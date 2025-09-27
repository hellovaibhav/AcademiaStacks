import Material from '../models/Material.js';
import User from '../models/User.js';
// Removed Gozunga integration
import {createError} from '../utils/error.js';

/**
 * Get all materials for admin review (including pending, approved, rejected)
 */
export const getAllMaterialsForAdmin = async (req, res, next) => {
  try {
    const {status, page = 1, limit = 20} = req.query;

    // Build filter based on status
    let filter = {};
    if (status) {
      filter.verifiedBy = status;
    }

    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const finalLimit = Math.min(limit, maxLimit);

    const materials = await Material.find(filter)
      .populate('contributedBy', 'name email')
      .sort({createdAt: -1})
      .skip(skip)
      .limit(finalLimit);

    const totalMaterials = await Material.countDocuments(filter);
    const totalPages = Math.ceil(totalMaterials / finalLimit);

    // Get statistics
    const stats = await Material.aggregate([
      {
        $group: {
          _id: {$ifNull: ['$verifiedBy', 'legacy']},
          count: {$sum: 1}
        }
      }
    ]);

    const statistics = {
      pending: 0,
      approved: 0,
      rejected: 0,
      legacy: 0,
      notVerified: 0,
      total: totalMaterials
    };

    stats.forEach(stat => {
      if (stat._id === 'pending') {
        statistics.pending = stat.count;
      } else if (stat._id === 'verified') {
        statistics.approved = stat.count;
      } else if (stat._id === 'rejected') {
        statistics.rejected = stat.count;
      } else if (stat._id === 'legacy') {
        statistics.legacy = stat.count;
      } else if (stat._id === 'notVerified') {
        statistics.notVerified = stat.count;
      }
    });

    res.json({
      success: true,
      materials,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      statistics
    });
  } catch (error) {
    console.error('Error fetching materials for admin:', error);
    next(createError(500, 'Failed to fetch materials'));
  }
};

/**
 * Approve a material
 */
export const approveMaterial = async (req, res, next) => {
  try {
    const {materialId} = req.params;
    const {adminNotes} = req.body;

    const material = await Material.findById(materialId);
    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    if (material.verifiedBy === 'verified') {
      return next(createError(400, 'Material is already approved'));
    }

    // Update material status
    material.verifiedBy = 'verified';
    material.verifiedAt = new Date();
    material.verifiedByAdmin = req.user.email;
    if (adminNotes) {
      material.adminNotes = adminNotes;
    }

    await material.save();

    res.json({
      success: true,
      message: 'Material approved successfully',
      material
    });
  } catch (error) {
    console.error('Error approving material:', error);
    next(createError(500, 'Failed to approve material'));
  }
};

/**
 * Reject a material and delete from storage
 */
export const rejectMaterial = async (req, res, next) => {
  try {
    const {materialId} = req.params;
    const {reason} = req.body;

    const material = await Material.findById(materialId);
    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    if (material.verifiedBy === 'rejected') {
      return next(createError(400, 'Material is already rejected'));
    }

    // File stored locally, no additional cleanup needed

    // Update material status
    material.verifiedBy = 'rejected';
    material.rejectedAt = new Date();
    material.rejectedByAdmin = req.user.email;
    if (reason) {
      material.rejectionReason = reason;
    }

    await material.save();

    res.json({
      success: true,
      message: 'Material rejected and deleted from storage',
      material
    });
  } catch (error) {
    console.error('Error rejecting material:', error);
    next(createError(500, 'Failed to reject material'));
  }
};

/**
 * Get material details for admin review
 */
export const getMaterialForAdmin = async (req, res, next) => {
  try {
    const {materialId} = req.params;

    const material = await Material.findById(materialId)
      .populate('contributedBy', 'name email branch batch');

    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    res.json({
      success: true,
      material
    });
  } catch (error) {
    console.error('Error fetching material for admin:', error);
    next(createError(500, 'Failed to fetch material details'));
  }
};

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({isVerified: true});
    const adminUsers = await User.countDocuments({isAdmin: true});

    const materialStats = await Material.aggregate([
      {
        $group: {
          _id: {$ifNull: ['$verifiedBy', 'legacy']},
          count: {$sum: 1}
        }
      }
    ]);

    const totalMaterials = await Material.countDocuments();
    const pendingMaterials = materialStats.find(s => s._id === 'pending')?.count || 0;
    const approvedMaterials = materialStats.find(s => s._id === 'verified')?.count || 0;
    const rejectedMaterials = materialStats.find(s => s._id === 'rejected')?.count || 0;
    const legacyMaterials = materialStats.find(s => s._id === 'legacy')?.count || 0;
    const notVerifiedMaterials = materialStats.find(s => s._id === 'notVerified')?.count || 0;

    // Recent activity
    const recentMaterials = await Material.find()
      .populate('contributedBy', 'name email')
      .sort({createdAt: -1})
      .limit(10);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          admins: adminUsers
        },
        materials: {
          total: totalMaterials,
          pending: pendingMaterials,
          approved: approvedMaterials,
          rejected: rejectedMaterials,
          legacy: legacyMaterials,
          notVerified: notVerifiedMaterials
        }
      },
      recentActivity: recentMaterials
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    next(createError(500, 'Failed to fetch admin statistics'));
  }
};

/**
 * Promote user to admin
 */
export const promoteToAdmin = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    if (user.isAdmin) {
      return next(createError(400, 'User is already an admin'));
    }

    user.isAdmin = true;
    user.promotedBy = req.user.email;
    user.promotedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    next(createError(500, 'Failed to promote user to admin'));
  }
};

/**
 * Demote admin to regular user
 */
export const demoteFromAdmin = async (req, res, next) => {
  try {
    const {userId} = req.params;

    // Prevent self-demotion
    if (userId === req.user._id.toString()) {
      return next(createError(400, 'Cannot demote yourself'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    if (!user.isAdmin) {
      return next(createError(400, 'User is not an admin'));
    }

    user.isAdmin = false;
    user.demotedBy = req.user.email;
    user.demotedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'User demoted from admin successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error demoting user from admin:', error);
    next(createError(500, 'Failed to demote user from admin'));
  }
};
