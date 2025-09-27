import User from '../models/User.js';
import {body, param, validationResult} from 'express-validator';
import {createError} from '../utils/error.js';

// SECURITY: Validation schemas
export const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('name').optional().trim().isLength({min: 2, max: 50}).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('branch').optional().trim().isLength({min: 2, max: 50}).withMessage('Branch must be between 2 and 50 characters'),
  body('batch').optional().isInt({min: 2020, max: 2030}).withMessage('Batch must be between 2020 and 2030'),
  body('isAdmin').optional().custom(() => {
    throw new Error('Admin privileges cannot be modified through this endpoint');
  })
];

export const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

export const saveItemValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('materialId').isMongoId().withMessage('Invalid material ID'),
  body('userId').isMongoId().withMessage('Invalid user ID')
];

export const updateUser = async (req, res, next)=>{
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // SECURITY: Prevent updating sensitive fields
    const {password, isAdmin, otp, otpExpires, refreshToken, ...allowedUpdates} = req.body;

    if (Object.keys(allowedUpdates).length === 0) {
      return next(createError(400, 'No valid fields to update'));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {$set: allowedUpdates},
      {new: true, runValidators: true} // SECURITY: Run mongoose validators
    );

    if (!updatedUser) {
      return next(createError(404, 'User not found'));
    }

    // SECURITY: Remove sensitive information from response
    const {password: userPassword, otp: userOtp, otpExpires: userOtpExpires, refreshToken: userRefreshToken, ...userResponse} = updatedUser.toObject();
    res.status(200).json(userResponse);
  } catch (err) {
    next(err);
  }
};
export const deleteUser = async (req, res, next)=>{
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({message: 'User has been deleted successfully'});
  } catch (err) {
    next(err);
  }
};
export const getUser = async (req, res, next)=>{
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // SECURITY: Remove sensitive information from response
    const {password: userPassword, otp: userOtp, otpExpires: userOtpExpires, refreshToken: userRefreshToken, ...userResponse} = user.toObject();
    res.status(200).json(userResponse);
  } catch (err) {
    next(err);
  }
};
export const getUsers = async (req, res, next)=>{
  try {
    // SECURITY: Add pagination to prevent data exposure
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // SECURITY: Limit maximum results per page
    const maxLimit = 50;
    const finalLimit = limit > maxLimit ? maxLimit : limit;

    const users = await User.find()
      .select('-password -otp -otpExpires -refreshToken') // SECURITY: Exclude sensitive fields
      .skip(skip)
      .limit(finalLimit)
      .sort({createdAt: -1});

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / finalLimit);

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};


export const saveItem = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const {email, materialId, userId} = req.body;

    // SECURITY: Verify user exists and email matches
    const user = await User.findOne({_id: userId, email: email});

    if (!user) {
      return next(createError(404, 'User not found or email mismatch'));
    }

    // SECURITY: Check if material is already saved
    const isMaterialSaved = user.savedItem.includes(materialId);

    let updateUser;
    if (isMaterialSaved) {
      // Remove from saved items
      updateUser = await User.findByIdAndUpdate(
        userId,
        {$pull: {savedItem: materialId}},
        {new: true}
      );
    } else {
      // Add to saved items
      updateUser = await User.findByIdAndUpdate(
        userId,
        {$push: {savedItem: materialId}},
        {new: true}
      );
    }

    // SECURITY: Remove sensitive information from response
    const {password: userPassword, otp: userOtp, otpExpires: userOtpExpires, refreshToken: userRefreshToken, ...userResponse} = updateUser.toObject();

    res.status(200).json({
      message: isMaterialSaved ? 'Material removed from saved items' : 'Material added to saved items',
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

