import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import {createError} from '../utils/error.js';
import jwt from 'jsonwebtoken';
import {body, validationResult} from 'express-validator';
import {sendOTPEmail} from '../utils/emailService.js';
import {isTemporaryEmail} from '../utils/tempEmailValidator.js';

// SECURITY: Input validation schemas
export const registerValidation = [
  body('name')
    .trim()
    .isLength({min: 2, max: 50})
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .custom((email) => {
      if (isTemporaryEmail(email)) {
        throw new Error('Please use a permanent email address. Temporary email addresses are not allowed as we provide important updates and newsletters.');
      }
      return true;
    }),

  body('password')
    .isLength({min: 8, max: 128})
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('branch')
    .trim()
    .isIn(['CSE', 'CSE DSAI', 'ECE', 'ECE IOT', 'MCE'])
    .withMessage('Branch must be one of: CSE, CSE DSAI, ECE, ECE IOT, MCE'),

  body('batch')
    .isInt({min: 2016, max: new Date().getFullYear()})
    .withMessage(`Batch must be between 2016 and ${new Date().getFullYear()}`),

  // SECURITY: Prevent admin privilege escalation
  body('isAdmin')
    .optional()
    .custom(() => {
      throw new Error('Admin privileges cannot be set during registration');
    })
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('otp')
    .isNumeric()
    .isLength({min: 6, max: 6})
    .withMessage('OTP must be exactly 6 digits')
];

export const resendOTPValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

export const register = async (req, res, next) => {
  // SECURITY: Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(400, errors.array()[0].msg));
  }

  try {
    // SECURITY: Check if user already exists before creating
    const checkUser = await User.findOne({email: req.body.email});

    if (checkUser) {
      return next(createError(409, 'User with this email already exists'));
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    var str = req.body.email;
    var name = str.split('@')[0];
    var domain = str.split('@')[1];
    var username = name + domain.split('.')[0];
    var naming = req.body.name;
    var firstname = naming.split(' ')[0];
    var otpCode = Math.floor(100000 + Math.random() * 900000);

    // SECURITY: Force isAdmin to false to prevent privilege escalation
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: username,
      password: hash,
      branch: req.body.branch,
      batch: req.body.batch,
      isAdmin: false, // SECURITY: Always false for new registrations
      fname: firstname,
      otp: otpCode,
      otpExpires: new Date(Date.now() + 60 * 60 * 1000) // SECURITY: OTP expires in 1 hour
    });

    const saveduser = await newUser.save();

    // SECURITY: Don't return sensitive information
    const {password: _password, otp: _otp, ...userResponse} = saveduser.toObject();

    // Send registration response immediately for fast user experience
    res.status(200).json({
      message: 'Registration successful. Please check your email for OTP verification.',
      user: userResponse,
      emailSent: true // Optimistically assume email will be sent
    });

    // Send OTP email asynchronously (non-blocking) for better performance
    sendOTPEmail(req.body.email, req.body.name, otpCode)
      .then((emailResult) => {
        if (emailResult.success) {
          console.log(`✅ OTP email sent successfully to: ${req.body.email}`);
        } else {
          console.error(`❌ Failed to send OTP email to ${req.body.email}:`, emailResult.error);
        }
      })
      .catch((error) => {
        console.error(`❌ Email service error for ${req.body.email}:`, error);
      });
  } catch (err) {
    next(err);
  }
};

