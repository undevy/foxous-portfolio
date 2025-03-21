import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CompactIconGrid from '../../ui/CompactIconGrid';
import CircularMenu from '../CircularMenu';
import { useTheme } from '../../../contexts/ThemeContext';
import { companyData } from '../../../data/companies';
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
  const handleOpenCircularMenu = () => {
    setIsCircularMenuOpen(true);
    
    // Отслеживаем открытие кругового меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'circular_menu_open',
      'compact_grid'
    );
  };
  
  // Закрытие кругового меню (мобильная версия)
  const handleCloseCircularMenu = () => {
    setIsCircularMenuOpen(false);
    
    // Отслеживаем закрытие кругового меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'circular_menu_close',
      'close_button'
    );
  };

  // Обработчик клика по компании (для десктопной версии)
  const handleCompanyClick = (companyId) => {
    // Отслеживаем выбор компании в десктопной версии
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.COMPANY_SELECT,
      `footer_${companyId}`
    );
    
    toggleCompany(companyId);
  };
  
  // Обработчик клика по кнопке Connect
  const handleConnectClick = () => {
    // Отслеживаем нажатие на кнопку Connect
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.BUTTON_CLICK,
      'connect_button'
    );
    
    toggleCompany('contact');
  };
  
  return (
    <div className="relative">
      <div className="glassmorphism rounded-3xl shadow-sm w-full">
        <div className="flex items-center py-3 px-4">
          {/* Меню иконка (лиса/крестик) с переходом */}
          <div className={`icon-container relative ${isMenuOpen ? 'no-hover' : ''}`}>
            <button 
              className="w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none"
              onClick={() => {
                // Отслеживаем клик по иконке лисы/меню
                trackEvent(
                  EVENT_CATEGORIES.UI_INTERACTION,
                  isMenuOpen ? 'menu_toggle_close' : 'menu_toggle_open',
                  'fox_icon'
                );
                toggleCompany('menu');
              }}
              ref={foxIconRef}
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
              {!isMenuOpen && (
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
              <CompactIconGrid 
                onOpen={handleOpenCircularMenu} 
                activeCompany={activeCompany}
              />
            )}
            
            {/* Круговое меню (только мобильная версия) */}
            {isMobile && (
              <CircularMenu 
                isOpen={isCircularMenuOpen}
                onClose={handleCloseCircularMenu}
                toggleCompany={(companyId) => {
                  // Отслеживаем выбор компании в круговом меню
                  trackEvent(
                    EVENT_CATEGORIES.NAVIGATION,
                    EVENT_ACTIONS.COMPANY_SELECT,
                    `circular_menu_${companyId}`
                  );
                  toggleCompany(companyId);
                }}
                activeCompany={activeCompany}
              />
            )}
            
            {/* Иконки компаний для десктопной версии */}
            {!isMobile && (
              <div className="flex justify-center space-x-3">
                {companyList.map(companyId => (
                  <div 
                    key={companyId} 
                    className="icon-container relative"
                  >
                    <button 
                      onClick={() => handleCompanyClick(companyId)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none"
                      aria-label={companyId}
                    >
                      <img 
                        src={`/assets/svgs/${companyIds[companyId]}.svg`} 
                        alt={companyId}
                        className={`w-10 h-10 nav-icon ${activeCompany === companyId ? 'icon-active' : ''}`}
                      />
                      
                      {activeCompany === companyId && (
                        <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-primary border border-white dark:border-gray-800"></div>
                      )}
                      
                      <span className="tooltip tooltip-top">{companyData[companyId].name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Кнопка Connect */}
          <button 
            onClick={handleConnectClick}
            className="bg-primary hover:bg-primary-dark text-white dark:text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide btn-primary transition-colors duration-200 outline-none focus:outline-none"
            style={{ minWidth: isMobile ? 'auto' : '120px' }}
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