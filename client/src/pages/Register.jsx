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
          action=""
          method="get"
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
            placeholder="Username"
            id="username"
            value={data.username}
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
