// src/components/common/TransformingCompanyHeader.jsx
import React, { useEffect, useRef } from 'react';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';

// Компонент, который трансформируется из карточки компании в навигационный элемент
const TransformingCompanyHeader = ({
  company,
  activeCase,
  selectCase,
  closeSidebar,
  backToCompanyCard,
  setShowContactModal,
  isTransformed,
  isMobile,
  maxHeight,
  onHeightChange
}) => {

  // Получаем данные компании
  const companyInfo = companyData[company];
  
  // Получаем проекты компании
  const companyProjects = projectsByCompany[company] || [];

  // Ref для измерения высоты карточки (для десктопной версии)
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

  // Используем ResizeObserver для уведомления родителя об изменении высоты (для десктопной версии)
  useEffect(() => {
    if (!cardRef.current || isMobile || !onHeightChange) return;
    
    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      onHeightChange(height);
    });
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isMobile, onHeightChange]);

  // Обновлённый расчёт высоты прокручиваемой области
  const contentHeight = maxHeight
    ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 260px)`
    : `calc(100vh - 260px)`;

  // Если компания не определена, не отображаем ничего
  if (!company || !companyInfo) {
    console.log("🔍 TransformingCompanyHeader: компания не определена, ничего не отображаем");
    return null;
  }

  // Трансформированный режим (компактная карточка с табами)
  if (isTransformed) {
    console.log("🔍 TransformingCompanyHeader: рендерим КОМПАКТНЫЙ режим");
    return (
      <div 
        className="bg-white rounded-t-3xl shadow-sm border border-gray-200 overflow-hidden transform-card-transition"
        style={{ 
          minHeight: '60px',  // Гарантируем минимальную высоту
          position: 'relative',
          zIndex: 30  // Увеличиваем z-index, чтобы быть выше ProjectDetails
        }}
      >
        <div className="p-4 flex items-center justify-between">
          {/* Стрелка вверх (СЛЕВА) - возврат к полной карточке */}
          <button
            onClick={() => {
              console.log("🔍 Нажата кнопка стрелки вверх в трансформированной карточке");
              backToCompanyCard();
            }}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="Вернуться к компании"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>

          {/* Название проекта по центру */}
          <div className="text-base font-medium text-center flex-grow">
            {activeCase && companyProjects.find(p => p.id === activeCase)?.shortName}
          </div>

          {/* Кнопка закрытия (СПРАВА) - закрывает обе карточки */}
          <button
            onClick={() => {
              console.log("🔍 Нажата кнопка закрытия (X) в трансформированной карточке");
              closeSidebar(); // Закрывает обе карточки
            }}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Горизонтальная прокрутка с табами проектов */}
        <div 
          className="overflow-x-auto custom-scrollbar scrollbar-hide pb-3 horizontal-scroll" 
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex space-x-2 px-4 pb-3 min-w-max">
            {companyProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  console.log(`🔍 Нажат таб проекта: ${project.shortName} (${project.id})`);
                  selectCase(project.id);
                }}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  activeCase === project.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {project.shortName}
              </button>
            ))}
            <button
              onClick={() => {
                console.log("🔍 Нажата кнопка 'Other' в табах проектов");
                setShowContactModal(true);
              }}
              className="px-3 py-1 text-sm rounded-full whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Other
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Полная карточка компании (не трансформированный вид)
  console.log("🔍 TransformingCompanyHeader: рендерим ПОЛНЫЙ режим");
  return (
    <div
      ref={cardRef}
      className="bg-white rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden transform-card-transition"
      style={{
        height: '100%',
        maxHeight: maxHeight || (isMobile ? 'calc(100vh - 140px)' : 'none'),
        zIndex: isMobile ? 10 : 'auto',
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 bg-white p-6 pb-4 border-b border-gray-50">
        <button
          onClick={() => {
            console.log("🔍 Нажата кнопка закрытия (X) в полной карточке компании");
            closeSidebar();
          }}
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
          <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Key Projects</h3>
          <div className="flex flex-wrap gap-2">
            {companyProjects.map((project) => (
              <button
                key={project.id || project.title}
                onClick={() => {
                  console.log(`🔍 Нажата кнопка проекта: ${project.shortName || project.id}`);
                  selectCase(
                    project.id || project.title.toLowerCase().replace(/\s+/g, '')
                  );
                }}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCase ===
                  (project.id || project.title.toLowerCase().replace(/\s+/g, ''))
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {project.shortName || project.id}
              </button>
            ))}
            <button
              onClick={() => {
                console.log("🔍 Нажата кнопка 'Other' в полной карточке компании");
                setShowContactModal(true);
              }}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Other
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {companyInfo.tags && companyInfo.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
          {company === 'nexus' ? (
            // Специальная логика для Nexus Network
            <button
              onClick={() => {
                console.log("🔍 Нажата кнопка 'Contact about'");
                setShowContactModal(true);
              }}
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

// Дополнительные props с значениями по умолчанию
TransformingCompanyHeader.defaultProps = {
  onHeightChange: () => {} // Пустая функция по умолчанию
};

export default TransformingCompanyHeader;