import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import img1 from "../assets/hanoh.jpg"
const Home = () => {
  return (
    <div className="min-h-[86.2vh] flex items-center justify-center bg-red-800">
      <Carousel className="min-w-80 max-w-7xl " swipeable={true}>
        <div>
          <img src={img1} alt="mo"/>
          <p className="legend">Legend 1</p>
        </div>
        <div>
          <img src={img1} alt="mo"/>
          <p className="legend">Legend 2</p>
        </div>
        <div>
          <img src={img1} alt="mo"/>
          <p className="legend">Legend 3</p>
        </div>
      </Carousel>
    </div>
  );
};

export default Home;
