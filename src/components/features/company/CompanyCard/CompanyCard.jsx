// src/components/features/company/CompanyCard/CompanyCard.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';

/**
 * Компонент карточки компании
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.setActiveCase - Функция установки активного кейса
 * @param {Function} props.handleCloseSidebar - Функция закрытия сайдбара
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {boolean} props.isMobile - Флаг мобильного устройства
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
  isMobile,
  maxHeight,
  onHeightChange,
}) => {
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];
  const cardRef = useRef(null);

  // Функция для получения изображения компании
  const getCompanyImage = (companyId) => {
    const imageMap = {
      'gmx': '/assets/images/GMX.webp',
      'nexus': '/assets/images/Nexus.webp',
      'p2p': '/assets/images/KeyApp.webp',
      'wildberries': '/assets/images/Wb.webp'
    };
    
    return imageMap[companyId] || '/api/placeholder/400/250'; // Используем заглушку, если изображение не найдено
  };

  // Обновлённый расчёт высоты прокручиваемой области:
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
    if (!cardRef.current || isMobile || !onHeightChange) return;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      onHeightChange(height);
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isMobile, onHeightChange]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden"
      style={{
        height: '100%',
        maxHeight: maxHeight || (isMobile ? 'calc(100vh - 140px)' : 'none'),
        zIndex: isMobile ? 10 : 'auto',
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 bg-white p-6 pb-4 border-b border-gray-50">
        <button
          onClick={handleCloseSidebar}
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

        <img 
          src={getCompanyImage(company)}
          alt={companyInfo.name} 
          className="w-full h-auto rounded-xl mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2 text-left">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемое содержимое с добавлением minHeight */}
      <div
        className="p-6 pt-2 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: contentHeight, minHeight: '150px' }}
      >
        <p className="text-base text-gray-600 mb-4 text-left">
          {companyInfo.description}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-black mb-3 text-left">Get a Sneak Peek</h3>
          <div className="flex flex-wrap gap-3">
            {companyProjects.map((project) => {
              // Не отображать активный проект в десктопной версии
              if (!isMobile && activeCase === project.id) return null;
              
              return (
                <button
                  key={project.id || project.title}
                  onClick={() => setActiveCase(project.id)}
                  className={`${
                    activeCase === project.id
                      ? 'border-blue-700 bg-blue-50 text-black'
                      : 'border-gray-200 hover:bg-gray-100 text-black'
                  }`}
                  style={{
                    display: 'flex',
                    padding: '8px 20px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '9999px',
                    border: activeCase === project.id ? '1px solid #1D4ED8' : '1px solid #E7E7E7',
                    background: activeCase === project.id ? '#EFF6FF' : 'transparent',
                    fontSize: '14px',
                    fontWeight: '400',
                    width: 'auto' // Ширина подстраивается под содержимое
                  }}
                >
                  {project.shortName}
                </button>
              );
            })}
            <button
              onClick={openContactModal}
              className="border-gray-200 hover:bg-gray-100 text-black"
              style={{
                display: 'flex',
                padding: '8px 20px',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                border: '1px solid #E7E7E7',
                fontSize: '14px',
                fontWeight: '400',
                width: 'auto' // Ширина подстраивается под содержимое
              }}
            >
              🔍 Other
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
          {company === 'nexus' ? (
            // Специальная логика для Nexus Network
            <button
              onClick={openContactModal}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
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
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
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
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
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
  isMobile: PropTypes.bool.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onHeightChange: PropTypes.func
};

CompanyCard.defaultProps = {
  onHeightChange: () => {}
};

// Добавляем мемоизацию с кастомным сравнением пропсов
export default React.memo(CompanyCard, (prevProps, nextProps) => {
  // Сравниваем только те пропсы, которые действительно влияют на рендеринг
  return (
    prevProps.company === nextProps.company &&
    prevProps.activeCase === nextProps.activeCase &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.maxHeight === nextProps.maxHeight
  );
});