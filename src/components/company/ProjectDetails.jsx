// src/components/company/ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { caseStudies } from '../../data/projects';

const ProjectDetails = ({ activeCase, handleCloseDetail, isMobile, maxHeight }) => {
  const [cardHeight, setCardHeight] = useState('auto');
  
  // Find project by ID or key
  const project = Object.values(caseStudies).find(p => 
    p.id === activeCase || 
    p.title.toLowerCase().replace(/\s+/g, '') === activeCase
  );
  
  // Sync height with CompanyCard for desktop version
  useEffect(() => {
    if (!isMobile) {
      window.syncCardHeight = (height) => {
        setCardHeight(`${height}px`);
      };
    }
    
    return () => {
      if (!isMobile) {
        window.syncCardHeight = null;
      }
    };
  }, [isMobile]);
  
  if (!project) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
        <button onClick={handleCloseDetail} className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex justify-center items-center h-64">
          <p className="text-base text-gray-600">Проект не найден. Пожалуйста, выберите другой проект.</p>
        </div>
      </div>
    );
  }

  // Styles for mobile version
  const mobileStyles = isMobile ? {
    boxShadow: '0 -10px 15px -5px rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    zIndex: 20,
    marginTop: '-24px',
    paddingTop: '32px'
  } : {};

  // Use either maxHeight from props or calculate based on device type
  const calculatedMaxHeight = maxHeight || (isMobile ? 'calc(100vh - 160px)' : cardHeight);

  return (
    <div 
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative"
      style={{
        height: '100%',
        maxHeight: calculatedMaxHeight,
        overflowY: 'auto',
        padding: '24px',
        ...mobileStyles
      }}
    >
      <button 
        onClick={handleCloseDetail} 
        className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"
        style={{ zIndex: 30 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="h-full custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">{project.title}</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Challenge</h2>
            <p className="text-base text-gray-600">
              {project.challenge}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3">Solution</h2>
            <p className="text-base text-gray-600">
              {project.solution}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-3">Impact</h2>
            {Array.isArray(project.impact) ? (
              <ul className="list-disc list-inside text-base text-gray-600">
                {project.impact.map((item, index) => (
                  <li key={index} className="mb-1">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-gray-600">{project.impact}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;