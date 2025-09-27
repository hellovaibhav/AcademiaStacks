import Feedback from '../models/Feedback.js';
import {body, validationResult} from 'express-validator';
import {createError} from '../utils/error.js';
import {sendFeedbackNotification} from '../utils/emailService.js';

// SECURITY: Validation schema for feedback
export const feedbackValidation = [
  body('name')
    .trim()
    .isLength({min: 2, max: 50})
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('type')
    .trim()
    .isIn(['bug', 'feature', 'general', 'complaint', 'suggestion'])
    .withMessage('Invalid feedback type'),

  body('message')
    .trim()
    .isLength({min: 10, max: 1000})
    .withMessage('Message must be between 10 and 1000 characters')
];

export const createFeedback = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // SECURITY: Sanitize input data
    const {name, email, type, message} = req.body;

    const newFeedback = new Feedback({
      name: name.trim(),
      email: email.toLowerCase(),
      type: type.toLowerCase(),
      message: message.trim()
    });

    const savedFeedback = await newFeedback.save();

    // Send feedback notification email to admin
    const emailResult = await sendFeedbackNotification({
      name: savedFeedback.name,
      email: savedFeedback.email,
      type: savedFeedback.type,
      message: savedFeedback.message,
      createdAt: savedFeedback.createdAt
    });

    if (!emailResult.success) {
      console.error('Failed to send feedback notification email:', emailResult.error);
      // Don't fail feedback submission if email fails, but log the error
    }

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: savedFeedback._id,
        name: savedFeedback.name,
        type: savedFeedback.type,
        createdAt: savedFeedback.createdAt
      },
      emailSent: emailResult.success
    });
  } catch (err) {
    next(err);
  }
};
