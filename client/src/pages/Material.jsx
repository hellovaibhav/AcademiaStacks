import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Material = () => {
  const navigate = useNavigate();
  let items = [
    {navigate:"pyq" , text:"Previous Year Question"},
    {navigate:"notes" , text:"Notes"},
    {navigate:"assignment" , text:"Assignment"},
  ]
  return (
    <div className="min-h-[100vh] flex flex-col md:flex-row mt-32 md:mt-0 items-center justify-center">
    {
      items.map((item)=>(
        <motion.button
        className="bg-red-400 m-10 p-2 rounded-xl h-56 w-64 md:h-80 md:w-96"
        onClick={() => {
          navigate(item.navigate);
        }}
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <img src="" alt="Loading...." className="h-[80%]" />
        <p>{item.text}</p>
      </motion.button>
        ))
    }

    </div>
  );
};

export default Material;
