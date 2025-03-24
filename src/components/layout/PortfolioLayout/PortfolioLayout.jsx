// src/components/layout/PortfolioLayout/PortfolioLayout.jsx
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import MobileLayout from '../MobileLayout';
import DesktopLayout from '../DesktopLayout';
import AnimatedBackground from '../../ui/AnimatedBackground';
import ContactModal from '../../modals/ContactModal/ContactModal';
import MainMenu from '../../features/menu/MainMenu';
import usePortfolio from '../../../hooks/usePortfolio';
import { useDevice } from '../../../contexts/DeviceContext';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES } from '../../../services/analytics';
import { useFirstLoad } from '../../../contexts/FirstLoadContext';

/**
 * Корневой компонент макета приложения, отвечающий за выбор между мобильной и десктопной версиями
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @returns {JSX.Element} Компонент макета портфолио
 */
const PortfolioLayout = () => {
  // Используем хук usePortfolio для получения состояния портфолио
  const portfolioState = usePortfolio();
  
  // Определяем тип устройства через DeviceContext вместо проверки ширины окна
  const { isTouchDevice, isTablet, isIOS, isMobile } = useDevice();
  
  // Отслеживаем изменения ориентации экрана
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  
  // Храним предыдущий макет для отслеживания переключений
  const [prevLayout, setPrevLayout] = useState(null);
  
  // Получаем флаг первой загрузки и функцию его сброса
  const { isFirstLoad, completeFirstLoad } = useFirstLoad();
  
  // Определяем, какой макет использовать:
  // - Мобильный - для всех тач-устройств в портретной ориентации и малых планшетов
  // - Десктопный - для десктопов и больших планшетов в ландшафтной ориентации
  const useDesktopLayout = !isMobile && (!isTablet || (isTablet && orientation === 'landscape'));
  
  // Обработчик изменения ориентации экрана
  const handleOrientationChange = useCallback(() => {
    const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    
    if (newOrientation !== orientation) {
      setOrientation(newOrientation);
      
      // Отслеживаем изменение ориентации и возможное переключение макета
      trackEvent(
        EVENT_CATEGORIES.USER_PREFERENCE,
        'orientation_change',
        `${orientation}_to_${newOrientation}_${isTouchDevice ? 'touch' : 'mouse'}`
      );
    }
  }, [orientation, isTouchDevice]);
  
  // Слушатель изменения размера окна и ориентации
  useEffect(() => {
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [handleOrientationChange]);
  
  // Эффект для отслеживания времени использования макета
  useEffect(() => {
    const currentLayout = useDesktopLayout ? 'desktop' : 'mobile';
    
    // Отслеживаем инициализацию макета при первой загрузке
    if (prevLayout === null) {
      trackEvent(
        EVENT_CATEGORIES.CONTENT_VIEW,
        'layout_initialized',
        `${currentLayout}_${isTouchDevice ? 'touch' : 'mouse'}_${orientation}`
      );
      
      // Добавляем контекстную информацию о девайсе
      trackEvent(
        EVENT_CATEGORIES.USER_PREFERENCE,
        'device_context',
        `${isTouchDevice ? 'touch' : 'mouse'}_${isTablet ? 'tablet' : 'non-tablet'}_${isIOS ? 'ios' : 'non-ios'}`
      );
      
      // Начинаем отслеживать время использования макета
      startTimingEvent(`layout_view_${currentLayout}`);
    } 
    // Отслеживаем переключение макета во время использования (например, при повороте планшета)
    else if (prevLayout !== currentLayout) {
      // Завершаем отслеживание времени использования предыдущего макета
      endTimingEvent(
        EVENT_CATEGORIES.ENGAGEMENT,
        `layout_view_duration`,
        prevLayout
      );
      
      // Отслеживаем переключение макета
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        'layout_switched',
        `${prevLayout}_to_${currentLayout}_${isTouchDevice ? 'touch' : 'mouse'}_${orientation}`
      );
      
      // Начинаем отслеживать время использования нового макета
      startTimingEvent(`layout_view_${currentLayout}`);
    }
    
    // Обновляем предыдущий макет
    setPrevLayout(currentLayout);
    
    // При размонтировании завершаем отслеживание времени
    return () => {
      if (currentLayout) {
        endTimingEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          `layout_view_duration`,
          currentLayout
        );
      }
    };
  }, [useDesktopLayout, isTouchDevice, isTablet, isIOS, orientation, prevLayout]);
  
  // Сбрасываем флаг первой загрузки после монтирования компонента
  useEffect(() => {
    // Используем setTimeout, чтобы дать компонентам время на рендеринг
    // перед тем, как разрешить анимации
    const timer = setTimeout(() => {
      completeFirstLoad();
    }, 1000); // Даем 1 секунду на рендеринг всех компонентов
    
    return () => clearTimeout(timer);
  }, [completeFirstLoad]);

  // Мемоизированные компоненты для предотвращения ненужных ререндеров
  const backgroundComponent = useMemo(() => <AnimatedBackground />, []);
  
  const contactModalComponent = useMemo(() => (
    <ContactModal 
      showContactModal={portfolioState.showContactModal}
      setShowContactModal={portfolioState.setShowContactModal}
      activeCompany={portfolioState.activeCompany}
    />
  ), [
    portfolioState.showContactModal, 
    portfolioState.setShowContactModal, 
    portfolioState.activeCompany
  ]);
  
  const menuComponent = useMemo(() => (
    <MainMenu 
      isOpen={portfolioState.isMenuOpen}
      position={portfolioState.menuPosition}
      onClose={portfolioState.closeMenu}
      isMobile={isMobile}
    />
  ), [
    portfolioState.isMenuOpen,
    portfolioState.menuPosition,
    portfolioState.closeMenu,
    isMobile
  ]);

  return (
    <div className={`min-h-screen w-full overflow-hidden relative ${
      isTouchDevice ? 'touch-container' : ''
    } ${isIOS ? 'ios-specific' : ''}`}>
      {/* Анимированный фон */}
      {backgroundComponent}
      
      {/* Выбор макета в зависимости от типа устройства */}
      {useDesktopLayout ? (
        <DesktopLayout 
          {...portfolioState} 
          foxIconRef={portfolioState.foxIconRef}
          isMobile={isMobile}
          isMenuOpen={portfolioState.isMenuOpen}
          isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
        />
      ) : (
        <MobileLayout 
          {...portfolioState} 
          isCompanyCardTransformed={portfolioState.isCompanyCardTransformed}
          backToCompanyCard={portfolioState.backToCompanyCard}
          foxIconRef={portfolioState.foxIconRef}
          isMobile={isMobile}
          isMenuOpen={portfolioState.isMenuOpen}
          isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
        />
      )}
      
      {/* Модальное окно контактов */}
      {contactModalComponent}
      
      {/* Главное меню */}
      {menuComponent}
    </div>
  );
};

export default PortfolioLayout;