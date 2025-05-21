import { FaDownload } from "react-icons/fa6";


export default function Applicants() {
     return (
          <div>
               <div className='overflow-x-auto mt-4'>
                    <table className='min-w-full text-sm border border-gray-300 shadow-sm rounded-md'>
                         <thead className='bg-gray-50'>
                              <tr className='bg-blue-100'>
                                   <th className='px-4 py-2 text-left'>No.</th>
                                   <th className='px-4 py-2 text-left'>User name</th>
                                   <th className='px-4 py-2 text-left'>Job Title</th>
                                   <th className='px-4 py-2 text-left'>Location</th>
                                   <th className='px-4 py-2 text-left max-sm:hidden'>Resume</th>
                                   <th className='px-4 py-2 text-left  max-sm:hidden'>Action</th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr>
                                   <td className='px-4 py-5'>1</td>
                                   <td className='px-4 py-2'>Syed Sohail</td>
                                   <td className='px-4 py-2'>Web Developer</td>
                                   <td className='px-4 py-2'>Gulbarga</td>
                                   <td className='px-4 py-2  max-sm:hidden'>
                                        <div className='flex items-center gap-2 cursor-pointer'>
                                             <span>Resume</span>
                                             <FaDownload className='text-sm' />
                                        </div>
                                   </td>
                                   <td className='px-4 py-2  max-sm:hidden'>
                                        <div className='flex items-center gap-2'>
                                             <button className='text-green-600 hover:text-blue-800 font-medium'>Accept</button> |
                                             <button className='text-red-600 hover:text-blue-800 font-medium'>Reject</button>
                                        </div>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               </div>
          </div>
     )
}
