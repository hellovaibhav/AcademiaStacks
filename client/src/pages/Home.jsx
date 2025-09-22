import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  AiOutlineBook, 
  AiOutlineFileText, 
  AiOutlineUpload, 
  AiOutlineTeam,
  AiOutlineGithub,
  AiOutlineStar,
  AiOutlineFork,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineDatabase
} from "react-icons/ai";
import { API_ENDPOINTS } from "../config/api";

const Home = () => {
  const [platformStats, setPlatformStats] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [platformResponse, githubResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.PLATFORM_STATS),
          axios.get(API_ENDPOINTS.GITHUB_STATS)
        ]);
        
        setPlatformStats(platformResponse.data.stats);
        setGithubStats(githubResponse.data.github);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set fallback data
        setPlatformStats({
          totalMaterials: 0,
          totalUsers: 0,
          contributorsCount: 0,
          verifiedMaterials: 0
        });
        setGithubStats({
          stars: 0,
          forks: 0,
          watchers: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: AiOutlineBook,
      title: "Comprehensive Materials",
      description: "Access notes, assignments, PYQs, and handouts for all courses"
    },
    {
      icon: AiOutlineFileText,
      title: "PDF Thumbnails",
      description: "Preview PDFs before downloading with auto-generated thumbnails"
    },
    {
      icon: AiOutlineUpload,
      title: "Easy Upload",
      description: "Contribute materials easily with our streamlined upload process"
    },
    {
      icon: AiOutlineTeam,
      title: "Community Driven",
      description: "Upvote and share materials with fellow students and educators"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3EFE0]">
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
                Welcome to{" "}
                <span className="text-[#22A39F]">Academia Stacks</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
                Your comprehensive platform for accessing and sharing study materials. 
                Find notes, assignments, previous year questions, and more for all your courses.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/material"
                  className="bg-[#22A39F] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1a8a87] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Materials
                </Link>
                <Link
                  to="/upload"
                  className="bg-white text-[#22A39F] border-2 border-[#22A39F] px-8 py-4 rounded-lg font-semibold hover:bg-[#22A39F] hover:text-white transition-all duration-200"
                >
                  Upload Materials
                </Link>
              </div>
            </motion.div>

            {/* Visual Elements Grid */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.9, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {/* Feature Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.5
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#22A39F] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AiOutlineBook className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Study Notes</h3>
                <p className="text-gray-600 text-sm">Comprehensive notes for all subjects</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.6
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AiOutlineFileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignments</h3>
                <p className="text-gray-600 text-sm">Homework and project solutions</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.7
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AiOutlineDatabase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">PYQs</h3>
                <p className="text-gray-600 text-sm">Previous year question papers</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.8
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AiOutlineUpload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Upload</h3>
                <p className="text-gray-600 text-sm">Share materials effortlessly</p>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6
              }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-3">
                <AiOutlineCheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700 font-medium">Verified Materials</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <AiOutlineClockCircle className="w-6 h-6 text-blue-500" />
                <span className="text-gray-700 font-medium">Always Updated</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <AiOutlineUser className="w-6 h-6 text-purple-500" />
                <span className="text-gray-700 font-medium">Community Driven</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#22A39F] mb-2">
                    {platformStats?.totalMaterials || 0}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Study Materials
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#22A39F] mb-2">
                    {platformStats?.totalUsers || 0}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#22A39F] mb-2">
                    {platformStats?.contributorsCount || 0}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Contributors
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#22A39F] mb-2">
                    {githubStats?.stars || 0}
                  </div>
                  <div className="text-gray-600 font-medium">
                    GitHub Stars
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Academia Stacks?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform designed specifically for students to access and share study materials efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.7, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.15
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-[#22A39F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Open Source & Community Driven
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Academia Stacks is an open-source project built by students, for students. 
              We believe in the power of community collaboration and transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* GitHub Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-center mb-6">
                <AiOutlineGithub className="w-12 h-12 text-gray-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">GitHub Repository</h3>
              <p className="text-gray-600 mb-6">
                Our code is open source and available on GitHub. Anyone can contribute, 
                report issues, or suggest new features.
              </p>
              
              {loading ? (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#22A39F] mb-1">
                      {githubStats?.stars || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <AiOutlineStar className="w-4 h-4 mr-1" />
                      Stars
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#22A39F] mb-1">
                      {githubStats?.forks || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <AiOutlineFork className="w-4 h-4 mr-1" />
                      Forks
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#22A39F] mb-1">
                      {githubStats?.watchers || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Watchers
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <a
                  href="https://github.com/hellovaibhav/AcademiaStacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                >
                  <AiOutlineGithub className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </motion.div>

            {/* Contribution Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-center mb-6">
                <AiOutlineTeam className="w-12 h-12 text-[#22A39F]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Contribute</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22A39F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>Fork the repository and clone it to your local machine</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22A39F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>Create a new branch for your feature or bug fix</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22A39F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>Make your changes and submit a pull request</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22A39F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p>Share study materials through our upload system</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/upload"
                  className="inline-flex items-center space-x-2 bg-[#22A39F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a8a87] transition-all duration-200"
                >
                  <AiOutlineUpload className="w-5 h-5" />
                  <span>Start Contributing</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#22A39F]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using Academia Stacks to enhance their learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-[#22A39F] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Account
              </Link>
              <Link
                to="/material"
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#22A39F] transition-all duration-200"
              >
                Browse Materials
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
