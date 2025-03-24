// src/components/layout/CircularMenu/CircularMenu.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент кругового меню для мобильной версии
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Открыто ли меню
 * @param {Function} props.onClose - Функция закрытия меню
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент кругового меню
 */
const CircularMenu = ({ 
  isOpen, 
  onClose, 
  toggleCompany, 
  activeCompany 
}) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Идентификаторы компаний для иконок
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Фиксированные позиции иконок в круговом меню (из Figma-макета)
  const companyPositions = {
    gmx: { top: '72px', left: '24px' },
    nexus: { top: '72px', left: '120px' },
    p2p: { top: '116px', left: '46px' },
    wildberries: { top: '116px', left: '98px' }
  };
  
  // Список доступных компаний
  const companyList = ['gmx', 'nexus', 'p2p', 'wildberries'];
  
  // Обработчик клика по иконке компании
  const handleCompanyClick = useCallback((companyId, event) => {
    event.stopPropagation();
    
    // Отслеживаем выбор компании в круговом меню
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.COMPANY_SELECT,
      `circular_menu_${companyId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    toggleCompany(companyId);
    onClose();
  }, [toggleCompany, onClose, isTouchDevice]);
  
  // Обработчик закрытия меню
  const handleCloseMenu = useCallback((e) => {
    e.stopPropagation();
    
    // Отслеживаем закрытие кругового меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'circular_menu_close',
      `close_button_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    onClose();
  }, [onClose, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для кнопки закрытия
  const closeTouchProps = useTouchClick(handleCloseMenu, {
    stopPropagation: true
  });

  // Определяем класс для анимации в зависимости от устройства
  const animationClass = isTablet || isIOS 
    ? 'transition-all duration-200 ease-out' 
    : 'transition-all duration-300 ease-in-out';

  return (
    <div 
      className={`absolute left-1/2 transform -translate-x-1/2 w-44 h-44 ${animationClass} overflow-visible ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      style={{ 
        transform: isOpen ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0)',
        top: '-88px',
        zIndex: 60,
        borderRadius: '12.5rem',
        border: '1px solid var(--color-glass-border)',
        background: 'var(--color-glass-bg)',
        boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)' // Для Safari
      }}
      onClick={(e) => {
        e.stopPropagation();
        
        // Отслеживаем закрытие кругового меню кликом по фону
        trackEvent(
          EVENT_CATEGORIES.UI_INTERACTION,
          'circular_menu_close',
          `background_click_${isTouchDevice ? 'touch' : 'mouse'}`
        );
        
        onClose();
      }}
    >
      {/* Иконки компаний */}
      {companyList.map((companyId, index) => (
        <div 
          key={companyId} 
          className="absolute w-8 h-8"
          style={{
            ...companyPositions[companyId],
            opacity: isOpen ? 1 : 0,
            transition: `all ${isTablet || isIOS ? '200ms ease-out' : '300ms cubic-bezier(0.34, 1.56, 0.64, 1)'}`,
            transitionDelay: `${index * 50}ms`,
          }}
        >
          <button 
            onClick={(e) => handleCompanyClick(companyId, e)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none ${
              isTouchDevice ? 'touch-button' : ''
            }`}
            aria-label={companyId}
            style={{
              transform: 'scale(0.8)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <img 
              src={`/assets/svgs/${companyIds[companyId]}.svg`} 
              alt={companyId}
              className={`w-10 h-10 nav-icon ${activeCompany === companyId ? 'icon-active' : ''}`}
            />
          </button>
        </div>
      ))}
      
      {/* Кнопка закрытия с белым фоном */}
      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out shadow-sm">
        <button
          {...closeTouchProps}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTouchDevice ? 'touch-button' : ''
          }`}
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isTouchDevice ? "20" : "16"} height={isTouchDevice ? "20" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

CircularMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(CircularMenu);