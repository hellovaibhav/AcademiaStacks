import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/logo_website.png";
import { motion } from "framer-motion";
const NavbarHead = () => {
  const Navigate = useNavigate();
  // const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {
  //   const token = localStorage.getItem("user");
  //   if (token) {
  //     setLoggedIn(true);
  //     console.log("The state of loggedIn is : " + loggedIn);
  //   }
  // }, []);
  const { user } = useContext(AuthContext);
  // const [registered, setRegistered] = useState(true);
  let Links = [
    { name: "Home", logo: "Home", link: "/" },
    { name: "Material", logo: "Material", link: "/material" },
    { name: "About", logo: "About Us", link: "/about" },
    { name: "Feedback", logo: "Feedback", link: "/feedback" },
    {
      name: "Login",
      logo: `${user ? "Hello " + user.fname : "Login"}`,
      link: `${user ? "/user": "/login"}`,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="z-10 drop-shadow-lg md:drop-shadow-sm w-full fixed top-0 left-0">
      <div className="md:flex md:items-center justify-between bg-white md:bg-transparent pt-4 md:h-auto h-24 md:py-0 md:pl-10 md:pr-0 px-7">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
            }}
            className="text-3xl inline text-indigo-600 mr-1 font-bold cursor-pointer md:flex items-center font-[Poppins]"
          >
            <img src={Logo} className="w-14 drop-shadow-md" alt="LOGO" />
          </Link>
          {open ? (
            <AiOutlineClose
              onClick={() => {
                setOpen(!open);
              }}
              className="text-3xl   z-20 cursor-pointer md:hidden inline"
            />
          ) : (
            <AiOutlineMenu
              onClick={() => {
                setOpen(!open);
              }}
              className="text-3xl   z-20 cursor-pointer md:hidden inline"
            />
          )}
        </div>

        <ul
          className={` ${
            open ? "top-24" : "top-[-490px]"
          } bg-white opacity-[0.85] md:opacity-100  md:bg-blue-400 drop-shadow-lg md:pl-16 pl-0 md:rounded-bl-full rounded-none h-auto md:h-16 md:flex md:items-center absolute md:static  w-full left-0 md:w-auto transition-all duration-500 ease-in`}
        >
          {Links.map((link) => (
            <motion.li
            
              key={link.name}
              className="text-blue-400 hover:text-white text-center md:text-right md:text-white md:hover:text-blue-400 md:ml-8 mx-4 text-xl md:my-0 my-7 "
              whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
            >
              {" "}
              <NavLink
                onClick={() => {
                  setOpen(!open);
                }}
                to={link.link}
                className="text-2xl font-light px-4 md:hover:text-bg-blue-400  md:hover:bg-white hover:bg-blue-400 hover:rounded-xl hover:py-[0.65rem] transition-all duration-200 ease-in"
              >
                {link.logo}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarHead;
