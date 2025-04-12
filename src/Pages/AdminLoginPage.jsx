import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Form validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Make admin login request
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });

      // Handle successful response
      if (response.data.success) {
        const { token, admin } = response.data;

        // Store authentication info
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', admin.role);
        localStorage.setItem('userId', admin.id);
        localStorage.setItem('userName', admin.name);
        
        setSuccess('Admin login successful! Redirecting...');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin/hotels');
        }, 1500);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 bg-blue-800"
      >
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1474&auto=format&fit=crop"
          alt="Admin Dashboard"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute top-1/3 left-20 text-white">
          <h3 className="text-4xl font-bold">Admin Portal</h3>
          <p className="text-lg mt-4">
            Manage your listings and users with the ListyGo admin dashboard.
          </p>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 p-10 flex flex-col justify-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <img src="/Logo.png" alt="logo" className="h-12 object-contain w-12" />
            <span>ListyGo Admin</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4">Admin Sign In</h2>
        <p className="mb-6 text-gray-600">
          Access your administrator dashboard
        </p>

        {/* Error and Success Messages */}
        {error && <p className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</p>}
        {success && <p className="text-green-600 mb-4 p-3 bg-green-50 rounded">{success}</p>}

        {/* Email */}
        <label className="text-sm text-gray-500 font-medium">Admin Email</label>
        <div className="flex items-center border-2 border-blue-800 rounded-md mb-6 py-2 px-3">
          <FiMail className="text-blue-800 mr-2" />
          <input
            type="email"
            placeholder="Enter your admin email"
            className="w-full focus:outline-none bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <label className="text-sm text-gray-500 font-medium">Password</label>
        <div className="flex items-center border-2 border-blue-800 rounded-md mb-6 py-2 px-3">
          <FiLock className="text-blue-800 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full focus:outline-none bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div 
            onClick={() => setShowPassword(!showPassword)} 
            className="cursor-pointer">
            {showPassword 
              ? <AiOutlineEye className="text-gray-600" /> 
              : <AiOutlineEyeInvisible className="text-gray-600" />}
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <span className="text-blue-800 cursor-pointer text-sm">
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          className={`${
            loading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-900'
          } text-white font-semibold py-3 rounded-md shadow-lg`}
        >
          {loading ? 'Logging in...' : 'Login to Admin Panel'}
        </motion.button>
        
        {/* Back to main site */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-800 hover:underline">
            Return to main website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;