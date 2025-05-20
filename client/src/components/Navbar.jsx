import { SignedIn, SignedOut, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll } from "motion/react"
import { useContext, useEffect } from "react";
import { allContext } from "../context/Context";
import axios from "axios";
import { useRef } from 'react';
import Cookies from 'js-cookie';
const WEBSITE_API_BASE_URL = import.meta.env.VITE_WEBSITE_API_BASE_URL

export default function Navbar() {
  const { openSignIn } = useClerk();
  const { user, isLoaded, isSignedIn} = useUser();
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const { clerkUser, setClerkUser } = useContext(allContext);
  const hasSavedUser = useRef(false);
  useEffect(() => {
    isLoaded && user &&
      setClerkUser(
        {...clerkUser,
          userName: user.fullName,
          profilePic: user.imageUrl,
          userEmail: user.primaryEmailAddress.emailAddress,
          _id: user.id,
          userResume:null,
        })
  }, [isLoaded, user])


  useEffect(() => {
    if(isSignedIn){

      if (
      clerkUser &&
      clerkUser._id &&
      clerkUser.userEmail &&
      !hasSavedUser.current && Cookies.get('_Session-logged')===undefined
    ) {
      hasSavedUser.current = true;
      axios.post(`${WEBSITE_API_BASE_URL}/website/saveUsersData`, clerkUser)
        .then((res) => res.data)
        .catch((err) => err);
        Cookies.set("_Session-logged",true)


    }

    }else{
      Cookies.remove("_Session-logged")
    }
    
  }, [clerkUser]);

  return (
    <div className='w-full shadow-lg bg-white sticky top-0 z-50 '>

      {
        location.pathname == "/" ?
          <motion.div className='w-full bg-blue-800 fixed top-0 left-0 h-1 origin-left' style={{ scaleX: scrollYProgress }} ></motion.div> : ""
      }

      <div className='max-w-[1320px] mx-auto flex items-center text-center justify-between px-4 py-0.5 max-sm:py-0'>

        {/* Logo */}
        <div className='text-3xl  max-sm:py-4 py-5 '>
          <Link to={"/"}>
            <p>
              Fast
              <span className='text-blue-600 '>
                Job
              </span>
            </p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className=' sm:flex items-center gap-6'>
          <SignedOut>

            <button onClick={() => openSignIn()} className='bg-blue-600 rounded-full px-5 py-2 text-white cursor-pointer'>
              Login
            </button>
          </SignedOut>

          <SignedIn>
            {isLoaded && user && (
              <div className="flex items-center gap-4">
                {/* Applied Jobs + Hi, Name */}
                <div className="flex items-center gap-2">
                  <Link to="/applied-jobs" className="text-blue-600 font-medium">
                    Applied Jobs
                  </Link>
                  <span className="text-gray-400">|</span>
                  <p className="font-semibold hidden md:block capitalize">Hi, {user.fullName}</p>
                </div>

                {/* Profile image */}
                <UserButton />
              </div>
            )}
          </SignedIn>

        </div>
      </div>

    </div>
  );
}
