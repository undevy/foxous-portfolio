import React from 'react';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';
import ContactModal from '../modals/ContactModal';
import Footer from '../common/Footer';
import AnimatedBackground from '../common/AnimatedBackground'; // Импортируем наш новый компонент
import usePortfolio from '../../hooks/usePortfolio';

const PortfolioLayout = () => {
  const {
    activeCompany,
    activeCase,
    isOpen,
    showContactModal,
    setShowContactModal,
    toggleCompany,
    selectCase,
    closeSidebar,
    closeProjectDetails
  } = usePortfolio();

  return (
    <div className="flex flex-col h-screen w-full p-8 gap-6">
      {/* Добавляем анимированный фон */}
      <AnimatedBackground />
      
      <div className="flex-1 flex gap-6">
        {isOpen && activeCompany && (
          /* Карточка обзора компании */
          <CompanyCard 
            company={activeCompany}
            activeCase={activeCase}
            setActiveCase={selectCase}
            handleCloseSidebar={closeSidebar}
            setShowContactModal={setShowContactModal}
          />
        )}

        {isOpen && activeCompany && activeCase && (
          /* Карточка с деталями кейса */
          <ProjectDetails 
            activeCase={activeCase}
            handleCloseDetail={closeProjectDetails}
          />
        )}
      </div>

      {/* Модальное окно контактов */}
      <ContactModal 
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
        activeCompany={activeCompany}
      />

      {/* Футер в стиле Mac OS dock */}
      <Footer 
        activeCompany={activeCompany}
        toggleCompany={toggleCompany}
      />
    </div>
  );
};

export default PortfolioLayout;