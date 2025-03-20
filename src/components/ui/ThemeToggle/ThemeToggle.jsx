import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Компонент переключателя темы (светлая/тёмная)
 * @returns {JSX.Element} Компонент переключателя темы
 */
const ThemeToggle = () => {
  // Получаем состояние и функцию переключения из контекста
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-between p-2" onClick={toggleDarkMode}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900 flex items-center justify-center">
          <img 
            src={isDarkMode ? "/assets/svgs/Moon.svg" : "/assets/svgs/Sun.svg"} 
            alt={isDarkMode ? "Dark Mode" : "Light Mode"} 
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Theme</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </div>
        </div>
      </div>
      <div className={`w-10 h-5 flex items-center ${isDarkMode ? 'bg-primary' : 'bg-gray-200'} rounded-full px-1 transition-colors duration-300`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : ''}`}></div>
      </div>
    </div>
  );
};

export default ThemeToggle;