import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { motion } from "framer-motion";
const Navbar = () => {
  return (
    <div className="Navbar flex items-center justify-between overflow-hidden">
      <div className="w-[40vw] z-0 pl-20 pt-4 ">
        <motion.p
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
        </motion.p>
      </div>
      <motion.div className="w-[60vw] text-white h-[3.8rem] flex items-center justify-around rounded-bl-[5rem] pl-10  bg-blue-400"
      
      >
        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0,
              type: "spring",
              stiffness: 200,
            },
          }}
          // whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
          whileTap={{scale:0.7 , transition: { duration: 0.3 }}}
        >
          <NavLink
            to="/material"
            className="dad text-2xl  hover:shadow-stone-600 hover:rounded-2xl hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            Material
          </NavLink>
        </motion.p>
        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0.1,
              type: "spring",
              stiffness: 200,
            },
          }}
          // whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
          whileTap={{scale:0.7 , transition: { duration: 0.3 }}}

        >
          <NavLink
            to="/about"
            className="dad text-2xl  hover:shadow-stone-600 hover:rounded-2xl hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            About Us
          </NavLink>
        </motion.p>
        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            },
          }}
          // whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
          whileTap={{scale:0.7 , transition: { duration: 0.3 }}}

        >
          <NavLink
            to="/feedback"
            className="dad text-2xl  hover:shadow-stone-600 hover:rounded-2xl hover:shadow-[7px_-1px_41px_-9px_rgba(0,0,0,0.75)] duration-300 px-4 py-1 "
          >
            Feedback
          </NavLink>
        </motion.p>
        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0.3,
              type: "spring",
              stiffness: 200,
            },
          }}
          // whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
          whileTap={{scale:0.7 , transition: { duration: 0.3 }}}

        ></motion.p>

        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            },
          }}
          // whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}
          whileTap={{scale:0.7 , transition: { duration: 0.3 }}}

        >
          <NavLink
            to="/login"
            className=" hover:shadow-stone-600 hover:rounded-2xl  duration-300 px-4 py-1 text-xl italic"
          >
            <FaUserAlt />
          </NavLink>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Navbar;
