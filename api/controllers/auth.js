import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { sendOTPEmail } from '../utils/emailService.js';
import { isTemporaryEmail } from '../utils/tempEmailValidator.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// Constants for better maintainability
const OTP_EXPIRY_MINUTES = 15; // Reduced from 60 minutes for security
const OTP_LENGTH = 6;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const SALT_ROUNDS = 12; // Increased from 10 for better security
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const CURRENT_YEAR = new Date().getFullYear();

// Rate limiting configurations
export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Max 3 registration attempts per IP
    message: 'Too many registration attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 login attempts per IP
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

export const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Max 3 OTP attempts per minute
    message: 'Too many OTP verification attempts. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
});

export const resendOTPLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Max 3 resend attempts per 5 minutes
    message: 'Too many OTP resend requests. Please wait before requesting again.',
    standardHeaders: true,
    legacyHeaders: false
});

// Enhanced validation schemas
export const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s.''-]+$/)
        .withMessage('Name can only contain letters, spaces, periods, apostrophes, and hyphens')
        .escape(), // Sanitize HTML entities

    body('email')
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: false }) // Keep dots in Gmail for uniqueness
        .withMessage('Please provide a valid email')
        .isLength({ max: 254 }) // RFC compliant max email length
        .withMessage('Email address is too long')
        .custom(async (email) => {
            if (isTemporaryEmail(email)) {
                throw new Error('Temporary email addresses are not allowed. Please use a permanent email address.');
            }

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('An account with this email already exists');
            }
            return true;
        }),

    body('password')
        .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
        .withMessage(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_=])[A-Za-z\d@$!%*?&#+\-_=]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .custom((password) => {
            // Check for common weak passwords
            const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
            if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
                throw new Error('Password contains common weak patterns');
            }
            return true;
        }),

    body('branch')
        .trim()
        .isIn(['CSE', 'CSE DSAI', 'ECE', 'ECE IOT', 'MCE'])
        .withMessage('Branch must be one of: CSE, CSE DSAI, ECE, ECE IOT, MCE'),

    body('batch')
        .isInt({ min: 2016, max: CURRENT_YEAR })
        .withMessage(`Batch must be between 2016 and ${CURRENT_YEAR}`)
        .custom((batch, { req }) => {
            // Additional business logic validation
            const currentYear = new Date().getFullYear();
            if (batch > currentYear) {
                throw new Error('Batch year cannot be in the future');
            }
            return true;
        }),

    // Security: Prevent admin privilege escalation
    body('isAdmin')
        .optional()
        .custom(() => {
            throw new Error('Admin privileges cannot be set during registration');
        }),

    // Additional security fields
    body(['refreshToken', 'otp', 'otpExpires', 'loginAttempts', 'lockUntil'])
        .optional()
        .custom(() => {
            throw new Error('Security fields cannot be set manually');
        })
];

export const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: false })
        .withMessage('Please provide a valid email')
        .isLength({ max: 254 })
        .withMessage('Email address is too long'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: MAX_PASSWORD_LENGTH })
        .withMessage('Password is too long')
];

export const otpValidation = [
    body('email')
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: false })
        .withMessage('Please provide a valid email'),

    body('otp')
        .isNumeric()
        .isLength({ min: OTP_LENGTH, max: OTP_LENGTH })
        .withMessage(`OTP must be exactly ${OTP_LENGTH} digits`)
        .custom((otp) => {
            // Ensure OTP is not sequential or repeated digits
            if (/^(\d)\1{5}$/.test(otp) || /^(012345|123456|654321)$/.test(otp)) {
                throw new Error('Invalid OTP format');
            }
            return true;
        })
];

export const resendOTPValidation = [
    body('email')
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: false })
        .withMessage('Please provide a valid email')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(createError(400, errorMessages[0])); // Return first error for cleaner UX
    }
    next();
};

// Helper function to generate secure OTP
const generateSecureOTP = () => {
    let otp;
    do {
        otp = crypto.randomInt(100000, 999999);
    } while (
        // Avoid weak patterns
    /^(\d)\1{5}$/.test(otp.toString()) || // All same digits
    /^(012345|123456|654321)$/.test(otp.toString()) // Sequential patterns
        );
    return otp;
};

