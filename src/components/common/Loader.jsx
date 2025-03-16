// src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="flex flex-col items-center">
        {/* Анимированный лоадер */}
        <div className="loader-icon">
          <img 
            src="/assets/svgs/Fox.svg" 
            alt="Loading" 
            className="w-16 h-16 loader-pulse"
          />
          {/* Анимированное кольцо вокруг логотипа */}
          <div className="loader-ring"></div>
        </div>
        
        {/* Текст загрузки */}
        <p className="text-gray-700 text-sm font-medium animate-pulse">
          Letting you in...
        </p>
      </div>
    </div>
  );
};

export default React.memo(Loader);