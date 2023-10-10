// Imports 
import React from "react";
import Carousel from "../components/Carousel";
// Main Function
const Home = () => {
  return (
    <div className="min-h-[95vh] bg-[#F3EFE0] px-10 sm:px-0 md:py-32 py-28 flex flex-col justify-between items-center ">
      <div className="flex flex-col w-screen xl:flex-row justify-around items-center">
        <Carousel />
        <div className=" flex flex-col justify-center items-center ">
          <p className="text-lg text-Red hidden lg:flex lg:text-4xl pr-4 bg-[rgb(34,163,159,0.4)] my-10 lg:my-8 h-[10rem] w-[15rem] lg:w-[20rem] text-center items-center justify-center px-5 rounded-lg">
            Wanna Contribute ?
          </p>
          <p className="w-[70vw] xl:w-[20vw] my-10 lg:my-0 text-justify ">Maintaining an updated repository of study materials is a considerable endeavor, and your valuable contribution can make a significant difference. We invite you to share your notes, question papers, and any other non-copyrighted study materials that you believe will benefit your fellow students.

By contributing to Academia Stacks, you not only help your peers but also have the chance to be featured on our contributors' page as a recognition of your valuable input. Your name will be proudly displayed alongside your contributed materials.

Getting involved is easy! Simply reach out to any of our developers via email or social media links, and they will guide you through the process of featuring your materials on the site. Your generosity will ensure that Academia Stacks remains a dynamic resource for present and future batches. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
