// Imports
import React from "react";
import ClipLoader from "react-spinners/HashLoader";

// Main component
const Loader = () => {
  return (
    <div className="loader bg-[#F3EFE0] flex flex-col justify-center items-center">
      <ClipLoader size={100} color="#36d7b7" aria-label="Loading Spinner" data-testid="loader" />
      <p className="text-xl mt-5 text-blue-400 font-semibold">Getting Your Materials</p>
    </div>
  );
};

export default Loader;
