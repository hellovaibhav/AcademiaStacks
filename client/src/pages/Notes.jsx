import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import img from "../assets/pic1.png";
// import MaterialPage from "../assets/MaterialPageContent";
import axios from "axios";

const Notes = () => {
  const [index, setIndex] = useState(7);
  const [data, setData] = useState([]);
  const showMore = () => {
    if (index < data.length - 1) {
      if (index + 4 > data.length - 1) {
        setIndex(data.length);
      } else {
        setIndex(index + 4);
      }
      setIndex(index + 4);
    }
  };

  const fetchNotes = async () => {
    const { data } = await axios.get(
      "http://localhost:8800/api/materials/Notes"
    );
    console.log(data);
    setData(data);
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  return (
    <div className="min-h-[100vh]  flex items-center justify-around mt-16 md:mt-24 pl-0 sm:pl-[2rem] lg:pl-[25rem] md:pl-[10rem] xl:pl-[30rem] ">
      <div className="leftFilter fixed top-52 left-14 h-40 hidden lg:block border-4 border-black w-[20vw]">
        Notes Filter Here
      </div>
      <div className="flex flex-col items-center justify-around pb-10">
        <div className="rightContent w-[80vw] flex flex-wrap mt-14 lg:mt-0">
          {data.slice(0, index + 1).map((material) => (
            <motion.div
              className="parent flex flex-col h-60 w-[100vw] md:w-56 bg-red-100 m-8 rounded-xl drop-shadow-md"
              whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <img
                src={material.image}
                alt="Not available"
                className="h-[12rem] w-auto"
              />
              <div className="descriptionChild p-2">{material.subject}</div>
            </motion.div>
          ))}
        </div>
        {index < data.length - 1 ? (
          <motion.button
            whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
            onClick={showMore}
            className="h-10 bg-blue-400 p-2 rounded-lg drop-shadow-md hover:bg-blue-200 mb-4 2xl:mr-10 xl:mr-[15rem]  "
          >
            Show More
          </motion.button>
        ) : (
          <motion.button
            whileTap={{
              x: [0, 10, 0, -10, 0],
              backgroundColor: "#ff3333",
              color: "white",
              transition: { duration: 0.1 },
            }}
            onClick={null}
            className="h-10 bg-rose-400 p-2 rounded-lg drop-shadow-md  mb-4 2xl:mr-10 xl:mr-[15rem]  "
          >
            Thank You See You Later
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Notes;
