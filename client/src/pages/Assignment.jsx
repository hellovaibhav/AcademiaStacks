import { motion } from "framer-motion";
import React,{useState} from "react";
// import img from "../assets/pic1.png";
import MaterialPage from "../assets/MaterialPageContent";

const Assignment = () => {
  const [index, setIndex] = useState(7);
  const showMore = () => {
    if (index < MaterialPage.length - 1) {
      if (index + 4 > MaterialPage.length - 1) {
        setIndex(MaterialPage.length);
      } else {
        setIndex(index + 4);
      }
      setIndex(index + 4);
    }
  };

  return (
    <div className="min-h-[100vh]  flex items-center justify-around mt-16 md:mt-24 pl-0 sm:pl-[2rem] lg:pl-[25rem] md:pl-[10rem] xl:pl-[30rem] ">
      <div className="leftFilter fixed top-52 left-14 h-40 hidden lg:block border-4 border-black w-[20vw]">
        Notes Filter Here
      </div>
      <div className="flex flex-col items-center justify-around pb-10">
        <div className="rightContent w-[80vw] flex flex-wrap mt-14 lg:mt-0">
          {MaterialPage.slice(0, index + 1).map((material) => (
            <div className="parent flex flex-col h-60 w-[100vw] md:w-56 bg-red-100 m-8 rounded-xl drop-shadow-md">
              <img
                src={material.images}
                alt="Not available"
                className="h-[12rem] w-auto"
              />
              <div className="descriptionChild p-2">{material.description}</div>
            </div>
          ))}
        </div>
        {index < MaterialPage.length - 1 && (
          <motion.button
            whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
            onClick={showMore}
            className="h-10 bg-blue-400 p-2 rounded-lg drop-shadow-md hover:bg-blue-200 mb-4 2xl:mr-10 xl:mr-[15rem]  "
          >
            Show More
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Assignment;