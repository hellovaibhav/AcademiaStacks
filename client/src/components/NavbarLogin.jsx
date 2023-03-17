import React from "react";
import { Link } from "react-router-dom";
const NavbarLogin = () => {
  return (
    <div className="flex justify-center items-center py-10 ">
      <Link to="/" className="text-4xl ">
        LOGO
      </Link>
    </div>
  );
};

export default NavbarLogin;
