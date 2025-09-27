import React from 'react';
import {motion} from 'framer-motion';
import {useState} from 'react';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';
import images from '../assets/imageItem';
const ParentCarousel = () => {
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
    <div className="h-[30vh] mx-4 mb-4 bg-blue-200 w-[20vw] rounded-3xl flex items-center justify-center">
      <div className="content flex items-center justify-center w-[50vw]">
        <motion.button
          onClick={prevOne}
          className="relative left-[1rem] flex items-center max-w-[1.1rem] max-h-[2rem] justify-center bg-blue-300 mx-2 py-1 rounded-lg"
          whileHover={{scale: 1}}
          whileTap={{scale: 0.5, opacity: 0.5, transition: {duration: 0.3}}}
        >
          <AiOutlineArrowLeft className="w-10 h-7" />
        </motion.button>
        <img src={images[index]} alt="" className="h-[20vh] rounded-lg" />
        <motion.button
          onClick={nextOne}
          className=" relative right-[1rem] flex items-center max-w-[1.1rem] max-h-[2rem] justify-center bg-blue-300 mx-2 py-1 rounded-lg"
          whileHover={{scale: 1}}
          whileTap={{scale: 0.5, opacity: 0.5, transition: {duration: 0.3}}}
        >
          <AiOutlineArrowRight className="w-10 h-7" />
        </motion.button>
      </div>
    </div>
  );
};

export default ParentCarousel;
