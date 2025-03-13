import React from 'react';
import { caseStudies } from '../../data/projects';

const ProjectDetails = ({ activeCase, handleCloseDetail, isMobile, maxHeight }) => {
  // Поиск проекта по id или ключу
  const project = Object.values(caseStudies).find(
    (p) =>
      p.id === activeCase ||
      p.title.toLowerCase().replace(/\s+/g, '') === activeCase
  );

  if (!project) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
        <button
          onClick={handleCloseDetail}
          className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex justify-center items-center h-64">
          <p className="text-base text-gray-600">
            Проект не найден. Пожалуйста, выберите другой проект.
          </p>
        </div>
      </div>
    );
  }

  // Стили для мобильной версии
  const mobileStyles = isMobile
    ? {
        boxShadow: '0 -8px 20px -5px rgba(0, 0, 0, 0.15)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        zIndex: 20,
        maxHeight: 'calc(85vh - 120px)',
      }
    : {};

  // Используем переданный maxHeight или значение по умолчанию для мобильной версии
  const calculatedMaxHeight = maxHeight || (isMobile ? 'calc(85vh - 120px)' : 'auto');
  const contentHeight = `calc(${
    typeof calculatedMaxHeight === 'string'
      ? calculatedMaxHeight
      : calculatedMaxHeight + 'px'
  } - 80px)`;

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden"
      style={{
        height: '100%',
        maxHeight: calculatedMaxHeight,
        ...mobileStyles,
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-30 bg-white p-6 pb-4 border-b border-gray-50">
        <button
          onClick={handleCloseDetail}
          className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center z-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h1 className="text-2xl font-semibold text-left">{project.title}</h1>
      </div>

      {/* Скроллируемое содержимое */}
      <div className="p-6 pt-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: contentHeight }}>
        <div className="max-w-3xl">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3 text-left">Challenge</h2>
            <p className="text-base text-gray-600 text-left">{project.challenge}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3 text-left">Solution</h2>
            <p className="text-base text-gray-600 text-left">{project.solution}</p>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-3 text-left">Impact</h2>
            {Array.isArray(project.impact) ? (
              <ul className="list-disc list-inside text-base text-gray-600 text-left">
                {project.impact.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-gray-600 text-left">{project.impact}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;