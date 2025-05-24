import { createContext, useState } from 'react'

export const allContext = createContext()

export default function Context({ children }) {

  const [view, setView] = useState("addJob");
  const [logoUrl, setLogoUrl] = useState("")
  const [userName, setUserName] = useState("")
  const [checkLogin, setLogin] = useState(false)
  const [getJobData, setJobData] = useState([])
  const [forgotOn, setForgotOn] = useState(false)
  const [userRegisterData, setUserRegisterData] = useState({
    uname: "",
    upassword: "",
    uemail: "",
    logo: null,
  })


  const obj = {
    setView, view,
    setUserRegisterData, userRegisterData,
    checkLogin, setLogin, setLogoUrl, logoUrl,
    userName, setUserName, setJobData, getJobData,
    forgotOn, setForgotOn
  }



  return (
    <allContext.Provider value={obj}>
      {children}
    </allContext.Provider>
  )
}
