import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

// Icon components
const SuccessIcon = () => (
  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
    <motion.svg
      initial={{scale: 0}}
      animate={{scale: 1}}
      transition={{delay: 0.2}}
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </motion.svg>
  </div>
);

const ErrorIcon = () => (
  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
    <motion.svg
      initial={{scale: 0}}
      animate={{scale: 1}}
      transition={{delay: 0.2}}
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </motion.svg>
  </div>
);

const InfoIcon = () => (
  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
    <motion.svg
      initial={{scale: 0}}
      animate={{scale: 1}}
      transition={{delay: 0.2}}
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </motion.svg>
  </div>
);

const WarningIcon = () => (
  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
    <motion.svg
      initial={{scale: 0}}
      animate={{scale: 1}}
      transition={{delay: 0.2}}
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </motion.svg>
  </div>
);

// Single Toast Component
const Toast = ({id, type = 'info', message, onClose, duration = 4000}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose(id);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [id, onClose, duration]);

  const getIcon = () => {
    switch (type) {
    case 'success': return <SuccessIcon />;
    case 'error': return <ErrorIcon />;
    case 'warning': return <WarningIcon />;
    default: return <InfoIcon />;
    }
  };

  const getColors = () => {
    switch (type) {
    case 'success': return 'border-green-200 bg-green-50 text-green-800';
    case 'error': return 'border-red-200 bg-red-50 text-red-800';
    case 'warning': return 'border-amber-200 bg-amber-50 text-amber-800';
    default: return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getProgressColor = () => {
    switch (type) {
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'warning': return 'bg-amber-500';
    default: return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, x: 100, scale: 0.95}}
      animate={{opacity: 1, x: 0, scale: 1}}
      exit={{opacity: 0, x: 100, scale: 0.95}}
      transition={{duration: 0.3, ease: 'easeOut'}}
      className={`relative overflow-hidden max-w-sm w-full border rounded-xl shadow-lg backdrop-blur-sm ${getColors()}`}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
        <motion.div
          className={`h-full ${getProgressColor()}`}
          style={{width: `${progress}%`}}
          transition={{duration: 0.1, ease: 'linear'}}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({toasts, onClose}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={onClose}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Hook
let toastCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = ++toastCounter;
    const newToast = {id, message, type, duration};

    setToasts((prev) => [...prev, newToast]);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration)
  };

  return {
    toasts,
    toast,
    removeToast,
    ToastContainer: () => <ToastContainer toasts={toasts} onClose={removeToast} />
  };
};

export default Toast;
