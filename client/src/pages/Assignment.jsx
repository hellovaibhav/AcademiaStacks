import React from "react";
import img from "../assets/pic1.png";
import MaterialPage from "../assets/MaterialPageContent";

const Assignment = () => {
  return (
    <div className="min-h-[100vh]  flex items-center justify-around mt-32 md:mt-24 pl-0 sm:pl-[2rem] lg:pl-[25rem] md:pl-[10rem] ">
      <div className="leftFilter fixed top-52 left-14 h-40 hidden lg:block border-4 border-black w-[20vw]">
        Filter Here
      </div>
      <div className="rightContent w-[80vw] flex flex-wrap mt-14 lg:mt-0">
        {MaterialPage.map((material) => (
          <div className="parent flex flex-col h-60 w-[100vw] md:w-56 bg-red-400 m-8 rounded-xl drop-shadow-md">
            <img
              src={img}
              alt="Not available"
              className="h-[12rem] w-auto"
            />
            <div className="descriptionChild p-2">{material.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignment;