import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiCalendar, FiEdit, FiBell, FiShield } from 'react-icons/fi';
import { Avatar, Button, Tooltip, Progress, Tag } from 'antd';

const PersonalInfo = ({ user, containerVariants, itemVariants }) => {
  const isPhoneVerified = !!user.phone; // If 'phone' is not null/empty, treat as "Verified"

  return (
    <motion.div
      key="personal"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Profile Summary Card */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
              {user.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  size={80} 
                  className="border-4 border-blue-100"
                />
              ) : (
                <Avatar 
                  size={80} 
                  className="bg-blue-500 border-4 border-blue-100"
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              )}
              <div className="absolute bottom-0 right-0">
                <Tooltip title="Upload Photo">
                  <Button 
                    type="primary" 
                    shape="circle" 
                    size="small" 
                    icon={<FiEdit size={12} />} 
                    className="bg-blue-600 shadow-md"
                  />
                </Tooltip>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.name}
              </h3>
              <div className="text-gray-500 flex items-center gap-2 mt-1">
                <FiMail className="text-blue-500" size={14} />
                {user.email}
              </div>
              {user.phone && (
                <div className="text-gray-500 flex items-center gap-2 mt-1">
                  <FiPhone className="text-blue-500" size={14} />
                  {user.phone}
                </div>
              )}
              <div className="text-gray-500 flex items-center gap-2 mt-1">
                <FiCalendar className="text-blue-500" size={14} />
                Member since {new Date(user.memberSince || '2024-01-01').toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <Button 
            type="default"
            icon={<FiEdit size={14} />}
            className="border-blue-500 text-blue-600 hover:text-blue-700"
          >
            Edit Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Profile Completion</h4>
              <span className="text-sm font-medium text-blue-600">{user.profileCompleted || 65}%</span>
            </div>
            <Progress 
              percent={user.profileCompleted || 65} 
              showInfo={false} 
              strokeColor="#3b82f6"
              trailColor="#e0e7ff"
            />
            <div className="mt-2 text-xs text-gray-500">
              Complete your profile to unlock more features
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Reward Points</h4>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {user.rewardPoints || 750}
              </div>
              <div className="text-xs text-gray-500">150 points until next reward</div>
            </div>
            <div>
              <div className="bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded-full">
                {user.tier || 'Silver'} Member
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Saved Properties</h4>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {user.favoriteHotels || 5}
              </div>
              <div className="text-xs text-gray-500">Properties on your wishlist</div>
            </div>
            <div>
              <Button 
                type="default" 
                shape="circle" 
                icon={<FiEdit size={16} className="text-blue-500" />}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FiBell className="text-blue-500" size={18} />
                <span className="text-sm">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FiShield className="text-blue-500" size={18} />
                <span className="text-sm">Two-Factor Authentication</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Verification Status */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email Status */}
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <FiMail className="text-green-500" size={18} />
              <span className="text-sm font-medium">Email</span>
            </div>
            <Tag color="success">Verified</Tag>
          </div>

          {/* Phone Status */}
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <FiPhone
                className={isPhoneVerified ? 'text-green-500' : 'text-red-500'}
                size={18}
              />
              <span className="text-sm font-medium">Phone</span>
            </div>
            <Tag color={isPhoneVerified ? 'success' : 'error'}>
              {isPhoneVerified ? 'Verified' : 'Not Verified'}
            </Tag>
          </div>

          {/* ID Verification */}
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <FiEdit className="text-gray-500" size={18} />
              <span className="text-sm font-medium">ID Verification</span>
            </div>
            <Tag color="default">Not Started</Tag>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfo;