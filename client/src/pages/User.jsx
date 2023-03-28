import React from "react";
import { useNavigate } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
const User = () => {
  const Navigate = useNavigate();

  return (
    <div className="pt-36 bg-[#F3EFE0] min-h-[90vh] flex flex-col items-center justify-center text-cente">
      <HiUserCircle className="h-44 w-60 text-sky-400" />
      <p className="m-2 p-2 text-center">
        <span className="font-semibold text-xl">Name</span>:{" "}
        {JSON.parse(localStorage.getItem("user")).name}
      </p>
      <p className="m-2 p-2 text-center">
        <span className="font-semibold text-xl">Branch</span>:{" "}
        {JSON.parse(localStorage.getItem("user")).branch}
      </p>
      <p className="m-2 p-2 text-center">
        <span className="font-semibold text-xl">Email</span> :{" "}
        {JSON.parse(localStorage.getItem("user")).email}
      </p>
      <p
        className="pr-5 bg-rose-200 cursor-pointer text-red-600 hover:bg-red-600 duration-500 font-bold hover:text-white md:ml-8 mx-4 text-3xl md:my-5 my-7 px-5 py-2 rounded-xl "
        onClick={() => {
          localStorage.clear();
          window.location.reload(false);
          Navigate("/login");
        }}
      >
        Logout
      </p>
    </div>
  );
};

export default User;
