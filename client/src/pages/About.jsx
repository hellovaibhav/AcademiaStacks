import React, { useState } from "react";
import { motion } from "framer-motion";
import img from "..//assets/profilePic.jpg";
const About = () => {
  const [provider, setProvider] = useState(true);
  const [saquib, setSaquib] = useState(false);
  const [vaibhav, setVaibhav] = useState(false);
  const [nishant, setNishant] = useState(false);
  const [vivek, setVivek] = useState(false);
  return (
    <div className="customBgColor flex-col justify-evenly ">
      <div className="drop-shadow-xl flex justify-center items-center flex-col px-[3rem] py-[12rem] customBgColor2 rounded-2xl content w-[70%] h-[40%] mt-24">
        {provider && (
          <>
            {" "}
            <div className=" flex justify-evenly w-[100%] px-20 items-center">
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
            </div>{" "}
          </>
        )}
        {saquib && (
          <>
            {" "}
            <p className="text-3xl font-medium text-gray-600 pb-2">
              Saquib Ali
            </p>
            <p className="text-xl font-normal pb-1">Dev</p>
            <p className="text-lg font-light">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
              cumque quo soluta! Assumenda, provident cum, id maiores animi
              perferendis temporibus nihil voluptatem, magnam praesentium
              dolorum sit? Architecto qui velit corporis quas doloribus adipisci
              facere necessitatibus unde eius magni, a iusto!
            </p>{" "}
          </>
        )}
        {vaibhav && (
          <>
            {" "}
            <p className="text-3xl font-medium text-gray-600 pb-2">
              Vaibhav Verma
            </p>
            <p className="text-xl font-normal pb-1">Position</p>
            <p className="text-lg font-light">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
              deleniti est expedita sapiente dolores maiores quia sit
              consequuntur at praesentium accusamus ipsam, officia ut
              exercitationem suscipit omnis placeat rem. Itaque dignissimos qui
              quia similique ad nobis aut aliquam, rerum quo?
            </p>{" "}
          </>
        )}
        {nishant && (
          <>
            {" "}
            <p className="text-3xl font-medium text-gray-600 pb-2">
              Nishant Kumar
            </p>
            <p className="text-xl font-normal pb-1">Position</p>
            <p className="text-lg font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              error, animi eos in esse quas odio aperiam! Vitae nobis soluta
              impedit omnis maiores incidunt error itaque ipsum hic sit? At, ex.
              Vitae similique laborum accusantium, atque excepturi voluptates?
              Illo sapiente quo illum et expedita aspernatur dolor eum neque qui
              tenetur, doloremque vitae, maxime maiores. Nam illum fugiat ex
              voluptatem officia?
            </p>{" "}
          </>
        )}
        {vivek && (
          <>
            {" "}
            <p className="text-3xl font-medium text-gray-600 pb-2">
              Vivek Giri
            </p>
            <p className="text-xl font-normal pb-1">Position</p>
            <p className="text-lg font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
              inventore commodi, exercitationem maxime iste neque ipsam illum
              possimus ad dolores dolore cumque quia sunt eius quibusdam dolorem
              atque non sequi incidunt minima corrupti minus vero nam. Quae sed
              amet a totam eos animi ipsa est eum doloribus labore sint
              laudantium ex sapiente ducimus culpa sit voluptatem repudiandae
              laboriosam, minima in voluptates velit itaque molestiae. Dolores,
              quas corporis porro praesentium facere dicta esse maiores?
              Temporibus iure fugiat corrupti velit commodi error, aliquam
              libero placeat iste similique inventore maiores. Adipisci vero
              quia, reprehenderit veritatis pariatur, laudantium assumenda nemo
              vitae earum, iusto laborum?
            </p>{" "}
          </>
        )}
      </div>
      <div className="buttonsw w-[50%] mb-10 mr-10 flex justify-between">
        <motion.button
          className="bg-white mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
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
          className="bg-white mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
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
          className="bg-white mx-6 px-6 py-2 text-xl hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
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
          className="bg-white mx-6 px-6 py-2 text-xl  hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
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
          className="bg-white mx-6 px-6 py-2 text-xl  hover:bg-blue-400 duration-300 hover:text-white hover:rounded-lg hover:drop-shadow-2xl"
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
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
    </div>
  );
};

export default About;
