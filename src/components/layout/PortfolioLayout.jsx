// src/components/layout/PortfolioLayout.jsx
import React, { useEffect, useState } from 'react';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import AnimatedBackground from '../common/AnimatedBackground';
import ContactModal from '../modals/ContactModal';
import usePortfolio from '../../hooks/usePortfolio';

const PortfolioLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const portfolioState = usePortfolio();
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      <AnimatedBackground />
      
      {isMobile ? (
        <MobileLayout {...portfolioState} />
      ) : (
        <DesktopLayout {...portfolioState} />
      )}
      
      <ContactModal 
        showContactModal={portfolioState.showContactModal}
        setShowContactModal={portfolioState.setShowContactModal}
        activeCompany={portfolioState.activeCompany}
      />
    </div>
  );
};

export default PortfolioLayout;