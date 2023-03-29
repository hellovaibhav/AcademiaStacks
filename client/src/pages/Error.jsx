import React from "react";
import { Link } from "react-router-dom";
import OhShit from "../assets/OhShit.gif";
const Error = () => {
  return (
    <div className="min-h-[100vh] bg-[#F3EFE0] pt-10 flex flex-col items-center justify-center ">
      <span className="text-xl sm:text-2xl md:text-4xl">
        Oh Shit ! <span className="text-rose-500 text-4xl md:text-7xl ml-2 md:ml-10"> 404</span>{" "}
      </span>
      <img
        src={OhShit}
        alt="OhShit"
        className="md:h-[25rem] md:w-[35rem] sm:h-[15rem] sm:w-[20rem] h-[10rem] w-[15rem] mt-10 rounded-xl drop-shadow-md saturate-150"
      />
      <span className="text-xl sm:text-2xl md:text-4xl">
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
