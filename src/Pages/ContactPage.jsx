import React, { useState } from 'react';
import { FiPhoneCall, FiMail, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Card, Button, Form, Input, notification, message } from 'antd';
import Icon from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../utils/constants'; // Adjust the import based on your project structure

// Contact Info Card Component
const ContactInfoCard = ({ title, content }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
  >
    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
      <Icon size={22} />
    </div>
    <div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-1">{content}</p>
    </div>
  </motion.div>
);

// Social Media Button Component
const SocialButton = ({  color }) => (
  <motion.a 
    href="#" 
    whileHover={{ y: -3 }}
    className={`w-10 h-10 flex items-center justify-center rounded-full ${color}`}
  >
    <Icon size={18} color="white" />
  </motion.a>
);

// FAQ Item Component
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-gray-800"
      >
        {question}
        <span className="text-blue-500 text-xl transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-2 text-gray-600 text-sm"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 10 }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Get form data
      const formData = form.getFieldsValue();
      
      // Make the actual API call
      const response = await axios.post(`${API_URL}/users/contact-us`, formData);
      
      // Check if the request was successful
      if (response.status === 200 ) {
        // Reset form
        form.resetFields();
        
        // Show success notification
        message.success("Thank you for contacting us. We will get back to you shortly!")
      } else {
        // If API returns success: false
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      // Handle errors
      console.error('Contact form submission error:', error);
      
      notification.error({
        message: 'Message Failed',
        description: error.response?.data?.message || 'Unable to send your message. Please try again later.',
        placement: 'top',
        duration: 5, // Show for 5 seconds
      });
    } finally {
      // Always disable loading state when done
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-5 bg-gradient-to-tr from-blue-50 via-white to-blue-50 pt-24 pb-16 px-4">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Get in Touch</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions about our services or need assistance with your booking?
          We're here to help you every step of the way.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {/* Contact Cards Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants}>
            <ContactInfoCard 
              icon={FiPhoneCall} 
              title="Call Us" 
              content="+91 9876543210" 
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ContactInfoCard 
              icon={FiMail} 
              title="Email Us" 
              content="support@listygo.com" 
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ContactInfoCard 
              icon={FiMapPin} 
              title="Visit Us" 
              content="Baroda, Gujarat, India" 
            />
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-2/3"
          >
            <Card 
              title={
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <FiMessageSquare className="text-blue-500" /> 
                  Send Us a Message
                </div>
              } 
              className="shadow-lg rounded-xl"
              bordered={false}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input 
                      prefix={<FiUser className="text-gray-400 mr-2" />} 
                      placeholder="Your Name" 
                      size="large" 
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<FiMail className="text-gray-400 mr-2" />} 
                      placeholder="Your Email" 
                      size="large" 
                    />
                  </Form.Item>
                </div>
                
                <Form.Item
                  name="subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input 
                    prefix={<HiOutlineDocumentText className="text-gray-400 mr-2" />} 
                    placeholder="Subject" 
                    size="large" 
                  />
                </Form.Item>
                
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <Input.TextArea 
                    placeholder="Your Message" 
                    rows={6} 
                    size="large" 
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<FiSend />}
                    loading={loading}
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
          
          {/* FAQ and Social Section */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/3"
          >
            {/* FAQ Card */}
            <Card 
              title={<span className="text-lg font-bold text-gray-800">Frequently Asked Questions</span>} 
              className="shadow-md rounded-xl mb-6"
              bordered={false}
            >
              <div className="space-y-1">
                <FaqItem 
                  question="How can I book a hotel?" 
                  answer="You can book a hotel by searching for your destination, selecting your preferred hotel, and following our simple booking process." 
                />
                <FaqItem 
                  question="What payment methods do you accept?" 
                  answer="We accept all major credit cards, PayPal, and in select locations, direct bank transfers." 
                />
                <FaqItem 
                  question="What is your cancellation policy?" 
                  answer="Our cancellation policy varies by property. You can find specific details on the booking page before confirming your reservation." 
                />
                <FaqItem 
                  question="How do I contact customer support?" 
                  answer="You can reach our customer support team via phone, email, or by filling out the contact form on this page." 
                />
              </div>
            </Card>
            
            {/* Contact Hours Card */}
            <Card 
              title={<span className="text-lg font-bold text-gray-800">Contact Hours</span>}
              className="shadow-md rounded-xl mb-6"
              bordered={false}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Our customer service team is available 24/7 for emergency assistance.
                </p>
              </div>
            </Card>
            
            {/* Social Media Card */}
            <Card 
              title={<span className="text-lg font-bold text-gray-800">Connect With Us</span>}
              className="shadow-md rounded-xl"
              bordered={false}
            >
              <div className="flex justify-between mb-4">
                <SocialButton icon={FiMail} color="bg-red-500" />
                <SocialButton icon={FiPhoneCall} color="bg-blue-600" />
                <SocialButton icon={FiMapPin} color="bg-green-500" />
                <SocialButton icon={FiSend} color="bg-blue-400" />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Follow us on social media for updates, travel tips, and exclusive offers!
              </p>
            </Card>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 bg-white rounded-xl shadow-lg p-1 overflow-hidden"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118371.52525652264!2d73.09962304645858!3d22.320008759906867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1716167031707!5m2!1sen!2sin" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;