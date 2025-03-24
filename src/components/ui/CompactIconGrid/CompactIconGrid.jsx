// src/components/ui/CompactIconGrid/CompactIconGrid.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компактная сетка иконок для мобильного отображения
 * Оптимизирована для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onOpen - Функция, вызываемая при клике на сетку
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент компактной сетки иконок
 */
const CompactIconGrid = ({ onOpen, activeCompany }) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Идентификаторы компаний для иконок
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Порядок компаний в сетке
  const gridOrder = [
    'gmx',      // верхний левый
    'nexus',    // верхний правый
    'p2p',      // нижний левый
    'wildberries' // нижний правый
  ];

  // Обработчик открытия сетки
  const handleOpenGrid = useCallback(() => {
    // Отслеживаем открытие меню компаний с информацией об устройстве
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.BUTTON_CLICK, // Используем константу вместо строкового литерала
      `footer_${activeCompany || 'none'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    // Вызываем функцию открытия
    onOpen();
    
    // Логируем для отладки в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('CompactIconGrid click device info:', { 
        isTouchDevice, 
        isTablet, 
        isIOS, 
        userAgent: navigator.userAgent 
      });
    }
  }, [onOpen, activeCompany, isTouchDevice, isTablet, isIOS]);

  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(handleOpenGrid, {
    preventDefault: true,
    stopPropagation: true
  });

  return (
    <button 
      {...touchProps}
      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 shadow-sm ${
        isTouchDevice ? 'touch-enhanced' : ''
      }`}
      aria-label="Открыть меню компаний"
      style={{ 
        minWidth: '40px', 
        minHeight: '40px',
        ...(isTouchDevice && {
          // Улучшенная область касания для мобильных устройств
          minHeight: '44px',
          minWidth: '44px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          // Добавляем активное состояние для визуальной обратной связи
          WebkitAppearance: 'none'
        })
      }}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-8 h-8">
        {gridOrder.map(companyId => (
          <div 
            key={companyId}
            className={`flex items-center justify-center overflow-hidden rounded-sm ${
              isTablet || isIOS ? 'transition-opacity duration-200 ease' : 'transition-opacity duration-300 ease-in-out'
            }`}
            style={{ 
              width: '16px', 
              height: '16px',
              opacity: activeCompany ? (activeCompany === companyId ? 1 : 0.2) : 1 // Прозрачность иконки в зависимости от активной компании
            }}
          >
            <img 
              src={`/assets/svgs/${companyIds[companyId]}.svg`} 
              alt={companyId}
              className="w-full h-full object-contain"
              loading="eager" // Явная предзагрузка иконок для улучшения отзывчивости
            />
          </div>
        ))}
      </div>
      
      {/* Добавляем скрытый индикатор активности для улучшения UI на тач-устройствах */}
      {isTouchDevice && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 rounded-lg pointer-events-none opacity-0 touch-active-indicator"
          style={{
            transform: 'scale(0.95)',
            transition: isTablet || isIOS ? 'all 0.2s ease' : 'all 0.3s ease'
          }}
        ></div>
      )}
    </button>
  );
};

CompactIconGrid.propTypes = {
  onOpen: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(CompactIconGrid);