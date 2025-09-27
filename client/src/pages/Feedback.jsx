import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {API_ENDPOINTS} from '../config/api';
import {
  AiOutlineMessage,
  AiOutlineBug,
  AiOutlineBulb,
  AiOutlineCheckCircle,
  AiOutlineUser,
  AiOutlineMail
} from 'react-icons/ai';

const Feedback = () => {
  const navigate = useNavigate();
  const {toast} = useAuth();
  const url = API_ENDPOINTS.FEEDBACK;

  const [data, setData] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const feedbackTypes = [
    {value: 'Bug', label: 'Bug Report', icon: AiOutlineBug, color: 'text-red-500'},
    {value: 'Suggestions', label: 'Suggestions', icon: AiOutlineBulb, color: 'text-yellow-500'},
    {value: 'Feature', label: 'Feature Request', icon: AiOutlineCheckCircle, color: 'text-green-500'},
    {value: 'General', label: 'General Feedback', icon: AiOutlineMessage, color: 'text-blue-500'}
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!data.type) {
      newErrors.type = 'Please select a feedback type';
    }

    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const {id, value, name} = e.target;
    const fieldName = id || name;
    setData(prev => ({...prev, [fieldName]: value}));

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({...prev, [fieldName]: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(url, data);
      toast.success('Feedback submitted successfully! Thank you for your input.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Share Your <span className="text-[#22A39F]">Feedback</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Help us improve Academia Stacks by sharing your thoughts, reporting bugs, or suggesting new features.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                  <AiOutlineUser className="w-4 h-4 mr-2 text-[#22A39F]" />
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
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                  <AiOutlineMail className="w-4 h-4 mr-2 text-[#22A39F]" />
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

              {/* Feedback Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <motion.label
                        key={type.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          data.type === type.value
                            ? 'border-[#22A39F] bg-[#22A39F] bg-opacity-10'
                            : 'border-gray-300 hover:border-[#22A39F] hover:bg-gray-50'
                        }`}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={data.type === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <IconComponent className={`w-5 h-5 mr-2 ${type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </motion.label>
                    );
                  })}
                </div>
                {errors.type && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm"
                  >
                    {errors.type}
                  </motion.p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700">
                  <AiOutlineMessage className="w-4 h-4 mr-2 text-[#22A39F]" />
                  Message
                </label>
                <motion.textarea
                  id="message"
                  value={data.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your feedback..."
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  whileFocus={{scale: 1.02}}
                />
                {errors.message && (
                  <motion.p
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-red-500 text-sm"
                  >
                    {errors.message}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500">
                  {data.message.length}/500 characters
                </p>
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
                    Submitting...
                  </div>
                ) : (
                  'Submit Feedback'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Your feedback helps us make Academia Stacks better for everyone.
              We appreciate your time and input!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
