import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const EmptyState = ({ 
  title, 
  message, 
  icon = <SearchX className="h-12 w-12 text-gray-400" />
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center max-w-md">{message}</p>
    </motion.div>
  );
};

export default EmptyState;