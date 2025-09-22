import express from "express";
import { 
  getAllMaterialsForAdmin,
  approveMaterial,
  rejectMaterial,
  getMaterialForAdmin,
  getAdminStats,
  promoteToAdmin,
  demoteFromAdmin
} from "../controllers/admin.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// All admin routes require admin authentication
router.use(verifyAdmin);

// Validation middleware
const validateMaterialAction = [
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
  body('adminNotes').optional().trim().isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters')
];

const validateMaterialId = [
  param('materialId').isMongoId().withMessage('Invalid material ID')
];

const validateUserId = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];

// Get all materials for admin review
router.get("/materials", getAllMaterialsForAdmin);

// Get specific material for admin review
router.get("/materials/:materialId", validateMaterialId, getMaterialForAdmin);

// Approve a material
router.patch("/materials/:materialId/approve", 
  validateMaterialId, 
  validateMaterialAction, 
  approveMaterial
);

// Reject a material
router.patch("/materials/:materialId/reject", 
  validateMaterialId, 
  validateMaterialAction, 
  rejectMaterial
);

// Get admin dashboard statistics
router.get("/stats", getAdminStats);

// Promote user to admin
router.patch("/users/:userId/promote", validateUserId, promoteToAdmin);

// Demote admin to regular user
router.patch("/users/:userId/demote", validateUserId, demoteFromAdmin);

export default router;
