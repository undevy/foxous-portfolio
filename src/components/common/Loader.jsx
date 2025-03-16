// src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="flex flex-col items-center justify-center">
        <div className="loader-icon">
          <img 
            src="/assets/svgs/Fox.svg" 
            alt="Loading" 
            className="loader-pulse"
          />
          <div className="loader-ring"></div>
        </div>
        
        <p>Letting you in...</p>
      </div>
    </div>
  );
};

export default React.memo(Loader);