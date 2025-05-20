
import { useContext, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { allContext } from '../context/Context';
import axios from 'axios';
// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
const staticPath = import.meta.env.VITE_STATICPATH;
export default function AddJob() {
     const editorRef = useRef(null);
     const quillInstance = useRef(null);
     const { userRegisterData, view, logoUrl,userName } = useContext(allContext)
     const formRef = useRef();
     useEffect(() => {
          if (view === "addJob" && editorRef.current && !quillInstance.current) {
               quillInstance.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                         toolbar: [
                              [{ 'header': [1, 2, false] }],
                              ['bold', 'italic', 'underline'],
                              ['image', 'code-block']
                         ]
                    }
               });
          }
     }, [view]);

     const sendData = (e) => {
          e.preventDefault()
          const title = e.target.title.value;
          const description = editorRef.current.firstChild.innerHTML
          const category = e.target.category.value;
          const location = e.target.location.value
          const level = e.target.level.value
          const salary = e.target.salary.value
          const adminEmail = userRegisterData.uemail
          const adminImage = "http://localhost:8000/uploads/CompaniesLogo/"+logoUrl
          const adminName = userName
          const dataObj = { title, description, category, location, level, salary, adminEmail, adminImage,adminName}
          




          axios.post(`${staticPath}insert`, dataObj)
               .then((res) => {
                    if (res.data.success) {
                         toast.success("Job Created Successfully")
                          formRef.current.reset();
                    }
               }
               )

     }


     return (
          <div>
               <Toaster/>
               <form  onSubmit={sendData} ref={formRef}>
                    <div className='space-y-4'>
                         <div>
                              <h1 className='text-lg font-semibold text-[#252525] mb-1'>Job title</h1>
                              <input type="text" placeholder='Job Name' className='outline-none border border-gray-300 px-3 py-2 rounded w-full max-w-md' name='title' required />
                         </div>
                         <div className=' max-w-md'>
                              <h1 className='text-lg font-semibold text-[#252525] mb-1'>Job Description</h1>
                              <div
                                   ref={editorRef}
                                   className="h-50 bg-white border border-gray-300 rounded max-w-md"
                              ></div>
                         </div>
                         <div className='flex flex-col sm:flex-row gap-4'>
                              <div>
                                   <h1 className='text-lg font-semibold text-[#252525] mb-1'>Job category</h1>
                                   <input type="text" placeholder='Job Category' className='outline-none border border-gray-300 px-3 py-2 rounded w-full sm:w-[200px]' name='category' required />
                              </div>
                              <div>
                                   <h1 className='text-lg font-semibold text-[#252525] mb-1'>Job Location</h1>
                                   <input type="text" placeholder='Job Location' className='outline-none border border-gray-300 px-3 py-2 rounded w-full sm:w-[200px]' name='location' required />
                              </div>
                         </div>
                         <div className='flex flex-col sm:flex-row gap-4'>
                              <div>
                                   <h1 className='text-lg font-semibold text-[#252525] mb-1'>Job Level</h1>
                                   <select className="border border-gray-300 px-3 py-2 rounded-md w-full sm:w-[200px] text-sm outline-none" name='level'>
                                        <option value="Not Defined">Select Level</option>
                                        <option value="Fresher">Fresher (0 year)</option>
                                        <option value="Beginner">Beginner (0-1 year)</option>
                                        <option value="Intermediate">Intermediate (1-3 years)</option>
                                        <option value="Advanced">Advanced (3-5 years)</option>
                                        <option value="Expert">Expert (5+ years)</option>
                                   </select>
                              </div>
                              <div>
                                   <h1 className='text-lg font-semibold text-[#252525] mb-1'>Salary</h1>
                                   <input type="number" placeholder='0' className='outline-none border border-gray-300 px-3 py-2 rounded text-sm w-full sm:w-[200px]' name='salary' required />
                              </div>
                         </div>
                         <button className='px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:outline-1 hover:outline-blue-700'>Add Job</button>
                    </div>
               </form>
          </div>
     )
}
