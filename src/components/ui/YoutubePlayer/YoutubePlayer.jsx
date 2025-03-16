import React, { useState, useEffect, useRef } from 'react';

/**
 * Компонент встроенного YouTube-плеера с функцией аккордеона
 * @returns {JSX.Element} Компонент YouTube-плеера
 */
const YoutubePlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoId = 'C5NPMy7r_-M';
  const iframeRef = useRef(null);

  // Предзагружаем видео
  useEffect(() => {
    // Создаем скрытый iframe для предзагрузки
    const preloadFrame = document.createElement('link');
    preloadFrame.rel = 'preload';
    preloadFrame.as = 'iframe';
    preloadFrame.href = `https://www.youtube.com/embed/${videoId}?rel=0`;
    document.head.appendChild(preloadFrame);
    
    // Скрытый iframe для фактической предзагрузки
    const hiddenIframe = document.createElement('iframe');
    hiddenIframe.style.display = 'none';
    hiddenIframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
    hiddenIframe.onload = () => setVideoLoaded(true);
    document.body.appendChild(hiddenIframe);
    
    return () => {
      document.head.removeChild(preloadFrame);
      document.body.removeChild(hiddenIframe);
    };
  }, [videoId]);

  return (
    <div 
      className="p-2"
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <img 
              src="/assets/svgs/Youtube.svg" 
              alt="YouTube" 
              className="w-10 h-10"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">Layer2 Meetup Talk</div>
            <div className="text-sm text-gray-500">Why UX in Web3 Sucks</div>
          </div>
        </div>
        
        {isHovered && (
          <div className="text-gray-400 icon-transition">
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
              className="icon-transition"
            >
              {isExpanded ? (
                <polyline points="18 15 12 9 6 15"></polyline>
              ) : (
                <polyline points="6 9 12 15 18 9"></polyline>
              )}
            </svg>
          </div>
        )}
      </div>
      
      {/* Плавная анимация открытия/закрытия */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          {(isExpanded || videoLoaded) && (
            <iframe 
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;