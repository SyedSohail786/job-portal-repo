import React from 'react'
import { assets } from '../assets/assets'

export default function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow-[0px_0px_1px_1px_#ccc] mt-4 py-3">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 md:items-center md:justify-between">
        <span className="text-sm text-gray-500 text-center dark:text-gray-400">
          © 2025 <a href="#" className="hover:underline">Fast Job</a>. All Rights Reserved.
        </span>
        <div className='flex gap-3 items-center max-sm:flex-col max-md:flex-col'>

          <p className="text-gray-500 text-center"> Developed By Syed Sohail with ❤️</p>
          <ul className="flex gap-4 items-center text-sm ">
            <li>
              <a href="https://shorturl.at/lQKhS">
                <img src={assets.instagram_icon} alt="Instagram" className="h-8 w-8" />
              </a>
            </li>
            <li>
              <a href="https://github.com/SyedSohail786">
                <img src="https://cdn.prod.website-files.com/5f10ed4b2ae6bc09c03f5d7a/64959d5f65a257fb51a4259c_github.png" alt="Github" className="h-8 w-8" />
              </a>
            </li>
            <li>
              <img src={assets.twitter_icon} alt="Twitter" className="h-8 w-8" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
