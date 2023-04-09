import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginAnimation from "../assets/Login2.json";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorBoundary from "../components/ErrorBoundary";

const Login = () => {
  const navigate = useNavigate();
  //url to go to
  const url = process.env.REACT_APP_LOGIN;

  //useStates to hold input
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;

    setdata(newdata);
    console.log(newdata);
  }
  //Function to handle submit
  const [load, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(url, data);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/material");
    } catch (err) {
      alert("User not registered or wrong mail id or password");
      dispatch({ type: "LOGIN_FAILURE", payload: err.res.data });
    }
  }

  return (
    <>
      {load ? (
        <div className="min-h-[100vh] bg-[#F3EFE0] flex items-center  justify-center pt-16 md:pt-10   ">
          <Loader />
        </div>
      ) : (
        <div className="min-h-[90vh] flex items-center bg-[#F3EFE0] justify-center">
          <div className="bg-[#22a39fb3] flex flex-col justify-around md:w-[25rem] w-[20rem] h-[28rem] md:h-auto  py-10 px-2 rounded-lg drop-shadow-lg">
            <h1 className="text-4xl font-bold text-center h-[10vh] pt-4 text-white">
              Login
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
                method="get"
                className="flex flex-col justify-evenly h-[20rem] px-10"
              >
                <motion.input
                  type="text"
                  id="email"
                  value={data.email}
                  onChange={(e) => handleChange(e)}
                  placeholder="Email"
                  className="min-h-[2rem] w-50 md:w-64 rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base "
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                />
                <motion.input
                  autoComplete="true"
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={data.password}
                  onChange={(e) => handleChange(e)}
                  className="min-h-[2rem] w-50 md:w-64 rounded p-2 focus:bg-sky-100 focus:text-blue-500 focus:font-base"
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                />
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 transition-all duration-300 inline text-xl mx-3 font-medium"
                >
                  Register
                </Link>
                <div className="flex justify-center items-center">
                  <motion.button
                    type="submit"
                    className="bg-white text-sky-600 h-10 w-20 hover:bg-sky-300 hover:rounded-sm hover:text-white transition-all duration-100"
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
      )}
    </>
  );
};

export default Login;
