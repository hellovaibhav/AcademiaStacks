import React, {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {AuthContext} from '../context/AuthContext';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {validateEmailForRegistration} from '../utils/tempEmailValidator';

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    batch: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const {loading, error, register, isAuthenticated, clearError} = useContext(AuthContext);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/material');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.name || data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!data.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailValidation = validateEmailForRegistration(data.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message;
      }
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (data.password.length > 128) {
      newErrors.password = 'Password must be less than 128 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (!data.branch) {
      newErrors.branch = 'Please select a branch';
    }

    if (!data.batch) {
      newErrors.batch = 'Please select a batch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const {id, value} = e.target;
    setData(prev => ({...prev, [id]: value}));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register(data);

    if (result.success) {
      navigate('/verification');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Join <span className="text-[#22A39F]">Academia Stacks</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Create your account to start accessing and sharing study materials with fellow students.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
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
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  whileFocus={{scale: 1.02}}
                  autoComplete="name"
                />
                {errors.name && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  whileFocus={{scale: 1.02}}
                  autoComplete="email"
                />
                {errors.email && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    whileFocus={{scale: 1.02}}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Branch and Batch Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <select
                    id="branch"
                    value={data.branch}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 ${
                      errors.branch ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" disabled>
                      Select your branch
                    </option>
                    <option value="CSE">CSE</option>
                    <option value="CSE DSAI">CSE DSAI</option>
                    <option value="ECE">ECE</option>
                    <option value="ECE IOT">ECE IOT</option>
                    <option value="MCE">MCE</option>
                  </select>
                  {errors.branch && (
                    <motion.p
                      initial={{opacity: 0, y: -10}}
                      animate={{opacity: 1, y: 0}}
                      className="text-red-500 text-sm"
                    >
                      {errors.branch}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="batch" className="text-sm font-medium text-gray-700">
                    Batch
                  </label>
                  <select
                    id="batch"
                    value={data.batch}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 ${
                      errors.batch ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" disabled>
                      Select your batch
                    </option>
                    {Array.from({length: new Date().getFullYear() - 2015}, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  {errors.batch && (
                    <motion.p
                      initial={{opacity: 0, y: -10}}
                      animate={{opacity: 1, y: 0}}
                      className="text-red-500 text-sm"
                    >
                      {errors.batch}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-[#22A39F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1a8a87] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                whileHover={{scale: loading ? 1 : 1.02}}
                whileTap={{scale: loading ? 1 : 0.98}}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{rotate: 360}}
                      transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
                    />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-[#22A39F] hover:text-[#1a8a87] font-semibold transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              By creating an account, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
