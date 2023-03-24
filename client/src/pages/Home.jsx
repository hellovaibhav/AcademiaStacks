import React from "react";
import Carousel from "../components/Carousel";

const Home = () => {
  return (
    <div className="min-h-[95vh] px-10 sm:px-0 md:my-32 my-28 flex flex-col justify-between items-center py-[2rem]">
      <div className="flex flex-col xl:flex-row justify-between items-center">
        <Carousel />
        <div className=" flex flex-col justify-center items-center ">
          <p className="text-lg hidden lg:flex lg:text-4xl pr-4 bg-blue-100 my-10 lg:my-8 h-[10rem] w-[15rem] lg:w-[20rem] text-center items-center justify-center px-5 rounded-lg">
            The Quality you should TRUST on
          </p>
          <p className="w-[70vw] xl:w-[20vw] my-10 lg:my-0 text-justify ">
           You might have gone through many handwritten or printed materials which don't contain the Quality content you need to study for. You might have faced the issue of lack of proper study material in your life till now, but that won't be the case anymore as Academia Stacks brings for you the best notes and best study material you might have ever seen. All our materials have been verified by subject experts you can also go through PYQs and Handouts which are directly submitted by extremely qualified and experienced professor. We can wait to see you understand your concepts as clear as a crystal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
