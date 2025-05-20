import React, { useContext, useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom'
import { allContext } from '../context/Context'
import { assets } from '../assets/assets'
import JobCard from "../components/Jobcard"
import Footer from "../components/Footer"
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
const WEBSITE_API_BASE_URL = import.meta.env.VITE_WEBSITE_API_BASE_URL


export default function ApplyJob() {


  const { id } = useParams()
  const { jobInfo, clerkUser, setClerkUser } = useContext(allContext)
  const [filteredjobs, setFilteredJobs] = useState([])
  const [applied, setapplied] = useState(true)
  const [load, setLoad] = useState(true)

  useEffect(() => {
    const filteredJobs = jobInfo.filter(items => items._id === id)
    setFilteredJobs(filteredJobs);
  }, [id, jobInfo])





  const applyJobFunction = () => {
    const { userName, userEmail } = clerkUser
    const { jobTitle, jobLocation, _id } = filteredjobs[0];
    const appliedUsersData = {
      userName, userEmail, jobTitle, jobLocation, _id
    }

    axios.post(`${WEBSITE_API_BASE_URL}/website/saveAppliedJobs`, appliedUsersData)
      .then((res) => {
        if (res.data.status) {
          setapplied(res.data.success)

          toast.success(`Successfully Applied ${jobTitle} Job`)
        } else {
          toast.success(`Already Applied for this Job`)
        }

      })

  }

  useEffect(() => {
  if (filteredjobs.length > 0 && clerkUser.userEmail) {
    const applicants = filteredjobs[0].jobApplicants || [];
    const alreadyApplied = applicants.some(
      (applicant) => applicant.userEmail === clerkUser.userEmail
    );
    setapplied(!alreadyApplied); // false means "already applied", so button shows "Applied"
    setLoad(true)
  }
}, [filteredjobs, clerkUser]);

  


  return (
    <div>

      
      

      {
        load ?
      <>
      <Navbar />
        <div>

          <div className='w-full py-5 px-5'>
            <div className='max-w-[1320px] mx-auto '>
              <Toaster />

              {

                filteredjobs.map((items, index) => {
                  return (
                    // info area
                    <div key={index}>
                      <div className='w-full py-15 px-10 border rounded-[10px] border-gray-600 bg-blue-50 grid grid-cols-[70%_auto] max-sm:grid-cols-1 ' >

                        <div className='flex max-lg:flex-col max-sm:items-center '>
                          <img src={items.adminImage} className='h-[100px] rounded border bg-white border-gray-600 p-5 max-lg:w-[100px]' alt="" />
                          <div className=' flex-col justify-center px-5 py-2 max-lg:flex'>
                            <h1 className='text-4xl font-semibold max-sm:text-xl max-sm:text-center'>{items.jobTitle}</h1>


                            <div className='flex gap-5 py-3 text-gray-600 text-center max-sm:flex-col max-sm:items-center'>
                              <div className='flex gap-1'>
                                <img src={assets.suitcase_icon} alt="" /> <p>{items.adminName}</p>
                              </div>
                              <div className='flex gap-1'>
                                <img src={assets.location_icon} alt="" /> <p>{items.jobLocation}</p>
                              </div>
                              <div className='flex gap-1' >
                                <img src={assets.person_icon} alt="" /> <p>{items.jobLevel}</p>
                              </div>
                              <div className='flex gap-1' >
                                <img src={assets.money_icon} alt="" /> <p>{(items.jobSalary / 1000)}k</p>
                              </div>

                            </div>
                          </div>

                        </div>


                        <div className='text-center flex items-center flex-col pt-4'>
                          <button className={`px-6 py-3 cursor-pointer bg-blue-600 border border-gray-300 rounded-[10px] text-white 
                              ${applied ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`} disabled={!applied}
                            onClick={() => applyJobFunction()}>{applied ? "Apply Now" : "Applied"}
                          </button>
                          <p className='text-gray-500 text-[15px] mt-5'>Posted {new Date(items.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}</p>
                        </div>

                      </div>
                      {/* description area */}
                      <div className=' max-w-[1320px] grid grid-cols-[70%_auto] mt-4 py-5 max-lg:grid-cols-1  '>
                        <div className='px-5'>
                          <h1 className='font-bold text-2xl mb-4'>Job description</h1>
                          <div className='rich-text mb-15' dangerouslySetInnerHTML={{ __html: items.jobDescription }}>
                          </div>
                          <button className={`px-6 py-3 cursor-pointer bg-blue-600 border border-gray-300 rounded-[10px] text-white 
                              ${applied ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`} disabled={!applied}
                            onClick={() => applyJobFunction()}>{applied ? "Apply Now" : "Applied"}
                          </button>
                        </div>



                        {/* Right side cards */}
                        <div className='flex flex-col max-lg:hidden'>
                          <h1 className='text-2xl font-semibold mb-5'>More Jobs from {items.adminName}</h1>
                          {
                            jobInfo.filter(jobs => jobs._id !== items._id && jobs.jobPostedAdmin === items.jobPostedAdmin).filter(jobs => true).slice(0, 3).map((job, index) => <JobCard key={index} job={job} />)
                          }

                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>
        <Footer />
      </>
      :
          <div className=' w-full h-screen flex justify-center items-center'>
          

          <div role="status" className='justify-center items-center' >
              <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>

          </div>
          }
    </div>
  )
}
