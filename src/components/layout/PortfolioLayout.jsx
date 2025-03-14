// src/components/layout/PortfolioLayout.jsx
import React, { useEffect, useState, useCallback } from 'react';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import AnimatedBackground from '../common/AnimatedBackground';
import ContactModal from '../modals/ContactModal';
import usePortfolio from '../../hooks/usePortfolio';

const PortfolioLayout = () => {
  // Оптимизируем определение мобильного устройства используя useState и useCallback
  const [isMobile, setIsMobile] = useState(false);
  const portfolioState = usePortfolio();
  
  // Оптимизируем функцию проверки мобильного устройства
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    // Вызываем один раз при монтировании
    checkIfMobile();
    
    // Добавляем слушатель изменения размера
    window.addEventListener('resize', checkIfMobile);
    
    // Очищаем слушатель при размонтировании
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [checkIfMobile]);

  // Используем React.memo для AnimatedBackground (уже сделано)
  const backgroundComponent = React.useMemo(() => <AnimatedBackground />, []);
  
  // Используем React.memo для ContactModal
  const contactModalComponent = React.useMemo(() => (
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
        <MobileLayout {...portfolioState} />
      ) : (
        <DesktopLayout {...portfolioState} />
      )}
      
      {contactModalComponent}
    </div>
  );
};

export default PortfolioLayout;