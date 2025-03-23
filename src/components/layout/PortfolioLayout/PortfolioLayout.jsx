// src/components/layout/PortfolioLayout/PortfolioLayout.jsx
import React, { useMemo, useEffect } from 'react';
import MobileLayout from '../MobileLayout';
import DesktopLayout from '../DesktopLayout';
import AnimatedBackground from '../../ui/AnimatedBackground';
import ContactModal from '../../modals/ContactModal/ContactModal';
import MainMenu from '../../features/menu/MainMenu';
import usePortfolio from '../../../hooks/usePortfolio';
import { useFirstLoad } from '../../../contexts/FirstLoadContext'; // Импортируем хук

/**
 * Корневой компонент макета приложения, отвечающий за выбор между мобильной и десктопной версиями
 * @returns {JSX.Element} Компонент макета портфолио
 */
const PortfolioLayout = () => {
  // Получаем все состояния и функции из хука usePortfolio, включая флаг isMobile
  const portfolioState = usePortfolio();
  // Используем isMobile из portfolioState вместо локального состояния
  const { isMobile } = portfolioState;
  
  // Получаем флаг первой загрузки и функцию его сброса
  const { isFirstLoad, completeFirstLoad } = useFirstLoad();
  
  // Сбрасываем флаг первой загрузки после монтирования компонента
  useEffect(() => {
    // Используем setTimeout, чтобы дать компонентам время на монтирование
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
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Анимированный фон */}
      {backgroundComponent}
      
      {/* Выбор макета в зависимости от типа устройства */}
      {isMobile ? (
        <MobileLayout 
          {...portfolioState} 
          isCompanyCardTransformed={portfolioState.isCompanyCardTransformed}
          backToCompanyCard={portfolioState.backToCompanyCard}
          foxIconRef={portfolioState.foxIconRef}
          isMobile={isMobile}
          isMenuOpen={portfolioState.isMenuOpen}
          isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
        />
      ) : (
        <DesktopLayout 
          {...portfolioState} 
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