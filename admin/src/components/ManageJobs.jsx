import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
const websitestaticPath = import.meta.env.VITE_WEBSITE_PATH;
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { allContext } from '../context/Context';



export default function ManageJobs() {
     const { getJobData, setJobData } = useContext(allContext)
     const [loader, setLoader] = useState(false)
     const visibilityFunction = (id, currentVisibilty) => {
          const newVisibilty = !currentVisibilty
          const token = localStorage.getItem("token");
          axios.put(`${websitestaticPath}updateVisibilty/${id}`, { visible: newVisibilty },
               {
                    headers: { Authorization: `Bearer ${token}` }
               }
          )
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
                    axios.post(`${staticAdminPath}view`, loggedUser,
                         {
                              headers: { Authorization: `Bearer ${token}` }
                         }
                    )
                         .then((res) => {
                              setJobData(res.data.data);
                              setLoader(true);
                         });

               }).catch((err) => {
                    toast.error("Failed to update visibility");
                    console.error(err);
               });


     };

     const DeleteJob=(_id)=>{
          axios.delete(`${staticAdminPath}deleteJob/${_id}`)
          .then((res)=>{
               if(res.data.status){
                    Refresh()
                    toast.success("Job Deleted Succesfully")
               }else{
                    toast.error("Something Went Wrong")
               }
          })
     }
     //To show the logged admin jobs created data only
     useEffect(() => {
          const token = localStorage.getItem("token");
          const loggedUser = { loggedEmail: Cookies.get("_sessionfastJob") }
          axios.post(`${staticAdminPath}view`,
               loggedUser,
               {
                    headers: { Authorization: `Bearer ${token}` }
               })
               .then((res) => {
                    setJobData(res.data.data);
                    setLoader(true);
               })
     }, [])

     const Refresh=()=>{
          const token = localStorage.getItem("token");
          const loggedUser = { loggedEmail: Cookies.get("_sessionfastJob") }
          axios.post(`${staticAdminPath}view`,
               loggedUser,
               {
                    headers: { Authorization: `Bearer ${token}` }
               })
               .then((res) => {
                    setJobData(res.data.data);
                    setLoader(true);
               })
     }

     return (

          <div>
               <Toaster />

               {
                    loader ?

                         <div className='overflow-x-auto mt-4'>
                              <table className='min-w-full text-sm border border-gray-300 shadow-sm rounded-md'>
                                   <thead className='bg-gray-50'>
                                        <tr className='bg-blue-100'>
                                             <th className='px-4 py-2 text-left'>No.</th>
                                             <th className='px-4 py-2 text-left'>Job Title</th>
                                             <th className='px-4 py-2 text-left'>Date</th>
                                             <th className='px-4 py-2 text-left'>Location</th>
                                             <th className='px-4 py-2 text-left  max-sm:hidden'>Applicants</th>
                                             <th className='px-4 py-2 text-left  max-sm:hidden'>Visibility</th>
                                             <th className='px-4 py-2 text-left  max-sm:hidden'>Action</th>
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
                                                                 <td className='px-4 py-2 font-bold text-rose-700 cursor-pointer max-sm:hidden' onClick={()=>DeleteJob(items._id)}>Delete</td>
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
                         : <>
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
          </div>
     )
}
