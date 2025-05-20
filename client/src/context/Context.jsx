import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
// import { jobsData } from '../assets/assets'

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
  useEffect(() => {
    axios.get("http://localhost:8000/website/viewJobs")
      .then((res) => {
        const jobs = res.data.msg || []
        setJobsData(jobs)
        setJobInfo(jobs) // ✅ only set when jobsData is available
      })
      .catch((err) => console.error("Error fetching jobs:", err))
  }, [])

  
  const obj = {
    setIsSearched, setSearchValue,
    isSearched, searchValue, jobInfo,
    setJobInfo, setClerkUser, clerkUser,
    setJobsData, jobsData
  }

  return (
    <allContext.Provider value={obj}>
      {children}
    </allContext.Provider>
  )
}
