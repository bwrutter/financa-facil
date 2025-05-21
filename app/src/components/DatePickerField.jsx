import React from 'react';
import { Calendar } from 'lucide-react';

const DatePickerField = ({ 
  value, 
  onChange, 
  label,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default DatePickerField;