export const registerVerify = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    // SECURITY: Check if user is already verified
    if (user.isVerified) {
      return next(createError(400, 'User is already verified'));
    }

    // SECURITY: Check OTP expiration
    if (user.otpExpires && new Date() > user.otpExpires) {
      return next(createError(400, 'OTP has expired after 1 hour. Please register again.'));
    }

    // SECURITY: Use strict comparison for OTP
    if (parseInt(req.body.otp, 10) !== user.otp) {
      return next(createError(400, 'Invalid OTP!'));
    }

    // SECURITY: Clear OTP data after successful verification
    const doc = await User.findOneAndUpdate(
      {email: req.body.email},
      {
        isVerified: true,
        otp: null,
        otpExpires: null
      },
      {new: true}
    );

    // SECURITY: Don't expose sensitive information
    const {password: _password, otp: _otp, otpExpires: _otpExpires, ...userResponse} = doc.toObject();
    res.status(200).json({
      message: 'Email verified successfully',
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

// Resend OTP endpoint
export const resendOTP = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    // SECURITY: Check if user is already verified
    if (user.isVerified) {
      return next(createError(400, 'User is already verified'));
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // Update user with new OTP and expiration
    await User.findOneAndUpdate(
      {email: req.body.email},
      {
        otp: otpCode,
        otpExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      }
    );

    // Send new OTP email
    const emailResult = await sendOTPEmail(req.body.email, user.name, otpCode);

    if (!emailResult.success) {
      console.error(`❌ Failed to resend OTP email to ${req.body.email}:`, emailResult.error);
      return next(createError(500, 'Failed to send OTP email'));
    }

    console.log(`✅ OTP email resent successfully to: ${req.body.email}`);

    res.status(200).json({
      message: 'OTP has been resent to your email',
      emailSent: true
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const user = await User.findOne({email: req.body.email});

    if (!user) {
      return next(createError(404, 'User not found!'));
    }
    if (user.isVerified === false) {
      return next(createError(401, 'User not verified please input otp'));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError(400, 'Wrong password or username!'));
    }

    // SECURITY: Create JWT with expiration and refresh token
    const accessToken = jwt.sign(
      {id: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: '6h'} // SECURITY: Short-lived access token
    );

    const refreshToken = jwt.sign(
      {id: user._id},
      process.env.JWT_REFRESH || process.env.JWT_SECRET,
      {expiresIn: '7d'} // SECURITY: Longer-lived refresh token
    );

    // SECURITY: Store refresh token in database for invalidation capability
    await User.findByIdAndUpdate(user._id, {refreshToken});

    // SECURITY: Remove sensitive information from response
    const {password: _password, otp: _otp, otpExpires: _otpExpires, refreshToken: _userRefreshToken, ...otherDetails} = user._doc;

    // SECURITY: Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh' // SECURITY: Limit refresh token scope
    };

    res
      .cookie('access_token', accessToken, cookieOptions)
      .cookie('refresh_token', refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        message: 'Login successful',
        user: otherDetails,
        accessToken, // SECURITY: Also send token in response for client storage
        refreshToken, // SECURITY: Also send refresh token for client storage
        expiresIn: 15 * 60 // Token expiry in seconds
      });
  } catch (err) {
    next(err);
  }
};

// SECURITY: Logout endpoint to invalidate sessions
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    // SECURITY: Invalidate refresh token in database
    if (refreshToken) {
      await User.findOneAndUpdate(
        {refreshToken},
        {refreshToken: null}
      );
    }

    // SECURITY: Clear all authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res
      .clearCookie('access_token', cookieOptions)
      .clearCookie('refresh_token', {...cookieOptions, path: '/api/auth/refresh'})
      .status(200)
      .json({message: 'Logged out successfully'});
  } catch (err) {
    next(err);
  }
};

// SECURITY: Refresh token endpoint for maintaining sessions
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(createError(401, 'Refresh token not provided'));
    }

    // SECURITY: Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH || process.env.JWT_SECRET);

    // SECURITY: Check if refresh token exists in database
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken
    });

    if (!user) {
      return next(createError(401, 'Invalid refresh token'));
    }

    // SECURITY: Generate new access token
    const newAccessToken = jwt.sign(
      {id: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: '15m'}
    );

    // SECURITY: Set new access token cookie
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
        message: 'Token refreshed successfully',
        accessToken: newAccessToken, // SECURITY: Also send token in response for client storage
        expiresIn: 15 * 60
      });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(createError(401, 'Invalid or expired refresh token'));
    }
    next(err);
  }
};

// SECURITY: Separate cleanup function for unverified users
export const cleanupUnverifiedUsers = async () => {
  try {
    const currentTime = new Date();
    const unverifiedUsers = await User.find({
      isVerified: false,
      otpExpires: {$lt: currentTime} // Users whose OTP has expired
    });

    if (unverifiedUsers.length > 0) {
      console.log(`Cleaning up ${unverifiedUsers.length} unverified users whose OTP has expired`);

      for (const user of unverifiedUsers) {
        console.log(`Deleting unverified user ${user._id} (${user.email}) - OTP expired at ${user.otpExpires}`);
        await User.deleteOne({_id: user._id});
      }

      console.log('Cleanup completed');
    } else {
      console.log('No expired unverified users found for cleanup');
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
};
