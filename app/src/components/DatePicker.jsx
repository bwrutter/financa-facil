import React from 'react';

const DatePicker = ({ value, onChange, icon }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-2.5">
          {icon}
        </div>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 ${icon ? 'pl-10' : 'pl-4'} pr-4`}
      />
    </div>
  );
};

export default DatePicker;