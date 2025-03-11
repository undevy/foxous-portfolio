import React, { useRef, useEffect } from 'react';
import { companyData } from '../../data/companies';
import { projectsByCompany } from '../../data/projects';

const CompanyCard = ({ company, activeCase, setActiveCase, handleCloseSidebar, setShowContactModal, isMobile, maxHeight }) => {
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];
  const cardRef = useRef(null);
  
  // Calculate content height for scrolling area - using maxHeight instead of height
  const contentHeight = maxHeight ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 120px)` : 'calc(100vh - 260px)';

  // Send card height to parent component for syncing with project card
  useEffect(() => {
    if (!isMobile && cardRef.current && window.syncCardHeight) {
      window.syncCardHeight(cardRef.current.offsetHeight);
    }
  }, [isMobile, company]);
  
  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden"
      style={{
        height: '100%',
        // Using standard maxHeight calculation without conditional overrides
        maxHeight: maxHeight || (isMobile ? 'calc(100vh - 140px)' : 'none'),
        zIndex: isMobile ? 10 : 'auto'
      }}
    >
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-white p-6 pb-4 border-b border-gray-50">
        <button 
          onClick={handleCloseSidebar} 
          className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center z-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <img 
          src="/api/placeholder/400/250" 
          alt={companyInfo.name} 
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2 text-left">{companyInfo.name}</h2>
      </div>

      {/* Scrollable content - FIXED by using maxHeight instead of height */}
      <div className="p-6 pt-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: contentHeight }}>
        <p className="text-base text-gray-600 mb-4 text-left">
          {companyInfo.description}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Key Projects</h3>
          <div className="flex flex-wrap gap-2">
            {companyProjects.map(project => (
              <button 
                key={project.id || project.title}
                onClick={() => setActiveCase(project.id || project.title.toLowerCase().replace(/\s+/g, ''))}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCase === (project.id || project.title.toLowerCase().replace(/\s+/g, '')) 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {project.title.split(' ')[0]}
              </button>
            ))}
            <button 
              onClick={() => setShowContactModal(true)}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Other
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {companyInfo.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
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
    </div>
  );
};

export default CompanyCard;