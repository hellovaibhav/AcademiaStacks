// Imports
import React from "react";

// Function Declaration
const dt = new Date();

// Main function
const Footer = () => {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center bg-[#434242] min-h-[10vh] pt-12 text-center text-white border-t-2 border-white">
      <div className="parent md:flex hidden w-[80vw]  items-center justify-around pb-5">
        <div className="1 w-[15%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Get In Touch</p>
            <p>saquibali353@gmail.com</p>
            <p>hacktivator.iiit@gmail.com</p>
          </div>
        </div>
        <div className="1 w-[25%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Connect With Us</p>
            <div className="flex">
            
            <a
              href="https://www.linkedin.com/in/saquib-ali-4a3235219/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#22a39fb3] px-2"
            >
              Saquib
            </a>
            <p>|</p>
            <a
              href="https://www.linkedin.com/in/vaibhav-verma-iiitr/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#22a39fb3] px-2"
            >
              Vaibhav
            </a>
            <p>|</p>
            <a
              href="https://www.linkedin.com/in/nishant-kumar-92275b19a/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#22a39fb3] px-2"
            >
              Nishant
            </a>
            <p>|</p>
            <a
              href="https://www.linkedin.com/in/vivek-giri45/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#22a39fb3] px-2"
            >
              Vivek
            </a>
            </div>
            <a
              href="https://github.com/Hacktivators-IIIT"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#22a39fb3]"
            >
            GitHub
            </a>
          </div>
        </div>
        <div className="1 w-[15%]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold pb-2">Address</p>
            <p>IIIT Ranchi Jupmi Campus</p>
            <p>Dhurwa , Ranchi, Jharkhand</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h1>Made With 💖 by Hacktivators</h1>
        <h1>© {dt.getFullYear()} <span className="absolute right-5 text-gray-400">Version 1.0.1 ( α )</span></h1>
        
      </div>
    </div>
  );
};

export default Footer;
