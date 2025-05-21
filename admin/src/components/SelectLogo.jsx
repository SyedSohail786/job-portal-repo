import { useContext, useState } from 'react';
import { allContext } from '../context/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;




const SelectLogo = () => {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);
  const { setUserRegisterData, userRegisterData, setLogin, setLogoUrl, setUserName } = useContext(allContext)
  const handleFileChange = (e) => {
    setUserRegisterData(prev => ({ ...prev, logo: e.target.files[0] }))
    setSelectedFile(e.target.files[0]);
  };

  const formDataFunction = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('uname', userRegisterData.uname);
    formData.append('uemail', userRegisterData.uemail);
    formData.append('upassword', userRegisterData.upassword);
    formData.append('logo', userRegisterData.logo);


    try {
      const res = await axios.post(`${staticAdminPath}admin-register`, formData);
      axios.post(`${staticAdminPath}getLogo`, { loginEmail: userRegisterData.uemail }).then((res) => {
        setLogoUrl(res.data.logoName)
        setUserName(res.data.userName)
        Cookies.set('_sessionfastJob', JSON.stringify(userRegisterData.uemail))
      })
      setLogin(true)
      
      navigate("/dashboard")

    } catch (err) {
      console.error('❌ Error:', err);
    }
  };


  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md text-center">
        <form action="" onSubmit={formDataFunction}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Company Logo</h2>

          <label
            htmlFor="logo-upload"
            className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V18a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0021 18v-1.5M16 12l-4-4-4 4m4-4v10"
              />
            </svg>
            <span className="text-gray-500">
              {selectedFile ? selectedFile.name : 'Click to upload or drag image here'}
            </span>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange} required
            />
          </label>

          <p className="text-sm text-gray-400 mt-2">
            Supported formats: JPG, PNG, SVG (Max 2MB)
          </p>

          {selectedFile && (
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Complete
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SelectLogo;
