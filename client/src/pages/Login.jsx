import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  //url to go to
  const url = "";
  //useStates to hold input
  const [data, setdata] = useState({
    username: "",
    password: "",
  });
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setdata(newdata);
    console.log(newdata);
  }
  //Function to handle submit
  function submit(e) {
    e.preventDefault();
    axios.post(url, { data }).then((res) => {
      console.log(res.data);
    });
  }
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="bg-blue-200 flex flex-col justify-around w-[24rem] h-[28rem] py-10 px-2 rounded-lg drop-shadow-lg">
        <h1 className="text-4xl font-bold text-center h-[20vh] pt-4 text-white">
          Login
        </h1>
        <form
          onSubmit={(e) => submit(e)}
          action=""
          method="get"
          className="flex flex-col justify-evenly h-[80vh] px-10"
        >
          <input
            type="text"
            id="username"
            value={data.username}
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base "
          />
          <input
            autoComplete="true"
            type="password"
            placeholder="Password"
            id="password"
            value={data.password}
            onChange={(e) => handleChange(e)}
            className="min-h-[2rem] rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
          />
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-500 transition-all duration-300 inline text-sm mx-3 font-semibold"
          >
            Register
          </Link>
          <div className="flex justify-center items-center">
            <motion.button
              type="submit"
              className="bg-white text-sky-600 h-10 w-20 hover:bg-sky-300 hover:rounded-sm hover:text-white transition-all duration-100"
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

export default Login;
