import React, { useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { allContext } from '../context/Context';
import Type from './Type';
import { motion } from "motion/react"

export default function Hero() {
  const { setIsSearched, setSearchValue } = useContext(allContext);
  const titleRef = useRef();
  const locationRef = useRef();

  const searchData = () => {
    setSearchValue({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <div className='w-full my-5 px-4'>
      {/* Hero section */}
      <div className='max-w-[1320px] mx-auto bg-gradient-to-r from-violet-800 to-violet-950 text-white p-6 md:p-12 lg:p-20 rounded-3xl'>
        <div className='text-center space-y-6'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
            <Type />
          </h1>
          <p className='text-lg md:text-xl lg:text-2xl font-semibold'>
            Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!
          </p>
        </div>

        {/* Search bar */}
        {/* Search bar */}
        <div className="mt-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-md px-4 py-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2 w-full">
            <img src={assets.search_icon} alt="search" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search for jobs"
              className="flex-1 text-black outline-none px-3 py-2 rounded-md border max-sm:w-50 border-gray-300"
              ref={titleRef}
            />
          </div>

          <div className="flex items-center gap-2 w-full">
            <img src={assets.location_icon} alt="location" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 text-black outline-none px-3 py-2 max-sm:w-50 rounded-md border border-gray-300"
              ref={locationRef}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.6 }}
            onClick={searchData}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
          >
            Search
          </motion.button>
        </div>

      </div>

      {/* Trusted companies */}
      <div className='max-w-[1320px] mx-auto mt-6 border border-gray-300 rounded-2xl p-6 flex flex-wrap items-center justify-center gap-4'>
        <h1 className='w-full text-center text-gray-600 font-semibold mb-2'>Trusted by</h1>
        {[assets.microsoft_logo, assets.adobe_logo, assets.amazon_logo, assets.walmart_logo, assets.accenture_logo, assets.samsung_logo].map((logo, idx) => (
          <img key={idx} src={logo} alt="brand" className='h-6 object-contain' />
        ))}
      </div>
    </div>
  );
}
