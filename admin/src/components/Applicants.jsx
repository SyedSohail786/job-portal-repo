import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { allContext } from "../context/Context";

const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;
const staticPath = import.meta.env.VITE_STATIC_PATH;

export default function Applicants() {
     const { userRegisterData } = useContext(allContext);
     const [applicants, setApplicants] = useState([]);
     const [loader, setLoader] = useState(false);

     useEffect(() => {
          axios.post(`${staticAdminPath}getApplicants`, userRegisterData)
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
                         <div className='w-full h-screen flex justify-center items-center'>
                              <div className='mr-4'>Fast Job</div>
                              <div role="status">
                                   <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none">
                                        <path d="..." fill="currentColor" />
                                        <path d="..." fill="currentFill" />
                                   </svg>
                                   <span className="sr-only">Loading...</span>
                              </div>
                         </div>
                    )
               }
          </div>
     );
}
