// src/components/layout/PortfolioLayout/PortfolioLayout.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MobileLayout from '../MobileLayout';
import DesktopLayout from '../DesktopLayout';
import AnimatedBackground from '../../ui/AnimatedBackground';
import ContactModal from '../../modals/ContactModal/ContactModal';
import MainMenu from '../../features/menu/MainMenu';
import usePortfolio from '../../../hooks/usePortfolio';

/**
 * Корневой компонент макета приложения, отвечающий за выбор между мобильной и десктопной версиями
 * @returns {JSX.Element} Компонент макета портфолио
 */
const PortfolioLayout = () => {
  // Получаем все состояния и функции из хука usePortfolio, включая флаг isMobile
  const portfolioState = usePortfolio();
  // Используем isMobile из portfolioState вместо локального состояния
  const { isMobile } = portfolioState;

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
        />
      ) : (
        <DesktopLayout 
          {...portfolioState} 
          foxIconRef={portfolioState.foxIconRef}
          isMobile={isMobile}
          isMenuOpen={portfolioState.isMenuOpen}
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