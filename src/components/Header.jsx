import React, { useState } from 'react';
import pic1 from '../assets/top-photo.svg';
import pic2 from '../assets/india-monuments.png';

const Header = () => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-200 via-white/90 to-transparent overflow-hidden mt-18">
      
      {/* BACKGROUND IMAGE WITH BLUR + OPACITY */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-80 z-0">
        <img
          src={pic1}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Vacation Rentals in India
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Find and book unique accommodation on Rentals
          </p>

          {/* RESPONSIVE SEARCH BAR */}
          <div className="w-full max-w-xl bg-white rounded-full border border-blue-300 flex items-center px-4 py-2 shadow-md mb-6">
            <input 
              type="text"
              placeholder="What are you looking for?"
              className="flex-grow bg-transparent focus:outline-none text-sm md:text-base text-gray-700 placeholder-gray-500"
            />
            <button className="text-blue-600 hover:text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"
                />
              </svg>
            </button>
          </div>

          {/* LOCATION & CATEGORY SELECT */}
          <div className="rounded-2xl shadow-md flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x overflow-hidden w-full max-w-xl bg-white">
            <div className="p-4 flex-1">
              <label className="font-semibold text-sm text-gray-800 mb-2 block">Location</label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Where are you going?</option>
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="goa">Goa</option>
                </select>
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1">
              <label className="font-semibold text-sm text-gray-800 mb-2 block">Select Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose category</option>
                  <option value="beach">Beachside</option>
                  <option value="mountain">Mountain View</option>
                  <option value="luxury">Luxury</option>
                </select>
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE (OPTIONAL CONTENT OVERLAY) */}
        <div className="hidden md:block w-full md:w-1/2 relative z-10">
          {/* You can overlay something here if needed later */}
        </div>
      </div>

      {/* FOOTER DECORATION IMAGE */}
      <div className="absolute bottom-0 left-0 w-full hidden md:block z-0">
        <img
          src={pic2}
          alt="India Monuments"
          className="w-2xl object-contain"
        />
      </div>
    </div>
  );
};

export default Header;
