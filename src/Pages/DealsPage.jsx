import React, { useState } from 'react';
import { FaTags, FaPercent, FaCalendarAlt } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const dealsData = [
  {
    title: 'Summer Sale',
    description: 'Up to 40% off on beachside stays.',
    validTill: '30 June 2025',
    icon: <FaPercent />
  },
  {
    title: 'Weekend Escape',
    description: 'Flat ₹2000 off on bookings above ₹10000.',
    validTill: 'Every weekend',
    icon: <FaCalendarAlt />
  },
  {
    title: 'New User Offer',
    description: 'Get ₹1000 off on your first booking!',
    validTill: 'Till 31 July 2025',
    icon: <FaTags />
  }
];

const DealsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className={`bg-white shadow-md rounded-lg w-full lg:w-1/4 p-6 ${menuOpen ? '' : 'hidden lg:block'}`}>
          <div className="text-center mb-6">
            <img
              src="/deals-icon.png"
              alt="Deals"
              className="w-20 h-20 mx-auto mb-2"
            />
            <h2 className="text-xl font-bold text-blue-700">Available Deals</h2>
          </div>

          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li>Top Discounts</li>
            <li>Holiday Offers</li>
            <li>Seasonal Promotions</li>
            <li>Referral Bonuses</li>
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
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Hot Deals & Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {dealsData.map((deal, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 text-blue-700 mb-2">
                    {deal.icon}
                    <h3 className="text-lg font-semibold">{deal.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">{deal.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Valid till: {deal.validTill}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
