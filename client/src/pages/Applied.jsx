import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from "../components/Footer"
import { allContext } from '../context/Context'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
const WEBSITE_API_BASE_URL = import.meta.env.VITE_WEBSITE_API_BASE_URL
import Cookies from 'js-cookie';

export default function Applied() {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const { clerkUser, setClerkUser, setGotResume, gotResume } = useContext(allContext);
  const [jobsApplied, setJobApplied] = useState([])


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
    const userEmail = localStorage.getItem("_sessionEmail")
    console.log(userEmail)
    if (userEmail) {
      axios.post(`${WEBSITE_API_BASE_URL}/website/getResume`, { userEmail })
        .then((res) => setGotResume(res.data.resumeName))

      axios.post(`${WEBSITE_API_BASE_URL}/website/appliedJobs`, { userEmail })
        .then((res) => setJobApplied(res.data))
    }


  }, [])

  return (
    <>
      <div>
        <Toaster />
        <Navbar />

        {
          jobsApplied.length > 0 ?

            <div className='max-w-[1320px] mx-auto  mt-5 py-5 px-2 min-h-[72vh] 2xl:px-20  '>
              <h1 className='text-lg font-semibold '>Your Resume</h1>
              <div className='flex gap-2 mb-6 mt-3 w-full'>

                {
                  isEdit ?
                    <>
                      <form onSubmit={resumeSubmit} className='w-full flex gap-2'>
                        <label className='flex items-center max-sm:text-[12px]' htmlFor="resumeUpload">
                          {
                            gotResume ?
                              <p className='bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2'>
                                {gotResume}
                              </p> : <p className='bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mr-2'>
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
                      <a className='bg-blue-100 text-blue-600 px-3 rounded py-3 text-sm'>{gotResume ? "Resume Already Submitted" : "Submit Resume"}</a>
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
                              {items.action === 1 ? "Accepted" : items.action === 0 ? "Rejected" : "Pending"}
                            </span>

                          </td>
                        </tr>
                      ) : (null))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            :

            <>
              <div className=' w-full h-screen flex justify-center items-center'>

                <div className='mr-4'>Fast Job</div>
                <div role="status" className='justify-center items-center' >
                  <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>

              </div>

            </>

        }


        <Footer />
      </div>

    </>
  )
}
