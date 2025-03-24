// src/components/ui/GithubLink/GithubLink.jsx
import React, { useState, useCallback } from 'react';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент ссылки на GitHub репозиторий
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @returns {JSX.Element} Компонент ссылки на GitHub
 */
const GithubLink = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Определение типа устройства (используем только isTouchDevice)
  const { isTouchDevice } = useDevice();
  
  // Обработчик клика по ссылке с трекингом
  const handleGithubClick = useCallback(() => {
    // Отслеживаем клик с учетом типа устройства
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.LINK_CLICK,
      `github_repository_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [isTouchDevice]);
  
  // Использование оптимизированного хука для тач-устройств
  const touchProps = useTouchClick(handleGithubClick);
  
  return (
    <a 
      href="https://github.com/undevy/foxous-portfolio" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-2 ${
        isTouchDevice ? 'touch-interactive-item' : 'menu-item menu-item-hover'
      }`}
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img 
            src="/assets/svgs/Github.svg"
            alt="GitHub"
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">GitHub Repository</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">undevy/foxous-portfolio</div>
        </div>
      </div>
      
      {(isHovered || isTouchDevice) && (
        <div className="text-gray-400 dark:text-gray-500">
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

export default React.memo(GithubLink);