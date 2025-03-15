// src/components/layout/PortfolioLayout.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import AnimatedBackground from '../common/AnimatedBackground';
import ContactModal from '../modals/ContactModal';
import usePortfolio from '../../hooks/usePortfolio';

const PortfolioLayout = () => {
  // Сразу определяем тип устройства при первом рендере
  const initialIsMobile = window.innerWidth < 768;
  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const portfolioState = usePortfolio();
  
  // Оптимизируем функцию проверки мобильного устройства
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    // Добавляем слушатель изменения размера
    window.addEventListener('resize', checkIfMobile);
    
    // Очищаем слушатель при размонтировании
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [checkIfMobile]);

  // Используем React.memo для AnimatedBackground (уже сделано)
  const backgroundComponent = useMemo(() => <AnimatedBackground />, []);
  
  // Используем React.memo для ContactModal
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

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {backgroundComponent}
      
      {isMobile ? (
        <MobileLayout 
          {...portfolioState} 
          // Явно передаем новые пропсы для ясности (хотя они уже включены в ...portfolioState)
          isCompanyCardTransformed={portfolioState.isCompanyCardTransformed}
          backToCompanyCard={portfolioState.backToCompanyCard}
        />
      ) : (
        <DesktopLayout {...portfolioState} />
      )}
      
      {contactModalComponent}
    </div>
  );
};

export default PortfolioLayout;