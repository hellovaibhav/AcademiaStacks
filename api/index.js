import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// route imports
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import materialsRoute from "./routes/materials.js"
import feedbacksRoute from "./routes/feedbacks.js"
import homeRoute from "./routes/home.js"
import uploadRoute from "./routes/upload.js"
import adminRoute from "./routes/admin.js"
import userProfileRoute from "./routes/userProfile.js"
import statsRoute from "./routes/stats.js"
import cookieParser from "cookie-parser";
import { inject } from '@vercel/analytics';
import { cleanupUnverifiedUsers } from "./controllers/auth.js";
import { verifyEmailConfig } from "./utils/emailService.js";
import { checkGozungaConfig } from "./utils/gozunga.js";
 
inject();

const app = express();

const port = process.env.PORT || 8800;

// SECURITY: Enable trust proxy for accurate IP addresses behind reverse proxies
app.set('trust proxy', 1);

var allowedOrigins = ['http://localhost:3000',
    'https://academia-stacks.vercel.app'];

// SECURITY: Enhanced CORS configuration
const options = {
    origin: function (origin, callback) {
        // SECURITY: In production, be more strict about origins
        if (process.env.NODE_ENV === 'production') {
            if (!origin || allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
        } else {
            // Allow development origins
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
        }
        return callback(null, true);
    },
    credentials: true, // SECURITY: Allow credentials (cookies) to be sent
    optionsSuccessStatus: 200 // SECURITY: Some legacy browsers choke on 204
}
app.use(cors(options));

dotenv.config();

// SECURITY: Validate critical environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'MAILID',
  'MAILPASS'
];

console.log('🔍 Validating environment variables...');
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ CRITICAL SECURITY ERROR: ${envVar} is not set!`);
    console.error('   This will cause authentication and database failures.');
    console.error('   Please check your .env file and restart the server.');
    process.exit(1);
  }
});
console.log('✅ All critical environment variables are set');

// Environment validation completed

// SECURITY: Add security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-eval'"], // Allow PDF.js to work
            imgSrc: ["'self'", "https://drive.google.com", "data:", "blob:"],
            connectSrc: ["'self'", "https://drive.google.com", "https://*.googleapis.com"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "blob:"],
            frameSrc: ["'self'", "https://drive.google.com"],
            workerSrc: ["'self'", "blob:", "https://cdnjs.cloudflare.com"],
        },
    },
    crossOriginEmbedderPolicy: false // Allow embedding Google Drive content
}));

// SECURITY: Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window per IP
    message: {
        error: "Too many authentication attempts from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
    // Removed custom keyGenerator to use default IPv6-safe behavior
});

// SECURITY: General rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: {
        error: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// SECURITY: Apply general rate limiting to all routes
app.use(generalLimiter);

// SECURITY: NoSQL injection prevention
app.use(mongoSanitize());

// SECURITY: Enhanced session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
    resave: false,
    saveUninitialized: false, // SECURITY: Don't save empty sessions
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // SECURITY: Secure cookies in production
        httpOnly: true, // SECURITY: Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict' // SECURITY: CSRF protection
    },
    name: 'sessionId' // SECURITY: Change default session name
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// mongodb connection

const connect = async () => {
    try {
        // Enhanced MongoDB connection with proper SSL configuration
        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            retryWrites: true,
            w: 'majority',
            // Add connection timeout and retry settings
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            // Handle SSL certificate issues (updated to use new TLS options)
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false
        };
        
        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        console.log("connected to Database");
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
};

// MongoDB connection event handlers
mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
});

mongoose.connection.on("reconnected", () => {
    console.log("Database reconnected");
});

// Connect to MongoDB
connect().catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});

// SECURITY: Schedule cleanup of unverified users every 15 minutes
setInterval(() => {
    cleanupUnverifiedUsers();
}, 24 * 60 * 60 * 1000); // Run every 24 hours

// SECURITY: Run cleanup once on startup
setTimeout(() => {
    cleanupUnverifiedUsers();
}, 5000); // Run 5 seconds after startup

// SECURITY: Middlewares with size limits
app.use(cookieParser());
app.use(express.json({ 
    limit: '10mb', // SECURITY: Limit request size to prevent DoS
    strict: true, // SECURITY: Only parse arrays and objects
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' // SECURITY: Limit URL-encoded data size
}));

// SECURITY: Apply auth rate limiting to specific routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/verification', authLimiter);

app.use("/", homeRoute)
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/materials", materialsRoute);
app.use("/api/feedbacks", feedbacksRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user-profile", userProfileRoute);
app.use("/api/stats", statsRoute);


app.use((err, req, res, next) => {

    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went Wrong !";


    return res.status(errorStatus).json({
        "success": false,
        "status": errorStatus,
        "message": errorMessage,
        "stack": err.stack

    });
});


app.listen(port, async () => {
    console.log("connected to backend");
    
    // Verify email configuration on startup
    await verifyEmailConfig();
    
    // Check Gozunga configuration on startup
    await checkGozungaConfig();
});
