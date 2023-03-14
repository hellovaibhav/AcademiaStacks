import React from "react";
import {motion} from "framer-motion"
const Footer = () => {
  return (
    <motion.div className="overflow-hidden bg-blue-400 text-center text-white"
    initial={{x:"100%"}}
    whileInView={{x:"0%" , transition:{duration:0.5}}}>
      <h1>Made With Love</h1>
      <h1>@2023</h1>
    </motion.div>
  );
};

export default Footer;
