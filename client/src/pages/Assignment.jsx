import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import img from "../assets/pic1.png";
// import MaterialPage from "../assets/MaterialPageContent";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { BiUpvote } from "react-icons/bi";
import Cookies from "js-cookie";

const Notes = () => {
  const [index, setIndex] = useState(7);
  const [data, setData] = useState([]);
  const showMore = () => {
    if (index < data.length - 1) {
      if (index + 4 > data.length - 1) {
        setIndex(data.length);
      } else {
        setIndex(index + 4);
      }
      setIndex(index + 4);
    }
  };

  const [loading, setLoading] = useState(false);
  const fetchNotes = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
    const { data } = await axios.get(process.env.REACT_APP_ASSIGNMENT);
    setData(data);
  };
  useEffect(() => {
    fetchNotes();
  }, [data]);

  const [countUp, setCountUp] = useState(0);
  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    featured: false,
  });
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <>
      {
        <div className="min-h-[100vh] bg-[#F3EFE0] flex items-center justify-center pt-[5rem] md:pt-24 pl-[15%] sm:pl-[25%] lg:pl-[25rem] md:pl-[20%] xl:pl-[30rem]  ">
          <div className="leftFilter fixed top-[15vh] left-14 hidden md:block w-[20vw]">
            <div className="flex text-white h-80 flex-col flex-wrap items-center py-2 justify-center rounded-xl px-4 xl:px-10 2xl:px-20 lg:px-6 bg-[rgb(34,163,159,0.4)]">
              <p className="text-3xl font-bold m-2">Filters</p>
              <div>
                <label className="font-semibold text-right">Semester :</label>
                <select
                  className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-right">Featured :</label>
                <select
                  className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                  name="featured"
                  value={filters.featured}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="true">Featured</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-right">Branch :</label>
                <select
                  className="h-12 border-2 p-1 border-[#feffff] bg-[rgb(34,158,154,0.4)] md:w-32 lg:w-40 m-1"
                  name="branch"
                  value={filters.branch}
                  onChange={handleFilterChange}
                >
                  <option value="">All Branches</option>
                  <option value="ECE">ECE</option>
                  <option value="CSE">CSE</option>
                </select>
              </div>
            </div>
          </div>
          <button className="flex items-center justify-evenly md:hidden fixed top-24 h-14 md:top-16 left-0 w-[100vw] bg-[#F3EFE0] drop-shadow-md z-40">
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-28 sm:w-32 mx-1"
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
              >
                <option value="">All Sem</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
              </select>
            </div>
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-[5.7rem] sm:w-32 mx-1"
                name="featured"
                value={filters.featured}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Featured</option>
              </select>
            </div>
            <div>
              <select
                className="h-10 text-sm border-2 px-1 border-[#22A39F] bg-[rgb(34,163,159,0.5)] w-24 sm:w-32 mx-1"
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
              >
                <option value="">All Branch</option>
                <option value="ECE">ECE</option>
                <option value="CSE">CSE</option>
              </select>
            </div>
          </button>

          <div className="flex max-w-[80vw] flex-col items-center justify-center md:ml-[10vw] pb-10">
            <div className="rightContent  flex flex-wrap mt-14 lg:mt-0">
              {filters.branch === "" &&
              filters.semester === "" &&
              filters.instructorName === ""
                ? data.slice(0, index + 1).map((material, ind) => (
                    <motion.div
                      key={material._id}
                      className="parent flex flex-col h-auto  w-[50vw] md:w-72 bg-[#22A39F] m-8 rounded-xl drop-shadow-md :hover-hidden"
                      // whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                      // initial={{ y: 150, opacity: 0 }}
                      // animate={{ y: 0, opacity: 1 }}
                      // transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Link to={material.materialLink} target="_blank">
                        <img
                          src={material.thumbnail}
                          alt="Not available"
                          className="h-[12rem] w-auto"
                          onMouseEnter={() => setHoveredIndex(ind)}
                          onMouseLeave={() => setHoveredIndex(-1)}
                        />
                        {hoveredIndex === ind && material.desc && (
                          <motion.div
                            className="absolute bg-white text-black drop-shadow-md border-x-4 border-b-4 border-[#22a39f99] p-4  h-[144px] rounded-b-2xl bottom-0 left-0 right-0"
                            initial={{ x: -90, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.8 }}
                          >
                            <p className="text-lg font-bold">{material.desc}</p>
                          </motion.div>
                        )}
                      </Link>
                      <div className="descriptionChild text-white p-2 flex flex-col justify-center items-center text-center">
                        <p className=" text-lg ">
                          {" "}
                          {material.subject}{" "}
                          <span className="font-semibold text-lg">
                            {" "}
                            {material.instructorName}{" "}
                          </span>
                        </p>
                        <p>
                          by{" "}
                          <span className="font-semibold text-lg">
                            {" "}
                            {material.author}{" "}
                          </span>{" "}
                          in {material.yearOfWriting}
                        </p>
                      </div>
                      <div className="h-10 flex text-center justify-center items-center cursor-pointer">
                        <p
                          onClick={async () => {
                            console.log();
                            let email = Cookies.get("email");
                            let materialId = material._id;
                            try {
                              const res = await axios.post(
                                process.env.REACT_APP_UPVOTE,
                                { materialId, email }
                              );
                            } catch (err) {
                              alert("Error Posting Vote");
                            }
                            if (material.upvotes.length === 1) {
                              setCountUp(countUp - 1);
                            } else {
                              setCountUp(countUp + 1);
                            }
                          }}
                          className="flex items-center justify-center "
                        >
                          <BiUpvote
                            className={`h-6 w-6 m-1 text-white ${
                              material.upvotes[material.upvotes.length - 1] ===
                              Cookies.get("email")
                                ? " bg-rose-500  rounded-full"
                                : "  bg-gray-300 text-black rounded-full "
                            }`}
                          />{" "}
                          <span className="text-xl">
                            {" "}
                            {material.upvotes.length <= 0
                              ? "0"
                              : material.upvotes.length}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  ))
                : data
                    .slice(0, index + 1)
                    .filter(
                      (item) =>
                        (filters.semester
                          ? Number(item.semester) === Number(filters.semester)
                          : true) &&
                        (filters.branch
                          ? item.branch.find((e) => e === filters.branch)
                          : true) &&
                        (filters.featured
                          ? item.featured === (filters.featured === "true")
                          : true)
                    )
                    .map((material, ind) => (
                      <motion.div
                        key={material._id}
                        className="parent flex flex-col h-auto  w-[50vw] md:w-72 bg-[rgb(34,163,159,0.3)] m-8 rounded-xl drop-shadow-md :hover-hidden"
                        // whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                        // initial={{ y: 150, opacity: 0 }}
                        // animate={{ y: 0, opacity: 1 }}
                        // transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <Link to={material.materialLink} target="_blank">
                          <img
                            src={material.thumbnail}
                            alt="Not available"
                            className="h-[12rem] w-auto"
                            onMouseEnter={() => setHoveredIndex(ind)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                          />
                          {hoveredIndex === ind && material.desc && (
                            <motion.div
                              className="absolute bg-white text-black drop-shadow-md border-x-4 border-b-4 border-[#22a39f99] h-[144px] rounded-b-2xl  p-4 top-bottom left-0 right-0"
                              initial={{ x: -90, opacity: 0 }}
                              animate={{ x: 0, opacity: 0.8 }}
                            >
                              <p className="text-lg font-bold">
                                {material.desc}
                              </p>
                            </motion.div>
                          )}
                        </Link>
                        <div className="descriptionChild text-white p-2 flex flex-col justify-center items-center text-center">
                          <p className=" text-lg ">
                            {" "}
                            {material.subject}{" "}
                            <span className="font-semibold text-lg">
                              {" "}
                              {material.instructorName}{" "}
                            </span>
                          </p>
                          <p>
                            by{" "}
                            <span className="font-semibold text-lg">
                              {" "}
                              {material.author}{" "}
                            </span>{" "}
                            in {material.yearOfWriting}
                          </p>
                        </div>
                        <div className="h-10 flex text-center justify-center items-center cursor-pointer">
                          <p
                            onClick={async () => {
                              console.log();
                              let email = Cookies.get("email");
                              let materialId = material._id;
                              try {
                                const res = await axios.post(
                                  process.env.REACT_APP_UPVOTE,
                                  { materialId, email }
                                );
                              } catch (err) {
                                alert("Error Posting Vote");
                              }
                              if (material.upvotes.length === 1) {
                                setCountUp(countUp - 1);
                              } else {
                                setCountUp(countUp + 1);
                              }
                            }}
                            className="flex items-center justify-center "
                          >
                            <BiUpvote
                              className={`h-6 w-6 m-1 text-white ${
                                material.upvotes[
                                  material.upvotes.length - 1
                                ] === Cookies.get("email")
                                  ? " bg-rose-500  rounded-full"
                                  : "  bg-gray-300 text-black rounded-full "
                              }`}
                            />{" "}
                            <span className="text-xl">
                              {" "}
                              {material.upvotes.length <= 0
                                ? "0"
                                : material.upvotes.length}
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
            </div>
            {index < data.length - 1 ? (
              <motion.button
                whileTap={{ scale: 0.7, transition: { duration: 0.1 } }}
                onClick={showMore}
                className="h-auto sm:h-10 bg-blue-400 p-2 rounded-lg drop-shadow-md hover:bg-blue-200 mb-4 mr-[25%] xl:mr-[10%] 2xl:mr-10 "
              >
                Show More
              </motion.button>
            ) : (
              <motion.button
                whileTap={{
                  x: [0, 10, 0, -10, 0],
                  backgroundColor: "#ff3333",
                  color: "white",
                  transition: { duration: 0.1 },
                }}
                onClick={null}
                className="h-auto sm:h-10 w-40 bg-rose-400 p-2 rounded-lg drop-shadow-md  mb-4 mr-[25%] xl:mr-[10%] 2xl:mr-10 "
              >
                Soon...
              </motion.button>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default Notes;
