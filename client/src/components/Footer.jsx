import React from "react";

const dt = new Date();

const Footer = () => {
  return (
    <div className="overflow-hidden bg-blue-400 text-center text-white border-t-2 border-white">
      <h1>Made With 💖 by Hacktivators+</h1>
      <h1>© {dt.getFullYear()}</h1>
    </div>
  );
};

export default Footer;
