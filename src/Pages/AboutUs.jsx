import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegSmileBeam, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const AboutUs = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className={`bg-white shadow-md rounded-lg w-full lg:w-1/4 p-6 ${menuOpen ? '' : 'hidden lg:block'}`}>
          <h2 className="text-xl font-bold text-blue-700 mb-4">Navigation</h2>
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li>Our Story</li>
            <li>Our Mission</li>
            <li>Our Team</li>
            <li>Locations</li>
          </ul>
        </div>

        {/* Toggle Button for Mobile */}
        <div className="lg:hidden flex justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-700 border px-3 py-1 rounded shadow-sm mb-2"
          >
            {menuOpen ? 'Hide Menu' : 'Show Menu'}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-3/4 p-8">
          <motion.h2
            className="text-3xl font-bold text-blue-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Us
          </motion.h2>

          <motion.p
            className="text-gray-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            At ListyGo, we’re passionate about making your travel experience seamless, personalized, and enjoyable. 
            Whether you’re looking for a cozy weekend retreat or a luxurious staycation, we’re here to help you find the perfect spot.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              className="bg-blue-50 p-5 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 text-blue-700 mb-2">
                <FaRegSmileBeam />
                <h3 className="font-semibold text-lg">Our Mission</h3>
              </div>
              <p className="text-sm text-gray-700">
                To provide unique stays for every traveler with trust, safety, and simplicity at the core of our platform.
              </p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-5 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 text-blue-700 mb-2">
                <FaUsers />
                <h3 className="font-semibold text-lg">Our Team</h3>
              </div>
              <p className="text-sm text-gray-700">
                A passionate group of designers, developers, and customer champions dedicated to building great travel experiences.
              </p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-5 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 text-blue-700 mb-2">
                <FaMapMarkerAlt />
                <h3 className="font-semibold text-lg">Our Presence</h3>
              </div>
              <p className="text-sm text-gray-700">
                We operate in major cities and tourist destinations across India with plans to expand globally.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
