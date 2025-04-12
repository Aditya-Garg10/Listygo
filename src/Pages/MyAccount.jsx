import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSettings } from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdPayment } from 'react-icons/md';
import { FaRegClipboard } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const sections = {
  personal: (
    <motion.div key="personal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-blue-600 mb-2">Personal Information</h3>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Email:</strong> john.doe@example.com</p>
      <p><strong>Phone:</strong> +91 9876543210</p>
      <button className="mt-4 text-sm text-blue-700 hover:underline">Edit</button>
    </motion.div>
  ),
  bookings: (
    <motion.div key="bookings" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-blue-600 mb-2">Your Bookings</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        <li>Goa Getaway – 23 Apr 2025</li>
        <li>Manali Adventure – 10 May 2025</li>
      </ul>
      <button className="mt-4 text-sm text-blue-700 hover:underline">Manage Bookings</button>
    </motion.div>
  ),
  payments: (
    <motion.div key="payments" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-blue-600 mb-2">Payment Methods</h3>
      <p>Visa ending in **** 1234</p>
      <p>PayPal: john.doe@gmail.com</p>
      <button className="mt-4 text-sm text-blue-700 hover:underline">Manage Payments</button>
    </motion.div>
  ),
  settings: (
    <motion.div key="settings" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-blue-600 mb-2">Account Settings</h3>
      <p>Receive email notifications: <strong>Yes</strong></p>
      <p>Two-factor authentication: <strong>Enabled</strong></p>
      <button className="mt-4 text-sm text-blue-700 hover:underline">Update Settings</button>
    </motion.div>
  ),
};

const MyAccount = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy auth check
  useEffect(() => {
    const isLoggedIn = true; // Replace with actual auth check
    if (!isLoggedIn) navigate('/login');
    setTimeout(() => setLoading(false), 1000); // Simulate loading
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Mobile toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mb-4 bg-blue-600 text-white px-4 py-2 rounded-md">
          {sidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>

        {/* Sidebar */}
        <div className={`bg-white shadow-md rounded-lg w-full lg:w-1/4 p-6 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="text-center mb-6">
            <img src="/profile.png" alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-blue-300" />
            <h2 className="text-xl font-bold text-blue-700">John Doe</h2>
            <p className="text-gray-500 text-sm">john.doe@example.com</p>
          </div>

          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <button onClick={() => setActiveSection('personal')} className="text-left hover:text-blue-600 flex items-center gap-2">
              <FiUser /> Personal Info
            </button>
            <button onClick={() => setActiveSection('bookings')} className="text-left hover:text-blue-600 flex items-center gap-2">
              <FaRegClipboard /> Bookings
            </button>
            <button onClick={() => setActiveSection('payments')} className="text-left hover:text-blue-600 flex items-center gap-2">
              <MdPayment /> Payment Methods
            </button>
            <button onClick={() => setActiveSection('settings')} className="text-left hover:text-blue-600 flex items-center gap-2">
              <FiSettings /> Settings
            </button>
            <button className="text-left text-red-500 hover:text-red-600 flex items-center gap-2">
              <AiOutlineLogout /> Log Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-3/4 p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 capitalize">{activeSection} Details</h2>
          <AnimatePresence mode="wait">
            {sections[activeSection]}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
