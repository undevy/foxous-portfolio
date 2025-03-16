import React, { useState } from 'react';

/**
 * Компонент ссылки на GitHub репозиторий
 * @returns {JSX.Element} Компонент ссылки на GitHub
 */
const GithubLink = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href="https://github.com/undevy/foxous-portfolio" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <img 
            src="/assets/svgs/Github.svg"
            alt="GitHub"
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">GitHub Repository</div>
          <div className="text-sm text-gray-500">undevy/foxous-portfolio</div>
        </div>
      </div>
      
      {isHovered && (
        <div className="text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      )}
    </a>
  );
};

export default GithubLink;