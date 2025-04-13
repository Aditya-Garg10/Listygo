import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Bell, Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { isAuthenticated, logoutUser, getCurrentUser } from '../services/authService';
import { Badge, Avatar, Input, Dropdown, Menu as AntMenu, Button } from 'antd';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if the current route matches a nav item
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setUserAuthenticated(authStatus);
      
      if (authStatus) {
        setUserData(getCurrentUser());
      }
    };
    
    checkAuth();
    
    // Add event listener for storage changes (for multi-tab logout)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogout = () => {
    logoutUser();
    setUserAuthenticated(false);
    setUserData(null);
    navigate('/');
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/hotels?search=${encodeURIComponent(value)}`);
      setSearchVisible(false);
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser?.role === 'admin' || currentUser?.role === 'super-admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  // // Fetch categories (mocked for now)
  // useEffect(() => {
  //   // Replace with actual API call to fetch categories
  //   setCategories([
  //     { _id: '1', name: 'Category 1' },
  //     { _id: '2', name: 'Category 2' },
  //     { _id: '3', name: 'Category 3' },
  //   ]);
  // }, []);
  
  // User dropdown menu items
  const userMenuItems = (
    <AntMenu>
      <AntMenu.Item key="1" icon={<User size={14} />}>
        <Link to="/account">My Profile</Link>
      </AntMenu.Item>
      {isAdmin && (
        <AntMenu.Item key="2" icon={<Bell size={14} />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </AntMenu.Item>
      )}
      <AntMenu.Item key="3" icon={<LogOut size={14} />} danger onClick={handleLogout}>
        Log Out
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-10">
            <img src="/Logo.png" alt="ListyGo Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-blue-400">ListyGo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link to="/" className={`transition duration-200 hover:text-blue-400 py-2 relative ${isActive('/') ? 'text-blue-400 font-semibold' : ''}`}>
                Home
                {isActive('/') && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
                            
              
              <Link to="/listings" className={`transition duration-200 hover:text-blue-400 py-2 relative ${isActive('/listings') ? 'text-blue-400 font-semibold' : ''}`}>
                All Listings
                {isActive('/listings') && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
{/* 
              <Dropdown
                overlay={
                  <AntMenu>
                    {categories.map(category => (
                      <AntMenu.Item key={category._id}>
                        <Link to={`/listings?category=${category._id}`}>
                          {category.name}
                        </Link>
                      </AntMenu.Item>
                    ))}
                  </AntMenu>
                }
              >
                <Link to="/listings" className="transition duration-200 hover:text-blue-400 py-2 relative">
                  Categories <ChevronDown size={16} />
                </Link>
              </Dropdown> */}
              
              <Link to="/about" className={`transition duration-200 hover:text-blue-400 py-2 relative ${isActive('/about') ? 'text-blue-400 font-semibold' : ''}`}>
                About Us
                {isActive('/about') && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
              
              <Link to="/contact" className={`transition duration-200 hover:text-blue-400 py-2 relative ${isActive('/contact') ? 'text-blue-400 font-semibold' : ''}`}>
                Contact Us
                {isActive('/contact') && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            </div>
            
            {userAuthenticated ? (
              <div className="flex items-center gap-4">
                <Dropdown 
                  overlay={userMenuItems} 
                  placement="bottomRight" 
                  trigger={['click']}
                  overlayClassName="shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar 
                      size={32} 
                      className="bg-blue-600"
                      src={userData?.avatar}
                    >
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-800">
                        {userData?.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {userData?.role || 'Guest'}
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-blue-400 border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium">
                  Log In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setSearchVisible(!searchVisible)}
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Search size={20} />
            </button>
            
            {userAuthenticated && (
              <Badge count={3} size="small">
                <Link to="/notifications" className="text-gray-500 hover:text-blue-400 transition-colors">
                  <Bell size={20} />
                </Link>
              </Badge>
            )}
            
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-400 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search bar overlay */}
        <AnimatePresence>
          {searchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white shadow-md py-3 px-4"
            >
              <div className="max-w-3xl mx-auto flex">
                <Input.Search
                  placeholder="Search for hotels, destinations..."
                  allowClear
                  enterButton
                  size="large"
                  onSearch={handleSearch}
                  className="w-full"
                  autoFocus
                />
                <Button 
                  type="text"
                  className="ml-2"
                  icon={<X size={18} />}
                  onClick={() => setSearchVisible(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white shadow-lg"
            >
              <div className="px-6 py-4 flex flex-col gap-3 text-sm font-medium">
                {userAuthenticated && (
                  <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                    <Avatar 
                      size={40} 
                      className="bg-blue-600"
                      src={userData?.avatar}
                    >
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {userData?.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {userData?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                )}
                
                <Link 
                  to="/" 
                  className={`py-2 ${isActive('/') ? 'text-blue-400 font-semibold' : 'text-gray-700'}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/hotels" 
                  className={`py-2 ${isActive('/hotels') ? 'text-blue-400 font-semibold' : 'text-gray-700'}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  Hotels
                </Link>
                <Link 
                  to="/listings" 
                  className={`py-2 ${isActive('/listings') ? 'text-blue-400 font-semibold' : 'text-gray-700'}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  All Listings
                </Link>
                <Link 
                  to="/about" 
                  className={`py-2 ${isActive('/about') ? 'text-blue-400 font-semibold' : 'text-gray-700'}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/contact" 
                  className={`py-2 ${isActive('/contact') ? 'text-blue-400 font-semibold' : 'text-gray-700'}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  Contact Us
                </Link>
                
                {userAuthenticated ? (
                  <>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <Link 
                      to="/account" 
                      className="py-2 text-gray-700 flex items-center gap-2" 
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link 
                      to="/notifications" 
                      className="py-2 text-gray-700 flex items-center gap-2" 
                      onClick={() => setMenuOpen(false)}
                    >
                      <Bell size={16} /> Notifications <Badge count={3} className="ml-1" />
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="py-2 text-red-500 flex items-center gap-2 w-full text-left"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-3">
                    <Link 
                      to="/login" 
                      className="text-blue-400 border border-blue-500 px-4 py-2 rounded-full hover:bg-blue-50 text-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Space to prevent content from being hidden under navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;