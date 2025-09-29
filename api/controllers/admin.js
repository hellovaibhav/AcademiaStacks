import Material from '../models/Material.js';
import User from '../models/User.js';
import { createError } from '../utils/error.js';
import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Constants for better maintainability
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const VALID_MATERIAL_STATUSES = ['pending', 'verified', 'rejected', 'legacy', 'notVerified'];
const RECENT_ACTIVITY_LIMIT = 10;

/**
 * Validation middleware for getAllMaterialsForAdmin
 */
export const validateGetAllMaterials = [
    query('status')
        .optional()
        .isIn(VALID_MATERIAL_STATUSES)
        .withMessage(`Status must be one of: ${VALID_MATERIAL_STATUSES.join(', ')}`),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: MAX_LIMIT })
        .withMessage(`Limit must be between 1 and ${MAX_LIMIT}`),
];

/**
 * Validation middleware for material ID parameter
 */
export const validateMaterialId = [
    param('materialId')
        .isMongoId()
        .withMessage('Invalid material ID format'),
];

/**
 * Validation middleware for user ID parameter
 */
export const validateUserId = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format'),
];

/**
 * Validation middleware for approve material
 */
export const validateApproveMaterial = [
    ...validateMaterialId,
    body('adminNotes')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Admin notes must be a string with maximum 1000 characters'),
];

/**
 * Validation middleware for reject material
 */
export const validateRejectMaterial = [
    ...validateMaterialId,
    body('reason')
        .notEmpty()
        .withMessage('Rejection reason is required')
        .isString()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Rejection reason must be between 10 and 500 characters'),
];

/**
 * Helper function to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(createError(400, `Validation failed: ${errorMessages.join(', ')}`));
    }
    next();
};

/**
 * Helper function to build material statistics
 */
const buildMaterialStatistics = (stats, totalMaterials) => {
    const statistics = {
        pending: 0,
        approved: 0,
        rejected: 0,
        legacy: 0,
        notVerified: 0,
        total: totalMaterials
    };

    stats.forEach(stat => {
        const statusKey = stat._id === 'verified' ? 'approved' : stat._id;
        if (statistics.hasOwnProperty(statusKey)) {
            statistics[statusKey] = stat.count;
        }
    });

    return statistics;
};

/**
 * Get all materials for admin review (including pending, approved, rejected)
 */
