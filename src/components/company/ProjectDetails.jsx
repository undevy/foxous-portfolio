import React from 'react';
import { caseStudies } from '../../data/projects';

const ProjectDetails = ({ activeCase, handleCloseDetail }) => {
  // Находим проект по ID или ключу
  // Мы ищем проект либо напрямую по ключу, либо через свойство id
  const project = Object.values(caseStudies).find(p => 
    p.id === activeCase || 
    p.title.toLowerCase().replace(/\s+/g, '') === activeCase
  );
  
  // Если проект не найден, показываем сообщение
  if (!project) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative">
        <button onClick={handleCloseDetail} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Проект не найден. Пожалуйста, выберите другой проект.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative">
      <button onClick={handleCloseDetail} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold mb-6">{project.title}</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-3">Challenge</h2>
          <p className="text-gray-600">
            {project.challenge}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-3">Solution</h2>
          <p className="text-gray-600">
            {project.solution}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-3">Impact</h2>
          {Array.isArray(project.impact) ? (
            <ul className="list-disc list-inside text-gray-600">
              {project.impact.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">{project.impact}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;