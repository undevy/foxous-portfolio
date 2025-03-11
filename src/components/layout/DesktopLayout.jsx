import React, { useRef, useEffect, useState } from 'react';
import Footer from '../common/Footer';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';

const DesktopLayout = ({ 
  activeCompany, 
  activeCase, 
  isOpen, 
  toggleCompany, 
  selectCase, 
  closeSidebar, 
  closeProjectDetails 
}) => {
  const footerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');
  
  useEffect(() => {
    const calculateContentHeight = () => {
      if (footerRef.current) {
        const viewportHeight = window.innerHeight;
        const footerHeight = footerRef.current.offsetHeight;
        const footerMargin = 24;
        setContentHeight(`calc(${viewportHeight}px - ${footerHeight}px - ${footerMargin}px)`);
      }
    };
    
    calculateContentHeight();
    window.addEventListener('resize', calculateContentHeight);
    
    return () => {
      window.removeEventListener('resize', calculateContentHeight);
    };
  }, []);

  return (
    <>
      {/* Main content area */}
      <div 
        className="flex justify-center items-center"
        style={{ height: contentHeight }}
      >
        <div className="w-full px-6 mx-auto" style={{ maxWidth: "1048px" }}>
          {/* If only company card is open without a project - center it */}
          {isOpen && activeCompany && !activeCase && (
            <div className="flex justify-center">
              <div className="w-[384px]" style={{ maxHeight: contentHeight }}>
                <CompanyCard 
                  company={activeCompany}
                  activeCase={activeCase}
                  setActiveCase={selectCase}
                  handleCloseSidebar={closeSidebar}
                  setShowContactModal={() => {}}
                  isMobile={false}
                  maxHeight={contentHeight}
                />
              </div>
            </div>
          )}

          {/* If both cards are open - display them in a row */}
          {isOpen && activeCompany && activeCase && (
            <div className="flex gap-6">
              <div className="w-[384px] shrink-0" style={{ maxHeight: contentHeight }}>
                <CompanyCard 
                  company={activeCompany}
                  activeCase={activeCase}
                  setActiveCase={selectCase}
                  handleCloseSidebar={closeSidebar}
                  setShowContactModal={() => {}}
                  isMobile={false}
                  maxHeight={contentHeight}
                />
              </div>
              <div className="flex-grow" style={{ maxHeight: contentHeight }}>
                <ProjectDetails 
                  activeCase={activeCase}
                  handleCloseDetail={closeProjectDetails}
                  isMobile={false}
                  maxHeight={contentHeight}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer at the bottom */}
      <div 
        ref={footerRef} 
        className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6"
      >
        {/* Use exactly 1000px for footer, as you suggested */}
        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          <Footer 
            activeCompany={activeCompany}
            toggleCompany={toggleCompany}
            isMobile={false}
          />
        </div>
      </div>
    </>
  );
};

export default DesktopLayout;