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
        <div className="mx-auto" style={{ maxWidth: "1048px" }}>
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
            {/* CompanyCard with reduced height when project is open */}
            <div className="w-full" style={{ maxHeight: activeCase ? "35vh" : "auto" }}>
              <CompanyCard 
                company={activeCompany}
                activeCase={activeCase}
                setActiveCase={selectCase}
                handleCloseSidebar={closeSidebar}
                setShowContactModal={() => {}}
                isMobile={true}
                // When project is open, make company card shorter
                maxHeight={activeCase ? "35vh" : "calc(100vh - 140px)"}
              />
            </div>
            
            {/* ProjectDetails with aggressive overlay - positioning for better overlap */}
            {activeCase && (
              <div 
                className="w-full"
                style={{
                  marginTop: "-80px", // Aggressive overlay for mobile
                  position: "relative",
                  zIndex: 20,
                  paddingBottom: "4px" // Small padding at bottom
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