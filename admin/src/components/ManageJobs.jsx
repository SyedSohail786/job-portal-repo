import axios from 'axios';
import { useEffect, useState } from 'react'
const websitestaticPath = import.meta.env.VITE_WEBSITE_PATH;
const staticPath = import.meta.env.VITE_STATICPATH;
// import { toast, Flip } from 'react-toastify';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
export default function ManageJobs() {
     const [getJobData, setJobData] = useState([])

     const visibilityFunction = (id, currentVisibilty) => {
          const newVisibilty = !currentVisibilty

          axios.put(`${websitestaticPath}updateVisibilty/${id}`, { visible: newVisibilty })
               .then(() => {

                    newVisibilty ? toast.success("Job Enabled", {
                         icon: '✅',
                         style: {
                              padding: '10px',
                              color: '#237CD5',
                         },
                         iconTheme: {
                              primary: '#713200',
                              secondary: '#FFFAEE',
                         },
                    }) : toast.error("Job Disabled")



                    // Refresh job data
                    const loggedUser = { loggedEmail: Cookies.get("_sessionfastJob") };
                    axios.post(`${staticPath}view`, loggedUser)
                         .then((res) => {
                              setJobData(res.data.data);
                         });

               }).catch((err) => {
                    toast.error("Failed to update visibility");
                    console.error(err);
               });


     };

     //To show the logged admin jobs created data only
     useEffect(() => {
          const loggedUser = { loggedEmail: Cookies.get("_sessionfastJob") }
          axios.post(`${staticPath}view`, loggedUser)
               .then((res) => {
                    setJobData(res.data.data)
               })

     }, [])
     return (
          <div>
               <Toaster />
               <div className='overflow-x-auto mt-4'>
                    <table className='min-w-full text-sm border border-gray-300 shadow-sm rounded-md'>
                         <thead className='bg-gray-50'>
                              <tr className='bg-blue-100'>
                                   <th className='px-4 py-2 text-left'>No.</th>
                                   <th className='px-4 py-2 text-left'>Job Title</th>
                                   <th className='px-4 py-2 text-left'>Date</th>
                                   <th className='px-4 py-2 text-left'>Location</th>
                                   <th className='px-4 py-2 text-left  max-sm:hidden'>Applicants</th>
                                   <th className='px-4 py-2 text-left  max-sm:hidden'>Visible</th>
                              </tr>
                         </thead>
                         <tbody>


                              {
                                   getJobData.length >= 1 ?

                                        getJobData.map((items, index) => {

                                             return (
                                                  <tr key={index}>
                                                       <td className='px-4 py-2'>{index + 1}</td>
                                                       <td className='px-4 py-2'>{items.jobTitle}</td>
                                                       <td className='px-4 py-2'>{new Date(items.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                       })}</td>
                                                       <td className='px-4 py-2'>{items.jobLocation}</td>
                                                       <td className='px-4 py-2  max-sm:hidden'>{items.jobApplicants.length}</td>
                                                       <td className='px-4 py-2  max-sm:hidden'>
                                                            {items.jobVisible ? (
                                                                 <button className='py-2 px-3 bg-red-600 text-white rounded-lg hover:outline-red-800 hover:outline-2' onClick={() => visibilityFunction(items._id, items.jobVisible)}>Click to Disable</button>
                                                            ) : (
                                                                 <button className='py-2 px-3 bg-green-600 text-white rounded-lg hover:outline-green-800 hover:outline-2' onClick={() => visibilityFunction(items._id, items.jobVisible)}>Click to Enable</button>
                                                            )}
                                                       </td>
                                                  </tr>
                                             )
                                        })
                                        : <tr>
                                             <td className='px-4 py-2'>No jobs found</td>
                                        </tr>
                              }

                         </tbody>
                    </table>
               </div>
          </div>
     )
}