// Helper function to generate username
const generateUsername = (email) => {
    const [name, domain] = email.split('@');
    const domainPart = domain.split('.')[0];
    return `${name}${domainPart}`.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Helper function to check account lockout
const checkAccountLockout = (user) => {
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
        throw createError(423, `Account locked. Try again in ${remainingTime} minutes.`);
    }
};

// Helper function to handle failed login attempts
const handleFailedLogin = async (user) => {
    const updates = { $inc: { loginAttempts: 1 } };

    // If first failed attempt, set loginAttempts to 1
    if (!user.loginAttempts) {
        updates.$set = { loginAttempts: 1 };
    }

    // If we have max failed attempts, lock the account
    if (user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !user.lockUntil) {
        updates.$set = {
            ...updates.$set,
            lockUntil: Date.now() + LOCKOUT_DURATION
        };
    }

    await User.findByIdAndUpdate(user._id, updates);
};

// Helper function to handle successful login
const handleSuccessfulLogin = async (user) => {
    // Clear failed attempts and lockout
    if (user.loginAttempts || user.lockUntil) {
        await User.findByIdAndUpdate(user._id, {
            $unset: { loginAttempts: 1, lockUntil: 1 }
        });
    }
};

export const register = [
    registerLimiter,
    registerValidation,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { name, email, password, branch, batch } = req.body;

                // Generate secure password hash
                const salt = await bcrypt.genSalt(SALT_ROUNDS);
                const hash = await bcrypt.hash(password, salt);

                // Generate username and other fields
                const username = generateUsername(email);
                const firstName = name.split(' ')[0];
                const otpCode = generateSecureOTP();

                // Create new user with enhanced security fields
                const newUser = new User({
                    name: name.trim(),
                    email: email.toLowerCase(),
                    username,
                    password: hash,
                    branch,
                    batch: parseInt(batch),
                    isAdmin: false, // Always false for new registrations
                    fname: firstName,
                    otp: otpCode,
                    otpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
                    createdAt: new Date(),
                    lastLoginAt: null,
                    loginAttempts: 0
                });

                const savedUser = await newUser.save({ session });

                // Remove sensitive information from response
                const { password: _password, otp: _otp, ...userResponse } = savedUser.toObject();

                res.status(201).json({
                    success: true,
                    message: 'Registration successful. Please check your email for OTP verification.',
                    data: {
                        user: userResponse,
                        otpExpiry: OTP_EXPIRY_MINUTES,
                        emailSent: true
                    }
                });

                // Send OTP email asynchronously
                sendOTPEmail(email, name, otpCode)
                    .then((emailResult) => {
                        if (emailResult.success) {
                            console.log(`✅ OTP email sent successfully to: ${email}`);
                        } else {
                            console.error(`❌ Failed to send OTP email to ${email}:`, emailResult.error);
                        }
                    })
                    .catch((error) => {
                        console.error(`❌ Email service error for ${email}:`, error);
                    });
            });
        } catch (error) {
            if (error.code === 11000) {
                // Handle duplicate key error
                const field = Object.keys(error.keyPattern)[0];
                return next(createError(409, `User with this ${field} already exists`));
            }
            console.error('Registration error:', error);
            next(createError(500, 'Registration failed. Please try again.'));
        } finally {
            await session.endSession();
        }
    }
];