export const getAllMaterialsForAdmin = [
    validateGetAllMaterials,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const {
                status,
                page = DEFAULT_PAGE,
                limit = DEFAULT_LIMIT,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            // Build filter
            let filter = {};
            if (status && status !== 'all') {
                filter.verifiedBy = status;
            }

            // Add search functionality
            if (search && search.trim()) {
                const searchRegex = new RegExp(search.trim(), 'i');
                filter.$or = [
                    { title: searchRegex },
                    { description: searchRegex },
                    { subject: searchRegex },
                    { branch: searchRegex }
                ];
            }

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const finalLimit = Math.min(parseInt(limit), MAX_LIMIT);

            // Build sort object
            const sortObj = {};
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

            // Execute queries in parallel for better performance
            const [materials, totalMaterials, stats] = await Promise.all([
                Material.find(filter)
                    .populate('contributedBy', 'name email branch batch')
                    .sort(sortObj)
                    .skip(skip)
                    .limit(finalLimit)
                    .lean(), // Use lean() for better performance since we're not modifying documents
                Material.countDocuments(filter),
                Material.aggregate([
                    {
                        $group: {
                            _id: { $ifNull: ['$verifiedBy', 'legacy'] },
                            count: { $sum: 1 }
                        }
                    }
                ])
            ]);

            const totalPages = Math.ceil(totalMaterials / finalLimit);
            const statistics = buildMaterialStatistics(stats, totalMaterials);

            res.json({
                success: true,
                data: {
                    materials,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalMaterials,
                        itemsPerPage: finalLimit,
                        hasNext: parseInt(page) < totalPages,
                        hasPrev: parseInt(page) > 1
                    },
                    statistics,
                    filters: {
                        status: status || 'all',
                        search: search || '',
                        sortBy,
                        sortOrder
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching materials for admin:', error);
            next(createError(500, 'Failed to fetch materials'));
        }
    }
];

/**
 * Approve a material
 */
export const approveMaterial = [
    validateApproveMaterial,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { materialId } = req.params;
                const { adminNotes } = req.body;

                const material = await Material.findById(materialId).session(session);
                if (!material) {
                    throw createError(404, 'Material not found');
                }

                if (material.verifiedBy === 'verified') {
                    throw createError(409, 'Material is already approved');
                }

                // Update material status with atomic operation
                const updateResult = await Material.findByIdAndUpdate(
                    materialId,
                    {
                        verifiedBy: 'verified',
                        verifiedAt: new Date(),
                        verifiedByAdmin: req.user.email,
                        ...(adminNotes && { adminNotes: adminNotes.trim() })
                    },
                    {
                        new: true,
                        session,
                        runValidators: true
                    }
                ).populate('contributedBy', 'name email branch batch');

                res.json({
                    success: true,
                    message: 'Material approved successfully',
                    data: { material: updateResult }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Error approving material:', error);
            next(createError(500, 'Failed to approve material'));
        } finally {
            await session.endSession();
        }
    }
];

/**
 * Reject a material
 */
export const rejectMaterial = [
    validateRejectMaterial,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { materialId } = req.params;
                const { reason } = req.body;

                const material = await Material.findById(materialId).session(session);
                if (!material) {
                    throw createError(404, 'Material not found');
                }

                if (material.verifiedBy === 'rejected') {
                    throw createError(409, 'Material is already rejected');
                }

                // Update material status
                const updateResult = await Material.findByIdAndUpdate(
                    materialId,
                    {
                        verifiedBy: 'rejected',
                        rejectedAt: new Date(),
                        rejectedByAdmin: req.user.email,
                        rejectionReason: reason.trim()
                    },
                    {
                        new: true,
                        session,
                        runValidators: true
                    }
                ).populate('contributedBy', 'name email branch batch');

                res.json({
                    success: true,
                    message: 'Material rejected successfully',
                    data: { material: updateResult }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Error rejecting material:', error);
            next(createError(500, 'Failed to reject material'));
        } finally {
            await session.endSession();
        }
    }
];

/**
 * Get material details for admin review
 */
export const getMaterialForAdmin = [
    validateMaterialId,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { materialId } = req.params;

            const material = await Material.findById(materialId)
                .populate('contributedBy', 'name email branch batch createdAt')
                .lean();

            if (!material) {
                return next(createError(404, 'Material not found'));
            }

            res.json({
                success: true,
                data: { material }
            });
        } catch (error) {
            console.error('Error fetching material for admin:', error);
            next(createError(500, 'Failed to fetch material details'));
        }
    }
];

/**
 * Get admin dashboard statistics with caching consideration
 */
export const getAdminStats = async (req, res, next) => {
    try {
        // Execute all queries in parallel for better performance
        const [
            userStats,
            materialStats,
            totalMaterials,
            recentMaterials
        ] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
                        admins: { $sum: { $cond: ['$isAdmin', 1, 0] } }
                    }
                }
            ]),
            Material.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ['$verifiedBy', 'legacy'] },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Material.countDocuments(),
            Material.find()
                .populate('contributedBy', 'name email branch batch')
                .sort({ createdAt: -1 })
                .limit(RECENT_ACTIVITY_LIMIT)
                .lean()
        ]);

        const userStatistics = userStats[0] || { total: 0, verified: 0, admins: 0 };
        const materialStatistics = buildMaterialStatistics(materialStats, totalMaterials);

        res.json({
            success: true,
            data: {
                stats: {
                    users: {
                        total: userStatistics.total,
                        verified: userStatistics.verified,
                        admins: userStatistics.admins,
                        unverified: userStatistics.total - userStatistics.verified
                    },
                    materials: materialStatistics
                },
                recentActivity: recentMaterials,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        next(createError(500, 'Failed to fetch admin statistics'));
    }
};

/**
 * Promote user to admin
 */
export const promoteToAdmin = [
    validateUserId,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { userId } = req.params;

                // Prevent self-promotion for security
                if (userId === req.user._id.toString()) {
                    throw createError(400, 'Cannot promote yourself');
                }

                const user = await User.findById(userId).session(session);
                if (!user) {
                    throw createError(404, 'User not found');
                }

                if (user.isAdmin) {
                    throw createError(409, 'User is already an admin');
                }

                // Atomic update
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        isAdmin: true,
                        promotedBy: req.user.email,
                        promotedAt: new Date()
                    },
                    {
                        new: true,
                        session,
                        select: '_id name email isAdmin promotedBy promotedAt',
                        runValidators: true
                    }
                );

                res.json({
                    success: true,
                    message: 'User promoted to admin successfully',
                    data: { user: updatedUser }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Error promoting user to admin:', error);
            next(createError(500, 'Failed to promote user to admin'));
        } finally {
            await session.endSession();
        }
    }
];

