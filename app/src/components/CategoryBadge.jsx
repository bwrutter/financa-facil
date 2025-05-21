import React from 'react';
import { motion } from 'framer-motion';

const CategoryBadge = ({ 
  category, 
  size = 'md',
  animate = false 
}) => {
  const getColorScheme = () => {
    switch (category) {
      case 'Streaming':
        return 'bg-purple-100 text-purple-700';
      case 'Estudos':
        return 'bg-blue-100 text-blue-700';
      case 'Casa':
        return 'bg-green-100 text-green-700';
      case 'Transporte':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-xs';

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      } 
    },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  if (animate) {
    return (
      <motion.span 
        className={`inline-flex items-center rounded-full font-medium ${getColorScheme()} ${sizeClasses}`}
        variants={badgeVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {category}
      </motion.span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getColorScheme()} ${sizeClasses}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;