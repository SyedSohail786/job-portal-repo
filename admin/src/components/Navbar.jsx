import { useContext, useEffect, useState } from "react";
import { allContext } from "../context/Context";
import Swal from 'sweetalert2'
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const staticAdminPath = import.meta.env.VITE_ADMIN_PATH;
const staticPath= import.meta.env.VITE_STATIC_PATH


export default function Navbar() {
  const [logout, setLogout] = useState(true)
  const navigate = useNavigate()
  const { setLogin, logoUrl, setLogoUrl, userName, setUserName } = useContext(allContext)

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.post(`${staticAdminPath}getLogo`, {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setLogoUrl(res.data.logoName)
        setUserName(res.data.userName)
      })

  }, [])




  //logout button logic
  const logoutBtn = () => {
    let timerInterval;
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('_sessionfastJob')
        localStorage.removeItem('token')
        setTimeout(() => {
          navigate("/")
        }, 2000)
        setLogin(false)
        Swal.fire({
          title: "You have been Logged Out!",
          html: "redriecting you to Login Page",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      }
    });
  }
  return (
    <nav className="w-full bg-white py-4 px-6 shadow-md relative z-10">
      <div className="mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">
          Fast<span className="text-gray-700">Job</span>
        </div>
        <div className="flex justify-center items-center gap-3 relative">
          <p className="font-semibold text-sm sm:text-base capitalize">Hi, {userName}</p>
          <img src={`${staticPath}/uploads/CompaniesLogo/${logoUrl}`} className="h-10 w-10 rounded-[50px] border border-gray-400" alt="companyLogo" onMouseOver={() => setLogout(false)} onMouseLeave={() => setLogout(true)} />
          <div className={`absolute top-10 right-2 border bg-white cursor-pointer border-gray-200 hover:bg-blue-100  rounded ${logout ? "hidden" : ""}`} onMouseOver={() => setLogout(false)} onMouseLeave={() => setLogout(true)} onClick={logoutBtn}
          >
            <p className="  px-4 py-2">Logout</p>
          </div>
        </div>
      </div>
    </nav>
  );
}


