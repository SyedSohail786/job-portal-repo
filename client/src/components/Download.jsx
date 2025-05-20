import React from 'react'
import { assets } from '../assets/assets'

export default function Download() {
  return (
    <div>
     <div className='w-full my-5 max-sm:hidden ' >
          <div className='max-w-[1200px] rounded-[15px] mx-auto bg-blue-50 grid grid-cols-2 pt-5'>
               <div className='py-25 px-35'>
                    <h3 className='text-3xl font-bold'>
                    Download Mobile App For Better Experience
                    </h3>
                    <div className='flex gap-3 my-5'>
                         <a href="#">
                              <img src={assets.play_store} alt="" />
                         </a>
                         <a href="#">
                              <img src={assets.app_store} alt="" />
                         </a>
                    </div>
               </div>
               <div>
                    <img src={assets.young_lady} alt="" className='px-5 '/>
               </div>
          </div>
     </div>
    </div>
  )
}
