// Imports
import React from 'react';
import {motion} from 'framer-motion';

// Symmetric Double Ring Spinner
const SymmetricSpinner = ({size = 'large', color = '#22A39F'}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer ring */}
      <motion.div
        className={'absolute inset-0 border-2 border-gray-200 border-t-2 rounded-full'}
        style={{borderTopColor: color}}
        animate={{rotate: 360}}
        transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
      />
      {/* Inner ring - opposite direction */}
      <motion.div
        className={'absolute inset-2 border-2 border-gray-200 border-b-2 rounded-full'}
        style={{borderBottomColor: color}}
        animate={{rotate: -360}}
        transition={{duration: 1.5, repeat: Infinity, ease: 'linear'}}
      />
    </div>
  );
};

// Smooth Wave Animation - Ultra Polished
const SmoothWaveLoader = ({size = 'large', color = '#22A39F'}) => {
  const sizeClasses = {
    small: {width: '28px', height: '28px', barWidth: '3px'},
    medium: {width: '36px', height: '36px', barWidth: '4px'},
    large: {width: '52px', height: '52px', barWidth: '5px'}
  };

  const config = sizeClasses[size];

  return (
    <div
      className="flex items-end justify-center gap-1"
      style={{width: config.width, height: config.height}}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            backgroundColor: color,
            width: config.barWidth,
            height: `${15 + index * 8}%`,
            minHeight: '8px'
          }}
          animate={{
            scaleY: [0.3, 1.5, 0.3],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: [0.4, 0, 0.6, 1], // Custom cubic-bezier for smooth wave
            repeatDelay: 0
          }}
        />
      ))}
    </div>
  );
};

// Modern Pulse Circles - Elegant Animation
const PulseCirclesLoader = ({size = 'large', color = '#22A39F'}) => {
  const sizeClasses = {
    small: {container: 'w-8 h-8', circle: 'w-2 h-2'},
    medium: {container: 'w-10 h-10', circle: 'w-3 h-3'},
    large: {container: 'w-14 h-14', circle: 'w-4 h-4'}
  };

  const config = sizeClasses[size];

  return (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{borderColor: `${color}40`}}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.8, 0, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />

      {/* Middle pulse ring */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{borderColor: `${color}60`}}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.6, 0, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.4,
          ease: 'easeOut'
        }}
      />

      {/* Center circle */}
      <motion.div
        className={`${config.circle} rounded-full`}
        style={{backgroundColor: color}}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

// Elegant Breathing Dots
const BreathingDotsLoader = ({size = 'large', color = '#22A39F'}) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} rounded-full`}
          style={{backgroundColor: color}}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: index * 0.3,
            ease: [0.4, 0, 0.6, 1]
          }}
        />
      ))}
    </div>
  );
};

// Bouncing Dots
const BouncingDots = ({size = 'large', color = '#22A39F'}) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} rounded-full`}
          style={{backgroundColor: color}}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// Modern Loading Spinner Component with options
const ModernSpinner = ({size = 'large', color = '#22A39F', type = 'wave'}) => {
  switch (type) {
  case 'wave':
    return <SmoothWaveLoader size={size} color={color} />;
  case 'pulse':
    return <PulseCirclesLoader size={size} color={color} />;
  case 'dots':
    return <BreathingDotsLoader size={size} color={color} />;
  case 'bounce':
    return <BouncingDots size={size} color={color} />;
  case 'symmetric':
    return <SymmetricSpinner size={size} color={color} />;
  default:
    return <SmoothWaveLoader size={size} color={color} />;
  }
};

// Pulse Dots Animation
const PulseDots = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-[#22A39F] rounded-full"
          animate={{scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7]}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// Standardized Loading Overlay Component
const LoadingOverlay = ({message = 'Loading...'}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <motion.div
      initial={{scale: 0.9, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{duration: 0.3}}
      className="bg-white p-8 rounded-xl shadow-xl"
    >
      <div className="flex flex-col items-center">
        <ModernSpinner size="large" type="wave" />
        <p className="text-center mt-6 text-gray-600 font-medium">{message}</p>
      </div>
    </motion.div>
  </div>
);

// Main component
const Loader = ({message = 'Loading...', type = 'full'}) => {
  // Inline loader for content sections
  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center py-8">
        <ModernSpinner size="medium" type="pulse" />
        <span className="ml-3 text-gray-600 font-medium">{message}</span>
      </div>
    );
  }

  // Overlay loader for consistent experience across pages
  if (type === 'overlay') {
    return <LoadingOverlay message={message} />;
  }

  // Full-screen loader for page loads - Clean and minimal
  return (
    <div className="loader bg-[#F3EFE0] flex flex-col justify-center items-center min-h-screen">
      {/* Modern Loading Animation */}
      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.4}}
        className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center"
      >
        {/* Main Spinner */}
        <ModernSpinner size="large" type="wave" />

        {/* Loading Text */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.3}}
          className="mt-8 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800">{message}</h3>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.5}}
          className="text-gray-500 text-sm mt-4 text-center max-w-xs"
        >
          Please wait while we prepare everything for you
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;
export {ModernSpinner};
