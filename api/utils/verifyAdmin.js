import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to check admin status
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Add user info to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token." 
    });
  }
};
