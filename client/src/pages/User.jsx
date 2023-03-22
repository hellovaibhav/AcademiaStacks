import React from "react";
import { useNavigate } from "react-router-dom";

const User = () => {
 
  const Navigate = useNavigate()

  return (
    <div className="mt-32 min-h-[85vh] flex flex-col items-center justify-center text-center">
      <p className="m-2 p-2">
        Name : {JSON.parse(localStorage.getItem("user")).name}
      </p>
      <p className="m-2 p-2">
        Branch : {JSON.parse(localStorage.getItem("user")).branch}
      </p>
      <p className="m-2 p-2">
        Email : {JSON.parse(localStorage.getItem("user")).email}
      </p>
      <p
        className="pr-5 bg-rose-200 cursor-pointer text-red-600 hover:bg-red-600 duration-500 font-bold hover:text-white  md:ml-8 mx-4 text-3xl md:my-0 my-7 px-5 py-2 rounded-xl "
        onClick={() => {
          localStorage.clear();
          window.location.reload(false);
          Navigate("/");
          
        }}
      >
        Logout
      </p>
    </div>
  );
};

export default User;
