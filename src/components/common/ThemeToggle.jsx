// src/components/common/ThemeToggle.jsx
import React, { useState } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    // Theme switching logic will be added later
  };

  return (
    <div className="flex items-center justify-between p-2" onClick={toggleTheme}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <img 
            src={isDarkMode ? "/assets/svgs/Moon.svg" : "/assets/svgs/Sun.svg"} 
            alt={isDarkMode ? "Dark Mode" : "Light Mode"} 
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">Theme</div>
          <div className="text-sm text-gray-500">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
        </div>
      </div>
      <div className={`w-10 h-5 flex items-center ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'} rounded-full px-1 transition-colors duration-300`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : ''}`}></div>
      </div>
    </div>
  );
};

export default ThemeToggle;