import { useState } from "react";
import SelectLogo from "./SelectLogo";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;

export default function EnterOTP({email}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showLogoPicker, setLogoPicker]= useState(false)
  const {uemail}=email

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      // Move to next input
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  
// OTP CHECKING HERE 
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalOtp=otp.join("");
    const otpObj={
      otp: finalOtp,
      uemail
    }

    axios.post(`${staticAdminPath}checkOTP`,otpObj)
    .then((res)=>{
      if (res.data.status===1){
        toast.success("Registration Successfull")
        setLogoPicker(true)
        return;
      }
      
      if(res.data.status===2){
        toast.error("Incorrect OTP")
      }else{
        toast.warning("OTP not found")
      }
      
    })

  };

  return (
    
        <div>
          <Toaster/>
        {
          showLogoPicker? <SelectLogo/>:<>
          <p className="text-sm font-bold text-center mb-3 text-gray-500">Enter the OTP sent to your email</p>
          <p className="text-sm font-bold text-center mb-6 text-gray-500" >({uemail})</p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-center gap-3 mb-6 ">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-xl text-center border max-sm:w-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Verify OTP
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive OTP? <button className="text-blue-600 hover:underline">Resend</button>
        </p>
          
          </>
        }
        </div>
     
  );
}
