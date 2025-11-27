import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {
  AiOutlineFileText,
  AiOutlineBook,
  AiOutlineFolderOpen,
  AiOutlineAppstore,
  AiOutlineRocket,
  AiOutlineArrowRight,
  AiOutlineCloudDownload,
  AiOutlineStar,
  AiOutlineCalendar,
} from "react-icons/ai";
import { BiNotepad } from "react-icons/bi";
import { FaGraduationCap, FaRegClock } from "react-icons/fa";
import { BsJournalBookmark, BsPeople } from "react-icons/bs";

const Material = () => {
  const navigate = useNavigate();

  const materialTypes = [
    {
      navigate: "allMaterials",
      title: "All Materials",
      description:
        "Complete collection of academic resources and study materials from all categories",
      icon: AiOutlineAppstore,
      featureIcon: BsJournalBookmark,
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      glow: "shadow-blue-500/30",
      lightGlow: "shadow-blue-400/20",
      bgGradient: "from-blue-50 via-blue-100 to-cyan-50",
      borderColor: "border-blue-200",
      stats: "500+ files",
      features: ["All Categories", "Updated Daily", "Premium Content"],
    },
    {
      navigate: "notes",
      title: "Study Notes",
      description:
        "Comprehensive notes, summaries, and revision materials crafted by top students",
      icon: AiOutlineFileText,
      featureIcon: AiOutlineStar,
      gradient: "from-emerald-500 via-emerald-600 to-teal-500",
      glow: "shadow-emerald-500/30",
      lightGlow: "shadow-emerald-400/20",
      bgGradient: "from-emerald-50 via-emerald-100 to-teal-50",
      borderColor: "border-emerald-200",
      stats: "200+ notes",
      features: ["Expert Curated", "Easy Revision", "Visual Learning"],
    },
    {
      navigate: "assignment",
      title: "Assignments",
      description:
        "Projects, homework tasks, and practical assignments with solutions",
      icon: BiNotepad,
      featureIcon: FaGraduationCap,
      gradient: "from-violet-500 via-violet-600 to-purple-500",
      glow: "shadow-violet-500/30",
      lightGlow: "shadow-violet-400/20",
      bgGradient: "from-violet-50 via-violet-100 to-purple-50",
      borderColor: "border-violet-200",
      stats: "150+ assignments",
      features: ["Step-by-Step", "Graded Samples", "Practical Focus"],
    },
    {
      navigate: "handouts",
      title: "Handouts",
      description:
        "Supplementary course materials, reference docs, and study guides",
      icon: AiOutlineFolderOpen,
      featureIcon: AiOutlineCloudDownload,
      gradient: "from-amber-500 via-amber-600 to-orange-500",
      glow: "shadow-amber-500/30",
      lightGlow: "shadow-amber-400/20",
      bgGradient: "from-amber-50 via-amber-100 to-orange-50",
      borderColor: "border-amber-200",
      stats: "80+ handouts",
      features: ["Quick Reference", "Printable", "Organized"],
    },
    {
      navigate: "pyq",
      title: "PYQ Papers",
      description:
        "Previous year question papers with solutions and exam preparation materials",
      icon: AiOutlineBook,
      featureIcon: AiOutlineCalendar,
      gradient: "from-rose-500 via-rose-600 to-pink-500",
      glow: "shadow-rose-500/30",
      lightGlow: "shadow-rose-400/20",
      bgGradient: "from-rose-50 via-rose-100 to-pink-50",
      borderColor: "border-rose-200",
      stats: "100+ papers",
      features: ["Year-wise", "Solved Papers", "Exam Pattern"],
    },
  ];

  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <Loader message="Loading academic resources..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-24 pb-16 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-2xl shadow-blue-500/40 flex items-center justify-center relative"
          >
            {/* Icon Glow Effect */}
            <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
            <AiOutlineRocket className="w-10 h-10 text-white relative z-10" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            Study{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Materials
            </span>
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "160px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8 rounded-full shadow-lg shadow-blue-500/30"
          />

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Discover premium academic resources designed to elevate your
            learning experience
          </p>
        </motion.div>

        {/* Cards Grid with Enhanced Glow Effects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {materialTypes.map((item, index) => {
            const IconComponent = item.icon;
            const FeatureIcon = item.featureIcon;

            return (
              <motion.div
                key={item.navigate}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer relative"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => navigate(item.navigate)}
              >
                {/* Multi-layer Glow System */}
                <div className="absolute inset-0 rounded-3xl transition-all duration-700">
                  {/* Base Glow Layer */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl ${item.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    animate={{
                      scale: hoveredCard === index ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Medium Glow Layer */}
                  <div
                    className={`absolute inset-0 rounded-3xl ${item.lightGlow} blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-300 delay-100`}
                  />

                  {/* Inner Glow Layer */}
                  <div
                    className={`absolute inset-0 rounded-3xl ${item.lightGlow} blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-200 delay-150`}
                  />
                </div>

                {/* Main Card Container */}
                <div
                  className={`relative bg-white rounded-3xl p-8 h-full min-h-[400px] shadow-2xl hover:shadow-3xl transition-all duration-500 border ${item.borderColor} group-hover:border-white/50 overflow-hidden backdrop-blur-sm`}
                >
                  {/* Background Gradient Layer */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated Gradient Overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`}
                    animate={{
                      backgroundPosition:
                        hoveredCard === index
                          ? ["0% 0%", "100% 100%"]
                          : "0% 0%",
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  />

                  {/* Content Container */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header Section with Icon and Stats */}
                    <div className="flex items-start justify-between mb-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`p-4 rounded-2xl bg-gradient-to-r ${item.gradient} shadow-2xl relative overflow-hidden group/icon`}
                      >
                        {/* Icon Glow Effect */}
                        <div
                          className={`absolute inset-0 ${item.glow} blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300`}
                        />
                        <div className="absolute inset-0 bg-white/20 transform group-hover/icon:scale-110 transition-transform duration-500" />
                        <IconComponent className="w-8 h-8 text-white relative z-10" />
                      </motion.div>

                      {/* Stats Badge with Glow */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-200 shadow-lg relative group/badge"
                      >
                        <div className="absolute inset-0 bg-white/50 rounded-2xl blur-sm opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                        <FaRegClock className="w-4 h-4 text-gray-500 relative z-10" />
                        <span className="text-sm font-semibold text-gray-700 relative z-10">
                          {item.stats}
                        </span>
                      </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                      {/* Title with Text Glow */}
                      <motion.h3
                        className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors leading-tight relative"
                        whileHover={{ scale: 1.02 }}
                      >
                        {item.title}
                        <span
                          className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${item.gradient} transition-all duration-500`}
                        />
                      </motion.h3>

                      {/* Description */}
                      <p className="text-gray-600 text-lg leading-relaxed font-light">
                        {item.description}
                      </p>

                      {/* Features List with Icon Glow */}
                      <div className="space-y-3">
                        {item.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.15 + featureIndex * 0.1,
                            }}
                            className="flex items-center space-x-3 group/feature"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`p-1.5 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg relative group-hover/feature:shadow-xl transition-all duration-300`}
                            >
                              {/* Feature Icon Glow */}
                              <div
                                className={`absolute inset-0 ${item.lightGlow} blur-sm opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300`}
                              />
                              <FeatureIcon className="w-3 h-3 text-white relative z-10" />
                            </motion.div>
                            <span className="text-gray-700 font-medium text-sm group-hover/feature:text-gray-900 transition-colors">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button with Enhanced Glow */}
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 group-hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center space-x-3 group/button">
                        <motion.span
                          className={`text-lg font-semibold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent relative`}
                          whileHover={{ scale: 1.05 }}
                        >
                          Explore Now
                          <span
                            className={`absolute bottom-0 left-0 w-0 group-hover/button:w-full h-0.5 bg-gradient-to-r ${item.gradient} transition-all duration-300`}
                          />
                        </motion.span>
                        <motion.div
                          animate={{ x: hoveredCard === index ? [0, 8, 0] : 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`p-1 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg`}
                        >
                          <AiOutlineArrowRight className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>

                      {/* Users Indicator */}
                      <div className="flex items-center space-x-2 text-gray-400 group/users">
                        <BsPeople className="w-4 h-4 group-hover/users:text-gray-600 transition-colors" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Enhanced Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <div className="flex items-center justify-center space-x-8 text-gray-500 mb-6">
            {[
              { color: "bg-emerald-400", text: "Premium Content" },
              { color: "bg-blue-400", text: "Expert Reviewed" },
              { color: "bg-purple-400", text: "Regular Updates" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-2 h-2 ${item.color} rounded-full shadow-lg`}
                  animate={{
                    scale: [1, 1.5, 1],
                    boxShadow: [
                      `0 0 10px ${item.color}`,
                      `0 0 20px ${item.color}`,
                      `0 0 10px ${item.color}`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-80 mx-auto shadow-lg"
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.1)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 10px rgba(59, 130, 246, 0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Material;
