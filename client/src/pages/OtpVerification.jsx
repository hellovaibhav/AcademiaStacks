import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import Cookies from 'js-cookie';
import {API_ENDPOINTS} from '../config/api';
import Loader from '../components/Loader';
import authService from '../services/authService';

const OtpVerification = () => {
  const navigate = useNavigate();
  const url = API_ENDPOINTS.VERIFY;
  const {toast} = useAuth();

  const [data, setData] = useState({
    email: '',
    otp: ''
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendLoading, setResendLoading] = useState(false);

  // Get email from cookies
  useEffect(() => {
    const email = Cookies.get('email');
    if (email) {
      setData(prev => ({...prev, email}));
    } else {
      // If no email in cookies, redirect to register
      navigate('/register');
    }
  }, [navigate]);

  const {loading, error, clearError} = useAuth();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.otp) {
      newErrors.otp = 'OTP is required';
    } else if (data.otp.length !== 6) {
      newErrors.otp = 'OTP must be exactly 6 digits';
    } else if (!/^\d{6}$/.test(data.otp)) {
      newErrors.otp = 'OTP must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 6); // Only numbers, max 6 digits
    setData(prev => ({...prev, otp: value}));

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({...prev, otp: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);

    try {
      await axios.post(url, data);

      // Show success message using modern toast
      toast.success('Email verified successfully! You can now log in with your credentials.');

      // Clear the email cookie since verification is complete
      Cookies.remove('email');

      // Redirect to login after a short delay to let user see the success message
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Your account has been verified! Please log in with your credentials.',
            verified: true
          }
        });
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed';
      if (err.response?.status === 400) {
        setErrors({otp: errorMessage});
      }
    } finally {
      setLocalLoading(false);
    }
  };


  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const result = await authService.resendOTP(data.email);

      if (result.success) {
        toast.success(result.data.message || 'OTP has been resent to your email');
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading && !localLoading) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center pt-20">
        <Loader message="Verifying your account..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Verify Your <span className="text-[#22A39F]">Email</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've sent a 6-digit verification code to <span className="font-semibold text-[#22A39F]">{data.email}</span>
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {error && (
              <motion.div
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 text-center block">
                  Enter 6-Digit Verification Code
                </label>
                <motion.input
                  type="text"
                  id="otp"
                  value={data.otp}
                  onChange={handleChange}
                  placeholder="123456"
                  maxLength="6"
                  className={`w-full px-4 py-4 text-2xl text-center border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 tracking-widest font-mono ${
                    errors.otp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  whileFocus={{scale: 1.02}}
                  autoComplete="one-time-code"
                />
                {errors.otp && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm text-center"
                  >
                    {errors.otp}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={localLoading || loading}
                className="w-full bg-[#22A39F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1a8a87] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                whileHover={{scale: localLoading || loading ? 1 : 1.02}}
                whileTap={{scale: localLoading || loading ? 1 : 0.98}}
              >
                {localLoading || loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{rotate: 360}}
                      transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
                    />
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </motion.button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-3">
                  Didn't receive the code?
                </p>
                <motion.button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-[#22A39F] hover:text-[#1a8a87] font-semibold transition-colors duration-200 disabled:opacity-50"
                  whileHover={{scale: resendLoading ? 1 : 1.05}}
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            className="mt-8 space-y-4"
          >
            {/* Timer Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-amber-600 text-2xl mr-3">⏰</div>
                <div>
                  <h3 className="text-amber-800 font-semibold">OTP Validity</h3>
                  <p className="text-amber-700 text-sm">This code will expire in 1 hour for security reasons.</p>
                </div>
              </div>
            </div>

            {/* Email Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">📧</div>
                <div>
                  <h3 className="text-blue-800 font-semibold">Check Your Email</h3>
                  <p className="text-blue-700 text-sm">
                    Don't forget to check your spam/junk folder if you don't see the email in your inbox.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Register */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.4}}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              Wrong email address?{' '}
              <Link
                to="/register"
                className="text-[#22A39F] hover:text-[#1a8a87] font-semibold transition-colors duration-200"
              >
                Go back to registration
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
