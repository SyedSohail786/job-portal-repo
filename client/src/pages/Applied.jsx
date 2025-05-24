import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from "../components/Footer"
import { allContext } from '../context/Context'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
const WEBSITE_API_BASE_URL = import.meta.env.VITE_WEBSITE_API_BASE_URL

export default function Applied() {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const { clerkUser, setClerkUser } = useContext(allContext);
  const [gotResume, setGotResume]= useState("")
  const [jobsApplied, setJobApplied]=useState([])
  const resumeSubmit = (e) => {
    e.preventDefault();


    //adding all users details in form data
    const resumeData = new FormData();
    resumeData.append("userResume", resume);
    resumeData.append("userName", clerkUser.userName);
    resumeData.append("profilePic", clerkUser.profilePic);
    resumeData.append("userEmail", clerkUser.userEmail);
    resumeData.append("_id", clerkUser._id);



    //checking if resume is selected or not
    if (resume) {
      setClerkUser({ ...clerkUser, userResume: resume.name })
      setIsEdit(false);


      axios.post(`${WEBSITE_API_BASE_URL}/website/saveResume`, resumeData)
        .then((res) => {
          res.data.status ? toast.success("Resume Uploaded Successfully") : toast.error("Internal Server Error")
        })




    } else {
      toast.error("Please Select Resume")
    }

  };


  useEffect(() => {
    const userEmail= clerkUser.userEmail
    axios.post(`${WEBSITE_API_BASE_URL}/website/getResume`,{userEmail})
    .then((res)=>setGotResume(res.data.resumeName))

    axios.post(`${WEBSITE_API_BASE_URL}/website/appliedJobs`,{userEmail})
    .then((res)=>setJobApplied(res.data))

  }, [])
    
  return (
    <>
    <div>
      <Toaster />
      <Navbar />
      <div className='max-w-[1320px] mx-auto  mt-5 py-5 px-2 min-h-[65vh] 2xl:px-20  '>
        <h1 className='text-lg font-semibold '>Your Resume</h1>
        <div className='flex gap-2 mb-6 mt-3 w-full'>

          {
            isEdit ?
              <>
                <form onSubmit={resumeSubmit} className='w-full flex gap-2'>
                  <label className='flex items-center max-sm:text-[12px]' htmlFor="resumeUpload">
                    {
                      gotResume? 
                      <p className='bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2'>
                            {gotResume}
                      </p>: <p className='bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2'>
                      {
                        resume ? resume.name : "Select Resume"
                      }
                    </p>
                    }
                    
                    
                    <input type="file" className='text-sm' id='resumeUpload' hidden accept='application/pdf' onChange={e => setResume(e.target.files[0])} />
                  </label>


                  <button className='border border-green-400 bg-green-100 rounded-lg px-4 py-2 max-sm:text-[12px]' type='submit'>
                    Save
                  </button>


                </form>

              </>
              :
              <div className='flex gap-2'>
                <a className='bg-blue-100 text-blue-600 px-3 rounded py-3 text-sm'>{gotResume? "Resume Already Submitted": "Submit Resume"}</a>
                <button className='border border-gray-400 px-3 py-3 rounded font-semibold text-sm' onClick={() => setIsEdit(true)}>Edit</button>
              </div>
          }

        </div>
        <div>
          <h2 className='text-sm font-semibold my-3 '>Job Applied</h2>
          <table className='border border-gray-300 min-w-full rounded-lg bg-white text-sm' >
            <thead>
              <tr>
                <th className='px-3 py-3 border-b max-sm:px-1 border-gray-300 text-left'>Company</th>
                <th className='px-3 py-3 border-b max-sm:px-1 border-gray-300 text-left'>Job Title</th>
                <th className='px-3 py-3 border-b max-sm:px-1 border-gray-300 text-left max-sm:hidden'>Location</th>
                <th className='px-3 py-3 border-b max-sm:px-1 border-gray-300 text-left max-sm:hidden'>Date</th>
                <th className='px-3 py-3 border-b max-sm:px-1 border-gray-300 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                jobsApplied.map((items, index) => true ? (
                  <tr className='px-4 py-3 border-b border-gray-300 text-left' key={index}>
                    <td className='flex items-center py-5 gap-2 text-left px-5 max-sm:px-1 '>
                      <img src={items.adminImage} alt="" className='w-6 h-6' />
                      {items.adminName}
                    </td>
                    <td className='px-4 py-2' >{items.jobTitle} </td>
                    <td className='px-4 py-2 max-sm:hidden'>{items.jobLocation}</td>
                    <td className='px-4 py-2 max-sm:hidden'>
                      {moment(items.date).format("ll")}
                    </td>
                    <td className='px-4 py-2 max-sm:px-1'>
                      <span className={` py-2 rounded ${items.action === 1 ? " bg-green-200 text-green-900 px-2" : items.action === 0 ? " bg-red-300 text-red-900 px-2" : "bg-blue-300 text-blue-900 px-3"}`}>
                        {items.action===1? "Accepted": items.action===0?"Rejected": "Pending"}
                      </span>

                    </td>
                  </tr>
                ) : (null))
              }
            </tbody>
          </table>
        </div>
         
      </div>
    <Footer />
    </div>
     
</>
  )
}
