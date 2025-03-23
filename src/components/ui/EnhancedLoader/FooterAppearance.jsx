import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Компонент анимации появления футера
 * @returns {JSX.Element} - Компонент анимации футера
 */
const FooterAppearance = () => {
  const { isDarkMode } = useTheme();
  // Состояние для последовательного появления иконок
  const [showIcons, setShowIcons] = useState(false);
  
  // Эффект для запуска анимации последовательного появления иконок
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcons(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="footer-appearance-container">
      <div className="boot-indicator">
        <img 
          src={isDarkMode ? "/assets/svgs/Fox-Dark.svg" : "/assets/svgs/Fox.svg"}
          alt="Fox Logo" 
          className="boot-logo"
        />
      </div>
      
      {/* Прогресс-бар загрузки футера */}
      <div className="footer-loading-bar">
        <div className="footer-loading-progress"></div>
      </div>
      
      <div className={`footer-preview ${showIcons ? 'icons-visible' : ''}`}>
        <div className="footer-icon-placeholder" style={{ animationDelay: '0.1s' }}></div>
        <div className="footer-icon-placeholder" style={{ animationDelay: '0.2s' }}></div>
        <div className="footer-icon-placeholder" style={{ animationDelay: '0.3s' }}></div>
        <div className="footer-icon-placeholder" style={{ animationDelay: '0.4s' }}></div>
        <div className="footer-icon-placeholder" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <p className="boot-text">Preparing the interface...</p>
    </div>
  );
};

export default FooterAppearance;