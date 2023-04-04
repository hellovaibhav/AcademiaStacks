//Imports :
import React, { useEffect, useState } from "react";
import AssignmentPic from "../assets/assignmentPic.jpg";
import AllMaterialPic from "../assets/allMaterialPic.jpg"
import NotesPic from "../assets/notesPic.png";
import PyqPic from "../assets/pyqPic.jpg";
import handouts from "../assets/handouts.png"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

// Main Function
const Material = () => {
  const navigate = useNavigate();

  //Content Array
  let items = [
    { navigate: "pyq", text: "Previous Year Question", image: PyqPic },
    { navigate: "notes", text: "Notes", image: NotesPic },
    { navigate: "assignment", text: "Assignment", image: AssignmentPic },
    { navigate: "handouts", text: "Handout", image: handouts },
    { navigate: "allMaterials", text: "All Materials", image: AllMaterialPic },
  ];

  // Loading Settings 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return (
    <>
      {loading ? (
        <div className="min-h-[100vh] bg-[#F3EFE0] flex items-center justify-center  ">
          <Loader />
        </div>
      ) : (
        <div className="min-h-[100vh] bg-[#F3EFE0] flex flex-wrap flex-col md:flex-row pt-32 md:pt-16 lg:pt-13 items-center justify-center">
          {items.map((item) => (
            <motion.button
              key={item.navigate}
              className="bg-[rgb(34,163,159,0.6)] m-10 p-2 rounded-xl h-64 w-72 sm:h-72 sm:w-96 md:h-80 md:w-96 flex flex-col items-center justify-around"
              onClick={() => {
                navigate(item.navigate);
              }}
              whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <img
                src={item.image}
                alt="Loading...."
                className="h-[60%] flex items-center justify-center"
              />
              <p className="text-xl"> {item.text}</p>
            </motion.button>
          ))}
        </div>
      )}
    </>
  );
};

export default Material;
