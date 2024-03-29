import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import LoginAnimation from "../assets/Login.json";
import ErrorBoundary from "../components/ErrorBoundary";
import Cookies from 'js-cookie'


const Register = () => {
  const navigate = useNavigate();
  //url to go to
  const url = process.env.REACT_APP_REGISTER;
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    batch: "",
  });
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
    Cookies.set('email',data.email)
    console.log(newdata);

  }

  async function submit(e) {
    e.preventDefault();
    
    try {
      const response = await axios.post(url, data).then((res) => {
        console.log(res.data);
        navigate("/verification");
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="min-h-[85.2vh] flex items-center bg-[#F3EFE0] justify-center ">
      <div className="bg-[rgb(34,163,159,0.7)] flex flex-col justify-around md:w-[30rem] w-[24rem] h-[28rem] md:h-auto py-10 rounded-lg drop-shadow-lg px-2">
        <h1 className="text-4xl font-bold text-center h-[10vh] md:pt-0 pt-4 text-white">
          Register
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
            className="flex flex-col justify-evenly h-[20rem] px-10"
          >
            <motion.input
              type="text"
              placeholder="Stewie Griffin"
              id="name"
              value={data.name}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <motion.input
              type="text"
              placeholder="stewie@gmail.com"
              id="email"
              value={data.username}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <motion.input
              type="password"
              placeholder="*****"
              id="password"
              autoComplete="true"
              value={data.password}
              onChange={(e) => handleChange(e)}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
            />
            <div className="flex justify-around items-center">
              <select
                name="branch"
                id="branch"
                className="w-[46.5%] rounded-lg h-8 px-2 focus:bg-sky-100"
                value={data.branch}
                onChange={(e) => handleChange(e)}
              >
                <option value="" disabled defaultValue>
                  Select Branch
                </option>
                <option value="ECE">ECE</option>
                <option value="ECE IOT">ECE Speclization</option>
                <option value="CSE">CSE</option>
                <option value="CSE AIDS">CSE DSAI</option>
              </select>
              <select
                name="batch"
                id="batch"
                className="w-[46.5%] rounded-lg h-8 px-2 focus:bg-sky-100"
                value={data.batch}
                onChange={(e) => handleChange(e)}
              >
                <option value="" disabled defaultValue>
                  Select Batch
                </option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
              </select>
            </div>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 transition-all duration-300 inline text-xl font-medium"
            >
              Already have an Account
            </Link>
            <div className="flex justify-center items-center">
              <motion.button
                type="submit"
                className="bg-white text-sky-600 h-10 w-20 hover:bg-sky-300 hover:rounded-sm hover:text-white mx-3 transition-all duration-100"
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
