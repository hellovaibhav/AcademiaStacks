// Imports
import React from "react";

// Function Declaration
const dt = new Date();

// Main function
const Footer = () => {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center bg-[#434242] min-h-[10vh] py-2 text-center text-white border-t-2 border-white">
      <div>
        <h1>Made With 💖 by Hacktivators+</h1>
        <h1>© {dt.getFullYear()}</h1>
      </div>
      <div className="parent md:flex hidden w-[80vw]  items-center justify-around pt-5">
        <div className="1 w-[15%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Get In Touch</p>
            <p>saquibali353@gmail.com</p>
            <p>dummy@gmail.com</p>
          </div>
        </div>
        <div className="1 w-[15%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Connect</p>
            <p>LinkedIn</p>
            <p>GitHub</p>
          </div>
        </div>
        <div className="1 w-[15%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Address</p>
            <p>IIIT Ranchi Jupmi Campus</p>
            <p>IIIT JUT Campus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
