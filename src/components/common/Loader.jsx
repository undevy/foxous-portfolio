// src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-30 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Анимированный лоадер в виде пульсирующего логотипа лисы */}
        <div className="relative w-16 h-16 mb-4">
          <img 
            src="/assets/svgs/Fox.svg" 
            alt="Loading" 
            className="w-16 h-16 animate-pulse"
          />
          {/* Анимированное кольцо вокруг логотипа */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full opacity-75 animate-ping"></div>
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