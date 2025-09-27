import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {HiUserCircle} from 'react-icons/hi';
import {
  AiOutlineUpload,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineLogout
} from 'react-icons/ai';
import {BsBookmark} from 'react-icons/bs';
import {BiUpvote} from 'react-icons/bi';
import axios from 'axios';
import PDFViewer from '../components/PDFViewer';
import PDFThumbnail from '../components/PDFThumbnail';
import {ModernSpinner} from '../components/Loader';
import {API_ENDPOINTS} from '../config/api';
import {useAuth} from '../context/AuthContext';
import Cookies from 'js-cookie';
const User = () => {
  const navigate = useNavigate();
  const {toast} = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('uploaded');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    url: '',
    title: ''
  });
  const [upvoteLoading, setUpvoteLoading] = useState({});

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

  // Helper function to check if user has upvoted
  const hasUserUpvoted = (material) => {
    const userEmail = Cookies.get('email');
    if (!userEmail || !material.upvotes) {
      return false;
    }
    return material.upvotes.includes(userEmail);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchUserStats(userData._id);
    fetchMaterials(userData._id, 'uploaded');
  }, [navigate, fetchUserStats, fetchMaterials]);

  const fetchUserStats = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.USER_PROFILE_STATS}/${userId}/stats`);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load profile statistics');
    }
  }, [toast]);

  const fetchMaterials = useCallback(async (userId, type) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.USER_PROFILE_STATS}/${userId}/${type}`);
      setMaterials(response.data.materials || []);
    } catch (error) {
      toast.error(`Failed to load ${type} materials`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (user) {
      fetchMaterials(user._id, tab);
    }
  };

  const handleViewPDF = (material) => {
    setPdfViewer({
      isOpen: true,
      url: material.materialLink,
      materialId: material._id,
      title: `${material.subject} - ${material.instructorName}`
    });
  };

  const handleUpvote = async (material) => {
    const materialId = material._id;
    const email = Cookies.get('email');

    if (!email) {
      toast.error('Please login to upvote');
      return;
    }

    setUpvoteLoading(prev => ({...prev, [materialId]: true}));

    try {
      await axios.post(API_ENDPOINTS.UPVOTE, {materialId, email});

      // Update local data
      setMaterials(prevMaterials =>
        prevMaterials.map(item => {
          if (item._id === materialId) {
            const hasUpvoted = hasUserUpvoted(item);
            const newUpvotes = hasUpvoted
              ? item.upvotes.filter(vote => vote !== email)
              : [...(item.upvotes || []), email];

            return {
              ...item,
              upvotes: newUpvotes
            };
          }
          return item;
        })
      );

      // Show appropriate success message
      const hasUpvoted = hasUserUpvoted(material);
      toast.success(hasUpvoted ? 'Upvote removed' : 'Upvoted successfully');

      // Refresh stats and materials to reflect changes
      if (user) {
        fetchUserStats(user._id);
        fetchMaterials(user._id, activeTab);
      }
    } catch (error) {
      toast.error('Failed to update vote');
    } finally {
      setUpvoteLoading(prev => ({...prev, [materialId]: false}));
    }
  };

  const handleLogout = async () => {
    try {
      // Clear local storage and navigate
      localStorage.clear();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Error during logout');
    }
  };

  const handleTabClick = (tabId) => {
    handleTabChange(tabId);
  };

  const handleViewPDFClick = (material) => {
    handleViewPDF(material);
  };

  const handleUpvoteClick = (e, material) => {
    e.stopPropagation();
    handleUpvote(material);
  };

  const handleClosePDFViewer = () => {
    setPdfViewer({isOpen: false, url: '', materialId: '', title: ''});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center pt-20">
        <ModernSpinner size="large" type="stacking" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <HiUserCircle className="h-32 w-32 text-[#22A39F]" />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Branch:</span> {user.branch}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Batch:</span> {user.batch}
              </p>
              {user.isAdmin && (
                <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <AiOutlineLogout />
              <span>Logout</span>
            </button>
          </div>
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
                <AiOutlineUpload className="text-3xl text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Uploaded</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.uploaded}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <BiUpvote className="text-3xl text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Upvoted</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.upvoted}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <BsBookmark className="text-3xl text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Saved</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.saved}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <AiOutlineHeart className="text-3xl text-red-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Upvotes Received</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUpvotesReceived}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="bg-white rounded-lg shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                {id: 'uploaded', label: 'Uploaded Materials', icon: AiOutlineUpload},
                {id: 'upvoted', label: 'Upvoted Materials', icon: BiUpvote},
                {id: 'saved', label: 'Saved Materials', icon: BsBookmark}
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-[#22A39F] text-[#22A39F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Materials List */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <ModernSpinner size="medium" type="symmetric" />
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No {activeTab} materials found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <motion.div
                    key={material._id}
                    className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    whileHover={{scale: 1.02}}
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => handleViewPDFClick(material)}
                    >
                      <PDFThumbnail
                        pdfUrl={material.materialLink}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                        alt={`${material.subject} - PDF Preview`}
                      />

                      {/* View PDF Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <AiOutlineEye size={32} className="mx-auto mb-2" />
                          <span className="text-sm font-medium">View PDF</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {material.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Type:</span> {material.materialType}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Semester:</span> {material.semester}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Instructor:</span> {material.instructorName?.join(', ')}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {formatDate(material.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleUpvoteClick(e, material)}
                          disabled={upvoteLoading[material._id]}
                          className={`flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 ${
                            hasUserUpvoted(material)
                              ? 'text-[#22A39F] bg-[#22A39F]/10 rounded-lg px-2 py-1'
                              : 'text-gray-600 hover:text-[#22A39F] hover:bg-gray-100 rounded-lg px-2 py-1'
                          }`}
                        >
                          <BiUpvote
                            className={`h-4 w-4 ${
                              hasUserUpvoted(material)
                                ? 'text-[#22A39F]'
                                : 'text-gray-400'
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {material.upvotes?.length || 0}
                          </span>
                          {hasUserUpvoted(material) && (
                            <span className="text-xs text-[#22A39F] font-semibold">
                              ✓
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* PDF Viewer Modal */}
        <PDFViewer
          isOpen={pdfViewer.isOpen}
          onClose={handleClosePDFViewer}
          pdfUrl={pdfViewer.url}
          materialId={pdfViewer.materialId}
          title={pdfViewer.title}
        />
      </div>
    </div>
  );
};

export default User;
