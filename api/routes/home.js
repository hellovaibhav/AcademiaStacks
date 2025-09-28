import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', cors(), (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.status(200).json({
    message: 'The app is up and running',
    database: {
      status: dbStates[dbState],
      isConnected: dbState === 1,
      state: dbState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    emailService: {
      configured: !!(process.env.MAILID && process.env.MAILPASS),
      hasMailId: !!process.env.MAILID,
      hasMailPass: !!process.env.MAILPASS,
      status: (process.env.MAILID && process.env.MAILPASS) ? 'Ready' : 'Not Configured'
    },
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  });
});

// Health check endpoint for debugging
router.get('/health', cors(), (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.status(200).json({
    status: 'ok',
    database: {
      state: dbState,
      status: dbStates[dbState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    },
    emailService: {
      configured: !!(process.env.MAILID && process.env.MAILPASS),
      hasMailId: !!process.env.MAILID,
      hasMailPass: !!process.env.MAILPASS,
      status: (process.env.MAILID && process.env.MAILPASS) ? 'Ready' : 'Not Configured'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      vercel: !!process.env.VERCEL,
      hasMongoUri: !!process.env.MONGODB_URI
    },
    timestamp: new Date().toISOString()
  });
});

export default router;