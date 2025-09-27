import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import {
  AiOutlineFileText,
  AiOutlineBook,
  AiOutlineFolderOpen,
  AiOutlineAppstore
} from 'react-icons/ai';
import {BiNotepad} from 'react-icons/bi';

const Material = () => {
  const navigate = useNavigate();

  // Modern content array with icons and descriptions
  const materialTypes = [
    {
      navigate: 'allMaterials',
      title: 'All Materials',
      description: 'Browse through all available study materials',
      icon: AiOutlineAppstore,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      navigate: 'notes',
      title: 'Notes',
      description: 'Comprehensive study notes and summaries',
      icon: AiOutlineFileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      navigate: 'assignment',
      title: 'Assignments',
      description: 'Homework and project assignments',
      icon: BiNotepad,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      navigate: 'handouts',
      title: 'Handouts',
      description: 'Course handouts and supplementary materials',
      icon: AiOutlineFolderOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      navigate: 'pyq',
      title: 'Previous Year Questions',
      description: 'PYQ papers and exam preparation materials',
      icon: AiOutlineBook,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100vh] bg-[#F3EFE0] flex items-center justify-center">
        <Loader message="Loading study materials..." />
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#F3EFE0] pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Study Materials
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Access a comprehensive collection of study materials, notes, assignments, and more to excel in your academic journey.
          </p>
        </motion.div>

        {/* Materials Grid - Better Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
          {materialTypes.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.navigate}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                whileHover={{scale: 1.05, y: -5}}
                whileTap={{scale: 0.95}}
                className="group cursor-pointer"
                onClick={() => navigate(item.navigate)}
              >
                <div className={`${item.bgColor} rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[200px]`}>
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${item.iconColor} bg-white shadow-sm group-hover:shadow-md transition-all duration-200`}>
                        Browse
                        <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Material;
