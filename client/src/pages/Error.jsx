import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center ">
    <span className='text-4xl'>Error <span className='text-6xl'>|</span> Please Go Back</span>
    <Link to="/" className='bg-blue-400 p-4 px-6 my-8 hover:bg-blue-700 hover:text-white duration-300'>Back</Link>
    </div>
  )
}

export default Error