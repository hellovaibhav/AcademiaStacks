import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import {useToast} from '../components/Toast';
import {useAuth} from '../context/AuthContext';
import {API_ENDPOINTS} from '../config/api';
import {ModernSpinner} from '../components/Loader';
import PaywallOverlay from '../components/PaywallOverlay';
import {
  AiOutlineUpload,
  AiOutlineFileText,
  AiOutlineCloseCircle,
  AiOutlineEye,
  AiOutlineDelete
} from 'react-icons/ai';

const Upload = () => {
  const {user, isAuthenticated} = useAuth();
  const {toast} = useToast();
  // Upload functionality disabled - paywall active
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall] = useState(true); // Show paywall immediately

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
  const [selectedFile, setSelectedFile] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    subject: '',
    semester: '',
    instructorName: [],
    courseCode: '',
    desc: '',
    author: '',
    yearOfWriting: new Date().getFullYear(),
    branch: [],
    materialType: 'notes',
    contributedBy: user?.name || ''
  });

  // Material types
  const materialTypes = [
    {value: 'notes', label: 'Notes'},
    {value: 'assignments', label: 'Assignments'},
    {value: 'pyqs', label: 'Previous Year Questions'},
    {value: 'handouts', label: 'Handouts'}
  ];

  // Branches
  const branches = ['CSE', 'CSE DSAI', 'ECE', 'ECE IOT', 'MCE'];

  // Semesters
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUploadedMaterials();
    }
  }, [isAuthenticated]);

  const fetchUploadedMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.MATERIAL);
      const materials = response.data.materials || response.data;
      // Filter materials uploaded by current user
      const userMaterials = materials.filter(material =>
        material.contributedBy === user?.name || material.contributedBy === user?.email
      );
      setUploadedMaterials(userMaterials);
    } catch (error) {
      toast.error('Failed to load uploaded materials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addInstructor = () => {
    setFormData(prev => {
      const newInstructorName = [...prev.instructorName, ''];
      return {
        ...prev,
        instructorName: newInstructorName
      };
    });
  };

  const removeInstructor = (index) => {
    setFormData(prev => ({
      ...prev,
      instructorName: prev.instructorName.filter((_, i) => i !== index)
    }));
  };

  const updateInstructor = (index, value) => {
    setFormData(prev => {
      const newInstructorName = prev.instructorName.map((item, i) => i === index ? value : item);
      return {
        ...prev,
        instructorName: newInstructorName
      };
    });
  };

  const addBranch = () => {
    setFormData(prev => ({
      ...prev,
      branch: [...prev.branch, '']
    }));
  };

  const removeBranch = (index) => {
    setFormData(prev => ({
      ...prev,
      branch: prev.branch.filter((_, i) => i !== index)
    }));
  };

  const updateBranch = (index, value) => {
    setFormData(prev => ({
      ...prev,
      branch: prev.branch.map((item, i) => i === index ? value : item)
    }));
  };

  const handleCourseCodeChange = (e) => {
    const value = e.target.value;
    // Remove spaces from course code
    const cleanedValue = value.replace(/\s/g, '');
    setFormData(prev => ({
      ...prev,
      courseCode: cleanedValue
    }));
  };

  // Helper function to check if instructor names are valid
  const getValidInstructors = () => {
    return formData.instructorName.filter(name => name.trim() !== '');
  };

  // Helper function to check if branches are valid
  const getValidBranches = () => {
    return formData.branch.filter(branch => branch.trim() !== '');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Paywall is already shown, no need to trigger it again
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await axios.delete(`${API_ENDPOINTS.UPLOAD_MATERIAL}/${materialId}`);
      toast.success('Material deleted successfully');
      fetchUploadedMaterials();
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleViewPDF = (material) => {
    window.open(material.materialLink, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center pt-20">
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4"
        >
          <AiOutlineFileText className="text-6xl text-[#22A39F] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to upload and manage your materials
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

  return (
    <div className="min-h-screen bg-[#F3EFE0] pt-28 pb-10 relative">
      {/* Translucent Overlay */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#22A39F] mb-4">Upload Materials</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Share your study materials with the community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <AiOutlineUpload className="mr-2 text-[#22A39F]" />
              Upload New Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#22A39F] transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div>
                        <AiOutlineFileText className="text-4xl text-[#22A39F] mx-auto mb-2" />
                        <p className="text-sm text-gray-600">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <AiOutlineUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to select PDF file</p>
                        <p className="text-xs text-gray-500">Max size: 50MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Upload Progress - Disabled */}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                />
              </div>

              {/* Semester and Material Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type *
                  </label>
                  <select
                    name="materialType"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                  >
                    {materialTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instructor and Author */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Name *
                    {getValidInstructors().length > 0 && (
                      <span className="text-green-600 text-xs ml-2">✓ {getValidInstructors().length} instructor(s) added</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    {formData.instructorName.length === 0 ? (
                      <div className="text-gray-500 text-sm italic">No instructors added yet. Click "Add Instructor" to get started.</div>
                    ) : (
                      formData.instructorName.map((instructor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={instructor}
                            onChange={(e) => updateInstructor(index, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addInstructor();
                              }
                            }}
                            placeholder="Dr. John Smith"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                          />
                          {formData.instructorName.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInstructor(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove instructor"
                            >
                              <AiOutlineCloseCircle />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={addInstructor}
                      className="flex items-center space-x-2 text-[#22A39F] hover:bg-[#22A39F]/10 px-3 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-xl">+</span>
                      <span className="text-sm">Add Instructor</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                    {formData.author.trim() && (
                      <span className="text-green-600 text-xs ml-2">✓ Author added</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Author Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                  />
                </div>
              </div>

              {/* Branch and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch *
                    {getValidBranches().length > 0 && (
                      <span className="text-green-600 text-xs ml-2">✓ {getValidBranches().length} branch(es) selected</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    {formData.branch.length === 0 ? (
                      <div className="text-gray-500 text-sm italic">No branches selected yet. Click "Add Branch" to get started.</div>
                    ) : (
                      formData.branch.map((branch, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <select
                            value={branch}
                            onChange={(e) => updateBranch(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                          >
                            <option value="">Select Branch</option>
                            {branches
                              .filter(branchOption =>
                                // Show all branches if current field is empty
                                branch === '' ||
                                // Show only unselected branches if current field has a value
                                !formData.branch.some((selectedBranch, selectedIndex) =>
                                  selectedBranch === branchOption && selectedIndex !== index
                                )
                              )
                              .map(branchOption => (
                                <option key={branchOption} value={branchOption}>{branchOption}</option>
                              ))}
                          </select>
                          {formData.branch.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBranch(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove branch"
                            >
                              <AiOutlineCloseCircle />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={addBranch}
                      className="flex items-center space-x-2 text-[#22A39F] hover:bg-[#22A39F]/10 px-3 py-2 rounded-lg transition-colors"
                    >
                      <span className="text-xl">+</span>
                      <span className="text-sm">Add Branch</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="yearOfWriting"
                    value={formData.yearOfWriting}
                    onChange={handleInputChange}
                    min="2000"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                  />
                </div>
              </div>

              {/* Course Code and Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleCourseCodeChange}
                  placeholder="CS101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                />
                <p className="text-xs text-gray-500 mt-1">No spaces allowed in course code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22A39F]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#22A39F] text-white py-3 px-4 rounded-lg hover:bg-[#1a8a85] transition-colors flex items-center justify-center"
              >
                <AiOutlineUpload className="mr-2" />
                Upload Material
              </button>
            </form>
          </motion.div>

          {/* Uploaded Materials */}
          <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <AiOutlineFileText className="mr-2 text-[#22A39F]" />
              Your Uploaded Materials
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <ModernSpinner size="medium" type="symmetric" />
              </div>
            ) : uploadedMaterials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AiOutlineFileText className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No materials uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {uploadedMaterials.map((material) => (
                  <div
                    key={material._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{material.subject}</h3>
                        <p className="text-sm text-gray-600">
                          {material.materialType} • Semester {material.semester}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {material.author.join(', ')} • {material.yearOfWriting}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            material.verifiedBy === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : material.verifiedBy === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {material.verifiedBy === 'pending' ? 'Pending' :
                              material.verifiedBy === 'verified' ? 'Verified' : 'Rejected'}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatDate(material.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPDF(material)}
                          className="p-2 text-gray-400 hover:text-[#22A39F] transition-colors"
                          title="View PDF"
                        >
                          <AiOutlineEye />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Paywall Overlay */}
      <PaywallOverlay
        isVisible={showPaywall}
        onClose={() => {
          // No close functionality
        }}
        title="Upload Feature Under Development"
        message="This feature is currently under development. We're working hard to bring you the best upload experience. If you'd like to contribute to this project, please visit our GitHub repository."
        githubUrl="https://github.com/hellovaibhav/AcademiaStacks"
      />
    </div>
  );
};

export default Upload;
