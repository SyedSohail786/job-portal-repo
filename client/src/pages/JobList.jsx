import React, { useContext, useEffect, useState } from 'react'
import { allContext } from '../context/Context'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import Jobcard from '../components/Jobcard'
import axios from 'axios'

export default function JobList() {
     const { isSearched, searchValue, setSearchValue, jobsData } = useContext(allContext)
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
          </div>
     )
}
