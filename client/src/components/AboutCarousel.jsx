import React from "react";
import About from "./AboutInfo";
const AboutCarousel = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-32 pb-5">
      {About.map((about) => (
        <div 
        key={about.name}
        className={`w-[90vw] min-h-[50vh] flex text-gray-600 flex-col ${about.color} py-10 items-center justify-center rounded-xl px-5 drop-shadow-xl my-4`}>
          <img src={about.image} alt="" className="rounded-full w-52 h-52 drop-shadow-xl border-4 " />
          <p className="text-3xl font-semibold pt-4 ">{about.name}</p>
          <p className="text-base font-light py-2">{about.position}</p>
          <p className="text-justify py-4 border-t-2 border-b-2">{about.content}</p>
        </div>
      ))}
    </div>
  );
};

export default AboutCarousel;
