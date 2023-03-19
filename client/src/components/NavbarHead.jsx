import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/logo_website.png";
import { motion } from "framer-motion"
const NavbarHead = () => {
  const { user } = useContext(AuthContext);
  const [registered, setRegistered] = useState(true)
  let Links = [
    { name: "Home", logo: "Home", link: "/" },
    { name: "About", logo: "About", link: "/about" },
    { name: "Material", logo: "Material", link: "/material" },
    { name: "Feedback", logo: "Feedback", link: "/feedback" },
    { name: "Login", logo: `${user ? "Hello " + user.fname : 'Login'}`, link: `${registered ? '/login' : '/register'}` },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="z-10 drop-shadow-sm w-full fixed top-0 left-0">
      <div className="md:flex md:items-center justify-between bg-white md:bg-transparent pt-4 md:h-auto h-24 md:py-0 md:pl-10 md:pr-0 px-7">
        <Link
          to="/"
          onClick={() => {
            setOpen(!open);
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
            className="text-3xl absolute right-4 top-8 z-20 cursor-pointer md:hidden inline"
          />
        ) : (
          <AiOutlineMenu
            onClick={() => {
              setOpen(!open);

            }}
            className="text-3xl absolute right-4 top-8 z-20 cursor-pointer md:hidden inline"
          />
        )}

        <ul
          className={` ${open ? "top-24" : "top-[-490px]"
            } bg-white  md:bg-blue-400 drop-shadow-lg md:pl-16 pl-0 md:rounded-bl-full rounded-none h-auto md:h-16 md:flex md:items-center absolute md:static  w-full left-0 md:w-auto transition-all duration-500 ease-in`}
        >
          {Links.map((link) => (
            <motion.li
              key={link.name}
              className="text-blue-400 hover:text-white md:text-white md:hover:text-blue-400 md:ml-8 mx-4 text-xl md:my-0 my-7 "
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
