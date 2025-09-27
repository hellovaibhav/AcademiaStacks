import Material from '../models/Material.js';
import User from '../models/User.js';
import {createError} from '../utils/error.js';

/**
 * Get user's uploaded materials
 */
export const getUserUploadedMaterials = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const {page = 1, limit = 20} = req.query;

    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const finalLimit = Math.min(limit, maxLimit);

    const materials = await Material.find({
      contributedBy: userId,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    })
      .sort({createdAt: -1})
      .skip(skip)
      .limit(finalLimit);

    const totalMaterials = await Material.countDocuments({
      contributedBy: userId,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    const totalPages = Math.ceil(totalMaterials / finalLimit);

    res.json({
      success: true,
      materials,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user uploaded materials:', error);
    next(createError(500, 'Failed to fetch uploaded materials'));
  }
};

/**
 * Get user's upvoted materials
 */
export const getUserUpvotedMaterials = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const {page = 1, limit = 20} = req.query;

    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const finalLimit = Math.min(limit, maxLimit);

    // Get user's email first
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Find materials where the user's email is in the upvotes array
    const materials = await Material.find({
      upvotes: user.email,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    })
      .sort({createdAt: -1})
      .skip(skip)
      .limit(finalLimit);

    const totalMaterials = await Material.countDocuments({
      upvotes: user.email,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    const totalPages = Math.ceil(totalMaterials / finalLimit);

    res.json({
      success: true,
      materials,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user upvoted materials:', error);
    next(createError(500, 'Failed to fetch upvoted materials'));
  }
};

/**
 * Get user's saved materials
 */
export const getUserSavedMaterials = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const {page = 1, limit = 20} = req.query;

    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const finalLimit = Math.min(limit, maxLimit);

    // Get user's saved items
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const savedItemIds = user.savedItem.filter(id => id !== '0');

    if (savedItemIds.length === 0) {
      return res.json({
        success: true,
        materials: [],
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: 0,
          totalMaterials: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    }

    const materials = await Material.find({
      _id: {$in: savedItemIds},
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    })
      .sort({createdAt: -1})
      .skip(skip)
      .limit(finalLimit);

    const totalMaterials = await Material.countDocuments({
      _id: {$in: savedItemIds},
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    const totalPages = Math.ceil(totalMaterials / finalLimit);

    res.json({
      success: true,
      materials,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user saved materials:', error);
    next(createError(500, 'Failed to fetch saved materials'));
  }
};

/**
 * Get user profile statistics
 */
export const getUserProfileStats = async (req, res, next) => {
  try {
    const {userId} = req.params;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Get uploaded materials count
    const uploadedCount = await Material.countDocuments({
      contributedBy: userId,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    // Get upvoted materials count
    const upvotedCount = await Material.countDocuments({
      upvotes: user.email,
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    // Get saved materials count
    const savedItemIds = user.savedItem.filter(id => id !== '0');
    const savedCount = await Material.countDocuments({
      _id: {$in: savedItemIds},
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: 'notVerified'},
        {verifiedBy: {$exists: false}}
      ]
    });

    // Get total upvotes received
    const totalUpvotesReceived = await Material.aggregate([
      {$match: {contributedBy: userId}},
      {$project: {upvoteCount: {$size: '$upvotes'}}},
      {$group: {_id: null, total: {$sum: '$upvoteCount'}}}
    ]);

    res.json({
      success: true,
      stats: {
        uploaded: uploadedCount,
        upvoted: upvotedCount,
        saved: savedCount,
        totalUpvotesReceived: totalUpvotesReceived[0]?.total || 0
      },
      user: {
        name: user.name,
        email: user.email,
        branch: user.branch,
        batch: user.batch,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error fetching user profile stats:', error);
    next(createError(500, 'Failed to fetch profile statistics'));
  }
};
