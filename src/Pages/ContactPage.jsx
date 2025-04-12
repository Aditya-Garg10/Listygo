import React, { useState } from 'react';
import { FiPhoneCall, FiMail, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';



const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-1/4 p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-6">Get in Touch</h2>
          <div className="space-y-6 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <FiPhoneCall className="text-blue-600 text-lg mt-1" />
              <div>
                <p className="font-medium">Call Us</p>
                <p>+91 9876543210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMail className="text-blue-600 text-lg mt-1" />
              <div>
                <p className="font-medium">Email Us</p>
                <p>support@listygo.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-blue-600 text-lg mt-1" />
              <div>
                <p className="font-medium">Visit Us</p>
                <p>Baroda, Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-3/4 p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Send Us a Message</h2>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <textarea
              placeholder="Your Message"
              required
              rows="6"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Send Message
            </button>
          </motion.form>

          {isSubmitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-green-600 font-medium"
            >
              🎉 Message sent successfully!
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
