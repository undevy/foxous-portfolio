// src/components/features/company/CompanyCard/CompanyCard.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';
import { getCompanyImage } from '../../../../utils/companyUtils';
import { useImageViewer } from '../../../../contexts/ImageViewerContext';
import { getCompanyPngImage } from '../../../../utils/companyUtils';
import useTouchClick from '../../../../hooks/useTouchClick';

/**
 * Компонент карточки компании для десктопной версии
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.setActiveCase - Функция установки активного кейса
 * @param {Function} props.handleCloseSidebar - Функция закрытия сайдбара
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {number|string} props.maxHeight - Максимальная высота карточки
 * @param {Function} props.onHeightChange - Функция обратного вызова при изменении высоты
 * @returns {JSX.Element} Компонент карточки компании
 */
const CompanyCard = ({
  company,
  activeCase,
  setActiveCase,
  handleCloseSidebar,
  setShowContactModal,
  maxHeight,
  onHeightChange
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];
  const cardRef = useRef(null);
  const { openViewer } = useImageViewer();
  const handleImageClick = useCallback((e) => {
    openViewer(getCompanyPngImage(company), companyInfo.name);
  }, [company, companyInfo, openViewer]);
  
  // Используем наш новый хук
  const touchProps = useTouchClick(handleImageClick);

  // Обновлённый расчёт высоты прокручиваемой области
  const contentHeight = maxHeight
    ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 240px)`
    : `calc(100vh - 240px)`;

  // Функция для открытия модального окна контактов
  const openContactModal = () => {
    if (typeof setShowContactModal === 'function') {
      setShowContactModal(true);
    } else {
      console.error('setShowContactModal is not a function');
    }
  };

  // Используем ResizeObserver для уведомления родителя об изменении высоты
  useEffect(() => {
    if (!cardRef.current || !onHeightChange) return;
    
    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      onHeightChange(height);
    });
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [onHeightChange]);
  
  return (
    <div
      ref={cardRef}
      className="card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden"
      style={{
        height: '100%',
        maxHeight: maxHeight || 'none'
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 card-glassmorphism-bottom-border p-6 pb-4">
        <button
          onClick={handleCloseSidebar}
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

        <div 
          className="image-hover-effect mb-4 cursor-pointer" 
          {...touchProps}
        >
          <img 
            src={getCompanyImage(company)}
            alt={companyInfo.name} 
            className={`w-full h-auto transition-all duration-500 ${
              imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-left text-gray-900 dark:text-white">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемое содержимое */}
      <div
        className="p-6 pt-6 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: contentHeight, minHeight: '150px' }}
      >
        {/* Описание компании */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-left">
          {companyInfo.description}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-black dark:text-white mb-3 text-left">Get a Sneak Peek</h3>
          <div className="flex flex-wrap gap-3">
            {companyProjects.map((project) => {
              // Не отображать активный проект в десктопной версии
              if (activeCase === project.id) return null;
              
              return (
                <button
                  key={project.id || project.title}
                  onClick={() => setActiveCase(project.id)}
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white project-tag-button"
                  style={{
                    display: 'flex',
                    padding: '8px 20px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-button-border)',
                    fontSize: '16px',
                    fontWeight: '500',
                    width: 'auto'
                  }}
                >
                  {project.shortName}
                </button>
              );
            })}
            <button
              onClick={openContactModal}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              style={{
                display: 'flex',
                padding: '8px 20px',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                border: '1px solid var(--color-button-border)',
                fontSize: '16px',
                fontWeight: '500',
                width: 'auto'
              }}
            >
              🔍 Other
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col space-y-2">
          {company === 'nexus' ? (
            // Специальная логика для Nexus Network
            <button
              onClick={openContactModal}
              className="text-sm text-primary hover:text-primary-dark flex items-center"
            >
              <span>Contact about {companyInfo.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          ) : (
            // Для остальных компаний - обычная ссылка
            <a
              href={companyInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-dark flex items-center"
            >
              <span>Visit {companyInfo.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          )}

          {companyInfo.keyAppUrl && (
            <a
              href={companyInfo.keyAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary-dark flex items-center"
            >
              <span>Download Key App</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.string.isRequired,
  activeCase: PropTypes.string,
  setActiveCase: PropTypes.func.isRequired,
  handleCloseSidebar: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onHeightChange: PropTypes.func
};

CompanyCard.defaultProps = {
  onHeightChange: () => {}
};

export default React.memo(CompanyCard);