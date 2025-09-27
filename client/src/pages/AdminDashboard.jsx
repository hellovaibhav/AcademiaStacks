import React, {useState, useEffect, useCallback} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import {useToast} from '../components/Toast';
import {useAuth} from '../context/AuthContext';
import {API_ENDPOINTS} from '../config/api';
import {ModernSpinner} from '../components/Loader';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineEye,
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineClockCircle,
  AiOutlineCheckSquare
} from 'react-icons/ai';

const AdminDashboard = () => {
  const {user, isAuthenticated} = useAuth();
  const {toast} = useToast();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date not available';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const [stats, setStats] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    materialType: '',
    page: 1
  });

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.materialType) {
        params.append('materialType', filters.materialType);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }

      const response = await axios.get(`${API_ENDPOINTS.ADMIN_MATERIALS}?${params}`);
      setMaterials(response.data.materials || []);
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_STATS);
      setStats(response.data.stats);
    } catch (error) {
      // Error fetching stats - continue without stats
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      fetchMaterials();
      fetchStats();
    }
  }, [isAuthenticated, user, filters, fetchMaterials, fetchStats]);

  const handleApprove = async (materialId) => {
    setActionLoading(prev => ({...prev, [materialId]: true}));
    try {
      await axios.patch(`${API_ENDPOINTS.ADMIN_MATERIALS}/${materialId}/approve`, {
        adminNotes: 'Approved by admin'
      });
      toast.success('Material approved successfully');
      fetchMaterials();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve material');
    } finally {
      setActionLoading(prev => ({...prev, [materialId]: false}));
    }
  };

  const handleReject = async (materialId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) {
      return;
    }

    setActionLoading(prev => ({...prev, [materialId]: true}));
    try {
      await axios.patch(`${API_ENDPOINTS.ADMIN_MATERIALS}/${materialId}/reject`, {
        reason
      });
      toast.success('Material rejected and deleted from storage');
      fetchMaterials();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject material');
    } finally {
      setActionLoading(prev => ({...prev, [materialId]: false}));
    }
  };

  const handleViewMaterial = async (materialId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.ADMIN_MATERIALS}/${materialId}`);
      setSelectedMaterial(response.data.material);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load material details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
    case 'verified': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'legacy': return 'text-orange-600 bg-orange-100';
    case 'notVerified': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
    case 'verified': return <AiOutlineCheckCircle className="w-4 h-4" />;
    case 'pending': return <AiOutlineClockCircle className="w-4 h-4" />;
    case 'rejected': return <AiOutlineCloseCircle className="w-4 h-4" />;
    case 'legacy': return <AiOutlineFileText className="w-4 h-4" />;
    case 'notVerified': return <AiOutlineFileText className="w-4 h-4" />;
    default: return <AiOutlineFileText className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center pt-20">
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4"
        >
          <AiOutlineUser className="text-6xl text-[#22A39F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to access the admin dashboard
          </p>
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="bg-[#22A39F] text-white px-6 py-2 rounded-lg hover:bg-[#1a8a85] transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center pt-20">
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4"
        >
          <AiOutlineCloseCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges to access this page
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#22A39F] mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Manage and moderate uploaded materials
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <AiOutlineFileText className="text-3xl text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Total Materials</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.materials.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <AiOutlineClockCircle className="text-3xl text-yellow-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.materials.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <AiOutlineCheckSquare className="text-3xl text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.materials.approved}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <AiOutlineUser className="text-3xl text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.users.total}</p>
                </div>
              </div>
            </div>
            {stats.materials.legacy > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <AiOutlineFileText className="text-3xl text-orange-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Legacy Materials</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.materials.legacy}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
              <select
                value={filters.materialType}
                onChange={(e) => setFilters(prev => ({...prev, materialType: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
              >
                <option value="">All Types</option>
                <option value="notes">Notes</option>
                <option value="assignments">Assignments</option>
                <option value="pyqs">PYQs</option>
                <option value="handouts">Handouts</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({status: '', materialType: '', page: 1})}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Materials List */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Materials Management</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ModernSpinner size="medium" type="symmetric" />
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AiOutlineFileText className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>No materials found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr key={material._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {material.subject}
                          </div>
                          <div className="text-sm text-gray-500">
                            Semester {material.semester}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {material.materialType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(material.verifiedBy || 'notVerified')}`}>
                          {getStatusIcon(material.verifiedBy || 'notVerified')}
                          <span className="ml-1 capitalize">{material.verifiedBy || 'notVerified'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.contributedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(material.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMaterial(material._id)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <AiOutlineEye className="w-4 h-4" />
                          </button>

                          {(material.verifiedBy === 'pending' || material.verifiedBy === 'notVerified' || !material.verifiedBy) && (
                            <>
                              <button
                                onClick={() => handleApprove(material._id)}
                                disabled={actionLoading[material._id]}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                title="Approve"
                              >
                                <AiOutlineCheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(material._id)}
                                disabled={actionLoading[material._id]}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Reject"
                              >
                                <AiOutlineCloseCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Material Details Modal */}
        {showModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Material Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AiOutlineCloseCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.semester}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedMaterial.materialType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMaterial.verifiedBy)}`}>
                      {getStatusIcon(selectedMaterial.verifiedBy)}
                      <span className="ml-1 capitalize">{selectedMaterial.verifiedBy}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedMaterial.desc || 'No description provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Authors</label>
                  <p className="text-sm text-gray-900">{selectedMaterial.author?.join(', ')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructors</label>
                  <p className="text-sm text-gray-900">{selectedMaterial.instructorName?.join(', ')}</p>
                </div>

                {selectedMaterial.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="text-sm text-red-600">{selectedMaterial.rejectionReason}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => window.open(selectedMaterial.materialLink, '_blank')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View PDF
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
