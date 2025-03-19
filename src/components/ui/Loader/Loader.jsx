import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Компонент отображает анимированный индикатор загрузки
 * @returns {JSX.Element} Компонент индикатора загрузки
 */
const Loader = () => {
  // Получаем текущую тему из контекста
  const { isDarkMode } = useTheme();

  return (
    <div className="loader-container bg-page">
      <div className="flex flex-col items-center justify-center">
        <div className="loader-icon">
          <img 
            src={isDarkMode ? "/assets/svgs/Fox-Dark.svg" : "/assets/svgs/Fox.svg"}
            alt="Loading" 
            className="loader-pulse"
          />
          <div className="loader-ring" style={{ borderColor: 'var(--color-primary)' }}></div>
        </div>
        
        <p className="text-primary">Letting you in...</p>
      </div>
    </div>
  );
};

export default React.memo(Loader);