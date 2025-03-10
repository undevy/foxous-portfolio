// src/components/layout/MobileLayout.jsx
import React from 'react';
import Footer from '../common/Footer';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';

const MobileLayout = ({ 
  activeCompany, 
  activeCase, 
  isOpen, 
  toggleCompany, 
  selectCase, 
  closeSidebar, 
  closeProjectDetails 
}) => {
  return (
    <>
      {/* Header at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
        <div className="max-w-[1000px] mx-auto">
          <Footer 
            activeCompany={activeCompany}
            toggleCompany={toggleCompany}
            isMobile={true}
          />
        </div>
      </div>
      
      {/* Content area with top padding to account for header */}
      <div className="pt-20 px-4 pb-4">
        {isOpen && activeCompany && (
          <div className="relative">
            {/* Company Card */}
            <div className="w-full mb-4">
              <CompanyCard 
                company={activeCompany}
                activeCase={activeCase}
                setActiveCase={selectCase}
                handleCloseSidebar={closeSidebar}
                setShowContactModal={() => {}}
                isMobile={true}
              />
            </div>
            
            {/* Project Details with overlay effect */}
            {activeCase && (
              <div 
                className="w-full"
                style={{
                  marginTop: '-30px',
                  position: 'relative',
                  zIndex: 20
                }}
              >
                <ProjectDetails 
                  activeCase={activeCase}
                  handleCloseDetail={closeProjectDetails}
                  isMobile={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MobileLayout;