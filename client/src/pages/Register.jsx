import React from 'react'
import { Link } from 'react-router-dom'
const Register = () => {
  return (
    <div className="min-h-[86.2vh] flex items-center justify-center ">
      <div className="bg-gray-800 flex flex-col justify-around w-[24rem] h-[28rem] py-10">
        <h1 className="text-4xl font-bold text-center h-[20vh] pt-4 text-white">
          Register
        </h1>
        <form
          action=""
          method="get"
          className="flex flex-col justify-evenly h-[80vh] px-10"
        >
         
          <input
            type="text"
            placeholder="Name"
            className="min-h-[2rem] rounded p-2"
          />
          <input
          type="text"
          placeholder="Username"
          className="min-h-[2rem] rounded p-2"
        />
          <input
            type="password"
            name=""
            placeholder="Password"
            id=""
            className="min-h-[2rem] rounded p-2"
          />
          <Link to="/login" className="text-blue-600 text-sm">Already have an Account</Link>
          <div className="flex justify-center items-center">
            <button type="submit" className="bg-red-100 h-10 w-20 hover:bg-red-400 ease-in-out duration-100">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register