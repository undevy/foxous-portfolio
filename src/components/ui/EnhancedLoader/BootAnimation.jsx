import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Компонент анимации загрузки системы
 * @returns {JSX.Element} - Компонент анимации загрузки
 */
const BootAnimation = () => {
  // Получаем текущую тему из контекста
  const { isDarkMode } = useTheme();

  return (
    <div className="boot-animation-container">
      <div className="boot-spinner">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" stroke="var(--color-primary)" strokeWidth="4" strokeDasharray="176" strokeDashoffset="176" className="boot-spinner-circle" />
        </svg>
        
        <img 
          src={isDarkMode ? "/assets/svgs/Fox-Dark.svg" : "/assets/svgs/Fox.svg"}
          alt="Fox Logo" 
          className="boot-logo"
        />
      </div>
      <p className="boot-text">Loading...</p>
    </div>
  );
};

export default BootAnimation;