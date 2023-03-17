import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import images from "../assets/images";
const Carousel = () => {
  const [index, setIndex] = useState(0);
  const nextOne = () => {
    if (index === images.length - 1) {
      setIndex(0);
      return;
    }
    setIndex(index + 1);
  };
  const prevOne = () => {
    if (index === 0) {
      setIndex(images.length - 1);
      return;
    }
    setIndex(index - 1);
  };
  return (
    <div className=" flex items-center justify-center w-[90vw] md:w-[60vw]">
      <div className="content flex items-center justify-center  px-4 md:px-0">
        <motion.button
          onClick={prevOne}
          className="relative left-[0.5rem] lg:h-[60vh] md:h-[40vh] w-[8vw] h-[26vh] flex items-center justify-center bg-blue-300 mx-2 py-1 rounded-l-lg"
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.5, opacity: 0.5, transition: { duration: 0.3 } }}
        >
          <AiOutlineArrowLeft className="w-10 h-7" />
        </motion.button>
        <img src={images[index]} alt="" className="md:h-[40vh] h-[26vh] lg:h-[60vh] w-[100vw] " />
        <motion.button
          onClick={nextOne}
          className=" relative lg:h-[60vh] md:h-[40vh] w-[8vw] h-[26vh] right-[0.5rem] flex items-center justify-center bg-blue-300 mx-2 py-1 rounded-r-lg"
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.5, opacity: 0.5, transition: { duration: 0.3 } }}
        >
          <AiOutlineArrowRight className="w-10 h-7" />
        </motion.button>
      </div>
    </div>
  );
};

export default Carousel;
