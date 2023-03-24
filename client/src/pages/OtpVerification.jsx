import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";
const OtpVerification = () => {
  const navigate = useNavigate();
  //url to go to
  const url = "http://localhost:8800/api/auth/verification";
  //useStates to hold input
  const [data, setdata] = useState({
    email: "",
    otp: "",
  });
  data.email = Cookies.get("email");

  const { loading, error, dispatch } = useContext(AuthContext);

  function handleChange(e) {
    const newdata = { ...data };
    //Checking the OTP to be of length 6 only
    newdata[e.target.id] = e.target.value.substring(0, 6);
    setdata(newdata);
    console.log(newdata);
  }
  //Function to handle submit
  const [load, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      setTimeout(() => {
        setLoading(true);
      }, 1000);
      const res = await axios.post(url, data).catch((err) => {
        console.log(err.response.data.message);
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/login");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.data });
      navigate("/verification");
    }
  }

  return (
    <div className="min-h-[95vh] flex items-center justify-center">
      <form
        onSubmit={(e) => submit(e)}
        action=""
        method="POST"
        className="flex justify-around items-center min-h-[30vh]"
      >
        <div>
          <span className="px-2 mx-2 text-left text-2xl font-semibold text-blue-600">
            OTP   :   
          </span>

          <input
            type="number"
            onChange={(e) => handleChange(e)}
            id="otp"
            value={data.otp}
            maxLength="2"
            placeholder="123456"
            className="h-16 w-44 mx-2 bg-gray-300 border-2 border-black drop-shadow-lg p-2 text-4xl text-center tracking-widest"
          />
        </div>
        <motion.button
          type="submit"
          className="bg-blue-400 text-white h-10 w-20 hover:bg-sky-100 hover:rounded-sm hover:text-blue-600 transition-all duration-100 ml-10"
          whileHover={{ scale: 1.2, transition: { duration: 1 } }}
          whileTap={{ scale: 0.8, transition: { duration: 0.1 } }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.4 }}
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default OtpVerification;
