// src/components/layout/DesktopLayout.jsx
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
        <div className="w-full px-6 mx-auto max-w-[1000px]">
          <div className={`flex gap-6 ${isOpen ? 'flex' : 'hidden'}`}>
            {isOpen && activeCompany && (
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
            )}

            {isOpen && activeCompany && activeCase && (
              <div className="flex-grow" style={{ maxHeight: contentHeight }}>
                <ProjectDetails 
                  activeCase={activeCase}
                  handleCloseDetail={closeProjectDetails}
                  isMobile={false}
                  maxHeight={contentHeight}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer at the bottom */}
      <div 
        ref={footerRef} 
        className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6"
      >
        <div className="max-w-[1000px] mx-auto">
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