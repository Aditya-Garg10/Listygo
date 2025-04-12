import React from 'react';
import logo from '../assets/logo01.png'; // Adjust the path as necessary
import {
  FaFacebookF,
  FaYoutube,
  FaPaperPlane,
  FaInstagram
} from 'react-icons/fa';
import { Link } from 'react-router-dom'; // ← Add this for routing

const FooterSection = () => {
  return (
    <footer className="bg-[#121C1B] text-white pt-10 relative">
      {/* Contact Us Callout */}
      <div className="bg-[#F3F2F1] text-black rounded-xl shadow-lg p-6 md:p-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between -top-12 relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">
          Do you have any Questions?
        </h2>
        <Link to="/contact">
          <button className="bg-gradient-to-r from-red-600 to-red-400 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-lg">
            Contact Us
          </button>
        </Link>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-5 gap-10 border-t border-gray-600 pt-20">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <Link to="/">
          <img src={logo} alt="ListyGo Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-white">ListyGo</span>
          </Link>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/hotels">Book Your Stay</Link></li>
            <li><Link to="/host">Become A Host</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/safety">Safety information</Link></li>
            <li><Link to="/cancellation">Cancellation options</Link></li>
            <li><Link to="/covid">Our COVID-19 Response</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Our Socials</h4>
          <div className="flex space-x-4 text-xl text-gray-300">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaPaperPlane /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

         {/* Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Sign Up</h4>
            <p className="text-sm text-gray-300 mb-4">
              Sign up to stay tuned for new accommodation and the latest updates. Let's do it!
            </p>
            <div className="flex items-center ">
  
              <a
                href="/register"
                className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 rounded-md text-white font-semibold"
              >
                Sign Up
              </a>
            </div>
          </div>
          <div>
            
          </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 text-sm text-gray-400 py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="space-x-6 mb-2 md:mb-0">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/sales-refunds">Sales and Refunds</Link>
          <Link to="/legal">Legal</Link>
          <Link to="/site-map">Site Map</Link>
        </div>
        <div>© 2025 All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default FooterSection;
