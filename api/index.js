/**
 * AcademiaStacks API Server
 * 
 * This is the main server file for the AcademiaStacks application.
 * It handles all API requests, database connections, and middleware configuration.
 * 
 * Key Features:
 * - RESTful API endpoints for materials, users, and authentication
 * - MongoDB database integration with automatic reconnection
 * - Security middleware (CORS, Helmet, Rate Limiting)
 * - File upload handling for educational materials
 * - Email service integration for OTP verification
 * - Admin dashboard functionality
 * 
 * @author AcademiaStacks Team
 * @version 2.0.0
 */

// Core Express.js imports
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Route imports - organized by functionality
import authRoute from './routes/auth.js';           // Authentication routes (login, register, OTP)
import usersRoute from './routes/users.js';         // User management routes
import materialsRoute from './routes/materials.js'; // Material management routes
import feedbacksRoute from './routes/feedbacks.js'; // Feedback submission routes
import homeRoute from './routes/home.js';           // Home page and basic info routes
import uploadRoute from './routes/upload.js';       // File upload routes
import adminRoute from './routes/admin.js';         // Admin-only routes
import userProfileRoute from './routes/userProfile.js'; // User profile routes
import statsRoute from './routes/stats.js';         // Statistics and analytics routes

// Utility imports
import cookieParser from 'cookie-parser';           // Cookie parsing middleware
import {inject} from '@vercel/analytics';           // Analytics tracking
import {cleanupUnverifiedUsers} from './controllers/auth.js'; // User cleanup utility
import {verifyEmailConfig} from './utils/emailService.js';    // Email service verification

// Initialize Vercel Analytics
inject();

// Create Express application instance
const app = express();

// Set server port - use environment variable or default to 8800
const port = process.env.PORT || 8800;

// SECURITY: Enable trust proxy for accurate IP addresses behind reverse proxies
// This is important for rate limiting and security features to work correctly
app.set('trust proxy', 1);

// Configure allowed origins for CORS
// These are the domains that are allowed to make requests to this API
const allowedOrigins = [
  'http://localhost:3000',              // Local development frontend
  'https://academia-stacks.vercel.app', // Production frontend
  /^https:\/\/academia-stacks.*\.vercel\.app$/, // All Vercel preview deployments
];

// SECURITY: Enhanced CORS configuration
const options = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Debug logging to help identify blocked origins
    console.log('CORS: Checking origin:', origin);

    // Check if origin matches any allowed origin (string or regex)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log('CORS: Origin allowed:', origin);
      return callback(null, true);
    } else {
      console.log('CORS: Origin blocked:', origin);
      console.log('CORS: Allowed origins:', allowedOrigins);
      var errorMsg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
      return callback(new Error(errorMsg), false);
    }
  },
  credentials: true, // SECURITY: Allow credentials (cookies) to be sent
  optionsSuccessStatus: 200 // SECURITY: Some legacy browsers choke on 204
};
app.use(cors(options));

dotenv.config();

// SECURITY: Validate critical environment variables
// These variables are essential for the application to function properly
const requiredEnvVars = [
  'MONGODB_URI',    // MongoDB connection string
  'JWT_SECRET',     // Secret key for JWT token signing
  'SESSION_SECRET', // Secret key for session management
  'MAILID',         // Email service credentials
  'MAILPASS'        // Email service password
];

// Validate that all required environment variables are present
// This prevents the application from starting with missing critical configuration
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file and restart the server.');
    process.exit(1);
  }
});

// Environment validation completed

// SECURITY: Add security headers using Helmet
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],                    // Only allow resources from same origin
      styleSrc: ['\'self\'', '\'unsafe-inline\''], // Allow inline styles for Tailwind CSS
      scriptSrc: ['\'self\'', '\'unsafe-eval\''],  // Allow PDF.js to work (requires eval)
      imgSrc: ['\'self\'', 'https://drive.google.com', 'data:', 'blob:'], // Allow images from Google Drive
      connectSrc: ['\'self\'', 'https://drive.google.com', 'https://*.googleapis.com'], // API connections
      fontSrc: ['\'self\'', 'data:'],              // Allow fonts from same origin and data URLs
      objectSrc: ['\'none\''],                     // Disallow object, embed, and applet elements
      mediaSrc: ['\'self\'', 'blob:'],             // Allow media from same origin and blob URLs
      frameSrc: ['\'self\'', 'https://drive.google.com'], // Allow iframes from Google Drive
      workerSrc: ['\'self\'', 'blob:', 'https://cdnjs.cloudflare.com'] // Allow web workers
    }
  },
  crossOriginEmbedderPolicy: false // Allow embedding Google Drive content
}));

