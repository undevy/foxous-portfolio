import React from 'react';
import { companyData } from '../../data/companies';

const CompanyCard = ({ company, activeCase, setActiveCase, handleCloseSidebar, setShowContactModal }) => {
  const companyInfo = companyData[company];
  
  return (
    <div className="w-96 bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
      <button onClick={handleCloseSidebar} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="mb-6">
        <img 
          src="/api/placeholder/400/250" 
          alt={companyInfo.name} 
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{companyInfo.name}</h2>
        <p className="text-gray-600 mb-4">
          {companyInfo.description}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Key Projects</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveCase('tradepage')}
            className={`px-3 py-1 text-sm rounded-full ${
              activeCase === 'tradepage' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Trade Page
          </button>
          <button 
            onClick={() => setActiveCase('gasless')}
            className={`px-3 py-1 text-sm rounded-full ${
              activeCase === 'gasless' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Gasless & 1CT
          </button>
          <button 
            onClick={() => setActiveCase('pools')}
            className={`px-3 py-1 text-sm rounded-full ${
              activeCase === 'pools' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Pools
          </button>
          <button 
            onClick={() => setActiveCase('multichain')}
            className={`px-3 py-1 text-sm rounded-full ${
              activeCase === 'multichain' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Multichain
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            Other
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {companyInfo.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <a 
          href={companyInfo.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>Visit {companyInfo.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CompanyCard;