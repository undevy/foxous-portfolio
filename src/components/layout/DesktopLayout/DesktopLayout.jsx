// src/components/layout/DesktopLayout/DesktopLayout.jsx
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import CompanyCard from '../../features/company/CompanyCard';
import ProjectDetails from '../../features/project/ProjectDetails';
import { useDevice } from '../../../contexts/DeviceContext';
import { trackEvent, EVENT_CATEGORIES } from '../../../services/analytics';

/**
 * Компонент desktop-макета приложения
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {boolean} props.isOpen - Открыто ли окно
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {Function} props.selectCase - Функция выбора проекта
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.closeProjectDetails - Функция закрытия деталей проекта
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {Object} props.foxIconRef - Ref для иконки лисы
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {boolean} props.isMenuOpen - Открыто ли меню
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент desktop-макета
 */
const DesktopLayout = ({
  activeCompany,
  activeCase,
  isOpen,
  toggleCompany,
  selectCase,
  closeSidebar,
  closeProjectDetails,
  setShowContactModal,
  foxIconRef,
  isMobile,
  isMenuOpen,
  isFirstLoad
}) => {
  const footerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');
  const [cardHeight, setCardHeight] = useState('auto');
  
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();

  // Функция для расчета высоты контента с учетом iOS-устройств
  const calculateContentHeight = useCallback(() => {
    if (footerRef.current) {
      const viewportHeight = isIOS 
        ? window.innerHeight 
        : window.visualViewport ? window.visualViewport.height : window.innerHeight;
      
      const footerHeight = footerRef.current.offsetHeight;
      const footerMargin = 24;
      const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-bottom') || '0', 10);
      
      // Учитываем безопасную зону для iOS
      const totalBottomSpace = footerHeight + footerMargin + (isIOS ? safeAreaBottom : 0);
      
      setContentHeight(`calc(${viewportHeight}px - ${totalBottomSpace}px)`);
    }
  }, [isIOS]);

  // Инициализация и обновление при изменении размера окна
  useEffect(() => {
    calculateContentHeight();
    
    // Отслеживаем отображение десктопного макета
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'layout_view',
      `desktop_layout_${isTouchDevice ? 'touch_device' : 'mouse_device'}`
    );
    
    // Добавляем слушатель событий для изменения размера окна и ориентации
    window.addEventListener('resize', calculateContentHeight);
    window.addEventListener('orientationchange', calculateContentHeight);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', calculateContentHeight);
    }
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', calculateContentHeight);
      window.removeEventListener('orientationchange', calculateContentHeight);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', calculateContentHeight);
      }
    };
  }, [calculateContentHeight, isTouchDevice]);
  
  // Отслеживаем активную компанию и проект
  useEffect(() => {
    if (activeCompany) {
      trackEvent(
        EVENT_CATEGORIES.CONTENT_VIEW,
        'desktop_company_view',
        `${activeCompany}_${isTouchDevice ? 'touch' : 'mouse'}`
      );
      
      if (activeCase) {
        trackEvent(
          EVENT_CATEGORIES.CONTENT_VIEW,
          'desktop_project_view',
          `${activeCompany}_${activeCase}_${isTouchDevice ? 'touch' : 'mouse'}`
        );
      }
    }
  }, [activeCompany, activeCase, isTouchDevice]);

  // Мемоизируем футер для предотвращения ненужных перерисовок
  const footerComponent = useMemo(() => (
    <Footer 
      activeCompany={activeCompany} 
      toggleCompany={toggleCompany} 
      isMobile={false}
      foxIconRef={foxIconRef}
      isMenuOpen={isMenuOpen}
    />
  ), [activeCompany, toggleCompany, foxIconRef, isMenuOpen]);

  // Обработчик изменения высоты карточки компании
  const handleCardHeightChange = useCallback((height) => {
    setCardHeight(height);
  }, []);

  return (
    <>
      {/* Основной контент */}
      <div 
        className="flex justify-center items-center" 
        style={{ 
          height: contentHeight,
          WebkitOverflowScrolling: isIOS ? 'touch' : 'auto' // Улучшаем плавность прокрутки на iOS
        }}
      >
        <div 
          className={`w-full px-6 mx-auto ${isTouchDevice ? 'touch-container' : ''}`} 
          style={{ 
            maxWidth: '1048px',
            touchAction: isTouchDevice ? 'manipulation' : 'auto' // Оптимизация для тач-устройств
          }}
        >
          {isOpen && activeCompany && !activeCase && (
            <div className="flex justify-center">
              <div 
                className="w-[384px]" 
                style={{ 
                  maxHeight: contentHeight,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: isIOS ? 'touch' : 'auto'
                }}
              >
                <CompanyCard
                  company={activeCompany}
                  activeCase={activeCase}
                  setActiveCase={selectCase}
                  handleCloseSidebar={closeSidebar}
                  setShowContactModal={setShowContactModal}
                  isMobile={false}
                  maxHeight={contentHeight}
                  onHeightChange={handleCardHeightChange}
                  isFirstLoad={isFirstLoad}
                />
              </div>
            </div>
          )}

          {isOpen && activeCompany && activeCase && (
            <div className={`flex gap-6 ${isTablet || isIOS ? 'tablet-layout' : ''}`}>
              <div 
                className="w-[384px] shrink-0" 
                style={{ 
                  maxHeight: contentHeight,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: isIOS ? 'touch' : 'auto'
                }}
              >
                <CompanyCard
                  company={activeCompany}
                  activeCase={activeCase}
                  setActiveCase={selectCase}
                  handleCloseSidebar={closeSidebar}
                  setShowContactModal={setShowContactModal}
                  isMobile={false}
                  maxHeight={contentHeight}
                  onHeightChange={handleCardHeightChange}
                  isFirstLoad={isFirstLoad}
                />
              </div>
              <div 
                className="flex-grow" 
                style={{ 
                  maxHeight: contentHeight,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: isIOS ? 'touch' : 'auto'
                }}
              >
                <ProjectDetails
                  activeCase={activeCase}
                  handleCloseDetail={closeProjectDetails}
                  isMobile={false}
                  maxHeight={cardHeight}
                  isFirstLoad={isFirstLoad}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Футер внизу */}
      <div 
        ref={footerRef} 
        className={`fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 ${isIOS ? 'ios-footer' : ''}`}
        style={{
          paddingBottom: `calc(1.5rem + ${isIOS ? 'env(safe-area-inset-bottom, 0px)' : '0px'})`,
        }}
      >
        <div 
          className="mx-auto" 
          style={{ 
            maxWidth: '1000px',
            WebkitTransform: isIOS ? 'translateZ(0)' : 'none' // Улучшение производительности на iOS
          }}
        >
          {footerComponent}
        </div>
      </div>
    </>
  );
};

DesktopLayout.propTypes = {
  activeCompany: PropTypes.string,
  activeCase: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  closeProjectDetails: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  foxIconRef: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  isFirstLoad: PropTypes.bool
};

DesktopLayout.defaultProps = {
  isFirstLoad: false
};

export default React.memo(DesktopLayout);