// SECURITY: Rate limiting for authentication endpoints
// This prevents brute force attacks on login, register, and verification endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // 5 attempts in production, 20 in development
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.'
  },
  standardHeaders: true,  // Include rate limit info in response headers
  legacyHeaders: false    // Disable legacy headers
});

// SECURITY: General rate limiting for all other endpoints
// This prevents abuse and ensures fair usage of the API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 100, // 100 requests per window per IP address
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,  // Include rate limit info in response headers
  legacyHeaders: false    // Disable legacy headers
});

// SECURITY: Apply general rate limiting to all routes
app.use(generalLimiter);

// Database health check middleware
// This middleware ensures that all API requests are only processed when the database is connected
// It prevents errors and provides a clear response when the database is unavailable
app.use((req, res, next) => {
  // Skip health check for the root route to allow basic API status
  if (req.path === '/' || req.path === '/api' || req.path === '/api/') {
    return next();
  }
  
  // Check if MongoDB connection is ready (state 1 = connected)
  if (mongoose.connection.readyState !== 1) {
    // Return 503 Service Unavailable when database is not connected
    return res.status(503).json({
      success: false,
      message: 'Database connection not available. Please try again later.',
      status: 503
    });
  }
  // Continue to the next middleware if database is connected
  next();
});

// SECURITY: NoSQL injection prevention
// This middleware sanitizes user input to prevent MongoDB injection attacks
app.use(mongoSanitize());

// SECURITY: Enhanced session configuration
// This middleware manages user sessions with security best practices
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
  resave: false,                    // Don't save session if unmodified
  saveUninitialized: false,        // SECURITY: Don't save empty sessions
  cookie: {
    secure: process.env.NODE_ENV === 'production', // SECURITY: Secure cookies in production
    httpOnly: true,                // SECURITY: Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours session duration
    sameSite: 'strict'             // SECURITY: CSRF protection
  },
  name: 'sessionId'                // SECURITY: Change default session name
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// mongodb connection

const connect = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL:', !!process.env.VERCEL);
    
    // Enhanced MongoDB connection with proper SSL configuration and reconnection handling
    const mongoOptions = {
      ssl: true,
      retryWrites: true,
      w: 'majority',
      // Connection timeout and retry settings for better stability
      serverSelectionTimeoutMS: 10000, // Wait up to 10 seconds to select a server
      socketTimeoutMS: 60000, // Wait up to 60 seconds for socket operations
      connectTimeoutMS: 15000, // Wait up to 15 seconds for initial connection
      maxPoolSize: 20, // Maximum number of connections in the pool
      minPoolSize: 10, // Minimum number of connections in the pool
      maxIdleTimeMS: 60000, // Close connections after 60 seconds of inactivity
      // SSL/TLS configuration for secure connections
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      // Heartbeat frequency to keep connection alive
      heartbeatFrequencyMS: 10000,
      // Retry logic for failed operations
      retryReads: true,
      retryWrites: true
    };

    await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
    console.log('✅ Connected to MongoDB Database');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  }
};

// MongoDB connection event handlers with automatic reconnection
// These handlers ensure the application maintains a stable database connection

// Handle disconnection events - attempt to reconnect automatically
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected - attempting reconnection...');
  // Attempt to reconnect after a short delay to avoid overwhelming the server
  setTimeout(() => {
    connect().catch(() => {
      // Silent retry - errors are handled by the connect function
    });
  }, 5000);
});

// Handle connection errors - attempt to reconnect
mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err.message);
  // Attempt to reconnect on error after a delay
  setTimeout(() => {
    connect().catch(() => {
      // Silent retry - errors are handled by the connect function
    });
  }, 5000);
});

// Handle successful reconnection
mongoose.connection.on('reconnected', () => {
  console.log('Database reconnected successfully');
});

// Handle initial connection
mongoose.connection.on('connected', () => {
  console.log('Database connected successfully');
});

// Handle graceful shutdown when the process is terminated
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
});

// Connect to MongoDB
connect().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  // Don't exit process on Vercel - let it continue and retry
  if (process.env.VERCEL) {
    console.log('Running on Vercel - continuing without database connection for now');
  } else {
    process.exit(1);
  }
});

// SECURITY: Schedule cleanup of unverified users every 15 minutes
setInterval(() => {
  cleanupUnverifiedUsers();
}, 24 * 60 * 60 * 1000); // Run every 24 hours

// SECURITY: Run cleanup once on startup
setTimeout(() => {
  cleanupUnverifiedUsers();
}, 5000); // Run 5 seconds after startup

// Database connection health check - run every hour
// This periodic check ensures the database connection remains stable
// If the connection is lost, it attempts to reconnect automatically
setInterval(() => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database connection lost, attempting reconnection...');
    connect().catch(() => {
      // Silent retry - errors are handled by the connect function
    });
  }
}, 60 * 60 * 1000); // Check every hour (60 minutes)

// SECURITY: Middlewares with size limits
// These middlewares parse request data with security considerations

// Cookie parser middleware - parses cookies from request headers
app.use(cookieParser());

// JSON body parser with size limits
app.use(express.json({
  limit: '10mb',  // SECURITY: Limit request size to prevent DoS attacks
  strict: true    // SECURITY: Only parse arrays and objects (not primitives)
}));

// URL-encoded body parser with size limits
app.use(express.urlencoded({
  extended: true, // Allow parsing of nested objects
  limit: '10mb'  // SECURITY: Limit URL-encoded data size
}));

// SECURITY: Apply authentication rate limiting to sensitive routes
// These routes are protected with stricter rate limits to prevent brute force attacks
app.use('/api/auth/login', authLimiter);        // Login attempts
app.use('/api/auth/register', authLimiter);     // Registration attempts
app.use('/api/auth/verification', authLimiter); // OTP verification attempts
app.use('/api/auth/resend-otp', authLimiter);   // OTP resend attempts

// API Route definitions
// Each route is organized by functionality and includes appropriate middleware
app.use('/', homeRoute);                    // Home page and basic info
app.use('/api/auth', authRoute);            // Authentication endpoints (login, register, etc.)
app.use('/api/users', usersRoute);          // User management endpoints
app.use('/api/materials', materialsRoute);  // Material management endpoints
app.use('/api/feedbacks', feedbacksRoute);  // Feedback submission endpoints
app.use('/api/upload', uploadRoute);        // File upload endpoints
app.use('/api/admin', adminRoute);          // Admin-only endpoints
app.use('/api/user-profile', userProfileRoute); // User profile management
app.use('/api/stats', statsRoute);          // Statistics and analytics endpoints


// Global error handling middleware
// This middleware catches any unhandled errors and provides a consistent error response
// It should be the last middleware in the chain to catch all errors
app.use((err, req, res, next) => {
  // Determine the appropriate HTTP status code
  const errorStatus = err.status || 500;
  // Get error message or provide a generic one
  const errorMessage = err.message || 'Internal server error';

  // Log error details for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method
    });
  }

  // Return standardized error response
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Export the app for serverless deployment
export default app;

// Start the server only when not in serverless mode
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Verify email configuration on startup
  // This ensures email services are properly configured before accepting requests
  try {
    await verifyEmailConfig();
    console.log('✅ Email configuration verified');
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    // Don't exit the process, but log the error for manual investigation
  }

  // All startup checks completed - APIs are ready
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ACADEMIASTACKS API SERVER IS READY!');
  console.log('='.repeat(60));
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`📧 Email Service: ${process.env.MAILID ? 'Configured' : 'Not configured'}`);
  console.log('='.repeat(60));
  console.log('✅ All APIs are ready to receive requests!');
  console.log('='.repeat(60) + '\n');
  });
}
