// src/components/ui/ThemeToggle/ThemeToggle.jsx

import React, { useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент переключателя темы (светлая/тёмная)
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @returns {JSX.Element} Компонент переключателя темы
 */
const ThemeToggle = () => {
  // Получаем состояние и функцию переключения из контекста
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Обработчик переключения темы с трекингом
  const handleToggle = useCallback(() => {
    // Отслеживаем переключение темы
    trackEvent(
      EVENT_CATEGORIES.USER_PREFERENCE,
      EVENT_ACTIONS.THEME_CHANGE,
      `theme_toggle_to_${!isDarkMode ? 'dark' : 'light'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    // Переключаем тему
    toggleDarkMode();
  }, [isDarkMode, toggleDarkMode, isTouchDevice]);
  
  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(handleToggle);

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
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900 flex items-center justify-center">
          <img 
            src={isDarkMode ? "/assets/svgs/Moon.svg" : "/assets/svgs/Sun.svg"} 
            alt={isDarkMode ? "Enabled" : "Disabled"} 
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isDarkMode ? "Enabled" : "Disabled"}
          </div>
        </div>
      </div>
      <div 
        className={`w-10 h-5 flex items-center ${isDarkMode ? 'bg-primary' : 'bg-gray-200'} rounded-full px-1 transition-colors ${
          isTablet || isIOS ? 'duration-200 ease' : 'duration-300 ease-in-out'
        }`}
      >
        <div 
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            isTablet || isIOS ? 'duration-200 ease' : 'duration-300 ease-in-out'
          } ${isDarkMode ? 'translate-x-4' : ''}`}
        ></div>
      </div>
    </div>
  );
};

export default React.memo(ThemeToggle);