import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFirstLoad } from '../../../contexts/FirstLoadContext';
import { trackEvent, EVENT_CATEGORIES } from '../../../services/analytics';

/**
 * Компонент кнопки выключения сайта
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onPowerOff - Функция, вызываемая при выключении
 * @returns {JSX.Element} - Компонент кнопки выключения
 */
const PowerOff = ({ onPowerOff }) => {
  const { isDarkMode } = useTheme();
  const { resetFirstLoad } = useFirstLoad();
  const [isHovered, setIsHovered] = useState(false);
  
  // Обработчик нажатия на кнопку выключения
  const handlePowerOff = () => {
    // Отслеживаем событие в аналитике
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'power_off_click',
      'main_menu'
    );
    
    // Сбрасываем состояние первой загрузки
    resetFirstLoad();
    
    // Вызываем функцию обратного вызова для выключения
    if (onPowerOff) {
      onPowerOff();
    }
  };
  
  return (
    <div 
      className="flex items-center justify-between p-2 menu-item menu-item-hover cursor-pointer"
      onClick={handlePowerOff}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900 flex items-center justify-center">
          <img 
            src={isDarkMode ? "/assets/svgs/Off-Dark.svg" : "/assets/svgs/Off.svg"}
            alt="Power Off" 
            className="w-10 h-10"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Power Off</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Shut down and restart</div>
        </div>
      </div>
      
      {isHovered && (
        <div className="text-gray-400 dark:text-gray-500">
          {/*<svg 
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
            <path d="M18 15l-6-6-6 6"/>
          </svg>*/}
        </div>
      )}
    </div>
  );
};

PowerOff.propTypes = {
  onPowerOff: PropTypes.func
};

export default PowerOff;