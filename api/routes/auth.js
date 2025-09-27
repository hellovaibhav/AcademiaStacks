import express from 'express';
import {
  login,
  register,
  registerVerify,
  resendOTP,
  logout,
  refreshToken,
  registerValidation,
  loginValidation,
  otpValidation,
  resendOTPValidation
} from '../controllers/auth.js';
// import cors from 'cors';

const router = express.Router();

// SECURITY: Remove unnecessary GET route for register
// router.get("/register", cors(), (req, res) => {
// });

// SECURITY: Add validation middleware to routes
router.post('/register', registerValidation, register);
router.post('/verification', otpValidation, registerVerify);
router.post('/resend-otp', resendOTPValidation, resendOTP);
router.post('/login', loginValidation, login);

// SECURITY: Add logout endpoint
router.post('/logout', logout);

// SECURITY: Add refresh token endpoint
router.post('/refresh', refreshToken);

export default router;