// src/components/ui/PowerOff/PowerOff.jsx

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFirstLoad } from '../../../contexts/FirstLoadContext';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES } from '../../../services/analytics';

/**
 * Компонент кнопки выключения сайта
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onPowerOff - Функция, вызываемая при выключении
 * @returns {JSX.Element} - Компонент кнопки выключения
 */
const PowerOff = ({ onPowerOff }) => {
  const { isDarkMode } = useTheme();
  const { resetFirstLoad } = useFirstLoad();
  const [isHovered, setIsHovered] = useState(false);
  
  // Определяем тип устройства (используем только isTouchDevice)
  const { isTouchDevice } = useDevice();
  
  // Обработчик нажатия на кнопку выключения
  const handlePowerOff = useCallback(() => {
    // Отслеживаем событие в аналитике
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'power_off_click',
      `main_menu_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    // Сбрасываем состояние первой загрузки
    resetFirstLoad();
    
    // Вызываем функцию обратного вызова для выключения
    if (onPowerOff) {
      onPowerOff();
    }
  }, [onPowerOff, resetFirstLoad, isTouchDevice]);
  
  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(handlePowerOff);
  
  return (
    <div 
      className={`flex items-center justify-between p-2 ${
        isTouchDevice ? 'touch-interactive-item' : 'menu-item menu-item-hover'
      } cursor-pointer`}
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
      
      {(isHovered || isTouchDevice) && (
        <div className="text-gray-400 dark:text-gray-500"></div>
      )}
    </div>
  );
};

PowerOff.propTypes = {
  onPowerOff: PropTypes.func
};

export default React.memo(PowerOff);