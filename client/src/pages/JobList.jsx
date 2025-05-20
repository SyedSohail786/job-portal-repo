import React, { useContext, useEffect, useState } from 'react'
import { allContext } from '../context/Context'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import Jobcard from '../components/Jobcard'

export default function JobList() {
     const { isSearched, searchValue, setSearchValue, jobsData, fetchJobs } = useContext(allContext)
     const [show, setShow] = useState(false)
     const [currentPage, setCurrentPage] = useState(1)
     const [selectedJob, setSelectedJob] = useState([])
     const [selectedLocation, setSelectedLocation] = useState([])
     const [filteredJobs, setFilteredJobs] = useState(jobsData)






     const handleJobsChange = (category) => {
          setSelectedJob(
               prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
          )
     }
     const handleLocationChange = (location) => {
          setSelectedLocation(
               prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
          )
     }
     useEffect(() => {
          fetchJobs()
          const interval = setInterval(fetchJobs, 60000) // refresh every 60 seconds and fetch job data from api
          return () => clearInterval(interval)
     }, [])

     useEffect(() => {
          const matchesCategory = job => selectedJob.length === 0 || selectedJob.includes(job.category)
          const matchesLocation = job => selectedLocation.length === 0 || selectedLocation.includes(job.location)
          const matchesTitle = job => searchValue.title === "" || job.title.toLowerCase().includes(searchValue.title.toLowerCase())
          const matchesSearchLocation = job => searchValue.location === "" || job.location.toLowerCase().includes(searchValue.location.toLowerCase())

          const newFilteredJobs = jobsData.slice().reverse().filter(
               job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
          )
          setFilteredJobs(newFilteredJobs)
          setCurrentPage(1)
     }, [jobsData, selectedJob, selectedLocation, searchValue])

     return (
          <div className='container flex flex-col mx-auto 2xl:px-20 lg:flex-row'>
               <div className='w-full lg:w-1/4 bg-white px-4'>
                    {/* Search filter */}
                    {
                         isSearched && (searchValue.title !== "" || searchValue.location !== "") && (
                              <>
                                   <h3 className='text-lg mb-4 font-medium'>Current Search</h3>
                                   <div className='mb-4 text-gray-600'>
                                        {
                                             searchValue.title && (
                                                  <span className='inline-flex items-center gap-2.5 border border-blue-500 bg-blue-50 px-4 py-1.5 rounded'>
                                                       {searchValue.title}
                                                       <img onClick={e => setSearchValue(prev => ({ ...prev, title: '' }))} src={assets.cross_icon} className='cursor-pointer' alt="" />
                                                  </span>
                                             )

                                        }
                                        {
                                             searchValue.location && (
                                                  <span className='inline-flex ml-2 items-center gap-2.5 bg-red-50 border border-red-500 px-4 py-1.5 rounded'>
                                                       {searchValue.location}
                                                       <img onClick={e => setSearchValue(prev => ({ ...prev, location: '' }))} src={assets.cross_icon} className='cursor-pointer' alt="" />
                                                  </span>
                                             )

                                        }
                                   </div>
                              </>
                         )
                    }
                    <button className='px-4 py-2 rounded bg-blue-600 border lg:hidden border-gray-600 text-white' onClick={() => setShow(!show)}>
                         {show ? "Close" : "Filter"}
                    </button>
                    {/* Job filter */}
                    <div className={show ? "" : "max-lg:hidden"}>
                         <h1 className='font-medium text-lg py-4 px-2'>Search by Categories</h1>
                         <ul className=' space-y-2 text-gray-600 px-2'>
                              {
                                   JobCategories.map((items, index) => {
                                        return (
                                             <li key={index} className='flex gap-3 items-center'>
                                                  <input className='scale-125' type="checkbox" onChange={() => handleJobsChange(items)}
                                                       checked={selectedJob.includes(items)}
                                                  />
                                                  {items}
                                             </li>
                                        )
                                   })
                              }
                         </ul>

                    </div>
                    {/* Location  filter */}
                    <div className={show ? "" : "max-lg:hidden"}>
                         <h1 className='font-medium text-lg py-4 pt-14 px-2'>Search by Location</h1>
                         <ul className=' space-y-2 text-gray-600 px-2'>
                              {
                                   JobLocations.map((items, index) => {
                                        return (
                                             <li key={index} className='flex gap-3 items-center'>
                                                  <input className='scale-125' type="checkbox" onChange={() => handleLocationChange(items)}
                                                       checked={selectedLocation.includes(items)} />
                                                  {items}
                                             </li>
                                        )
                                   })
                              }
                         </ul>

                    </div>
               </div>
               {/* Job listing section */}
               {
                    filteredJobs.length > 0 ?

                         <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4 '>
                              {
                                   filteredJobs.length > 0 ?
                                        <>
                                             <h3 className='font-medium text-3xl py-2 ' id='job-list'>Latest Jobs</h3>
                                             <p className='mb-8 '>Get your desired job from top companies</p>
                                             <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                                                  {
                                                       filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => {
                                                            return (
                                                                 <Jobcard job={job} key={index} />
                                                            )
                                                       })
                                                  }
                                             </div>

                                             {/* Pagination */}
                                             {
                                                  filteredJobs.length > 0 && (
                                                       <div className='flex items-center justify-center space-x-2 mt-10'>
                                                            <a href="#job-list">
                                                                 <img
                                                                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                      src={assets.left_arrow_icon}
                                                                      alt=""
                                                                 />
                                                            </a>
                                                            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                                                                 <a href='#job-list' key={index}>
                                                                      <button
                                                                           onClick={() => setCurrentPage(index + 1)}
                                                                           className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded cursor-pointer ${currentPage === index + 1 ? "bg-blue-200" : "text-gray-500"}`}
                                                                      >
                                                                           {index + 1}
                                                                      </button>
                                                                 </a>
                                                            ))}
                                                            <a href="#job-list">
                                                                 <img
                                                                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredJobs.length / 6)))}
                                                                      src={assets.right_arrow_icon}
                                                                      alt=""
                                                                 />
                                                            </a>
                                                       </div>
                                                  )
                                             }

                                        </> :
                                        <div className="flex flex-col items-center justify-center text-center h-full py-16  rounded-lg ">
                                             <img
                                                  src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                                                  alt="No Jobs"
                                                  className="w-24 h-24 mb-4 opacity-70"
                                             />
                                             <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                                  No Jobs Available
                                             </h2>
                                             <p className="text-gray-500">
                                                  We couldn't find any jobs at the moment. Please check back later.
                                             </p>
                                        </div>
                              }



                         </section>
                         : <>

                              <div className=' w-full h-screen flex justify-center items-center'>

                              <div  className='mr-4'>Fast Job</div>
                                   <div role="status" className='justify-center items-center' >
                                        <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                             <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span class="sr-only">Loading...</span>
                                   </div>

                              </div>
                         </>
               }
          </div>
     )
}
