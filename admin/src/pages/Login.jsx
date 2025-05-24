import { useContext, useEffect, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from 'axios';
import EnterOTP from "../components/EnterOTP";
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;
import { allContext } from '../context/Context';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ForgotPassword from "../components/ForgotPassword";
const staticAdmin = import.meta.env.VITE_ADMIN_PATH



export default function Login() {
     const [passChange, setPassChange] = useState("")
     const [email, setEmail] = useState('')
     const [name, setName] = useState('')
     const [showOtp, setShowOtp] = useState(false)
     const [isSending, setIsSending] = useState(false)
     const [loginTrue, setLoginTrue] = useState(true)
     const [showPass, setShowPass] = useState(false)
     const [userEmailForOtp, setUserEmailForOtp] = useState(null)
     const navigate = useNavigate()
     const { setUserRegisterData, userRegisterData } = useContext(allContext)
     const { setLogin, setLogoUrl, setUserName } = useContext(allContext)
     const onClicks = () => {
          setLoginTrue(!loginTrue)
          setShowPass(false)
          setPassChange("")
          setEmail("")
          setName("")

     }

     const handleSubmitSignUP = (e) => {
          e.preventDefault();
          const uname = e.target.fullName.value
          const uemail = e.target.email.value
          const upassword = e.target.password.value
          const emailObj = { uemail, otp: "", uname }
          setUserEmailForOtp(emailObj)
          axios.post(`${staticAdminPath}email-check`, emailObj)
               .then((res) => {
                    if (res.data.status) {
                         setIsSending(true)
                         axios.post(`${staticAdminPath}sendOtp`, emailObj)
                              .then((res) => {
                                   if (res.data.status) {

                                        toast.success("OTP Sent!!")
                                        setShowOtp(true)
                                   } else {
                                        toast.warning("Internal Server Error ")
                                   }
                              })



                    } else {
                         toast.error("Email Already Exist, Please Login")
                    }

               }
               )
          setUserRegisterData({
               ...userRegisterData,
               uname,
               uemail,
               upassword
          });

     };

     const handleSubmitLogin = (e) => {
          e.preventDefault()
          const token = localStorage.getItem("token");
          const loginEmail = e.target.email.value;
          const loginPass = e.target.password.value;
          const loginObj = { loginEmail, loginPass }
          axios.post(`${staticAdminPath}check-Login-Details`, loginObj)
               .then((res) => {
                    if (res.data.status === 1) {
                         toast.success("Login Successfull")
                         localStorage.setItem("token", res.data.token);

                         setUserRegisterData({ uemail: loginEmail });
                         Cookies.set('_sessionfastJob', JSON.stringify(loginEmail))

                         axios.post(`${staticAdminPath}getLogo`, { loginEmail }, {
               headers: { Authorization: `Bearer ${token}` }
          })
                              .then((res) => {
                                   setLogoUrl(res.data.logoName)
                                   setUserName(res.data.userName)

                              })



                         setLogin(true)
                         return setTimeout(() => {
                              navigate("/dashboard")
                         }, 1000);

                    }
                    if (res.data.status === 0) {
                         toast.error("Wrong email or password")
                    } else {
                         toast.error("No user found, please register")
                    }
               })

     }

     useEffect(()=>{
          if(localStorage.getItem("token")){
               navigate("/dashboard")
          }
     },[])

     return (

          <>
               <Toaster />
               <div className="flex items-center justify-center min-h-screen w-full bg-white px-4 top-0 left-0">
                    <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-[0px_0px_10px_1px_#ccc] ">
                         {/* recruiter login */}

                         {/* <ForgotPassword/> */}


                         <div className={`${loginTrue ? "" : "hidden"}`}>
                              <h2 className="text-3xl font-semibold text-center mb-1">Recruiter Login</h2>
                              <p className='text-[13px] text-gray-500 text-center mb-3'>Welcome back! Please sign in to continue</p>
                              <form onSubmit={handleSubmitLogin} className="space-y-5">
                                   <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                             type="email"
                                             name="email"
                                             required
                                             onChange={e => setEmail(e.target.value)}
                                             placeholder='xyz@example.com'
                                             value={email}


                                             className="w-full mt-1 px-4 py-2 border rounded-[40px] text-[16px] outline-none"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium">Password</label>
                                        <div className='flex border rounded-[40px] items-center'>
                                             <input
                                                  type={`${showPass ? "text" : "password"}`}
                                                  name="password"
                                                  required
                                                  placeholder='Password'
                                                  value={passChange}
                                                  onChange={e => setPassChange(e.target.value)}
                                                  className="w-full px-4 py-2 text-[16px] outline-none"
                                             />
                                             {
                                                  passChange.length > 0 ?
                                                       (showPass ? <span className='pr-4' onClick={e => setShowPass(!showPass)}><LuEyeOff className='text-xl' /></span> : <span className='pr-4' onClick={e => setShowPass(!showPass)}><LuEye className='text-xl ' /></span>)
                                                       : ""
                                             }

                                        </div>
                                        <a className='text-[14px] mt-4 text-left text-blue-600 '>Forgot Password?</a>

                                   </div>
                                   <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-[40px] hover:bg-blue-700 transition">
                                        Login
                                   </button>
                              </form>
                              <p className="text-center text-sm mt-5">
                                   Don’t have an account? <span href="/" onClick={onClicks} className="text-blue-600 cursor-pointer ">SignUp</span>
                              </p>
                         </div>





                         {/* recruiter register */}

                         {
                              showOtp ?
                                   <div className={`${showOtp ? " " : "hidden"}`}>
                                        <EnterOTP email={userEmailForOtp} />
                                   </div>
                                   :
                                   <div className={`${loginTrue ? "hidden" : ""}`}>
                                        <h2 className="text-3xl font-semibold text-center  mb-6">Recruiter Registration</h2>

                                        <form onSubmit={handleSubmitSignUP} className="space-y-5">
                                             <div>
                                                  <label className="text-sm font-medium">Full Name</label>
                                                  <input
                                                       type="text"
                                                       name="fullName"
                                                       required
                                                       placeholder='Your Name'
                                                       onChange={e => setName(e.target.value)}
                                                       value={name}
                                                       className="w-full mt-1 px-4 py-2 border rounded-[40px] outline-none"
                                                  />
                                             </div>
                                             <div>
                                                  <label className="text-sm font-medium">Email</label>
                                                  <input
                                                       type="email"
                                                       name="email"
                                                       required
                                                       placeholder='xyz@example.com'
                                                       value={email}
                                                       onChange={e => setEmail(e.target.value)}
                                                       className="w-full mt-1 px-4 py-2 border rounded-[40px] outline-none"
                                                  />
                                             </div>
                                             <div>
                                                  <label className="text-sm font-medium">Password</label>
                                                  <div className='flex border rounded-[40px] items-center'>
                                                       <input
                                                            type={`${showPass ? "text" : "password"}`}
                                                            name="password"
                                                            required
                                                            placeholder='Password'
                                                            minLength={8}
                                                            maxLength={30}
                                                            value={passChange}
                                                            onChange={e => setPassChange(e.target.value)}
                                                            className="w-full px-4 py-2 outline-none"
                                                       />
                                                       {
                                                            passChange.length > 0 ?
                                                                 (showPass ? <span className='pr-4' onClick={e => setShowPass(!showPass)}><LuEyeOff className='text-xl' /></span> : <span className='pr-4' onClick={e => setShowPass(!showPass)}><LuEye className='text-xl ' /></span>)
                                                                 : ""
                                                       }

                                                  </div>
                                             </div>
                                             <div className="flex justify-center">
                                                  {
                                                       isSending ?
                                                            <button type="submit" className=" max-sm:w-44 w-full bg-blue-600 text-white py-3 rounded-[40px] hover:bg-blue-700 transition">
                                                                 Sending OTP....
                                                            </button>
                                                            :
                                                            <>
                                                                 <button type="submit" className=" max-sm:w-44 w-full bg-blue-600 text-white py-3 rounded-[40px] hover:bg-blue-700 transition" >
                                                                      Register
                                                                 </button>
                                                            </>
                                                  }
                                             </div>
                                        </form>
                                        <p className="text-center text-sm mt-5">
                                             Already have an account? <span onClick={onClicks} className="text-blue-600 cursor-pointer">Login</span>
                                        </p>
                                   </div>

                         }
                    </div>
               </div>


          </>

     )
}