/**
 * Demote admin to regular user
 */
export const demoteFromAdmin = [
    validateUserId,
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { userId } = req.params;

                // Prevent self-demotion
                if (userId === req.user._id.toString()) {
                    throw createError(400, 'Cannot demote yourself');
                }

                const user = await User.findById(userId).session(session);
                if (!user) {
                    throw createError(404, 'User not found');
                }

                if (!user.isAdmin) {
                    throw createError(409, 'User is not an admin');
                }

                // Check if this is the last admin (optional safety check)
                const adminCount = await User.countDocuments({ isAdmin: true }).session(session);
                if (adminCount <= 1) {
                    throw createError(400, 'Cannot demote the last admin user');
                }

                // Atomic update
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        isAdmin: false,
                        demotedBy: req.user.email,
                        demotedAt: new Date()
                    },
                    {
                        new: true,
                        session,
                        select: '_id name email isAdmin demotedBy demotedAt',
                        runValidators: true
                    }
                );

                res.json({
                    success: true,
                    message: 'User demoted from admin successfully',
                    data: { user: updatedUser }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error('Error demoting user from admin:', error);
            next(createError(500, 'Failed to demote user from admin'));
        } finally {
            await session.endSession();
        }
    }
];

/**
 * Bulk operations for materials (approve/reject multiple)
 */
export const bulkUpdateMaterials = [
    body('materialIds')
        .isArray({ min: 1, max: 50 })
        .withMessage('materialIds must be an array with 1-50 items')
        .custom((value) => {
            if (!value.every(id => mongoose.Types.ObjectId.isValid(id))) {
                throw new Error('All materialIds must be valid MongoDB ObjectIds');
            }
            return true;
        }),
    body('action')
        .isIn(['approve', 'reject'])
        .withMessage('Action must be either "approve" or "reject"'),
    body('reason')
        .if(body('action').equals('reject'))
        .notEmpty()
        .withMessage('Rejection reason is required when rejecting materials'),
    handleValidationErrors,
    async (req, res, next) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { materialIds, action, reason, adminNotes } = req.body;

                const updateData = {
                    ...(action === 'approve' && {
                        verifiedBy: 'verified',
                        verifiedAt: new Date(),
                        verifiedByAdmin: req.user.email,
                        ...(adminNotes && { adminNotes: adminNotes.trim() })
                    }),
                    ...(action === 'reject' && {
                        verifiedBy: 'rejected',
                        rejectedAt: new Date(),
                        rejectedByAdmin: req.user.email,
                        rejectionReason: reason.trim()
                    })
                };

                const result = await Material.updateMany(
                    {
                        _id: { $in: materialIds },
                        verifiedBy: { $ne: action === 'approve' ? 'verified' : 'rejected' }
                    },
                    updateData,
                    { session }
                );

                res.json({
                    success: true,
                    message: `Successfully ${action}ed ${result.modifiedCount} materials`,
                    data: {
                        totalRequested: materialIds.length,
                        actuallyModified: result.modifiedCount,
                        action
                    }
                });
            });
        } catch (error) {
            if (error.statusCode) {
                return next(error);
            }
            console.error(`Error in bulk ${req.body.action} materials:`, error);
            next(createError(500, `Failed to ${req.body.action} materials in bulk`));
        } finally {
            await session.endSession();
        }
    }
];
