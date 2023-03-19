import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import axios from "axios";
import Lottie from "lottie-react";
import LoginAnimation from "../assets/Login.json";

const Register = () => {
<<<<<<< HEAD
  //url to go to
  const url = "http://localhost:8800/api/auth/register";
=======
  // //url to go to
  // const url = "";
>>>>>>> d62f9a91fe8bb341317c10f4a12e5ebc2708aa54
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    batch: ""
  });
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
    console.log(newdata);
  }
<<<<<<< HEAD
  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(url, data)
        .then(data => {
          if (response.status == 200) {
            <Redirect to="../login" />
          }
        });
    }
    catch (err) {
      alert(err);
    }
  }

=======
  // function submit(e) {
  //   e.preventDefault();
  //   axios.post(url, { data }).then((res) => {
  //     console.log(res.data);
  //   });
  // }

  //lottie animation
>>>>>>> d62f9a91fe8bb341317c10f4a12e5ebc2708aa54

  return (
    <div className="min-h-[85.2vh] flex items-center justify-center ">
      <div className="bg-blue-200 flex flex-col justify-around md:w-[50rem] w-[24rem] h-[28rem] md:h-auto py-10 rounded-lg drop-shadow-lg px-2">
        <h1 className="text-4xl font-bold text-center h-[20vh] md:pt-0 pt-4 text-white">
          Register
        </h1>
<<<<<<< HEAD
        <form method="POST" action="POST"
          className="flex flex-col justify-evenly h-[80vh] px-10"
        >
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={data.name}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <input
            type="text"
            placeholder="Email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            autoComplete="true"
            value={data.password}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <div className="flex justify-around items-center">
            <select name="branch" id="branch" className="w-[45%]" value={data.branch}
              onChange={(e) => handleChange(e)}>
              <option value="" disabled defaultValue>Select Branch</option>
              <option value="ECE">ECE</option>
              <option value="ECE IOT">ECE Speclization</option>
              <option value="CSE">CSE</option>
              <option value="CSE AIDS">CSE DSAI</option>
            </select>
            <select name="batch" id="batch" className="w-[40%]" value={data.batch}
              onChange={(e) => handleChange(e)}>
              <option value="" disabled defaultValue>Select Batch</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
            </select>
          </div>
          <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-all duration-300 inline text-sm font-semibold">
            Already have an Account
          </Link>
          <div className="flex justify-center items-center">
            <motion.button
              type="submit"
              className="bg-white text-sky-600 h-10 w-20 hover:bg-sky-300 hover:rounded-sm hover:text-white mx-3 transition-all duration-100"
              whileHover={{
                scale: 1.2,
                transition: { duration: 1, ease: "easeInOut" },
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
              onClick={submit}
=======
        <div className="flex items-center justify-around">
          <Lottie
            animationData={LoginAnimation}
            className="h-80 hidden md:block"
          />

          <form
            onSubmit="/auth/register"
            action=""
            method="POST"
            className="flex flex-col justify-evenly h-[20rem] px-10"
          >
            <motion.input
              type="text"
              placeholder="Name"
              id="name"
              value={data.name}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <motion.input
              type="text"
              placeholder="Username"
              id="username"
              value={data.username}
              onChange={(e) => handleChange(e)}
              className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            />
            <motion.input
              type="password"
              placeholder="Password"
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
              >
                <option value="" disabled selected>
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
              >
                <option value="" disabled selected>
                  Select Batch
                </option>
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
              className="text-blue-600 hover:text-blue-500 transition-all duration-300 inline text-sm font-semibold"
>>>>>>> d62f9a91fe8bb341317c10f4a12e5ebc2708aa54
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
