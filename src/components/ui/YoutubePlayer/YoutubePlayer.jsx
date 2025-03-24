// src/components/ui/YoutubePlayer/YoutubePlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент встроенного YouTube-плеера с функцией аккордеона
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @returns {JSX.Element} Компонент YouTube-плеера
 */
const YoutubePlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoId = 'C5NPMy7r_-M';
  const iframeRef = useRef(null);
  
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();

  // Обработчик переключения состояния плеера
  const togglePlayer = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    // Отслеживаем действие с информацией об устройстве
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.EXPAND_COLLAPSE,
      `youtube_player_${newState ? 'expanded' : 'collapsed'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    if (newState && !videoStarted) {
      setVideoStarted(true);
      // Начало просмотра
      trackEvent(
        EVENT_CATEGORIES.CONTENT_VIEW,
        'video_play_start',
        `youtube_layer2_meetup_${isTouchDevice ? 'touch' : 'mouse'}`
      );
      
      // Начинаем отслеживать время просмотра
      startTimingEvent('youtube_video_view');
    }
  }, [isExpanded, videoStarted, isTouchDevice]);
  
  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(togglePlayer);
  
  // Отслеживание времени просмотра
  useEffect(() => {
    return () => {
      if (videoStarted) {
        endTimingEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          'video_view_duration',
          'youtube_layer2_meetup'
        );
      }
    };
  }, [videoStarted]);

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
    hiddenIframe.onload = () => {
      setVideoLoaded(true);
      trackEvent(
        EVENT_CATEGORIES.CONTENT_VIEW,
        'video_preload_complete',
        `youtube_player_${isTouchDevice ? 'touch' : 'mouse'}`
      );
    };
    document.body.appendChild(hiddenIframe);
    
    return () => {
      document.head.removeChild(preloadFrame);
      document.body.removeChild(hiddenIframe);
    };
  }, [videoId, isTouchDevice]);

  return (
    <div 
      className={`p-2 ${isTouchDevice ? 'touch-container' : ''}`}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      {...touchProps}
      style={{
        ...(isTouchDevice && {
          minHeight: '44px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        })
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900 flex items-center justify-center">
            <img 
              src="/assets/svgs/Youtube.svg" 
              alt="YouTube" 
              className="w-10 h-10"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Layer2 Meetup Talk</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Why UX in Web3 Sucks</div>
          </div>
        </div>
        
        {(isHovered || isTouchDevice) && (
          <div className="text-gray-400 dark:text-gray-500 icon-transition">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width={isTouchDevice ? "24" : "16"} 
              height={isTouchDevice ? "24" : "16"} 
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
      
      <div 
        className={`transition-all ${
          isTablet || isIOS ? 'duration-300 ease-out' : 'duration-500 ease-in-out'
        } overflow-hidden ${
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
              onLoad={() => {
                trackEvent(
                  EVENT_CATEGORIES.CONTENT_VIEW,
                  'video_iframe_loaded',
                  `youtube_player_${isTouchDevice ? 'touch' : 'mouse'}`
                );
              }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(YoutubePlayer);