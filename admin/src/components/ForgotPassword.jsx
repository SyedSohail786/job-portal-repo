import axios from "axios";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { allContext } from "../context/Context";
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;

const ForgotPassword = () => {
     const [email, setEmail] = useState("");
     const [otpSent, setOtpSent] = useState(false);
     const [otp, setOtp] = useState("");
     const [confirmPasswords, setConfirmPasswords] = useState("otp")
     const navigate = useNavigate()
     const { setForgotOn } = useContext(allContext)
     const handleSendOtp = (e) => {
          e.preventDefault();

          if (!email) return alert("Please enter your email first.");

          axios.post(`${staticAdminPath}sendOtpChangePassword`, { email })
               .then((res) => {
                    if (res.data.code === 202) {
                         return toast.error("No user found, please register")
                    }

                    if (res.data.status) {
                         toast.success("OTP Sent!!")
                         setOtpSent(true); // Show OTP section
                    }
               })



     };

     const handleVerifyOtp = (e) => {
          e.preventDefault();
          axios.post(`${staticAdminPath}checkForgotPasswordOtp`, { email, otp })
               .then((res) => {
                    if (res.status == 201) {
                         return toast.error("OTP expired or Invalid OTP")
                    }
                    if (res.status == 200) {
                         setConfirmPasswords("confirmPassword")
                         return toast.success("OTP Verified")
                    }


               }
               )

     };


     //confirm password checking area
     const [newPassword, setNewPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");

     const handleSubmit = (e) => {
          e.preventDefault();

          if (newPassword !== confirmPassword) {
               alert("Passwords do not match.");
               return;
          }

          axios.put(`${staticAdminPath}changePassword`, { email, newPassword })
               .then((res) => {
                    if (res.data.status) {
                         navigate("/dashboard")
                         localStorage.setItem("token", res.data.token);
                         toast.success("Password Updated Successfully")
                    } else {
                         toast.error("Something Went Wrong")
                    }
               })
     };

     return (

          <div className="bg-white rounded-2xl p-8 sm:p-10 max-w-md w-full">
               <Toaster />
               {/* otp sending and checking section */}
               {confirmPasswords == "otp" ?
                    <>
                         <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                              Forgot Your Password?
                         </h2>
                         <p className="text-sm text-gray-600 mb-6 text-center">
                              Enter your registered email below and we’ll send you an OTP.
                         </p>

                         <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                              {/* Email Input */}
                              <div className="mb-4">
                                   <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                   >
                                        Email address
                                   </label>
                                   <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="you@example.com"
                                   />
                              </div>

                              {/* OTP Input (visible only after clicking Send OTP) */}
                              {otpSent && (
                                   <div className="mb-4 transition-all duration-300">
                                        <label
                                             htmlFor="otp"
                                             className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                             Enter OTP
                                        </label>
                                        <input
                                             type="text"
                                             id="otp"
                                             value={otp}
                                             required
                                             onChange={(e) => setOtp(e.target.value)}
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                             placeholder="Enter the OTP"
                                        />
                                   </div>
                              )}

                              <button
                                   type="submit"
                                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                              >
                                   {otpSent ? "Verify OTP" : "Send OTP"}
                              </button>
                         </form>

                         <div className="mt-6 text-center">
                              <a className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={e => setForgotOn(false)}>
                                   Back to Login
                              </a>
                         </div>
                    </>
                    : confirmPasswords == "confirmPassword" ?
                         <>
                              {/* confirm password section */}
                              <div className="bg-white rounded-2xl  sm:p-10 max-w-md w-full">
                                   <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                                        Set New Password
                                   </h2>
                                   <p className="text-sm text-gray-600 mb-6 text-center">
                                        Enter your new password below.
                                   </p>

                                   <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                             <label
                                                  htmlFor="newPassword"
                                                  className="block text-sm font-medium text-gray-700 mb-1"
                                             >
                                                  New Password
                                             </label>
                                             <input
                                                  type="password"
                                                  id="newPassword"
                                                  value={newPassword}
                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                  required
                                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                  placeholder="Enter new password"
                                             />
                                        </div>

                                        <div className="mb-6">
                                             <label
                                                  htmlFor="confirmPassword"
                                                  className="block text-sm font-medium text-gray-700 mb-1"
                                             >
                                                  Confirm Password
                                             </label>
                                             <input
                                                  type="password"
                                                  id="confirmPassword"
                                                  value={confirmPassword}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                                  required
                                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                  placeholder="Re-enter new password"
                                             />
                                        </div>

                                        <button
                                             type="submit"
                                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                        >
                                             Change Password
                                        </button>
                                   </form>

                                   <div className="mt-6 text-center">
                                        <a className="text-sm text-blue-600 hover:underline" onClick={e => setForgotOn(false)}>
                                             Back to Login
                                        </a>
                                   </div>
                              </div>
                         </>
                         : ""
               }
          </div>

     );
};

export default ForgotPassword;
