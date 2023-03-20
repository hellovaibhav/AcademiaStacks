import React from 'react'
import {motion} from "framer-motion"
import {useNavigate} from "react-router-dom"
const Material = () => {
  const navigate =useNavigate();
  return (
    <div className="min-h-[100vh] flex items-center justify-center ">
      <motion.button className='bg-red-400 m-10 p-2 rounded-xl h-80 w-96' onClick={()=>{navigate('pyq')}}
      whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
      >
      <img src="" alt="something" className='h-[80%]'/>
      <p>Previous Year Question Papers</p>
      </motion.button>
      <motion.button className='bg-red-400 m-10 p-2 rounded-xl h-80 w-96' onClick={()=>{navigate('assignment')}}
      whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
      >
      <img src="" alt="something" className='h-[80%]'/>
      <p>Assignments</p>
      </motion.button>
      <motion.button className='bg-red-400 m-10 p-2 rounded-xl h-80 w-96' onClick={()=>{navigate('notes')}}
      whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
      >
      <img src="" alt="something" className='h-[80%]'/>
      <p>Notes</p>
      </motion.button>
    </div>
  )
}

export default Material