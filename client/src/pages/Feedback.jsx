import React from "react";
import { Link } from "react-router-dom";
const Feedback = () => {
  return (
    <div className="min-h-[86.2vh] flex items-center justify-center ">
      <div className="bg-red-300 h-[35rem] rounded-3xl w-[70rem]">
        <form
          action=""
          method="get"
          className="flex justify-evenly h-[80vh] px-10"
        >
          <div className="left w-[50vw] flex flex-col justify-evenly">
          <input
            type="text"
            placeholder="Name"
            className="min-h-[2rem] rounded p-2"
          />
          <input
            type="text"
            placeholder="Username"
            className="min-h-[2rem] rounded p-2"
          />
          <input
            type="password"
            name=""
            placeholder="Password"
            id=""
            className="min-h-[2rem] rounded p-2"
          />
          <Link to="/login" className="text-blue-600 text-sm">
            Already have an Account
          </Link>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-red-100 h-10 w-20 hover:bg-red-400 ease-in-out duration-100"
            >
              Submit
            </button>
          </div>
          </div>
          <div className="right w-[50vw]">
          Hello
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
