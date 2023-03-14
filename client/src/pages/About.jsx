import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img from "..//assets/profilePic.jpg";
const About = () => {
  const [provider, setProvider] = useState(true);
  const [saquib, setSaquib] = useState(false);
  const [vaibhav, setVaibhav] = useState(false);
  const [nishant, setNishant] = useState(false);
  const [vivek, setVivek] = useState(false);
  return (
    <motion.div className="customBgColor flex-col justify-evenly ">
      <div className="drop-shadow-xl overflow-y-hidden flex justify-center items-center flex-col px-[3rem] py-[12rem] customBgColor2 rounded-2xl content w-[70%] h-[40%] mt-24">
        <AnimatePresence>
          {vivek && (
            <>
              {" "}
              <motion.div
                className="parent  flex justify-evenly w-[100%] px-20 items-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, y: 100, type:"spring" }}
              >
                <div className="photo w-[40%]">
                  <img
                    src={img}
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[60%] flex flex-col items-center justify-center text-right">
                  <p className="text-3xl font-medium text-gray-600 pb-2">
                    Vivek Giri
                  </p>
                  <p className="text-xl font-normal pb-1">Dev</p>
                  <p className="text-lg font-light ">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Optio itaque aliquid quod eaque quidem? Explicabo, nihil
                    atque aliquid dolor minima deleniti odio adipisci iure nobis
                    sed sunt numquam, fugiat porro officia molestias! In porro
                    ratione ipsa ad. Ipsum, expedita necessitatibus.
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
                className="parent  flex justify-evenly w-[100%] px-20 items-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, y: 100, type:"spring" }}
              >
                <div className="photo w-[40%]">
                  <img
                    src={img}
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[60%] flex flex-col items-center justify-center text-right">
                  <p className="text-3xl font-medium text-gray-600 pb-2">
                    Nishant Kumar
                  </p>
                  <p className="text-xl font-normal pb-1">Dev</p>
                  <p className="text-lg font-light ">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Optio itaque aliquid quod eaque quidem? Explicabo, nihil
                    atque aliquid dolor minima deleniti odio adipisci iure nobis
                    sed sunt numquam, fugiat porro officia molestias! In porro
                    ratione ipsa ad. Ipsum, expedita necessitatibus.
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
                className="parent  flex justify-evenly w-[100%] px-20 items-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, y: 100 , type:"spring"}}
              >
                <div className="photo w-[40%]">
                  <img
                    src={img}
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[60%] flex flex-col items-center justify-center text-right">
                  <p className="text-3xl font-medium text-gray-600 pb-2">
                    Vaibhav Verma
                  </p>
                  <p className="text-xl font-normal pb-1">Dev</p>
                  <p className="text-lg font-light ">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Optio itaque aliquid quod eaque quidem? Explicabo, nihil
                    atque aliquid dolor minima deleniti odio adipisci iure nobis
                    sed sunt numquam, fugiat porro officia molestias! In porro
                    ratione ipsa ad. Ipsum, expedita necessitatibus.
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {saquib && (
            <>
              {" "}
              <motion.div
                className="parent  flex justify-evenly w-[100%] px-20 items-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, y: 100 , type:"spring"}}
              >
                <div className="photo w-[40%]">
                  <img
                    src={img}
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full drop-shadow-2xl"
                  />
                </div>
                <div className="content w-[60%] flex flex-col items-center justify-center text-right">
                  <p className="text-3xl font-medium text-gray-600 pb-2">
                    Saquib Ali
                  </p>
                  <p className="text-xl font-normal pb-1">Dev</p>
                  <p className="text-lg font-light ">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Sit cumque quo soluta! Assumenda, provident cum, id maiores
                    animi perferendis temporibus nihil voluptatem, magnam
                    praesentium dolorum sit? Architecto qui velit corporis quas
                    doloribus adipisci facere necessitatibus unde eius magni, a
                    iusto!
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
                className=" flex justify-evenly w-[100%] px-20 items-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, y: 100 , type:"spring"}}
              >
                <div className="w-[40%]">
                  <img
                    src={img}
                    alt="hat bkl"
                    className="h-52 w-52 rounded-full drop-shadow-2xl"
                  />
                </div>
                <div className="w-[60%] flex flex-col items-center justify-center">
                  <p className="text-3xl font-medium pb-4 text-gray-600">
                    Note Providers
                  </p>
                  <p className="text-xl font-normal">
                    GURUJI <br />
                    SAQUIB
                    <br />
                    VIVEK <br />
                    SUMIT
                    <br />
                  </p>
                </div>
              </motion.div>{" "}
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="buttonsw w-[50%] mb-10 mr-10 flex justify-between">
        <motion.button
          className="bg-white w-[10rem] mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
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
          className="bg-white w-[10rem] mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
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
          className="bg-white w-[10rem] mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
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
          className="bg-white w-[10rem] mx-6 px-6 py-2 text-xl  hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
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
          className="bg-white w-[10rem] mx-6 px-6 py-2 text-xl  hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.4 }}
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
