import React from "react";
import Carousel from "../components/Carousel";

const Home = () => {
  return (
    <div className="min-h-[95vh] px-10 sm:px-0 md:my-32 my-28 flex flex-col justify-between items-center py-[2rem]">
      <div className="flex flex-col xl:flex-row justify-between items-center">
        <Carousel />
        <div className=" flex flex-col justify-center items-center ">
          <p className="text-lg hidden lg:flex lg:text-4xl pr-4 bg-blue-100 my-10 lg:my-8 h-[10rem] w-[15rem] lg:w-[20rem] text-center items-center justify-center px-5 rounded-lg">
            The Notes You Need in Your life
          </p>
          <p className="w-[70vw] xl:w-[20vw] my-10 lg:my-0 text-justify ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            quo sequi odit laborum voluptate ullam harum alias provident itaque
            neque? Maxime debitis odit, dolorem quo perferendis repellendus
            exercitationem vero ipsa voluptate itaque excepturi architecto
            deserunt minus ducimus soluta at officiis!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