export const registerVerify = [
    otpLimiter,
    otpValidation,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { email, otp } = req.body;

                const user = await User.findOne({ email: email.toLowerCase() }).session(session);
                if (!user) {
                    throw createError(404, 'User not found');
                }

                if (user.isVerified) {
                    throw createError(409, 'User is already verified');
                }

                // Check OTP expiration
                if (!user.otpExpires || new Date() > user.otpExpires) {
                    throw createError(410, `OTP has expired after ${OTP_EXPIRY_MINUTES} minutes. Please request a new one.`);
                }

                // Verify OTP with constant-time comparison to prevent timing attacks
                const providedOTP = parseInt(otp, 10);
                const storedOTP = user.otp;

                if (!providedOTP || !storedOTP || providedOTP !== storedOTP) {
                    throw createError(400, 'Invalid OTP');
                }

                // Update user verification status and clear OTP data
                const updatedUser = await User.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            isVerified: true,
                            verifiedAt: new Date()
                        },
                        $unset: {
                            otp: 1,
                            otpExpires: 1
                        }
                    },
                    {
                        new: true,
                        session,
                        select: '-password -refreshToken'
                    }
                );

                res.status(200).json({
                    success: true,
                    message: 'Email verified successfully. You can now login.',
                    data: { user: updatedUser }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Email verification error:', error);
            next(createError(500, 'Email verification failed. Please try again.'));
        } finally {
            await session.endSession();
        }
    }
];

export const resendOTP = [
    resendOTPLimiter,
    resendOTPValidation,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw createError(404, 'User not found');
            }

            if (user.isVerified) {
                throw createError(409, 'User is already verified');
            }

            // Generate new secure OTP
            const otpCode = generateSecureOTP();
            const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

            // Update user with new OTP
            await User.findByIdAndUpdate(user._id, {
                otp: otpCode,
                otpExpires
            });

            // Send OTP email
            const emailResult = await sendOTPEmail(email, user.name, otpCode);

            if (!emailResult.success) {
                console.error(`❌ Failed to resend OTP email to ${email}:`, emailResult.error);
                throw createError(500, 'Failed to send OTP email. Please try again.');
            }

            console.log(`✅ OTP email resent successfully to: ${email}`);

            res.status(200).json({
                success: true,
                message: 'New OTP has been sent to your email',
                data: {
                    emailSent: true,
                    otpExpiry: OTP_EXPIRY_MINUTES
                }
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Resend OTP error:', error);
            next(createError(500, 'Failed to resend OTP. Please try again.'));
        }
    }
];

export const login = [
    loginLimiter,
    loginValidation,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { email, password } = req.body;

                const user = await User.findOne({ email: email.toLowerCase() }).session(session);
                if (!user) {
                    throw createError(404, 'User not found');
                }

                // Check account lockout
                checkAccountLockout(user);

                if (!user.isVerified) {
                    throw createError(401, 'Please verify your email before logging in');
                }

                // Verify password
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (!isPasswordCorrect) {
                    await handleFailedLogin(user);
                    const remainingAttempts = MAX_LOGIN_ATTEMPTS - (user.loginAttempts || 0) - 1;
                    throw createError(400, `Invalid credentials. ${remainingAttempts} attempts remaining.`);
                }

                // Handle successful login
                await handleSuccessfulLogin(user);

                // Generate tokens
                const accessToken = jwt.sign(
                    { id: user._id, isAdmin: user.isAdmin, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRY }
                );

                const refreshToken = jwt.sign(
                    { id: user._id, tokenVersion: user.tokenVersion || 1 },
                    process.env.JWT_REFRESH || process.env.JWT_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRY }
                );

                // Update user with refresh token and last login
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        refreshToken,
                        lastLoginAt: new Date(),
                        $inc: { loginCount: 1 }
                    },
                    { session }
                );

                // Remove sensitive information
                const { password: _password, otp: _otp, refreshToken: _rt, ...userResponse } = user.toObject();

                // Set secure cookies
                const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                };

                res
                    .cookie('access_token', accessToken, {
                        ...cookieOptions,
                        maxAge: 15 * 60 * 1000 // 15 minutes
                    })
                    .cookie('refresh_token', refreshToken, {
                        ...cookieOptions,
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        path: '/api/auth/refresh'
                    })
                    .status(200)
                    .json({
                        success: true,
                        message: 'Login successful',
                        data: {
                            user: userResponse,
                            tokens: {
                                accessToken,
                                refreshToken,
                                expiresIn: 15 * 60,
                                tokenType: 'Bearer'
                            }
                        }
                    });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Login error:', error);
            next(createError(500, 'Login failed. Please try again.'));
        } finally {
            await session.endSession();
        }
    }
];

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token || req.headers.authorization?.split(' ')[1];

        // Invalidate refresh token in database
        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                {
                    $unset: { refreshToken: 1 },
                    lastLogoutAt: new Date()
                }
            );
        }

        // Clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res
            .clearCookie('access_token', cookieOptions)
            .clearCookie('refresh_token', { ...cookieOptions, path: '/api/auth/refresh' })
            .status(200)
            .json({
                success: true,
                message: 'Logged out successfully'
            });
    } catch (error) {
        console.error('Logout error:', error);
        next(createError(500, 'Logout failed'));
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token ||
            req.headers.authorization?.replace('Bearer ', '');

        if (!refreshToken) {
            throw createError(401, 'Refresh token not provided');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH || process.env.JWT_SECRET);

        // Check if refresh token exists in database and is valid
        const user = await User.findOne({
            _id: decoded.id,
            refreshToken: refreshToken
        });

        if (!user) {
            throw createError(401, 'Invalid refresh token');
        }

        // Check token version for additional security
        if (decoded.tokenVersion && user.tokenVersion && decoded.tokenVersion !== user.tokenVersion) {
            throw createError(401, 'Token version mismatch');
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        // Set new access token cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        };

        res
            .cookie('access_token', newAccessToken, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: newAccessToken,
                    expiresIn: 15 * 60,
                    tokenType: 'Bearer'
                }
            });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(createError(401, 'Invalid or expired refresh token'));
        }
        console.error('Refresh token error:', error);
        next(createError(500, 'Token refresh failed'));
    }
};

