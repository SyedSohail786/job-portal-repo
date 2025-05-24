import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaDesktop, FaSquarePlus, FaUserPen } from "react-icons/fa6";
import AddJob from '../components/AddJob';
import ManageJobs from '../components/ManageJobs';
import Applicants from '../components/Applicants';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [view, setView] = useState("addJob");
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/"); // No token? Force login
    }
  }, []);




  return (
    <>
      <div className='w-full'>

        <Navbar />
        <div className='w-full flex flex-col lg:grid lg:grid-cols-[auto_1fr]'>
          {/* Sidebar */}
          <div className='border-b lg:border-r text-center border-gray-300 flex lg:flex-col gap-3 lg:gap-0 lg:h-screen'>
            <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${view === "addJob" ? "bg-blue-100 border-r-4 lg:border-r-8 border-blue-600" : "border-b border-gray-300"}`} onClick={() => setView("addJob")}>
              <FaSquarePlus className='text-xl' />
              <h1 className='font-semibold text-sm'>Add Jobs</h1>
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${view === "manageJobs" ? "bg-blue-100 border-r-4 lg:border-r-8 border-blue-600" : "border-b border-gray-300"}`} onClick={() => setView("manageJobs")}>
              <FaDesktop className='text-xl' />
              <h1 className='font-semibold text-sm'>Manage Jobs</h1>
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${view === "applicants" ? "bg-blue-100 border-r-4 lg:border-r-8 border-blue-600" : "border-b border-gray-300"}`} onClick={() => setView("applicants")}>
              <FaUserPen className='text-xl' />
              <h1 className='font-semibold text-sm'>View Applicants</h1>
            </div>
          </div>

          {/* Content Area */}
          <div className='p-4 w-full'>
            {view === "addJob" && (
              <AddJob />
            )}

            {view === "manageJobs" && (
              <ManageJobs />
            )}

            {view === "applicants" && (
              <Applicants />
            )}
          </div>
        </div>
      </div>

    </>
  );
}
