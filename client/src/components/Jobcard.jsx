import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

export default function Jobcard({ job }) {
     const navigate = useNavigate()


     return (
          <motion.div className='border border-gray-400 pt-5 px-5 mb-5 rounded-[15px] shadow-lg ' whileHover={{ scale:0.97 }}>
               <div>
                    <img src={job.adminImage} alt="" className='w-10 h-10' />
               </div>
               <h4 className='my-2 font-bold'>{job.jobTitle}</h4>
               <div>
                    <span className='inline-flex m-1 items-center gap-2.5 bg-red-50 border border-red-500 px-2 py-1.5 my-2 rounded'>{job.jobLocation}</span>
                    <span className='inline-flex m-1 items-center gap-2.5 border border-blue-500 bg-blue-50 px-2 py-1.5 my-2 rounded'>{job.jobLevel}</span>
               </div>
               <p dangerouslySetInnerHTML={{ __html: job.jobDescription.slice(0, 250) }} className='text-gray-500 my-3'></p>
               <div className='py-5 flex justify-center gap-3 flex-wrap'>
                    <button
                         onClick={() => navigate(`/apply-jobs/${job._id}`)}
                         className='rounded-[10px] bg-blue-600 text-white px-4 py-2 cursor-pointer'>
                         Apply Now
                    </button>
                    <button onClick={() => navigate(`/apply-jobs/${job._id}`)} className='rounded-[10px] border border-gray-400 px-4 py-2 text-gray-700 cursor-pointer'>
                         Learn More
                    </button>
               </div>

          </motion.div>
     )
}
