// src/components/layout/PortfolioLayout.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import AnimatedBackground from '../common/AnimatedBackground';
import ContactModal from '../modals/ContactModal';
import Menu from '../common/Menu';
import usePortfolio from '../../hooks/usePortfolio';

const PortfolioLayout = () => {
  // Define device type on initial render
  const initialIsMobile = window.innerWidth < 768;
  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const portfolioState = usePortfolio();
  
  // Optimize mobile detection function
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up listener on unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [checkIfMobile]);

  // Memoized components
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
    <Menu 
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
      {backgroundComponent}
      
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
      
      {contactModalComponent}
      {menuComponent}
    </div>
  );
};

export default PortfolioLayout;