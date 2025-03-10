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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div>
          {/* Fox logo icon */}
          <button className="w-10 h-10 rounded-lg flex items-center justify-center relative hover:bg-gray-50">
            <img src="/assets/svgs/Fox.svg" alt="Foxous" className="w-8 h-8" />
          </button>
        </div>
        
        <div className="flex space-x-3">
          {/* Company icons */}
          {Object.keys(companyData).map(companyId => (
            <button 
              key={companyId}
              onClick={() => toggleCompany(companyId)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 relative"
              title={companyData[companyId].name}
            >
              <img 
                src={`/assets/svgs/${companyIds[companyId]}.svg`} 
                alt={companyData[companyId].name}
                className="w-8 h-8" 
              />
              
              {/* Active indicator dot */}
              {activeCompany === companyId && (
                <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600 border border-white"></div>
              )}
            </button>
          ))}
        </div>
        
        <div>
          {/* Connect button */}
          <button 
            onClick={() => toggleCompany('contact')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;