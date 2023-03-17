import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineMenu ,AiOutlineClose } from "react-icons/ai";
import Logo from "../assets/logo_website.png";
const NavbarHead = () => {
  let Links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Material", link: "/material" },
    { name: "Feedback", link: "/feedback" },
    { name: "Login", link: "/login" },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="z-10 shadow-lg w-full fixed top-0 left-0">
      <div className="md:flex md:items-center justify-between bg-white py-4 md:px-10 px-7">
        <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-500 ">
          <Link to="/" className="text-3xl text-indigo-600 mr-1 pt-2 ">
            <img src={Logo} className="w-14" alt="LOGO" />
          </Link>
        </div>
        {
          open ? <AiOutlineClose
          onClick={() => {
            setOpen(!open);
          }}
          className="text-3xl absolute right-4 top-8 z-20 cursor-pointer md:hidden"
        /> : <AiOutlineMenu 
        onClick={() => {
          setOpen(!open);
        }}
        className="text-3xl absolute right-4 top-8 z-20 cursor-pointer md:hidden"
        />
        }
        
        <ul
          className={` ${
            open ? "top-24" : "top-[-490px]"
          } md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white w-full left-0 md:w-auto transition-all duration-500 ease-in`}
        >
          {Links.map((link) => (
            <li
              key={link.name}
              className="text-blue-600 md:ml-8 mx-4 text-xl md:my-0 my-7 "
            >
              {" "}
              <NavLink
                onClick={() => {
                  setOpen(!open);
                }}
                to={link.link}
                className="text-2xl font-light px-4 md:hover:text-white md:hover:bg-blue-400 hover:rounded-xl hover:py-[0.65rem] transition-all duration-200 ease-in"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarHead;
