import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { allContext } from "../context/Context";
const staticB = import.meta.env.VITE_STATIC_PATH
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;
const staticPath = import.meta.env.VITE_STATIC_PATH;

export default function Applicants() {
     const { userRegisterData } = useContext(allContext);
     const [applicants, setApplicants] = useState([]);
     const [loader, setLoader] = useState(false);
     const token = localStorage.getItem("token");

     useEffect(() => {
          axios.post(`${staticAdminPath}getApplicants`, userRegisterData,{
                    headers: { Authorization: `Bearer ${token}` }
               })
               .then((res) => {
                    setApplicants(res.data.applicants);
                    setLoader(true);
               });
     }, []);

     const handleAction = async (jobId, userEmail, action, index) => {
          console.log(applicants)
          console.log(userRegisterData)
          try {
               await axios.post(`${staticAdminPath}updateApplicantAction`, {
                    jobId,
                    userEmail,
                    action,
                    adminEmail:userRegisterData.uemail
               });

               const updated = [...applicants];
               updated[index].action = action;
               setApplicants(updated);
          } catch (err) {
               console.error("Action failed:", err);
          }
     };

     // useEffect(() => {
     //           const token = localStorage.getItem("token");
     //           if (token) {
     //                fetch(`${staticB}api/verify`, {
     //                     headers: { Authorization: `Bearer ${token}` }
     //                }).then((res) => console.log(res));
     //           }
     //      }, []);

     return (
          <div>
               {
                    loader ? (
                         <div className='overflow-x-auto mt-4'>
                              <table className='min-w-full text-sm border border-gray-300 shadow-sm rounded-md'>
                                   <thead className='bg-gray-50'>
                                        <tr className='bg-blue-100'>
                                             <th className='px-4 py-2 text-left'>No.</th>
                                             <th className='px-4 py-2 text-left'>User name</th>
                                             <th className='px-4 py-2 text-left'>Job Title</th>
                                             <th className='px-4 py-2 text-left'>Location</th>
                                             <th className='px-4 py-2 text-left max-sm:hidden'>Resume</th>
                                             <th className='px-4 py-2 text-left max-sm:hidden'>Status</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {
                                             applicants.length > 0 ? applicants.map((items, index) => (
                                                  <tr key={index}>
                                                       <td className='px-4 py-5'>{index + 1}</td>
                                                       <td className='px-4 py-2'>{items.userName}</td>
                                                       <td className='px-4 py-2'>{items.jobTitle}</td>
                                                       <td className='px-4 py-2'>{items.jobLocation}</td>
                                                       <td className='px-4 py-2 max-sm:hidden'>
                                                            <div className='flex items-center gap-2 cursor-pointer' onClick={() => {
                                                                 window.open(`${staticPath}uploads/resume/${items.resume}`, "_blank");
                                                            }}>
                                                                 <span>Download</span>
                                                                 <FaDownload className='text-sm' />
                                                            </div>
                                                       </td>
                                                       <td className='px-4 py-2 max-sm:hidden'>
                                                            {
                                                                 items.action === 1 ? <span className="text-green-600 font-semibold">Accepted</span> :
                                                                      items.action === 0 ? <span className="text-red-600 font-semibold">Rejected</span> :
                                                                           <div className='flex items-center gap-2'>
                                                                                <button
                                                                                     onClick={() => handleAction(items.jobId, items.userEmail, 1, index)}
                                                                                     className='text-green-600 hover:text-blue-800 font-medium'
                                                                                >
                                                                                     Accept
                                                                                </button>
                                                                                |
                                                                                <button
                                                                                     onClick={() => handleAction(items.jobId, items.userEmail, 0, index)}
                                                                                     className='text-red-600 hover:text-blue-800 font-medium'
                                                                                >
                                                                                     Reject
                                                                                </button>
                                                                           </div>
                                                            }
                                                       </td>
                                                  </tr>
                                             )) : (
                                                  <tr>
                                                       <td colSpan="6" className='px-4 py-2 text-center'>No Applicants Found</td>
                                                  </tr>
                                             )
                                        }
                                   </tbody>
                              </table>
                         </div>
                    ) : (
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
                    )
               }
          </div>
     );
}
