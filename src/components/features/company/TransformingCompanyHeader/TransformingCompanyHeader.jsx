// src/components/features/company/TransformingCompanyHeader/TransformingCompanyHeader.jsx
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';

/**
 * Компонент, который трансформируется из карточки компании в навигационный элемент
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {boolean} props.isTransformed - Флаг трансформации
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {string|number} props.maxHeight - Максимальная высота компонента
 * @param {Function} props.onHeightChange - Функция обратного вызова при изменении высоты
 * @returns {JSX.Element} Компонент трансформирующегося заголовка компании
 */
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

  // Состояние для отслеживания развернутости описания
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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

  // Функция для переключения видимости полного описания
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
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
    ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 280px)`
    : `calc(100vh - 280px)`;

  // Трансформированный режим (компактная карточка с табами)
  if (isTransformed) {
    return (
      <div 
        className="card-glassmorphism rounded-t-3xl shadow-sm overflow-hidden transform-card-transition"
        style={{ 
          minHeight: '100px', // Увеличиваем минимальную высоту для большего пространства
          position: 'relative',
          zIndex: 30,
          marginTop: isMobile ? '-50px' : '0', // Увеличиваем перекрытие с футером в мобильной версии
          paddingTop: '30px' // Увеличиваем отступ сверху для предотвращения перекрытия футером
        }}
      >
        {/* Горизонтальная прокрутка с табами проектов */}
        <div 
          className="overflow-x-auto custom-scrollbar scrollbar-hide pb-4 horizontal-scroll" 
          style={{ 
            WebkitOverflowScrolling: 'touch', 
            paddingTop: '30px', // Увеличиваем отступ сверху для предотвращения перекрытия футером
            paddingBottom: '12px' // Добавляем отступ снизу
          }}
        >
          <div className="flex space-x-1 px-4 pb-3 min-w-max">
            {/* Кнопка "Назад к компании" */}
            <button
              onClick={() => {
                backToCompanyCard();
              }}
              className="border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-black dark:text-white" 
              style={{
                display: 'flex',
                padding: '8px 20px',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                border: '1px solid var(--color-button-border)',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: '400',
                width: 'auto' // Ширина подстраивается под содержимое
              }}
            >
              ⬅️ To {companyInfo.name}
            </button>
            
            {/* Кнопки проектов (кроме активного) */}
            {companyProjects.map((project) => {
              // Не отображаем активный проект
              if (activeCase === project.id) return null;
              
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    selectCase(project.id);
                  }}
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                  style={{
                    display: 'flex',
                    padding: '8px 20px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-button-border)',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: 'auto' // Ширина подстраивается под содержимое
                  }}
                >
                  {project.shortName}
                </button>
              );
            })}
            
            {/* Кнопка "Other" */}
            <button
              onClick={() => setShowContactModal(true)}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              style={{
                display: 'flex',
                padding: '8px 20px',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                border: '1px solid var(--color-button-border)',
                fontSize: '14px',
                fontWeight: '600',
                width: 'auto' // Ширина подстраивается под содержимое
              }}
            >
              🔍 Other
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Полная карточка компании (не трансформированный вид)
  return (
    <div
      ref={cardRef}
      className="card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden transform-card-transition"
      style={{
        height: '100%',
        maxHeight: maxHeight || (isMobile ? 'calc(100vh - 120px)' : 'none'),
        zIndex: isMobile ? 10 : 'auto',
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 card-glassmorphism-bottom-border p-6 pb-1">
        <button
          onClick={() => {
            closeSidebar();
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

        <img
          src={getCompanyImage(company)}
          alt={companyInfo.name}
          className="w-full h-auto rounded-xl mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2 text-left text-gray-900 dark:text-white">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемое содержимое с добавлением minHeight */}
      <div
        className="p-6 pt-2 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: contentHeight, minHeight: '150px' }}
      >
        {/* Описание компании с возможностью сворачивания на мобильных устройствах */}
        {isMobile ? (
  <div className="relative mb-4">
    <div 
      className={`text-base text-gray-600 dark:text-gray-300 text-left text-clamp text-clamp-transition ${
        isDescriptionExpanded ? 'text-clamp-none' : 'text-clamp-3'
      }`}
    >
      {companyInfo.description}
    </div>
    <button 
      onClick={toggleDescription}
      className="text-primary font-normal text-base mt-1"
    >
      {isDescriptionExpanded ? 'less' : 'more'}
    </button>
  </div>
) : (
  <p className="text-base text-gray-600 dark:text-gray-300 mb-4 text-left">
    {companyInfo.description}
  </p>
)}

<div className="mb-4">
  <h3 className="text-sm font-medium text-black dark:text-white mb-2 text-left">Get a Sneak Peek</h3>
  
  {/* Условный рендеринг в зависимости от типа устройства */}
  {isMobile ? (
    // Мобильная версия с горизонтальным скроллом
    <div 
      className="overflow-x-auto custom-scrollbar scrollbar-hide pb-4 horizontal-scroll" 
      style={{ 
        WebkitOverflowScrolling: 'touch', 
        paddingBottom: '0px' 
      }}
    >
      <div className="flex space-x-1 px-0 min-w-max">
        {companyProjects.map((project) => (
          <button
            key={project.id || project.title}
            onClick={() => selectCase(project.id)}
            className={`${
              activeCase === project.id
                ? 'border-primary-dark bg-primary-light text-black dark:text-white'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white'
            }`}
            style={{
              display: 'flex',
              padding: '8px 20px',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              border: activeCase === project.id ? '1px solid #1D4ED8' : '1px solid var(--color-button-border)',
              background: activeCase === project.id ? 'var(--color-primary-light)' : 'transparent',
              fontSize: '14px',
              fontWeight: '600',
              width: 'auto' // Ширина подстраивается под содержимое
            }}
          >
            {project.shortName}
          </button>
        ))}
        <button
          onClick={() => setShowContactModal(true)}
          className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
          style={{
            display: 'flex',
            padding: '8px 20px',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '9999px',
            border: '1px solid var(--color-button-border)',
            fontSize: '14px',
            fontWeight: '600',
            width: 'auto' // Ширина подстраивается под содержимое
          }}
        >
          🔍 Other
        </button>
      </div>
    </div>
  ) : (
    // Десктопная версия с flex-wrap
    <div className="flex flex-wrap gap-3">
      {companyProjects.map((project) => (
        <button
          key={project.id || project.title}
          onClick={() => selectCase(project.id)}
          className={`${
            activeCase === project.id
              ? 'border-primary-dark bg-primary-light text-black dark:text-white'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white'
          }`}
          style={{
            display: 'flex',
            padding: '8px 20px',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '9999px',
            border: activeCase === project.id ? '1px solid #1D4ED8' : '1px solid var(--color-button-border)',
            background: activeCase === project.id ? 'var(--color-primary-light)' : 'transparent',
            fontSize: '14px',
            fontWeight: '600',
            width: 'auto' // Ширина подстраивается под содержимое
          }}
        >
          {project.shortName}
        </button>
      ))}
      <button
        onClick={() => setShowContactModal(true)}
        className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
        style={{
          display: 'flex',
          padding: '8px 20px',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
          borderRadius: '9999px',
          border: '1px solid var(--color-button-border)',
          fontSize: '14px',
          fontWeight: '600',
          width: 'auto' // Ширина подстраивается под содержимое
        }}
      >
        🔍 Other
      </button>
    </div>
  )}
</div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col space-y-2">
          {company === 'nexus' ? (
            // Специальная логика для Nexus Network
            <button
              onClick={() => {
                setShowContactModal(true);
              }}
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

TransformingCompanyHeader.propTypes = {
  company: PropTypes.string.isRequired,
  activeCase: PropTypes.string,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  isTransformed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onHeightChange: PropTypes.func
};

// Значения по умолчанию для функций обратного вызова
TransformingCompanyHeader.defaultProps = {
  onHeightChange: () => {}
};

export default React.memo(TransformingCompanyHeader);