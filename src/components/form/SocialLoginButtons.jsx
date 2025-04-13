import React from 'react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';

const SocialLoginButtons = ({ className = '' }) => {
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className={className || 'flex flex-col gap-3'}>
      <button
        type="button"
        onClick={() => handleSocialLogin('Google')}
        className="flex justify-center items-center py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-colors"
      >
        <FaGoogle className="text-[#EA4335] mr-3" size={18} />
        <span className="text-gray-700 font-medium">Google</span>
      </button>
      
      <button
        type="button"
        onClick={() => handleSocialLogin('Facebook')}
        className="flex justify-center items-center py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-colors"
      >
        <FaFacebookF className="text-[#1877F2] mr-3" size={18} />
        <span className="text-gray-700 font-medium">Facebook</span>
      </button>
      
      <button
        type="button"
        onClick={() => handleSocialLogin('Apple')}
        className="flex justify-center items-center py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-colors"
      >
        <FaApple className="text-black mr-3" size={18} />
        <span className="text-gray-700 font-medium">Apple</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;