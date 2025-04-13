import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiUser, FiMail, FiSettings, FiPhone, FiEdit, 
  FiCalendar, FiHeart, FiCreditCard, FiBell, FiBook, 
  FiShield, FiHelpCircle, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdPayment } from 'react-icons/md';
import { FaRegClipboard } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser, getCurrentUser, fetchCurrentUser } from '../services/authService';
import { Progress, Avatar, Button, Badge, Tooltip, Tabs, Tag, Card } from 'antd';
import PersonalInfo from '../components/PersonalInfo';
import Settings from '../components/Settings';

const MyAccount = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  
  // Mock data for demo purposes
  const mockBookings = useMemo(() => [
    {
      id: 'b1',
      hotelName: 'Seaside Resort & Spa',
      checkInDate: '2025-05-15',
      checkOutDate: '2025-05-20',
      status: 'upcoming',
      price: 875,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3'
    },
    {
      id: 'b2',
      hotelName: 'Mountain View Lodge',
      checkInDate: '2025-06-10',
      checkOutDate: '2025-06-15',
      status: 'upcoming',
      price: 650,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3'
    },
    {
      id: 'b3',
      hotelName: 'Urban Boutique Hotel',
      checkInDate: '2025-02-05',
      checkOutDate: '2025-02-08',
      status: 'completed',
      price: 420,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3'
    }
  ], []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      try {
        // If logged in as admin, call fetchCurrentUser(true)
        const isAdmin = localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'super-admin';
        const fetchedData = await fetchCurrentUser(isAdmin);
        setUserData(fetchedData);        
        if (Array.isArray(fetchedData.bookings)) {
          setBookings(fetchedData.bookings);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please login again.');
          setTimeout(() => {
            logoutUser();
            navigate('/login');
          }, 2000);
        } else {
          setError('Failed to load account information. Please try again later.');
        }
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // Handle logout
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-50 pt-16">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-600 animate-pulse">Loading your account...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-50 pt-16">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button 
            type="primary"
            size="large"
            onClick={() => navigate('/login')} 
            className="bg-blue-600 hover:bg-blue-700 border-none"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }
  
  // Get user data or fallback to localStorage
  const user = userData || getCurrentUser() || {
    name: 'Guest User',
    email: 'guest@example.com',
    memberSince: '2024-01-15',
    profileCompleted: 65,
    rewardPoints: 750,
    tier: 'Silver',
    favoriteHotels: 5
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  // Define tab items for mobile view
  const tabItems = [
    {
      key: 'personal',
      label: 'Profile',
      icon: <FiUser />
    },
    {
      key: 'bookings',
      label: 'Bookings',
      icon: <FaRegClipboard />
    },
    {
      key: 'payments',
      label: 'Payment',
      icon: <MdPayment />
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <FiSettings />
    }
  ];

  // Define dynamic content sections
  const sections = {
    personal: (
      <PersonalInfo 
        user={user} 
        containerVariants={containerVariants}
        itemVariants={itemVariants} 
      />
    ),
    bookings: (
      <motion.div
        key="bookings"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Your Bookings</h3>
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
              Book New Stay
            </Button>
          </div>
          
          <Tabs
            defaultActiveKey="upcoming"
            items={[
              {
                key: 'upcoming',
                label: 'Upcoming',
                children: (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'upcoming').length > 0 ? (
                      bookings
                        .filter(b => b.status === 'upcoming')
                        .map(booking => (
                          <Card key={booking.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-1/4">
                                <img 
                                  src={booking.image} 
                                  alt={booking.hotelName}
                                  className="w-full h-32 object-cover rounded-lg" 
                                />
                              </div>
                              <div className="md:w-3/4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                                  <h4 className="text-lg font-semibold text-blue-700">{booking.hotelName}</h4>
                                  <Badge.Ribbon text="Confirmed" color="blue">
                                    <div className="h-6"></div>
                                  </Badge.Ribbon>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm text-gray-500">Check-in</div>
                                    <div className="font-medium">{new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Check-out</div>
                                    <div className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 pt-4 border-t border-gray-100">
                                  <div className="text-lg font-bold text-blue-600">${booking.price}</div>
                                  <div className="flex gap-2 mt-3 md:mt-0">
                                    <Button type="default" size="small">Modify</Button>
                                    <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700">
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">🏨</div>
                        <h4 className="text-lg font-medium text-gray-700">No upcoming bookings</h4>
                        <p className="text-gray-500 mb-4">Ready for your next adventure?</p>
                        <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
                          Explore Hotels
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'completed',
                label: 'Completed',
                children: (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'completed').length > 0 ? (
                      bookings
                        .filter(b => b.status === 'completed')
                        .map(booking => (
                          <Card key={booking.id} className="shadow-sm hover:shadow-md transition-shadow opacity-80 hover:opacity-100">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-1/4">
                                <img 
                                  src={booking.image} 
                                  alt={booking.hotelName}
                                  className="w-full h-32 object-cover rounded-lg grayscale-[30%]" 
                                />
                              </div>
                              <div className="md:w-3/4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                                  <h4 className="text-lg font-semibold text-gray-700">{booking.hotelName}</h4>
                                  <Badge.Ribbon text="Completed" color="green">
                                    <div className="h-6"></div>
                                  </Badge.Ribbon>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm text-gray-500">Check-in</div>
                                    <div className="font-medium">{new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Check-out</div>
                                    <div className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 pt-4 border-t border-gray-100">
                                  <div className="text-lg font-bold text-gray-600">${booking.price}</div>
                                  <div className="flex gap-2 mt-3 md:mt-0">
                                    <Button type="default" size="small">Write Review</Button>
                                    <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700">
                                      Book Again
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">📅</div>
                        <h4 className="text-lg font-medium text-gray-700">No booking history</h4>
                        <p className="text-gray-500">Your completed stays will appear here</p>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'cancelled',
                label: 'Cancelled',
                children: (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🙌</div>
                    <h4 className="text-lg font-medium text-gray-700">No cancellations</h4>
                    <p className="text-gray-500">You haven't cancelled any bookings</p>
                  </div>
                ),
              },
            ]}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recently Viewed</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative h-36">
                  <img 
                    src={`https://source.unsplash.com/random/300x200/?hotel,interior,${i}`} 
                    alt="Hotel preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2">
                    <Button 
                      type="default" 
                      shape="circle" 
                      size="small" 
                      icon={<FiHeart size={14} />} 
                      className="bg-white/80 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="font-medium mb-1 truncate">Grand Hotel Example {i}</h5>
                  <div className="text-sm text-gray-500 mb-2">New York, USA</div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-blue-600">$129 <span className="text-gray-500 text-xs font-normal">/night</span></div>
                    <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">4.8 ★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    ),
    
    payments: (
      <motion.div
        key="payments"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Payment Methods</h3>
            <Button type="primary" icon={<FiCreditCard size={14} />} className="bg-blue-600 hover:bg-blue-700">
              Add Payment Method
            </Button>
          </div>
          
          {user.paymentMethods && user.paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {user.paymentMethods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <FiCreditCard size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{method.type}</div>
                        <div className="text-sm text-gray-500">•••• {method.lastFour}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Tag color="blue">Default</Tag>
                      )}
                      <Button type="text" size="small" danger>Remove</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-blue-50 rounded-xl">
              <div className="text-5xl mb-4">💳</div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No payment methods found</h4>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Add a credit card or other payment method to make booking faster and easier.
              </p>
              <Button 
                type="primary" 
                icon={<FiCreditCard size={14} />} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Billing History</h3>
          
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {booking.hotelName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                        ${booking.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Tag color="success">Paid</Tag>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Button type="link" className="text-blue-600 p-0">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No billing history available.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    ),
    
    settings: (
      <Settings 
        user={user}
        containerVariants={containerVariants}
        itemVariants={itemVariants} 
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-50 pt-24 pb-10 px-4">
      {/* Mobile Tabs (only visible on small screens) */}
      <div className="lg:hidden mb-4">
        <Tabs
          activeKey={activeSection}
          onChange={(key) => setActiveSection(key)}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <div className="flex flex-col items-center px-1">
                {item.icon}
                <span className="mt-1 text-xs">{item.label}</span>
              </div>
            )
          }))}
          centered
          size="small"
        />
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar for desktop */}
        <div className="bg-white shadow-md rounded-xl w-full lg:w-1/4 p-6 hidden lg:block">
          <div className="text-center mb-8">
            {user.avatar ? (
              <Avatar 
                src={user.avatar} 
                size={100} 
                className="border-4 border-blue-100 mb-4"
              />
            ) : (
              <Avatar 
                size={100} 
                className="bg-blue-500 border-4 border-blue-100 mb-4"
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
            <div className="text-blue-600 text-sm font-medium mb-2">
              {user.tier || 'Silver'} Member
            </div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            {[
              { key: 'personal', icon: <FiUser />, label: 'Personal Info' },
              { key: 'bookings', icon: <FaRegClipboard />, label: 'Bookings' },
              { key: 'payments', icon: <MdPayment />, label: 'Payment Methods' },
              { key: 'settings', icon: <FiSettings />, label: 'Settings' }
            ].map((item) => (
              <button 
                key={item.key}
                onClick={() => setActiveSection(item.key)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.key 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeSection === item.key && (
                  <FiChevronRight className="ml-auto" />
                )}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-500 hover:bg-red-50 transition-colors"
              >
                <AiOutlineLogout />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <AnimatePresence mode="wait">
            {sections[activeSection]}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;