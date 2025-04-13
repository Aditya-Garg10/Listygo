import React from 'react';
import { BsTelephone } from 'react-icons/bs';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const AuthPageLayout = ({ children, imageSrc, title, subtitle }) => {
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
            <img src="/Logo.png" alt="logo" className="h-10 object-contain w-10" />
            <span>ListyGo</span>
          </div>
        </div>

        {children}
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 relative items-center justify-center bg-black"
      >
        <img
          src={imageSrc || "https://images.unsplash.com/photo-1557401623-38c6c32c334f"}
          alt="Background"
          className="w-full h-full object-cover rounded-l-[50px]"
        />
        <div className="absolute top-6 right-6 text-white text-sm flex items-center gap-2">
          <BsTelephone />
          <span>+256 787 667 581</span>
        </div>
        <div className="absolute bottom-10 left-10 text-white">
          <h3 className="text-3xl font-bold">{title || "Sign in to ListyGo"}</h3>
          <p className="text-sm mt-2">{subtitle || "Homes as unique as you."}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPageLayout;