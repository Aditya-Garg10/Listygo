import React, { useState } from 'react';
import { FiMail, FiUser, FiLock } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import FormInput from '../components/form/FormInput';
import SubmitButton from '../components/form/SubmitButton';
import FormMessage from '../components/form/FormMessage';
import SocialLoginButtons from '../components/form/SocialLoginButtons';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = async () => {
    // Form validation
    if (!name || !email || !password) {
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

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Make registration request
      await registerUser({ name, email, password });
      
      setSuccess('Registration successful! Redirecting...');
      
      // Redirect to user dashboard
      setTimeout(() => {
        navigate('/account');
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.error || 
        'Registration failed. Please try again.'
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
      imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
      title="Join the ListyGo Community"
      subtitle="Create an account and start exploring amazing properties."
      overlayColor="from-blue-800/70 to-blue-900/80"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
          <p className="text-gray-600">
            Join thousands of travelers finding their perfect stay
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

        {/* Name */}
        <motion.div variants={itemVariants}>
          <FormInput
            label="Full Name"
            type="text"
            icon={FiUser}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            borderStyle="full"
            iconColor="#3b82f6"
          />
        </motion.div>

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
            placeholder="Choose a password"
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            borderStyle="full"
            iconColor="#3b82f6"
          />
          <p className="text-xs text-gray-500 mt-1 pl-1">
            Password must be at least 6 characters long
          </p>
        </motion.div>

        {/* Terms & Privacy */}
        <motion.div 
          variants={itemVariants}
          className="flex items-start mb-6 text-sm text-gray-600 mt-4"
        >
          <input 
            type="checkbox" 
            className="mt-1 mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            I agree to ListyGo's{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </Link>
          </span>
        </motion.div>

        {/* Register Button */}
        <motion.div variants={itemVariants}>
          <SubmitButton
            text="Create account"
            loadingText="Creating Account..."
            isLoading={loading}
            onClick={handleRegister}
            color="blue"
            fullWidth
            className="py-3 text-base font-medium"
            disabled={!agreedToTerms}
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
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </motion.div>

        {/* Social Registration */}
        <motion.div variants={itemVariants}>
          <SocialLoginButtons className="grid grid-cols-3 gap-3" />
        </motion.div>

        {/* Login Link */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 text-gray-600"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Sign in here
          </Link>
        </motion.div>
      </motion.div>
    </AuthPageLayout>
  );
};

export default RegisterPage;