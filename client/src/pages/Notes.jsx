import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PDFViewer from "../components/PDFViewer";
import PDFThumbnail from "../components/PDFThumbnail";
import { BiUpvote } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from "../config/api";

const Notes = () => {
  const [index, setIndex] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    featured: false,
  });
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    url: "",
    materialId: "",
    title: ""
  });
  const [upvoteLoading, setUpvoteLoading] = useState({});

  // Helper function to check if user has upvoted
  const hasUserUpvoted = (material) => {
    const userEmail = Cookies.get("email");
    if (!userEmail || !material.upvotes) return false;
    return material.upvotes.includes(userEmail);
  };

  const showMore = () => {
    if (index < data.length - 1) {
      const newIndex = Math.min(index + 8, data.length); // Increased to 8 for better display
      setIndex(newIndex);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.NOTES);
      setData(response.data.materials || response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleViewPDF = (material) => {
    console.log('🔍 Opening PDF:', {
      materialId: material._id,
      url: material.materialLink,
      subject: material.subject
    });
    
    // Try to open in PDFViewer first
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

  // Download PDF function
  const handleDownloadPDF = (material) => {
    if (material.materialLink) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = material.materialLink;
      link.download = `${material.subject}_${material.materialType}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } else {
      toast.error('PDF link not available');
    }
  };

  const handleUpvote = async (material) => {
    const materialId = material._id;
    const email = Cookies.get("email");

    if (!email) {
      toast.error("Please login to upvote");
      return;
    }

    setUpvoteLoading(prev => ({ ...prev, [materialId]: true }));

    try {
      await axios.post(API_ENDPOINTS.UPVOTE, { materialId, email });
      
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
      toast.success(hasUpvoted ? "Upvote removed" : "Upvoted successfully");
    } catch (error) {
      console.error('Upvote error:', error);
      toast.error("Failed to update vote");
    } finally {
      setUpvoteLoading(prev => ({ ...prev, [materialId]: false }));
    }
  };

  return (
    <>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {
        <div className="min-h-[100vh] bg-[#F3EFE0] pt-[5rem] md:pt-24">
          {/* Mobile Filter Bar */}
          <div className="flex items-center justify-evenly md:hidden fixed top-24 h-14 left-0 w-[100vw] bg-[#F3EFE0] drop-shadow-md z-40">
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-28 sm:w-32 mx-1"
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
              >
                <option value="">All Sem</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
              </select>
            </div>
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-[5.7rem] sm:w-32 mx-1"
                name="featured"
                value={filters.featured}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Featured</option>
              </select>
            </div>
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-24 sm:w-32 mx-1"
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
              >
                <option value="">All Branch</option>
                <option value="ECE">ECE</option>
                <option value="CSE">CSE</option>
              </select>
            </div>
          </div>

          <div className="flex">
            {/* Left Sidebar Filter - Desktop */}
            <div className="hidden md:block w-1/4 min-w-[250px] pl-4">
              <div className="sticky top-24">
                <div className="flex text-white h-80 flex-col flex-wrap items-center py-2 justify-center rounded-xl px-4 xl:px-10 2xl:px-20 lg:px-6 bg-[rgb(34,163,159,0.4)]">
                  <p className="text-3xl font-bold m-2">Filters</p>
                  <div>
                    <label className="font-semibold text-right">Semester :</label>
                    <select
                      className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                      name="semester"
                      value={filters.semester}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Semesters</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-right">Featured :</label>
                    <select
                      className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                      name="featured"
                      value={filters.featured}
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      <option value="true">Featured</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-right">Branch :</label>
                    <select
                      className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                      name="branch"
                      value={filters.branch}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Branches</option>
                      <option value="ECE">ECE</option>
                      <option value="CSE">CSE</option>
                    </select>
                  </div>
                </div>
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
                      ? item.featured === (filters.featured === "true")
                      : true)
                )
                .map((material, ind) => (
                  <motion.div
                    key={material._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: ind * 0.1 }}
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
                                ? "text-[#22A39F] bg-[#22A39F]/10 rounded-lg px-2 py-1"
                                : "text-gray-600 hover:text-[#22A39F] hover:bg-gray-100 rounded-lg px-2 py-1"
                            }`}
                          >
                            <BiUpvote
                              className={`h-5 w-5 ${
                                hasUserUpvoted(material)
                                  ? "text-[#22A39F]"
                                  : "text-gray-400"
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

                          {/* Download PDF Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(material);
                            }}
                            className="flex items-center space-x-2 text-green-600 hover:bg-green-50 rounded-lg px-3 py-1 transition-all duration-200"
                            title="Download PDF"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">Download</span>
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
                          {new Date(material.createdAt).toLocaleDateString()}
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
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={showMore}
                  className="bg-[#22A39F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1a8a87] transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Load More Notes
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-gray-500 text-lg mb-4">🎉 You've seen all notes!</p>
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
        onClose={() => setPdfViewer({ isOpen: false, url: "", materialId: "", title: "" })}
        pdfUrl={pdfViewer.url}
        materialId={pdfViewer.materialId}
        title={pdfViewer.title}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22A39F] mx-auto"></div>
            <p className="text-center mt-4 text-gray-600">Loading notes...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;