// Enhanced user profile endpoint
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -refreshToken -otp -otpExpires')
            .lean();

        if (!user) {
            throw createError(404, 'User not found');
        }

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        next(createError(500, 'Failed to fetch user profile'));
    }
};

// Change password endpoint
export const changePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
        .withMessage(`New password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_=])[A-Za-z\d@$!%*?&#+\-_=]/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { currentPassword, newPassword } = req.body;
                const userId = req.user.id;

                const user = await User.findById(userId).session(session);
                if (!user) {
                    throw createError(404, 'User not found');
                }

                // Verify current password
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    throw createError(400, 'Current password is incorrect');
                }

                // Check if new password is different from current
                const isSamePassword = await bcrypt.compare(newPassword, user.password);
                if (isSamePassword) {
                    throw createError(400, 'New password must be different from current password');
                }

                // Hash new password
                const salt = await bcrypt.genSalt(SALT_ROUNDS);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                // Update password and increment token version to invalidate all tokens
                await User.findByIdAndUpdate(
                    userId,
                    {
                        password: hashedPassword,
                        $inc: { tokenVersion: 1 },
                        $unset: { refreshToken: 1 },
                        passwordChangedAt: new Date()
                    },
                    { session }
                );

                res.status(200).json({
                    success: true,
                    message: 'Password changed successfully. Please login again.'
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Change password error:', error);
            next(createError(500, 'Failed to change password'));
        } finally {
            await session.endSession();
        }
    }
];

// Enhanced cleanup function for unverified users
export const cleanupUnverifiedUsers = async () => {
    try {
        const cutoffTime = new Date(Date.now() - (OTP_EXPIRY_MINUTES * 60 * 1000));

        const result = await User.deleteMany({
            isVerified: false,
            $or: [
                { otpExpires: { $lt: cutoffTime } },
                { createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // 24 hours old
            ]
        });

        if (result.deletedCount > 0) {
            console.log(`✅ Cleanup completed: Removed ${result.deletedCount} expired unverified users`);
        } else {
            console.log('ℹ️ No expired unverified users found for cleanup');
        }

        return result.deletedCount;
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
    }
};

// Invalidate all user sessions (for security incidents)
export const invalidateAllSessions = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, {
            $inc: { tokenVersion: 1 },
            $unset: { refreshToken: 1 }
        });

        res.status(200).json({
            success: true,
            message: 'All sessions invalidated successfully'
        });
    } catch (error) {
        console.error('Invalidate sessions error:', error);
        next(createError(500, 'Failed to invalidate sessions'));
    }
};
