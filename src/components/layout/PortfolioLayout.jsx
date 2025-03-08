import React, { useState } from 'react';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';
import ContactModal from '../modals/ContactModal';
import Footer from '../common/Footer';

const PortfolioLayout = () => {
  const [activeCompany, setActiveCompany] = useState('gmx');
  const [activeCase, setActiveCase] = useState('tradepage');
  const [isOpen, setIsOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleCloseSidebar = () => {
    setIsOpen(false);
    setActiveCompany(null);
  };

  const handleCloseDetail = () => {
    // Только закрытие панели деталей проекта
    setActiveCase(null);
  };

  const toggleCompany = (companyId) => {
    if (companyId === 'contact') {
      setShowContactModal(true);
      return;
    }
    
    if (activeCompany === companyId) {
      setActiveCompany(null);
      setIsOpen(false);
    } else {
      setActiveCompany(companyId);
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-blue-50 p-8 gap-6">
      <div className="flex-1 flex gap-6">
        {isOpen && activeCompany && (
          /* Карточка обзора проекта */
          <CompanyCard 
            company={activeCompany}
            activeCase={activeCase}
            setActiveCase={setActiveCase}
            handleCloseSidebar={handleCloseSidebar}
            setShowContactModal={setShowContactModal}
          />
        )}

        {isOpen && activeCompany && activeCase && (
          /* Карточка с деталями кейса */
          <ProjectDetails 
            activeCase={activeCase}
            handleCloseDetail={handleCloseDetail}
          />
        )}
      </div>

      {/* Модальное окно контактов */}
      <ContactModal 
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
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