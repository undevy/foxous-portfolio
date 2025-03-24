// src/components/ui/StatusIndicator/StatusIndicator.jsx

import React, { useEffect, useCallback } from 'react';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES } from '../../../services/analytics';

/**
 * Компонент индикатора статуса (доступен/занят)
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @returns {JSX.Element} Компонент индикатора статуса
 */
const StatusIndicator = () => {
  const isAvailable = true; // Логика определения статуса будет добавлена позже
  
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Отслеживаем просмотр компонента
  useEffect(() => {
    trackEvent(
      EVENT_CATEGORIES.CONTENT_VIEW,
      'status_indicator_view',
      `${isAvailable ? 'available' : 'busy'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [isAvailable, isTouchDevice]);
  
  // Обработчик клика по индикатору
  const handleStatusClick = useCallback(() => {
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'status_indicator_click',
      `${isAvailable ? 'available' : 'busy'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [isAvailable, isTouchDevice]);
  
  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(handleStatusClick);

  return (
    <div 
      className={`flex items-center justify-between p-2 ${
        isTouchDevice ? 'touch-interactive-item' : 'menu-item menu-item-hover'
      }`}
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
        <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-900">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isAvailable && (
              <div 
                className={`absolute inset-0 w-3 h-3 rounded-full bg-green-500 ${
                  isTablet || isIOS ? 'status-pulse-optimized' : 'animate-ping'
                } opacity-75`}
              ></div>
            )}
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Status</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isAvailable ? 'Available for projects' : 'Currently busy'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatusIndicator);