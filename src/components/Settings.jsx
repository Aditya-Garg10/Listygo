import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiBook, FiHelpCircle, FiShield, FiEdit } from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { Button, Tag, Switch } from 'antd';
import { updateDetails } from '../services/authService';

const Settings = ({ user, containerVariants, itemVariants }) => {
  const [preferences, setPreferences] = useState(user.preferences);

  useEffect(() => {
    setPreferences(user.preferences);
  }, [user]);

  const handleToggle = async (key, checked) => {
    const updatedPrefs = { ...preferences, [key]: checked };
    setPreferences(updatedPrefs);
    try {
      await updateDetails({ preferences: updatedPrefs });
    } catch (error) {
      console.error('Failed to update preferences', error);
    }
  };

  return (
    <motion.div
      key="settings"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Account Settings */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Account Settings</h3>
        <div className="space-y-6">
          {/* Email Preferences */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="font-medium text-gray-800 mb-4">Email Preferences</h4>
            <div className="space-y-3">
              {/* Booking Confirmations */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Booking Confirmations</div>
                  <div className="text-sm text-gray-500">
                    Receive emails when you make a reservation
                  </div>
                </div>
                <Switch 
                  checked={preferences?.booking_notifications} 
                  onChange={(checked) => handleToggle('booking_notifications', checked)} 
                />
              </div>
              {/* Promotions and Deals */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Promotions and Deals</div>
                  <div className="text-sm text-gray-500">
                    Stay updated with special offers and discounts
                  </div>
                </div>
                <Switch 
                  checked={preferences?.deal_alerts} 
                  onChange={(checked) => handleToggle('deal_alerts', checked)} 
                />
              </div>
              {/* Travel Tips */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Travel Tips</div>
                  <div className="text-sm text-gray-500">
                    Destination guides and travel advice
                  </div>
                </div>
                <Switch 
                  checked={preferences?.email_marketing} 
                  onChange={(checked) => handleToggle('email_marketing', checked)} 
                />
              </div>
            </div>
          </div>
          {/* Privacy Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="font-medium text-gray-800 mb-4">Privacy Settings</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
                  Enable 2FA
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Data Sharing</div>
                  <div className="text-sm text-gray-500">
                    Allow us to use your data for personalized recommendations
                  </div>
                </div>
                <Switch 
                  checked={preferences?.dataSharing} 
                  onChange={(checked) => handleToggle('dataSharing', checked)} 
                />
              </div>
            </div>
          </div>
          {/* Account Management */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Account Management</h4>
            <div className="space-y-4">
              <Button type="default" block icon={<FiEdit size={14} />}>
                Change Password
              </Button>
              <Button danger block icon={<AiOutlineLogout size={14} />}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Notification Settings */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Notification Settings</h3>
          <Button type="default">Reset to Default</Button>
        </div>
        <div className="space-y-4">
          {/* Push Notifications */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <FiBell className="text-blue-500" size={20} />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">
                  Alerts on your mobile device
                </div>
              </div>
            </div>
            <Switch 
              checked={preferences?.pushNotifications} 
              onChange={(checked) => handleToggle('pushNotifications', checked)} 
            />
          </div>
          {/* Booking Reminders */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <FiBook className="text-blue-500" size={20} />
              <div>
                <div className="font-medium">Booking Reminders</div>
                <div className="text-sm text-gray-500">
                  Reminders about upcoming stays
                </div>
              </div>
            </div>
            <Switch 
              checked={preferences?.bookingReminders} 
              onChange={(checked) => handleToggle('bookingReminders', checked)} 
            />
          </div>
          {/* Account Alerts */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiHelpCircle className="text-blue-500" size={20} />
              <div>
                <div className="font-medium">Account Alerts</div>
                <div className="text-sm text-gray-500">
                  Security and account-related notifications
                </div>
              </div>
            </div>
            <Switch 
              checked={preferences?.accountAlerts} 
              onChange={(checked) => handleToggle('accountAlerts', checked)} 
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;