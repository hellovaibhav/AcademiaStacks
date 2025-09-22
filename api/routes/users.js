import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  saveItem,
  updateUserValidation,
  userIdValidation,
  saveItemValidation
} from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// SECURITY: Enhanced authentication check endpoints
router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.status(200).json({ 
    message: "User authenticated successfully",
    user: { id: req.user.id, isAdmin: req.user.isAdmin }
  });
});

router.get("/checkuser/:id", userIdValidation, verifyUser, (req, res, next) => {
  res.status(200).json({ 
    message: "User authorized for this resource" 
  });
});

router.get("/checkadmin/:id", userIdValidation, verifyAdmin, (req, res, next) => {
  res.status(200).json({ 
    message: "Admin access confirmed" 
  });
});

// SECURITY: Add validation to all routes
//UPDATE FOR BOTH USER AND ADMIN
router.put("/modify/:id", updateUserValidation, verifyUser, updateUser);

//DELETE FOR BOTH USER AND ADMIN
router.delete("/modify/:id", userIdValidation, verifyUser, deleteUser);

//GET FOR BOTH USER AND ADMIN
router.get("/modify/:id", userIdValidation, verifyUser, getUser);

//GET ALL FOR ADMIN ONLY
router.get("/", verifyAdmin, getUsers);

// SECURITY: Protect save item endpoint with authentication
router.post("/saveItem", saveItemValidation, verifyToken, saveItem);

export default router;  