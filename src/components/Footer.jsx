import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import logo from '../assets/logo01.png'; // Adjust the path as necessary
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white pt-16 relative ">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-[150px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-[150px] opacity-10"></div>

      {/* Contact Us Callout */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r  from-white to-blue-50 text-gray-800 rounded-2xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between -top-20 relative z-50"
      >
        <div className="mb-4  relative md:mb-0 md:mr-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Do you have any Questions?
          </h2>
          <p className="text-gray-600">Our support team is here to help you find the perfect stay.</p>
        </div>
        <Link to="/contact">
          <Button 
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg px-8 py-3 h-auto"
          >
            Contact Us <FaArrowRight className="ml-2 inline-block" />
          </Button>
        </Link>
      </motion.div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 border-t border-blue-800 pt-20">
        {/* Logo Section */}
        <div className="flex flex-col items-start mb-8 md:mb-0">
          <Link to="/" className="flex items-center mb-4">
            <img src={logo} alt="ListyGo Logo" className="h-10 w-auto mr-2" />
            <span className="text-xl font-bold text-white">ListyGo</span>
          </Link>
          <Text className="text-blue-200 mt-2">
            Find your perfect accommodation worldwide with our premium booking platform.
          </Text>
          <div className="flex space-x-4 text-xl mt-6">
            <a href="#" className="w-10 h-10 bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center rounded-full transition-colors">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="w-10 h-10 bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center rounded-full transition-colors">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="w-10 h-10 bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center rounded-full transition-colors">
              <FaLinkedinIn size={16} />
            </a>
            <a href="#" className="w-10 h-10 bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center rounded-full transition-colors">
              <FaInstagram size={16} />
            </a>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white relative pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-blue-500">
            Resources
          </h4>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/hotels" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Book Your Stay
              </Link>
            </li>
            <li>
              <Link to="/host" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Become A Host
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white relative pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-blue-500">
            Support
          </h4>
          <ul className="space-y-3">
            <li>
              <Link to="/help" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/safety" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Safety Information
              </Link>
            </li>
            <li>
              <Link to="/cancellation" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Cancellation Options
              </Link>
            </li>
            <li>
              <Link to="/covid" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                COVID-19 Response
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-blue-200 hover:text-white transition-colors flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-4 text-white relative pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-8 before:h-0.5 before:bg-blue-500">
            Newsletter
          </h4>
          <p className="text-blue-200 mb-4">
            Subscribe to our newsletter for travel inspiration, tips, and exclusive offers. Join our community today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Enter your email" 
              className="bg-blue-800 border-blue-700 text-white placeholder-blue-400 rounded-md px-4 py-2 focus:border-blue-500" 
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              className="bg-blue-600 hover:bg-blue-500 border-none"
            >
              Subscribe
            </Button>
          </div>
          
          <div className="mt-6 bg-blue-800/50 rounded-lg p-4 border border-blue-700/50">
            <h5 className="text-white font-semibold mb-2">Join our community</h5>
            <p className="text-blue-200 text-sm mb-3">
              Create an account to save your favorite properties, get personalized recommendations, and more.
            </p>
            <Link to="/register">
              <Button type="default" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800 text-sm text-blue-300 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="space-x-4 mb-3 md:mb-0 flex flex-wrap justify-center md:justify-start gap-y-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors px-2">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-white transition-colors px-2">Terms of Use</Link>
            <Link to="/sales-refunds" className="hover:text-white transition-colors px-2">Sales and Refunds</Link>
            <Link to="/legal" className="hover:text-white transition-colors px-2">Legal</Link>
            <Link to="/site-map" className="hover:text-white transition-colors px-2">Site Map</Link>
          </div>
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} ListyGo. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;