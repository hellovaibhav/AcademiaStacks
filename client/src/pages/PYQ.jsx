import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import PDFViewer from '../components/PDFViewer';
import PDFThumbnail from '../components/PDFThumbnail';
import Loader from '../components/Loader';
import ModernFilter from '../components/ModernFilter';
import {BiUpvote} from 'react-icons/bi';
import {AiOutlineEye} from 'react-icons/ai';
import Cookies from 'js-cookie';
import {useToast} from '../components/Toast';
import {API_ENDPOINTS} from '../config/api';

const PYQ = () => {
  const {toast} = useToast();
  const [index, setIndex] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    featured: false
  });
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    url: '',
    materialId: '',
    title: ''
  });
  const [upvoteLoading, setUpvoteLoading] = useState({});

  // Helper function to check if user has upvoted
  const hasUserUpvoted = (material) => {
    const userEmail = Cookies.get('email');
    if (!userEmail || !material.upvotes) {
      return false;
    }
    return material.upvotes.includes(userEmail);
  };

  const showMore = () => {
    if (index < data.length - 1) {
      const newIndex = Math.min(index + 4, data.length - 1);
      setIndex(newIndex);
    }
  };

  const fetchPYQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.PYQ);
      setData(response.data.materials || response.data);
    } catch (error) {
      toast.error('Failed to load PYQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPYQs();
  }, []);

  const handleFilterChange = (event) => {
    const {name, value} = event.target;
    setFilters((prevFilters) => ({...prevFilters, [name]: value}));
  };

  const handleClearFilters = () => {
    setFilters({
      branch: '',
      semester: '',
      featured: false
    });
  };

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

  const handleViewPDF = (material) => {

    setPdfViewer({
      isOpen: true,
      url: material.materialLink,
      materialId: material._id,
      title: `${material.subject} - ${material.instructorName}`
    });
  };

  // Fallback function to open PDF in new tab
  const handleViewPDFInNewTab = (material) => {
    if (material.materialLink) {
      window.open(material.materialLink, '_blank');
    } else {
      toast.error('PDF link not available');
    }
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
      setData(prevData =>
        prevData.map(item => {
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
    } catch (error) {
      toast.error('Failed to update vote');
    } finally {
      setUpvoteLoading(prev => ({...prev, [materialId]: false}));
    }
  };

  return (
    <>
      {
        <div className="min-h-[100vh] bg-[#F3EFE0] pt-[5rem] md:pt-24">
          {/* Mobile Filter */}
          <ModernFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobile={true}
            className="md:hidden"
          />

          <div className="flex">
            {/* Left Sidebar Filter - Desktop */}
            <div className="hidden md:block w-1/4 min-w-[280px] pl-4">
              <div className="sticky top-24">
                <ModernFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile={false}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-4 md:px-8 pb-10">
              {/* Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-14 lg:mt-0 w-full">
                {data
                  .slice(0, index + 1)
                  .filter(
                    (item) =>
                      (filters.semester
                        ? Number(item.semester) === Number(filters.semester)
                        : true) &&
                      (filters.branch
                        ? item.branch.find((e) => e === filters.branch)
                        : true) &&
                      (filters.featured
                        ? item.featured === (filters.featured === 'true')
                        : true)
                  )
                  .map((material, ind) => (
                    <motion.div
                      key={material._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.3, delay: ind * 0.1}}
                    >
                      {/* PDF Thumbnail */}
                      <div
                        className="relative cursor-pointer group"
                        onClick={() => handleViewPDF(material)}
                      >
                        <PDFThumbnail
                          pdfUrl={material.materialLink}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                          alt={`${material.subject} - PDF Preview`}
                        />

                        {/* View PDF Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <AiOutlineEye size={32} className="mx-auto mb-2" />
                            <span className="text-sm font-medium">View PDF</span>
                          </div>
                        </div>

                        {/* Material Type Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-[#22A39F] text-white text-xs font-medium px-2 py-1 rounded-full">
                            {material.materialType}
                          </span>
                        </div>

                        {/* Semester Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Sem {material.semester}
                          </span>
                        </div>
                      </div>

                      {/* Material Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                          {material.subject}
                        </h3>

                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p>
                            <span className="font-medium">Instructor:</span> {material.instructorName?.join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Author:</span> {material.author?.join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Year:</span> {material.yearOfWriting}
                          </p>
                          <p>
                            <span className="font-medium">Branch:</span> {material.branch?.join(', ')}
                          </p>
                        </div>

                        {/* Description (if available) */}
                        {material.desc && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {material.desc}
                          </p>
                        )}

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpvote(material);
                              }}
                              disabled={upvoteLoading[material._id]}
                              className={`flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 ${
                                hasUserUpvoted(material)
                                  ? 'text-[#22A39F] bg-[#22A39F]/10 rounded-lg px-2 py-1'
                                  : 'text-gray-600 hover:text-[#22A39F] hover:bg-gray-100 rounded-lg px-2 py-1'
                              }`}
                            >
                              <BiUpvote
                                className={`h-5 w-5 ${
                                  hasUserUpvoted(material)
                                    ? 'text-[#22A39F]'
                                    : 'text-gray-400'
                                }`}
                              />
                              <span className="text-sm font-medium">
                                {material.upvotes?.length || 0} upvotes
                              </span>
                              {hasUserUpvoted(material) && (
                                <span className="text-xs text-[#22A39F] font-semibold">
                                  ✓
                                </span>
                              )}
                            </button>

                            {/* Open in New Tab Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPDFInNewTab(material);
                              }}
                              className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1 transition-all duration-200"
                              title="Open PDF in new tab"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span className="text-sm font-medium">Open</span>
                            </button>
                          </div>

                          <div className="text-xs text-gray-400">
                            {formatDate(material.createdAt)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Load More Button */}
              <div className="mt-8 flex justify-center">
                {index < data.length - 1 ? (
                  <motion.button
                    whileTap={{scale: 0.95}}
                    whileHover={{scale: 1.05}}
                    onClick={showMore}
                    className="bg-[#22A39F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1a8a87] transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load More PYQs
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="text-center"
                  >
                    <p className="text-gray-500 text-lg mb-4">🎉 You've seen all PYQs!</p>
                    <p className="text-sm text-gray-400">Check back later for new uploads</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      }

      {/* PDF Viewer */}
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer({isOpen: false, url: '', materialId: '', title: ''})}
        pdfUrl={pdfViewer.url}
        materialId={pdfViewer.materialId}
        title={pdfViewer.title}
      />

      {/* Loading Overlay */}
      {loading && <Loader type="overlay" message="Loading PYQs..." />}
    </>
  );
};

export default PYQ;