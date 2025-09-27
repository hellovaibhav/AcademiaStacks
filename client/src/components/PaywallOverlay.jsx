import React from 'react';
import {motion} from 'framer-motion';

const PaywallOverlay = ({isVisible, onClose, title = 'Feature Under Development', message = 'This feature is currently under development.', githubUrl}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      style={{top: '80px'}} // Start below navbar
    >
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.8, opacity: 0}}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center relative"
      >

        {/* Development Icon */}
        <motion.div
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{delay: 0.2}}
          className="w-20 h-20 bg-gradient-to-br from-[#22A39F] to-[#1a8a87] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <span className="text-white text-3xl">🚧</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.3}}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          {title}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.4}}
          className="text-gray-600 mb-6 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Development Status */}
        <motion.div
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.5}}
          className="text-left mb-8"
        >
          <h3 className="font-semibold text-gray-800 mb-3">What We're Building:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#22A39F] rounded-full mr-3" />
              Secure PDF upload system
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#22A39F] rounded-full mr-3" />
              Automatic file validation
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#22A39F] rounded-full mr-3" />
              Smart categorization
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#22A39F] rounded-full mr-3" />
              Community contribution features
            </li>
          </ul>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.6}}
          className="flex justify-center"
        >
          {githubUrl && (
            <button
              onClick={() => {
                window.open(githubUrl, '_blank');
              }}
              className="bg-gradient-to-r from-[#22A39F] to-[#1a8a87] text-white py-3 px-8 rounded-lg hover:from-[#1a8a87] hover:to-[#22A39F] transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Contribute on GitHub
            </button>
          )}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.7}}
          className="text-xs text-gray-400 mt-6"
        >
          Thank you for your patience as we build something amazing together! 🚀
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default PaywallOverlay;
