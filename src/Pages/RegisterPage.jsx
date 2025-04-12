import React, { useState } from 'react';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!email || !username || !password) {
      setError('All fields are required!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    // Do registration logic here
    alert('Successfully registered!');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 p-10 flex flex-col justify-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <span>ListyGo</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4">Sign up</h2>
        <p className="mb-6 text-gray-600">
            If you already have an account register <br />
            You can{' '}
            <span
                className="text-red-600 font-bold cursor-pointer"
                onClick={() => window.location.href = '/login'}
            >
                Login here !
            </span>
        </p>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Email */}
        <label className="text-sm text-gray-500">Email</label>
        <div className="flex items-center border-b-2 border-blue-900 mb-4 py-2">
          <FiMail className="text-blue-900 mr-2" />
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full focus:outline-none bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Username */}
        <label className="text-sm text-gray-500">Username</label>
        <div className="flex items-center border-b border-gray-400 mb-4 py-2">
          <FiUser className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Enter your User name"
            className="w-full focus:outline-none bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <label className="text-sm text-gray-500">Password</label>
        <div className="flex items-center border-b border-gray-400 mb-6 py-2">
          <FiLock className="text-gray-600 mr-2" />
          <input
            type="password"
            placeholder="Enter your Password"
            className="w-full focus:outline-none bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AiOutlineEyeInvisible className="text-gray-400" />
        </div>

        {/* Register Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegister}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full shadow-lg transition-all"
        >
          Register
        </motion.button>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 relative items-center justify-center bg-black"
      >
        <img
          src="https://images.unsplash.com/photo-1557401623-38c6c32c334f"
          alt="India Monument"
          className="w-full h-full object-cover rounded-l-[50px]"
        />
        <div className="absolute top-6 right-6 text-white text-sm flex items-center gap-2">
          <BsTelephone />
          <span>+256 787 667 581</span>
        </div>
        <div className="absolute bottom-10 left-10 text-white">
          <h3 className="text-3xl font-bold">Sign in to ListyGo</h3>
          <p className="text-sm mt-2">Homes as unique as you.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
