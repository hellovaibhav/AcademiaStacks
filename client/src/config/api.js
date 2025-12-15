// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Validate environment variable
if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not defined. Please check your environment configuration.');
}

export const API_ENDPOINTS = {
  // Authentication
  VERIFY: `${API_BASE_URL}/api/auth/verification`,

  // Materials (using consistent lowercase plural format)
  NOTES: `${API_BASE_URL}/api/materials/notes`,
  ASSIGNMENTS: `${API_BASE_URL}/api/materials/assignments`,
  PYQ: `${API_BASE_URL}/api/materials/pyqs`,
  HANDOUTS: `${API_BASE_URL}/api/materials/handouts`,
  MATERIAL: `${API_BASE_URL}/api/materials`,

  // Upload
  UPLOAD_MATERIAL: `${API_BASE_URL}/api/upload/material`,
  UPLOAD_STATS: `${API_BASE_URL}/api/upload/stats`,

  // Admin
  ADMIN_MATERIALS: `${API_BASE_URL}/api/admin/materials`,
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,

  // User Profile
  USER_PROFILE_STATS: `${API_BASE_URL}/api/user-profile`,

  // Statistics
  PLATFORM_STATS: `${API_BASE_URL}/api/stats/platform`,
  GITHUB_STATS: `${API_BASE_URL}/api/stats/github`,
  USER_UPLOADED: `${API_BASE_URL}/api/user-profile`,
  USER_UPVOTED: `${API_BASE_URL}/api/user-profile`,
  USER_SAVED: `${API_BASE_URL}/api/user-profile`,

  // Other
  UPVOTE: `${API_BASE_URL}/api/materials/upvote`,
  FEEDBACK: `${API_BASE_URL}/api/feedbacks`
};

export default API_ENDPOINTS;
