import React from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="Navbar flex items-center justify-between">
      <div className="w-[40vw] z-0 pl-20 pt-4 ">
        <Link to="/" className="text-4xl ">
          LOGO
        </Link>
      </div>
      <div className="w-[60vw] text-white h-[3.8rem] flex items-center justify-around rounded-bl-[5rem] pl-10 before:content-['']-bg-color[redx] bg-[#22A39F]">
        <Link to="/material" className="text-2xl">
          Material
        </Link>
        <Link to="/about" className="text-2xl">
          About Us
        </Link>
        <Link to="/feedback" className="text-2xl">
          Feedback
        </Link>
        <Link to="/login" className=" text-lg italic">
          <FaUserAlt />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
