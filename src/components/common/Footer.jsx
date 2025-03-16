// src/components/common/Footer.jsx
import React, { useState } from 'react';
import { companyData } from '../../data/companies';
import CompactIconGrid from './CompactIconGrid';
import MobileCircularMenu from './MobileCircularMenu';

const Footer = ({ activeCompany, toggleCompany, isMobile, foxIconRef, isMenuOpen }) => {
  const [isCircularMenuOpen, setIsCircularMenuOpen] = useState(false);
  
  // Company icon mappings
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Open circular menu (mobile)
  const handleOpenCircularMenu = () => {
    setIsCircularMenuOpen(true);
  };
  
  // Close circular menu (mobile)
  const handleCloseCircularMenu = () => {
    setIsCircularMenuOpen(false);
  };
  
  return (
    <div className="relative">
      <div className="glassmorphism rounded-3xl shadow-sm w-full">
        <div className="flex items-center py-3 px-4">
          {/* Menu icon (fox/close) with transition */}
          <div className={`icon-container relative ${isMenuOpen ? 'no-hover' : ''}`}>
            <button 
              className="w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none"
              onClick={() => toggleCompany('menu')}
              ref={foxIconRef}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center icon-transition">
                {isMenuOpen ? (
                  // Cross icon when menu is open
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700 icon-transition"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  // Fox icon when menu is closed
                  <img 
                    src="/assets/svgs/Fox.svg" 
                    alt="Foxous Menu" 
                    className={`w-10 h-10 nav-icon icon-transition ${activeCompany === 'menu' ? 'icon-active' : ''}`}
                  />
                )}
              </div>
              {!isMenuOpen && (
                <span className="tooltip tooltip-top-left">Open Menu</span>
              )}
              
              {activeCompany === 'menu' && !isMenuOpen && (
                <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-blue-600 border border-white"></div>
              )}
            </button>
          </div>
          
          {/* Center container for compact grid and circular menu */}
          <div className="flex-1 flex justify-center relative">
            {/* Compact grid (mobile only, when menu is closed) */}
            {isMobile && !isCircularMenuOpen && (
              <CompactIconGrid 
                onOpen={handleOpenCircularMenu} 
                activeCompany={activeCompany}
              />
            )}
            
            {/* Circular menu (mobile only) */}
            {isMobile && (
              <MobileCircularMenu 
                isOpen={isCircularMenuOpen}
                onClose={handleCloseCircularMenu}
                toggleCompany={toggleCompany}
                activeCompany={activeCompany}
              />
            )}
            
            {/* Company icons for desktop */}
            {!isMobile && (
              <div className="flex justify-center space-x-3">
                {Object.keys(companyData).map(companyId => (
                  <div 
                    key={companyId} 
                    className="icon-container relative"
                  >
                    <button 
                      onClick={() => toggleCompany(companyId)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none"
                      aria-label={companyData[companyId].name}
                    >
                      <img 
                        src={`/assets/svgs/${companyIds[companyId]}.svg`} 
                        alt={companyData[companyId].name}
                        className={`w-10 h-10 nav-icon ${activeCompany === companyId ? 'icon-active' : ''}`}
                      />
                      
                      {activeCompany === companyId && (
                        <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-blue-600 border border-white"></div>
                      )}
                      
                      <span className="tooltip tooltip-top">{companyData[companyId].name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Connect button */}
          <button 
            onClick={() => toggleCompany('contact')} 
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 outline-none focus:outline-none ${!isMobile ? 'min-w-[120px]' : ''}`}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoization with custom props comparison
export default React.memo(Footer, (prevProps, nextProps) => {
  return (
    prevProps.activeCompany === nextProps.activeCompany &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.isMenuOpen === nextProps.isMenuOpen
  );
});