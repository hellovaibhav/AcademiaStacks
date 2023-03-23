import React from "react";
import { motion } from "framer-motion";
const OtpVerification = ({ email }) => {
  const arr = [
    { type: "number" },
    { type: "number" },
    { type: "number" },
    { type: "number" },
    { type: "number" },
    { type: "number" },
  ];
  //Function to handle submit
  const submit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center">
      <form
        onSubmit={(e) => submit(e)}
        action=""
        method="get"
        className="flex flex-col justify-around items-center min-h-[30vh]"
      >
      <div>
        <span>Email</span>
        <input type="text" placeholder="Enter Your Email" className="ml-4 p-2 bg-gray-200 rounded-lg" />
      </div>
        <div>
          <span className="px-2 text-left text-2xl font-semibold text-blue-600">
            OTP :{" "}
          </span>
          {arr.map((item) => {
            return (
              <input
                key={item.type}
                type={item.type}
                className="h-16 w-14 mx-2 bg-gray-300 border-2 border-black drop-shadow-lg p-2 text-4xl text-center"
              />
            );
          })}
        </div>
        <motion.button
          type="submit"
          className="bg-blue-400 text-white h-10 w-20 hover:bg-sky-100 hover:rounded-sm hover:text-blue-600 transition-all duration-100"
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
