import React from "react";
import Logo from "../assets/logo_website.png";

import { Link } from "react-router-dom";
const NavbarLogin = () => {
  return (
    <div className="flex justify-center items-center pt-10 ">
      <Link to="/" className="text-4xl ">
        <img src={Logo} alt="" className="w-20"/>
      </Link>
    </div>
  );
};

export default NavbarLogin;
