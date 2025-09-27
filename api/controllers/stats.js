import Material from '../models/Material.js';
import User from '../models/User.js';
import {createError} from '../utils/error.js';

export const getPlatformStats = async (req, res, next) => {
  try {
    // Get total materials count
    const totalMaterials = await Material.countDocuments();

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get contributors count (users who have uploaded materials)
    const contributors = await Material.distinct('contributedBy');
    const contributorsCount = contributors.length;

    // Get materials by type
    const materialsByType = await Material.aggregate([
      {
        $group: {
          _id: '$materialType',
          count: {$sum: 1}
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMaterials = await Material.countDocuments({
      createdAt: {$gte: thirtyDaysAgo}
    });

    // Get verified materials count
    const verifiedMaterials = await Material.countDocuments({
      $or: [
        {verifiedBy: 'verified'},
        {verifiedBy: {$exists: false}},
        {verifiedBy: 'notVerified'}
      ]
    });

    res.status(200).json({
      success: true,
      stats: {
        totalMaterials,
        totalUsers,
        contributorsCount,
        verifiedMaterials,
        recentMaterials,
        materialsByType: materialsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    next(createError(500, 'Failed to fetch platform statistics.'));
  }
};

export const getGitHubStats = async (req, res, next) => {
  try {
    // For now, we'll return mock data since we don't have GitHub API integration
    // In a real implementation, you would call GitHub API to get repository stats
    const mockGitHubStats = {
      stars: 42, // This would come from GitHub API
      forks: 8, // This would come from GitHub API
      watchers: 15, // This would come from GitHub API
      openIssues: 3, // This would come from GitHub API
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      github: mockGitHubStats
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    next(createError(500, 'Failed to fetch GitHub statistics.'));
  }
};
