import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Lottie from "lottie-react";
import LoginAnimation from "../assets/Login.json";
import ErrorBoundary from "../components/ErrorBoundary";

const Register = () => {
  const navigate = useNavigate();
  //url to go to
  const url = process.env.REACT_APP_FEEDBACK;
  const [data, setdata] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
    console.log(newdata);
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(url, data).then((res) => {
        console.log(res.data);
        navigate("/");
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="min-h-[95vh] pt-10 md:min-h-[94vh] bg-[#F3EFE0] flex items-center justify-center ">
      <div className="bg-[rgb(34,163,159,0.5)] flex flex-col justify-around md:w-[40rem] w-[24rem] h-[28rem] md:h-auto py-10 rounded-lg drop-shadow-lg px-2">
        <h1 className="text-4xl font-bold text-center h-[10vh] md:pt-0 pt-4 text-white">
          Feedback
        </h1>
        <div className="flex items-center justify-around">
          {/* <ErrorBoundary>
            <Lottie
              animationData={LoginAnimation}
              className="h-80 hidden md:block"
            />
          </ErrorBoundary> */}

          <form
            onSubmit={(e) => submit(e)}
            action=""
            method="POST"
            className="flex flex-col justify-evenly h-auto md:h-[25rem] px-10 w-[100%] md:w-[75%]"
          >
          <label htmlFor="0">Name</label>
            <motion.input
              type="text"
              placeholder="Stewie Griffin"
              id="name"
              value={data.name}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <label htmlFor="">Email</label>
            <motion.input
              type="text"
              placeholder="stewie@gmail.com"
              id="email"
              value={data.email}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <label htmlFor="">Error Type</label>
            <select
              name="type"
              id="type"
              className="w-auto rounded-lg h-8 px-2 focus:bg-sky-100"
              value={data.type}
              onChange={(e) => handleChange(e)}
            >
              <option value="" disabled defaultValue>
                Select Type
              </option>
              <option value="Bug">Bug</option>
              <option value="Suggestions">Suggestions</option>
            </select>
            <label htmlFor="">Message</label>
            <motion.textarea
              type="message"
              placeholder="Enter your message here "
              id="message"
              autoComplete="false"
              value={data.message}
              onChange={(e) => handleChange(e)}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              className="min-h-[5rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
            />

            <div className="flex justify-center items-center">
              <motion.button
                type="submit"
                className="bg-white text-sky-600 h-10 w-20  hover:bg-sky-300 hover:rounded-sm hover:text-white mx-3 transition-all duration-100"
                whileHover={{ scale: 1.2, transition: { duration: 1 } }}
                whileTap={{ scale: 0.8, transition: { duration: 0.1 } }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1, delay: 0.4 }}
              >
                Submit
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
