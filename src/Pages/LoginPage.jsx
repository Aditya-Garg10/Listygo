import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import FormInput from '../components/form/FormInput';
import SubmitButton from '../components/form/SubmitButton';
import FormMessage from '../components/form/FormMessage';
import SocialLoginButtons from '../components/form/SocialLoginButtons';
import { loginUser } from '../services/authService';

const LoginPage = () => {
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
      // Make login request
      await loginUser({ email, password });
      
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to user dashboard
      setTimeout(() => {
        navigate('/account');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <AuthPageLayout 
      imageSrc="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1049&q=80"
      title="Welcome Back to ListyGo"
      subtitle="Your perfect stay is just a click away."
      overlayColor="from-blue-900/70 to-blue-800/80"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign in</h2>
          <p className="text-gray-600">
            Access your account to manage bookings and preferences
          </p>
        </motion.div>
        
        {/* Messages */}
        {(error || success) && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FormMessage message={error} type="error" />
            <FormMessage message={success} type="success" />
          </motion.div>
        )}

        {/* Email */}
        <motion.div variants={itemVariants}>
          <FormInput
            label="Email"
            type="email"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            borderStyle="full"
            iconColor="#3b82f6"
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <FormInput
            label="Password"
            type="password"
            icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            borderStyle="full"
            iconColor="#3b82f6"
          />
        </motion.div>

        {/* Remember & Forgot */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center mb-6 text-sm"
        >
          <label className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            Remember me
          </label>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium">
            Forgot Password?
          </span>
        </motion.div>

        {/* Login Button */}
        <motion.div variants={itemVariants}>
          <SubmitButton
            text="Login to your account"
            loadingText="Logging in..."
            isLoading={loading}
            onClick={handleLogin}
            color="blue"
            fullWidth
            className="py-3 text-base font-medium"
          />
        </motion.div>

        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          className="relative my-8"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </motion.div>

        {/* Social Login */}
        <motion.div variants={itemVariants}>
          <SocialLoginButtons className="grid grid-cols-3 gap-3" />
        </motion.div>

        {/* Registration Link */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 text-gray-600"
        >
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Create an account
          </Link>
        </motion.div>

        {/* Admin Login */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-4 text-sm text-gray-500"
        >
          <Link to="/admin/login" className="hover:text-blue-600 transition-colors">
            Administrator Login
          </Link>
        </motion.div>
      </motion.div>
    </AuthPageLayout>
  );
};

export default LoginPage;