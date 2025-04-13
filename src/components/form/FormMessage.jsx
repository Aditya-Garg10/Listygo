import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const FormMessage = ({ message, type }) => {
  if (!message) return null;

  const colorClass = type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`${colorClass} mb-4 p-2 rounded`}
    >
      {message}
    </motion.div>
  );
};

export default FormMessage;