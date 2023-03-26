import React from "react";
import { Link } from "react-router-dom";
import OhShit from "../assets/OhShit.gif";
const Error = () => {
  return (
    <div className="min-h-[100vh]  mt-10 flex flex-col items-center justify-center ">
     <span className="text-4xl">
         Oh Shit ! <span className="text-rose-500 text-7xl ml-10"> 404</span>{" "}
      </span>
      <img src={OhShit} alt="OhShit" className="h-[25rem] w-[35rem] mt-10 rounded-xl drop-shadow-md saturate-150" />
      <span className="text-4xl">
       There's an Error <span className="text-6xl">|</span> Please Go Back{" "}
      </span>
      <Link
        to="/"
        className="bg-blue-400 p-4 px-6 my-8 hover:bg-blue-700 hover:text-white duration-300"
      >
        Back
      </Link>
    </div>
  );
};

export default Error;
