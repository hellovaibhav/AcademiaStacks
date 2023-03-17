import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Register = () => {
  //url to go to
  const url = "";
  const [data, setdata] = useState({
    name: "",
    username: "",
    password: "",
  });
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
    console.log(newdata);
  }
  function submit(e) {
    e.preventDefault();
    axios.post(url, { data }).then((res) => {
      console.log(res.data);
    });
  }
  return (
    <div className="min-h-[85.2vh] flex items-center justify-center ">
      <div className="bg-blue-200 flex flex-col justify-around w-[24rem] h-[28rem] py-10 rounded-lg drop-shadow-lg px-2">
        <h1 className="text-4xl font-bold text-center h-[20vh] pt-4 text-white">
          Register
        </h1>
        <form
          onSubmit={(e) => submit(e)}
          action="/auth/register"
          method="POST"
          className="flex flex-col justify-evenly h-[80vh] px-10"
        >
          <input
            type="text"
            placeholder="Saqeeb Olly"
            id="name"
            name="name"
            value={data.name}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <input
            type="email"
            placeholder="saqeebolly@ollyfans.com"
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <input
            type="password"
            placeholder="ollyfans@123"
            id="password"
            name="password"
            autoComplete="true"
            value={data.password}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <div className="flex justify-around items-center">
            <select name="branch" id="branch" className="w-[45%]">
              <option value="" disabled selected>Select Branch</option>
              <option value="ECE">ECE</option>
              <option value="ECE IOT">ECE Speclization</option>
              <option value="CSE">CSE</option>
              <option value="CSE AIDS">CSE AIDS</option>
            </select>
            <select name="batch" id="batch" className="w-[40%]">
              <option value="" disabled selected>Select Batch</option>
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
            >
              Submit
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
