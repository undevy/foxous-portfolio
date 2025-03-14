// src/components/common/Footer.jsx
import React from 'react';
import { companyData } from '../../data/companies';

const Footer = ({ activeCompany, toggleCompany, isMobile }) => {
  // Company IDs mapping for icons
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  return (
    // Remove any padding or margin from the container itself
    <div className="glassmorphism rounded-3xl shadow-sm w-full">
      {/* Один flex-контейнер с padding и space-between - как в Figma */}
      <div className="flex items-center justify-between py-3 px-4">
        {/* Меню */}
        <div className="icon-container relative">
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center outline-none focus:outline-none"
            onClick={() => toggleCompany('menu')}
          >
            <img 
              src="/assets/svgs/Fox.svg" 
              alt="Foxous Menu" 
              className={`w-10 h-10 nav-icon ${activeCompany === 'menu' ? 'icon-active' : ''}`}
            />
            <span className="tooltip tooltip-top-left">Open Menu</span>
            
            {activeCompany === 'menu' && (
              <div className="absolute bottom-[-10px] w-2 h-2 rounded-full bg-blue-600 border border-white"></div>
            )}
          </button>
        </div>
        
        {/* Иконки компаний - без дополнительных обёрток */}
        <div className="flex space-x-3">
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
        
        {/* Кнопка Connect */}
        <button 
          onClick={() => toggleCompany('contact')} 
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 outline-none focus:outline-none ${!isMobile ? 'min-w-[120px]' : ''}`}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

// Добавляем мемоизацию с пользовательским сравнением пропсов
export default React.memo(Footer, (prevProps, nextProps) => {
  return (
    prevProps.activeCompany === nextProps.activeCompany &&
    prevProps.isMobile === nextProps.isMobile
  );
});