// src/components/layout/Footer/Footer.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CompactIconGrid from '../../ui/CompactIconGrid';
import CircularMenu from '../CircularMenu';
import { useTheme } from '../../../contexts/ThemeContext';
import { companyData } from '../../../data/companies';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент футера (нижней навигационной панели)
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {Object} props.foxIconRef - Ref для иконки лисы
 * @param {boolean} props.isMenuOpen - Открыто ли меню
 * @returns {JSX.Element} Компонент футера
 */
const Footer = ({ activeCompany, toggleCompany, isMobile, foxIconRef, isMenuOpen }) => {
  const [isCircularMenuOpen, setIsCircularMenuOpen] = useState(false);
  // Получаем текущую тему для выбора иконки лисы
  const { isDarkMode } = useTheme();
  // Используем информацию о типе устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Маппинг ID компаний к именам файлов SVG-иконок
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Список доступных компаний
  const companyList = ['gmx', 'nexus', 'p2p', 'wildberries'];
  
  // Открытие кругового меню (мобильная версия)
  const handleOpenCircularMenu = useCallback(() => {
    setIsCircularMenuOpen(true);
    
    // Отслеживаем открытие кругового меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.EXPAND_COLLAPSE,
      `circular_menu_open_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [isTouchDevice]);
  
  // Применяем useTouchClick к обработчику открытия меню
  const openMenuTouchProps = useTouchClick(handleOpenCircularMenu);
  
  // Закрытие кругового меню (мобильная версия)
  const handleCloseCircularMenu = useCallback(() => {
    setIsCircularMenuOpen(false);
    
    // Отслеживаем закрытие кругового меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.EXPAND_COLLAPSE,
      `circular_menu_close_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [isTouchDevice]);

  // Обработчик клика по Fox иконке (для открытия/закрытия меню)
  const handleFoxIconClick = useCallback(() => {
    // Отслеживаем клик по иконке лисы/меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      isMenuOpen ? EVENT_ACTIONS.MENU_CLOSE : EVENT_ACTIONS.MENU_OPEN,
      `fox_icon_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    toggleCompany('menu');
  }, [isMenuOpen, toggleCompany, isTouchDevice]);
  
  // Применяем useTouchClick к обработчику клика по иконке Fox
  const foxIconTouchProps = useTouchClick(handleFoxIconClick);

  // Обработчик клика по кнопке Connect
  const handleConnectClick = useCallback(() => {
    // Отслеживаем нажатие на кнопку Connect
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.BUTTON_CLICK,
      `connect_button_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    toggleCompany('contact');
  }, [toggleCompany, isTouchDevice]);
  
  // Применяем useTouchClick к обработчику клика по кнопке Connect
  const connectTouchProps = useTouchClick(handleConnectClick);
  
  // ИСПРАВЛЕНИЕ: Создаем единый обработчик для всех компаний
  const handleCompanyClick = useCallback((companyId) => {
    // Отслеживаем выбор компании в десктопной версии
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.COMPANY_SELECT,
      `footer_${companyId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    toggleCompany(companyId);
  }, [toggleCompany, isTouchDevice]);
  
  // Специфические классы для планшетов и iOS-устройств
  const tabletClass = isTablet ? 'tablet-optimized' : '';
  const iosClass = isIOS ? 'ios-specific' : '';
  
  return (
    <div className={`relative ${tabletClass} ${iosClass}`}>
      <div className="glassmorphism rounded-3xl shadow-sm w-full">
        <div className="flex items-center py-3 px-4">
          {/* Меню иконка (лиса/крестик) с переходом */}
          <div className={`icon-container relative ${isMenuOpen ? 'no-hover' : ''}`}>
            <button 
              className={`w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none ${
                isTouchDevice ? 'touch-button' : ''
              }`}
              {...foxIconTouchProps}
              ref={foxIconRef}
              style={{
                ...(isTouchDevice && {
                  minHeight: '44px',
                  minWidth: '44px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }),
                // Оптимизированные переходы для разных устройств
                transition: isTablet ? 'transform 0.2s ease-out' : 
                            isIOS ? 'transform 0.25s ease' : 
                            'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center icon-transition">
                {isMenuOpen ? (
                  // Крестик когда меню открыто
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700 dark:text-gray-200 icon-transition"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  // Иконка лисы когда меню закрыто (разная для светлой и тёмной темы)
                  <img 
                    src={isDarkMode ? "/assets/svgs/Fox-Dark.svg" : "/assets/svgs/Fox.svg"} 
                    alt="Foxous Menu" 
                    className={`w-10 h-10 nav-icon icon-transition ${activeCompany === 'menu' ? 'icon-active' : ''}`}
                  />
                )}
              </div>
              {!isMenuOpen && !isTouchDevice && (
                <span className="tooltip tooltip-top-left">Open Menu</span>
              )}
              
              {activeCompany === 'menu' && !isMenuOpen && (
                <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-primary border border-white dark:border-gray-800"></div>
              )}
            </button>
          </div>
          
          {/* Центральный контейнер для компактной сетки и кругового меню */}
          <div className="flex-1 flex justify-center relative">
            {/* Компактная сетка (только мобильная версия, когда меню закрыто) */}
            {isMobile && !isCircularMenuOpen && (
              <div
                {...openMenuTouchProps}
                style={{
                  ...(isTouchDevice && {
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }),
                  // Специфические оптимизации для iOS
                  ...(isIOS && {
                    cursor: 'pointer'
                  })
                }}
              >
                <CompactIconGrid 
                  onOpen={handleOpenCircularMenu} 
                  activeCompany={activeCompany}
                />
              </div>
            )}
            
            {/* Круговое меню (только мобильная версия) */}
            {isMobile && (
              <CircularMenu 
                isOpen={isCircularMenuOpen}
                onClose={handleCloseCircularMenu}
                toggleCompany={(companyId) => {
                  // ИСПРАВЛЕНИЕ: Вместо вызова trackEvent здесь, используем общий обработчик
                  handleCompanyClick(companyId);
                }}
                activeCompany={activeCompany}
              />
            )}
            
            {/* Иконки компаний для десктопной версии */}
            {!isMobile && (
              <div className="flex justify-center space-x-3">
                {companyList.map(companyId => {
                  // ИСПРАВЛЕНИЕ: Создаем обработчик для каждой компании без использования хуков в цикле
                  const companyTouchHandler = (e) => {
                    // Предотвращаем стандартное поведение для тач-событий
                    if (e.type === 'touchend') {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                    
                    // Вызываем общий обработчик
                    handleCompanyClick(companyId);
                  };
                  
                  return (
                    <div 
                      key={companyId} 
                      className="icon-container relative"
                    >
                      <button 
                        onClick={companyTouchHandler}
                        onTouchEnd={companyTouchHandler}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none ${
                          isTouchDevice ? 'touch-button' : ''
                        }`}
                        aria-label={companyId}
                        style={{
                          ...(isTouchDevice && {
                            minHeight: '44px',
                            minWidth: '44px',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                          }),
                          // Оптимизированные стили для планшетов и iOS
                          ...(isTablet && {
                            transition: 'transform 0.2s ease-out'
                          }),
                          ...(isIOS && {
                            transition: 'transform 0.25s ease',
                            cursor: 'pointer'
                          })
                        }}
                      >
                        <img 
                          src={`/assets/svgs/${companyIds[companyId]}.svg`} 
                          alt={companyId}
                          className={`w-10 h-10 nav-icon ${activeCompany === companyId ? 'icon-active' : ''}`}
                        />
                        
                        {activeCompany === companyId && (
                          <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-primary border border-white dark:border-gray-800"></div>
                        )}
                        
                        {!isTouchDevice && (
                          <span className="tooltip tooltip-top">{companyData[companyId].name}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Кнопка Connect */}
          <button 
            {...connectTouchProps}
            className={`bg-primary hover:bg-primary-dark text-white dark:text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide btn-primary transition-colors duration-200 outline-none focus:outline-none ${
              isTouchDevice ? 'touch-button' : ''
            }`}
            style={{
              minWidth: isMobile ? 'auto' : '120px',
              ...(isTouchDevice && {
                minHeight: '44px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }),
              // Оптимизация для iOS и планшетов
              ...(isTablet && {
                transition: 'all 0.2s ease-out'
              }),
              ...(isIOS && {
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                WebkitAppearance: 'none' // Улучшает нативный вид на iOS
              })
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  activeCompany: PropTypes.string,
  toggleCompany: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  foxIconRef: PropTypes.object,
  isMenuOpen: PropTypes.bool
};

// Мемоизация с пользовательским сравнением пропсов
export default React.memo(Footer, (prevProps, nextProps) => {
  return (
    prevProps.activeCompany === nextProps.activeCompany &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.isMenuOpen === nextProps.isMenuOpen
  );
});