import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
const WEBSITE_API_BASE_URL = import.meta.env.VITE_WEBSITE_API_BASE_URL
export const allContext = createContext()

export default function Context({ children }) {
  const [isSearched, setIsSearched] = useState(false)
  const [clerkUser, setClerkUser] = useState({
    userName: "",
    userEmail: "",
    profilePic: "",
    userResume: null,
    _id: "",
  })
  const [searchValue, setSearchValue] = useState({
    title: '',
    location: '',
  })
  const [jobsData, setJobsData] = useState([])
  const [jobInfo, setJobInfo] = useState([])
  const [gotResume,setGotResume]=useState("")

  //FETCHING JOBS DATA FROM API

  const fetchJobs = () => {
    axios.get(`${WEBSITE_API_BASE_URL}/website/viewJobs`)
      .then((res) => {
        const jobs = res.data.msg || []
        setJobsData(jobs)
        setJobInfo(jobs)
      })
      .catch((err) => console.error("Error fetching jobs:", err))
  }

  useEffect(() => {
    fetchJobs();
  }, [])

  const obj = {
    setIsSearched, setSearchValue,
    isSearched, searchValue, jobInfo,
    setJobInfo, setClerkUser, clerkUser,
    setJobsData, jobsData, fetchJobs,
    setGotResume,gotResume
  }


  return (
    <allContext.Provider value={obj}>
      {children}
    </allContext.Provider>
  )
}
