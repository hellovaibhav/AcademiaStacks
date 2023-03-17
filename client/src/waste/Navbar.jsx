import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="Navbar flex items-center justify-between overflow-hidden">
      <div className="w-[40vw] z-0 pl-20 pt-4 ">
        <p
          initial={{ x: 100, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0,
              type: "spring",
              stiffness: 200,
            },
          }}
        >
          <Link to="/" className="text-4xl ">
            LOGO
          </Link>
        </p>
      </div>
      <div className="hidden max-w-6xl mx-auto w-[60vw] text-white h-[3.8rem] md:flex flex-col md:flex-row items-center justify-around rounded-bl-[5rem] pl-10  bg-blue-400">
        <p>
          <NavLink
            to="/"
            className="dad text-2xl touch-pinch-zoom  hover:shadow-stone-600  hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            Home
          </NavLink>
        </p>
        <p>
          <NavLink
            to="/material"
            className="dad text-2xl touch-pinch-zoom  hover:shadow-stone-600  hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            Material
          </NavLink>
        </p>
        <p whileTap={{ scale: 0.7, transition: { duration: 0.3 } }}>
          <NavLink
            to="/about"
            className="dad text-2xl  hover:shadow-stone-600  hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            About Us
          </NavLink>
        </p>
        <p whileTap={{ scale: 0.7, transition: { duration: 0.3 } }}>
          <NavLink
            to="/feedback"
            className="dad text-2xl  hover:shadow-stone-600  hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            Feedback
          </NavLink>
        </p>
        <p whileTap={{ scale: 0.7, transition: { duration: 0.3 } }}></p>

        <p whileTap={{ scale: 0.7, transition: { duration: 0.3 } }}>
          <NavLink
            to="/login"
            className=" hover:shadow-stone-600   duration-300 px-4 py-1 text-xl italic"
          >
            <FaUserAlt />
          </NavLink>
        </p>
      </div>
      <div class="flex lg:hidden">
        <div class="space-y-2">
          <span class="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
          <span class="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
          <span class="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
