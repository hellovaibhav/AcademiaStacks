import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";

// route imports
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import materialsRoute from "./routes/materials.js"
import feedbacksRoute from "./routes/feedbacks.js"
import homeRoute from "./routes/home.js"
import cookieParser from "cookie-parser";
import { inject } from '@vercel/analytics';
 
inject();

const app = express();

const port = process.env.PORT || 8800;

var allowedOrigins = ['http://localhost:3000',
    'https://academia-stacks.vercel.app'];

const options = {
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    useSuccessStatus: true
}
app.use(cors(options));

dotenv.config();

app.use(session({
    secret: 'Olly',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));



// mongodb connection

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO);
        console.log("connected to Database");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

connect();

// middlewares

app.use(cookieParser());
app.use(express.json());

app.use("/", homeRoute)
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/materials", materialsRoute);
app.use("/api/feedbacks", feedbacksRoute);


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


app.listen(port, () => {

    console.log("connected to backend");
});
