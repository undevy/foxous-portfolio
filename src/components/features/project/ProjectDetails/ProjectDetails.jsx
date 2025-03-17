// src/components/features/project/ProjectDetails/ProjectDetails.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { caseStudies } from '../../../../data/projects';

/**
 * Компонент отображения деталей проекта
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.handleCloseDetail - Функция закрытия деталей
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {number|string} props.maxHeight - Максимальная высота компонента
 * @param {boolean} props.hideCloseButton - Скрыть кнопку закрытия
 * @param {boolean} props.squareTopCorners - Прямые верхние углы для мобильной версии
 * @returns {JSX.Element} Компонент деталей проекта
 */
const ProjectDetails = ({ 
  activeCase, 
  handleCloseDetail, 
  isMobile, 
  maxHeight,
  hideCloseButton, // Параметр для скрытия кнопки закрытия
  squareTopCorners // Параметр для прямых верхних углов
}) => {
  // Поиск проекта по id или ключу
  const project = useMemo(() => {
    return Object.values(caseStudies).find(
      (p) =>
        p.id === activeCase ||
        p.title.toLowerCase().replace(/\s+/g, '') === activeCase
    );
  }, [activeCase]);

  // Используем useMemo для вычисления стилей - всегда, независимо от наличия проекта
  const mobileStyles = useMemo(() => {
    if (!isMobile) return {};
    
    return {
      boxShadow: squareTopCorners ? 'none' : '0 -8px 20px -5px rgba(0, 0, 0, 0.15)',
      borderTopLeftRadius: squareTopCorners ? '0' : '24px',
      borderTopRightRadius: squareTopCorners ? '0' : '24px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
      zIndex: 20,
      maxHeight: 'calc(85vh - 80px)', // Увеличиваем максимальную высоту
    };
  }, [isMobile, squareTopCorners]);

  // Используем useMemo для вычисления высоты контента - всегда, независимо от наличия проекта
  const { calculatedMaxHeight, contentHeight } = useMemo(() => {
    const calculatedMaxHeight = maxHeight || (isMobile ? 'calc(85vh - 80px)' : 'auto'); // Увеличиваем максимальную высоту
    const contentHeight = `calc(${
      typeof calculatedMaxHeight === 'string'
        ? calculatedMaxHeight
        : calculatedMaxHeight + 'px'
    } - 80px)`; // Уменьшаем вычитаемую высоту

    return { calculatedMaxHeight, contentHeight };
  }, [maxHeight, isMobile]);

  // После вызова всех хуков можем использовать условный рендеринг
  if (!project) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
        {!hideCloseButton && (
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
        )}
        <div className="flex justify-center items-center h-64">
          <p className="text-base text-gray-600">
            Проект не найден. Пожалуйста, выберите другой проект.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden"
      style={{
        height: '100%',
        maxHeight: calculatedMaxHeight,
        ...mobileStyles,
      }}
    >
      {/* Заголовок в виде кнопки проекта */}
      <div className="sticky top-0 z-30 bg-white">
        <div className="p-4">
          {/* Стилизованная кнопка с названием проекта */}
          <button
            className="inline-flex border-blue-700 bg-blue-50 text-black"
            style={{
              display: 'inline-flex', // Изменено с flex на inline-flex
              padding: '8px 20px', // Корректные паддинги
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              border: '1px solid #1D4ED8',
              background: '#EFF6FF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'default',
              // width: 'auto', // Убрано свойство width: 100%, теперь ширина подстраивается под контент
              flexDirection: 'row' // Явно указываем направление flex
            }}
          >
            {project.title}
          </button>
          
          {!hideCloseButton && (
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
          )}
        </div>
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

ProjectDetails.propTypes = {
  activeCase: PropTypes.string,
  handleCloseDetail: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideCloseButton: PropTypes.bool,
  squareTopCorners: PropTypes.bool
};

// Значения по умолчанию для новых параметров
ProjectDetails.defaultProps = {
  hideCloseButton: false,
  squareTopCorners: false
};

// Оборачиваем в React.memo с кастомным сравнением пропсов
export default React.memo(ProjectDetails, (prevProps, nextProps) => {
  return (
    prevProps.activeCase === nextProps.activeCase &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.maxHeight === nextProps.maxHeight &&
    prevProps.hideCloseButton === nextProps.hideCloseButton &&
    prevProps.squareTopCorners === nextProps.squareTopCorners
  );
});