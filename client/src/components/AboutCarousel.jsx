import React from "react";
import About from "./AboutInfo";
const AboutCarousel = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-32">
      {About.map((about) => (
        <div className=" w-[90vw] min-h-[75vh] flex flex-col items-center justify-center py-10">
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
