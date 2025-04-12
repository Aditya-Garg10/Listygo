import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
          src={logo} alt="ListyGo Logo" className="h-10 w-auto" />
          
          <span className="text-xl font-bold text-blue-600">ListyGo</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/hotels" className="hover:text-blue-600">Hotels</Link>
          <Link to="/deals" className="hover:text-blue-600">Deals</Link>
          <Link to="/about" className="hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
          <Link to="/account" className="hover:text-blue-600 font-semibold">My Account</Link>
          <Link to="/login" className="text-blue-600 border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50">
            Log In
          </Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/hotels" className="hover:text-blue-600">Hotels</Link>
          <Link to="/deals" className="hover:text-blue-600">Deals</Link>
          <Link to="/about" className="hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
          <Link to="/account" className="hover:text-blue-600 font-semibold">My Account</Link>
          <Link to="/login" className="text-blue-600 border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50">
            Log In
          </Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
