import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AboutCarousel from "../components/AboutCarousel";
const About = () => {
  const [provider, setProvider] = useState(true);
  const [saquib, setSaquib] = useState(false);
  const [vaibhav, setVaibhav] = useState(false);
  const [nishant, setNishant] = useState(false);
  const [vivek, setVivek] = useState(false);

  return (
    <motion.div className="bg-white  h-auto md:h-[100vh] flex flex-col justify-around  items-center md:mt-10 ">
      <div className="carousel flex md:hidden text-[#22A39F]">
        {" "}
        <AboutCarousel />{" "}
      </div>

      <div className="drop-shadow-xl bg-[#F3EFE0] text-[#22A39F] md:flex hidden justify-center items-center flex-col  rounded-2xl content w-[90vw] h-[70vh]  md:w-[80vw] md:h-[50vh] mt-14 ">
        <AnimatePresence>
          {saquib && (
            <>
              {" "}
              <motion.div
                className="parent flex flex-col md:flex-row justify-evenly w-[90vw] h-[90vh] md:h-[20vh] px-10 md:px-[10vw] items-center"
                initial={{ opacity: 0, y: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.5 },
                }}
                exit={{ opacity: 0, y: 100, type: "spring" }}
              >
                <div className="photo w-[60vw] md:w-[40vw]">
                  <img
                    src='https://avatars.githubusercontent.com/u/106366280?v=4'
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full border-4 border-[#22A39F] drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[90vw] flex flex-col items-center justify-center text-justify px-10">
                  <p className="text-3xl font-medium pb-2">Saquib Ali</p>
                  <p className="text-xl font-normal pb-1">Frontend Developer</p>
                  <p className="text-lg font-light border-t-4 border-b-4 border-[#22A39F] py-4 mt-2 ">
                    Worked as the lead frontend developer for this site
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {vaibhav && (
            <>
              {" "}
              <motion.div
                className="parent flex flex-col md:flex-row justify-evenly w-[90vw] h-[90vh] md:h-[20vh] px-10 md:px-[10vw] items-center"
                initial={{ opacity: 0, y: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.5 },
                }}
                exit={{ opacity: 0, y: 100, type: "spring" }}
              >
                <div className="photo w-[60vw] md:w-[40vw]">
                  <img
                    src="https://avatars.githubusercontent.com/u/82583704?v=4" alt="legendary developer"
                    className="h-52 w-52 rounded-full border-4 border-[#22A39F] drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[90vw] flex flex-col items-center justify-center text-justify px-10">
                  <p className="text-3xl font-medium pb-2">Vaibhav Verma</p>
                  <p className="text-xl font-normal pb-1">Backend Developer</p>
                  <p className="text-lg font-light border-t-4 border-b-4 border-[#22A39F] py-4 mt-2 ">
                    Worked as The lead backend developer for this site
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {nishant && (
            <>
              {" "}
              <motion.div
                className="parent flex flex-col md:flex-row justify-evenly w-[90vw] h-[90vh] md:h-[20vh] px-10 md:px-[10vw] items-center"
                initial={{ opacity: 0, y: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.5 },
                }}
                exit={{ opacity: 0, y: 100, type: "spring" }}
              >
                <div className="photo w-[60vw] md:w-[40vw]">
                  <img
                    src='https://avatars.githubusercontent.com/u/106348929?v=4'
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full border-4 border-[#22A39F] drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[90vw] flex flex-col items-center justify-center text-justify px-10">
                  <p className="text-3xl font-medium pb-2">Nishant Kumar</p>
                  <p className="text-xl font-normal pb-1">Backend Developer</p>
                  <p className="text-lg font-light border-t-4 border-b-4 border-[#22A39F] py-4 mt-2 ">
                    Worked as supporting backend developer, and fixed issues related to backend.
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {vivek && (
            <>
              {" "}
              <motion.div
                className="parent flex flex-col md:flex-row justify-evenly w-[90vw] h-[90vh] md:h-[20vh] px-10 md:px-[10vw] items-center"
                initial={{ opacity: 0, y: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.5 },
                }}
                exit={{ opacity: 0, y: 100, type: "spring" }}
              >
                <div className="photo w-[60vw] md:w-[40vw]">
                  <img
                    src='https://avatars.githubusercontent.com/u/96737391?v=4'
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full border-4 border-[#22A39F] drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[90vw] flex flex-col items-center justify-center text-justify px-10">
                  <p className="text-3xl font-medium pb-2">Vivek Giri</p>
                  <p className="text-xl font-normal pb-1">Frontend Dev</p>
                  <p className="text-lg font-light border-t-4 border-b-4 border-[#22A39F] py-4 mt-2 ">
                    Worked as supporting frontend developer on this project, fixed issues related to frontend and provided data.
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {provider && (
            <>
              {" "}
              <motion.div
                className="parent flex flex-col md:flex-row justify-evenly w-[90vw] h-[90vh] md:h-[20vh] px-10 md:px-[10vw] items-center"
                initial={{ opacity: 0, y: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: 0.5 },
                }}
                exit={{ opacity: 0, y: 100, type: "spring" }}
              >
                <div className="w-[90vw] flex flex-col items-center justify-center px-10">
                  <p className="text-5xl font-medium pb-4">
                    Note Providers
                  </p>
                  <p className="text-xl font-normal">
                    GURUJI , SAQUIB , VIVEK , SUMIT
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="buttonsw w-[80vw] hidden md:flex flex-wrap justify-around">
        <motion.button
          className="bg-white w-[10rem] border-4 border-[#F3EFE0] hover:border-none text-[#22A39F] hover:text-[#22A39F] mx-6 px-6 py-2 my-2 text-xl hover:bg-[#F3EFE0] duration-300 hover: hover:rounded-lg hover:drop-shadow-2xl"
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1 }}
          onClick={() => {
            console.log("Saquib");
            setNishant(false);
            setVaibhav(false);
            setVivek(false);
            setProvider(false);
            setSaquib(true);
          }}
        >
          Saquib
        </motion.button>
        <motion.button
          className="bg-white w-[10rem] border-4 border-[#F3EFE0] hover:border-none text-[#22A39F] hover:text-[#22A39F] mx-6 px-6 py-2 my-2 text-xl hover:bg-[#F3EFE0] duration-300 hover: hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          onClick={() => {
            console.log("vaibhav");
            setNishant(false);
            setVaibhav(true);
            setVivek(false);
            setProvider(false);
            setSaquib(false);
          }}
        >
          Vaibhav
        </motion.button>
        <motion.button
          className="bg-white w-[10rem] border-4 border-[#F3EFE0] hover:border-none text-[#22A39F] hover:text-[#22A39F] mx-6 px-6 py-2 my-2 text-xl hover:bg-[#F3EFE0] duration-300 hover: hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.2 }}
          onClick={() => {
            console.log("nishant");
            setNishant(true);
            setVaibhav(false);
            setVivek(false);
            setProvider(false);
            setSaquib(false);
          }}
        >
          Nishant
        </motion.button>
        <motion.button
          className="bg-white w-[10rem] border-4 border-[#F3EFE0] hover:border-none text-[#22A39F] hover:text-[#22A39F] mx-6 px-6 py-2 my-2 text-xl  hover:bg-[#F3EFE0] duration-300 hover: hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.3 }}
          onClick={() => {
            console.log("giri");
            setNishant(false);
            setVaibhav(false);
            setVivek(true);
            setProvider(false);
            setSaquib(false);
          }}
        >
          Vivek
        </motion.button>
        <motion.button
          className="bg-white w-[10rem] border-4 border-[#F3EFE0] hover:border-none text-[#22A39F] hover:text-[#22A39F] mx-6 px-6 py-2 my-2 text-xl  hover:bg-[#F3EFE0] duration-300 hover: hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.4 }}
          onClick={() => {
            console.log("giri");
            setNishant(false);
            setVaibhav(false);
            setVivek(false);
            setProvider(true);
            setSaquib(false);
          }}
        >
          Providers
        </motion.button>
      </div>
    </motion.div>
  );
};

export default About;
