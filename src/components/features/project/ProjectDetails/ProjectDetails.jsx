// src/components/features/project/ProjectDetails/ProjectDetails.jsx
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { caseStudies } from '../../../../data/projects';
import { getProjectImage } from '../../../../utils/projectUtils';
import { useImageViewer } from '../../../../contexts/ImageViewerContext';
import { getProjectPngImage } from '../../../../utils/projectUtils';
import useTouchClick from '../../../../hooks/useTouchClick';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../../services/analytics';

/**
 * Компонент отображения деталей проекта
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.handleCloseDetail - Функция закрытия деталей
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {number|string} props.maxHeight - Максимальная высота компонента
 * @param {boolean} props.hideCloseButton - Скрыть кнопку закрытия
 * @param {boolean} props.squareTopCorners - Прямые верхние углы для мобильной версии
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент деталей проекта
 */
const ProjectDetails = ({ 
  activeCase, 
  handleCloseDetail, 
  isMobile, 
  maxHeight,
  hideCloseButton,
  squareTopCorners,
  isFirstLoad
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  // Поиск проекта по id или ключу
  const project = useMemo(() => {
    return Object.values(caseStudies).find(
      (p) =>
        p.id === activeCase ||
        p.title.toLowerCase().replace(/\s+/g, '') === activeCase
    );
  }, [activeCase]);

  const { openViewer } = useImageViewer();
   // Обработчик клика по изображению проекта
   const handleImageClick = useCallback((e) => {
    if (!project) return;
    openViewer(getProjectPngImage(project.id), project.title);
  }, [project, openViewer]);
  
  // Используем наш новый хук
  const touchProps = useTouchClick(handleImageClick);

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

  // Отслеживание времени просмотра проекта
  useEffect(() => {
    if (project && project.id) {
      // Начинаем отслеживать время просмотра
      startTimingEvent(`project_details_view_${project.id}`);
      
      // Отслеживаем просмотр деталей проекта
      trackEvent(
        EVENT_CATEGORIES.CONTENT_VIEW,
        'project_details_view',
        `${project.companyId}_${project.id}`
      );
      
      return () => {
        // Завершаем отслеживание времени при размонтировании
        endTimingEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          `project_details_duration`,
          `${project.companyId}_${project.id}`
        );
      };
    }
  }, [project]);
  
  // Отслеживание прокрутки содержимого
  const handleContentScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;
    const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    
    // Отслеживаем только значительные изменения прокрутки (10%, 25%, 50%, 75%, 90%, 100%)
    if (scrollPercentage === 25 || scrollPercentage === 50 || scrollPercentage === 75 || 
        scrollPercentage === 90 || scrollPercentage === 100) {
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        EVENT_ACTIONS.SCROLL,
        `project_details_${project ? project.id : 'unknown'}_${scrollPercentage}%`
      );
    }
  };

  // Определяем класс для анимации в зависимости от флага первой загрузки
  const transitionClass = isFirstLoad ? '' : 'transform-card-transition';

  // После вызова всех хуков можем использовать условный рендеринг
  if (!project) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative ${transitionClass}`}>
        {!hideCloseButton && (
          <button
            onClick={handleCloseDetail}
            className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 dark:text-gray-300"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="flex justify-center items-center h-64">
          <p className="text-base text-gray-600 dark:text-gray-300">
            Проект не найден. Пожалуйста, выберите другой проект.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden ${transitionClass}`}
      style={{
        height: '100%',
        maxHeight: calculatedMaxHeight,
        ...mobileStyles,
      }}
    >
      {/* Заголовок в виде кнопки проекта */}
      <div className="sticky top-0 z-30 card-glassmorphism-bottom-border">
        <div className="p-4">
          {/* Стилизованная кнопка с названием проекта */}
          <button
            className="inline-flex border-primary-dark bg-primary-light text-black dark:text-white"
            style={{
              display: 'inline-flex', // Изменено с flex на inline-flex
              padding: '8px 20px', // Корректные паддинги
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              border: '1px solid var(--color-primary-dark)',
              background: 'var(--color-primary-light)',
              fontSize: isMobile ? '14px' : '16px',     // Условное определение размера
              fontWeight: isMobile ? '600' : '500',     // Условное определение веса
              cursor: 'default',
              flexDirection: 'row' // Явно указываем направление flex
            }}
          >
            {project.title}
          </button>
          
          {!hideCloseButton && (
            <button
            onClick={() => {
              // Отслеживаем закрытие деталей проекта
              trackEvent(
                EVENT_CATEGORIES.UI_INTERACTION,
                'close_project_details',
                `${project.companyId}_${project.id}`
              );
              handleCloseDetail();
            }}
              className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600 dark:text-gray-300"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Скроллируемое содержимое */}
      <div className="p-6 pt-2 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: contentHeight }}
        onScroll={handleContentScroll}
        >
        <div className="max-w-3xl">

            <div className="mb-6" style={{ paddingTop: '8px' }}>
            <h2 className="text-xl font-bold mb-3 text-left text-gray-900 dark:text-white">Challenge</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">{project.challenge}</p>
          </div>
          {project && !imageError && (
            <div 
              className="image-hover-effect mb-4 cursor-pointer" 
              {...touchProps}
            >
              <img
                src={getProjectImage(project.id)}
                alt={project.title}
                className={`w-full h-auto transition-all duration-500 ${
                  imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoading(false)}
              />
            </div>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 text-left text-gray-900 dark:text-white">Solution</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-left">{project.solution}</p>
          </div>

          <div>
          <h2 className="text-xl font-bold mb-3 text-left text-gray-900 dark:text-white">Impact</h2>
            {Array.isArray(project.impact) ? (
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 text-left">
                {project.impact.map((item, index) => (
                  <li key={index} className="mb-1"
                  onMouseEnter={() => {
                    // Отслеживаем наведение на пункт списка impact (только в десктопной версии)
                    if (!isMobile) {
                      trackEvent(
                        EVENT_CATEGORIES.UI_INTERACTION,
                        'impact_item_hover',
                        `${project.id}_impact_${index}`
                      );
                    }
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-left">{project.impact}</p>
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
  squareTopCorners: PropTypes.bool,
  isFirstLoad: PropTypes.bool
};

// Значения по умолчанию для новых параметров
ProjectDetails.defaultProps = {
  hideCloseButton: false,
  squareTopCorners: false,
  isFirstLoad: false
};

// Оборачиваем в React.memo с кастомным сравнением пропсов
export default React.memo(ProjectDetails, (prevProps, nextProps) => {
  return (
    prevProps.activeCase === nextProps.activeCase &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.maxHeight === nextProps.maxHeight &&
    prevProps.hideCloseButton === nextProps.hideCloseButton &&
    prevProps.squareTopCorners === nextProps.squareTopCorners &&
    prevProps.isFirstLoad === nextProps.isFirstLoad
  );
});