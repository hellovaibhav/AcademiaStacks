import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
  FiFilter,
  FiChevronDown,
  FiX,
  FiRefreshCw,
  FiBookOpen,
  FiStar,
  FiUsers
} from 'react-icons/fi';

const ModernFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const branchOptions = [
    {value: '', label: 'All Branches'},
    {value: 'CSE', label: 'CSE'},
    {value: 'CSE DSAI', label: 'CSE DSAI'},
    {value: 'ECE', label: 'ECE'},
    {value: 'ECE IOT', label: 'ECE IOT'},
    {value: 'MCE', label: 'MCE'}
  ];

  const semesterOptions = [
    {value: '', label: 'All Semesters'},
    {value: '1', label: 'Semester 1'},
    {value: '2', label: 'Semester 2'},
    {value: '3', label: 'Semester 3'},
    {value: '4', label: 'Semester 4'},
    {value: '5', label: 'Semester 5'}
  ];

  const featuredOptions = [
    {value: '', label: 'All Materials'},
    {value: 'true', label: 'Featured Only'}
  ];

  const handleFilterChange = (name, value) => {
    onFilterChange({target: {name, value}});
  };

  const hasActiveFilters = filters.branch || filters.semester || filters.featured;

  if (isMobile) {
    return (
      <motion.div
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        className={`fixed top-24 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-40 ${className}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-[#22A39F] text-lg" />
            <span className="font-semibold text-gray-700">Filters</span>
            {hasActiveFilters && (
              <motion.span
                initial={{scale: 0}}
                animate={{scale: 1}}
                className="bg-[#22A39F] text-white text-xs px-2 py-1 rounded-full"
              >
                Active
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <motion.div
              animate={{rotate: isExpanded ? 180 : 0}}
              transition={{duration: 0.2}}
            >
              <FiChevronDown className="text-gray-600" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 0.3}}
              className="border-t border-gray-200"
            >
              <div className="p-4 space-y-4">
                {/* Mobile Filter Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Semester Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiBookOpen className="mr-2 text-[#22A39F]" />
                      Semester
                    </label>
                    <select
                      value={filters.semester}
                      onChange={(e) => handleFilterChange('semester', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white"
                    >
                      {semesterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUsers className="mr-2 text-[#22A39F]" />
                      Branch
                    </label>
                    <select
                      value={filters.branch}
                      onChange={(e) => handleFilterChange('branch', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white"
                    >
                      {branchOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiStar className="mr-2 text-[#22A39F]" />
                      Type
                    </label>
                    <select
                      value={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white"
                    >
                      {featuredOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <motion.button
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    onClick={onClearFilters}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200"
                  >
                    <FiX className="text-lg" />
                    <span className="font-medium">Clear All Filters</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Desktop Filter Component
  return (
    <motion.div
      initial={{opacity: 0, x: -20}}
      animate={{opacity: 1, x: 0}}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#22A39F] bg-opacity-10 rounded-lg">
            <FiFilter className="text-[#22A39F] text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <p className="text-sm text-gray-500">Refine your search</p>
          </div>
        </div>
        {hasActiveFilters && (
          <motion.button
            initial={{scale: 0}}
            animate={{scale: 1}}
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <FiRefreshCw className="text-sm" />
            <span>Clear</span>
          </motion.button>
        )}
      </div>

      {/* Filter Options */}
      <div className="space-y-6">
        {/* Semester Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <FiBookOpen className="mr-2 text-[#22A39F]" />
            Semester
          </label>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white hover:border-[#22A39F] hover:shadow-sm"
          >
            {semesterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <FiUsers className="mr-2 text-[#22A39F]" />
            Branch
          </label>
          <select
            value={filters.branch}
            onChange={(e) => handleFilterChange('branch', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white hover:border-[#22A39F] hover:shadow-sm"
          >
            {branchOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <FiStar className="mr-2 text-[#22A39F]" />
            Type
          </label>
          <select
            value={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22A39F] focus:border-transparent transition-all duration-200 bg-white hover:border-[#22A39F] hover:shadow-sm"
          >
            {featuredOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="mt-6 pt-4 border-t border-gray-100"
        >
          <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.semester && (
              <span className="px-2 py-1 bg-[#22A39F] bg-opacity-10 text-[#22A39F] text-xs rounded-full">
                Sem {filters.semester}
              </span>
            )}
            {filters.branch && (
              <span className="px-2 py-1 bg-[#22A39F] bg-opacity-10 text-[#22A39F] text-xs rounded-full">
                {filters.branch}
              </span>
            )}
            {filters.featured && (
              <span className="px-2 py-1 bg-[#22A39F] bg-opacity-10 text-[#22A39F] text-xs rounded-full">
                Featured
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModernFilter;
