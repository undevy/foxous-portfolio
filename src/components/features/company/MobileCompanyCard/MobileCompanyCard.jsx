// src/components/features/company/MobileCompanyCard/MobileCompanyCard.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';
import { getCompanyImage } from '../../../../utils/companyUtils';
import { useImageViewer } from '../../../../contexts/ImageViewerContext';
import { getCompanyPngImage } from '../../../../utils/companyUtils';
import useTouchClick from '../../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../../services/analytics';

/**
 * Компонент карточки компании для мобильных устройств
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {string|number} props.maxHeight - Максимальная высота компонента
 * @returns {JSX.Element} Компонент карточки компании для мобильных устройств
 */
const MobileCompanyCard = ({
  company,
  selectCase,
  closeSidebar,
  setShowContactModal,
  maxHeight
}) => {
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];
  const { openViewer } = useImageViewer();
   // Обработчик клика по изображению
   const handleImageClick = useCallback((e) => {
    // ✅ Добавляем трекинг
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'image_click',
      `mobile_company_image_${company}`
    );
    openViewer(getCompanyPngImage(company), companyInfo.name);
  }, [company, companyInfo, openViewer]);
  
  // Используем наш новый хук
  const touchProps = useTouchClick(handleImageClick);
  
  // Состояние для отслеживания развернутости текста
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // Добавляем новое состояние для изображения
  const [imageLoading, setImageLoading] = useState(true);
  // Обновлённый расчёт высоты прокручиваемой области
  const contentHeight = maxHeight
    ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 280px)`
    : `calc(100vh - 280px)`;

  // Функция для переключения видимости полного описания
  const toggleDescription = useCallback(() => {
    // Отслеживаем переключение описания
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.EXPAND_COLLAPSE,
      `mobile_description_${company}_${!isDescriptionExpanded ? 'expand' : 'collapse'}`
    );
    
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }, [isDescriptionExpanded, company]);

   // Обработчик закрытия карточки 
   const handleClose = useCallback(() => {
    // Отслеживаем закрытие карточки компании
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'close_company_card',
      `mobile_${company}`
    );
    
    closeSidebar();
  }, [closeSidebar, company]);
  
  // Обработчик выбора проекта
  const handleProjectSelect = useCallback((projectId) => {
    // Отслеживаем выбор проекта из мобильной карточки
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION, 
      EVENT_ACTIONS.PROJECT_SELECT,
      `mobile_card_${company}_${projectId}`
    );
    
    selectCase(projectId);
  }, [selectCase, company]);
  
  // Обработчик открытия контактов
  const handleOpenContacts = useCallback(() => {
    // Отслеживаем нажатие на кнопку "Other"
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.CONTACT_OPEN,
      `mobile_card_other_projects_${company}`
    );
    
    setShowContactModal(true);
  }, [setShowContactModal, company]);

  return (
    <div
      className="card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden transform-card-transition"
      style={{
        height: '100%',
        maxHeight: maxHeight || 'calc(100vh - 120px)',
        zIndex: 10
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 card-glassmorphism-bottom-border p-6 pb-1">
        <button
          onClick={handleClose}
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
            onLoad={() => {
              // Отслеживаем успешную загрузку изображения
              trackEvent(
                EVENT_CATEGORIES.CONTENT_VIEW,
                'image_loaded',
                `mobile_company_image_${company}`
              );
              setImageLoading(false);
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-left text-gray-900 dark:text-white">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемое содержимое */}
      <div
        className="p-6 pt-2 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: contentHeight, minHeight: '150px' }}
      >
        {/* Описание компании с возможностью сворачивания */}
        <div className="relative mb-4 mt-2">
          <div 
            className={`text-xs text-gray-600 dark:text-gray-300 text-left text-clamp text-clamp-transition ${
              isDescriptionExpanded ? 'text-clamp-none' : 'text-clamp-3'
            }`}
          >
            {companyInfo.description}
          </div>
          <button 
            onClick={toggleDescription}
            className="text-primary font-normal text-xs mt-1"
          >
            {isDescriptionExpanded ? 'less' : 'more'}
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-medium text-black dark:text-white mb-2 text-left">Get a Sneak Peek</h3>
          
          {/* Горизонтальный скролл для списка проектов */}
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
                  onClick={() => handleProjectSelect(project.id)}
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
                    width: 'auto'
                  }}
                >
                  {project.shortName}
                </button>
              ))}
              <button
                onClick={handleOpenContacts}
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
                  width: 'auto'
                }}
              >
                🔍 Other
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col space-y-2">
          {company === 'nexus' ? (
            // Специальная логика для Nexus Network
            <button
            onClick={() => {
              // ✅ Добавляем трекинг
              trackEvent(
                EVENT_CATEGORIES.UI_INTERACTION,
                EVENT_ACTIONS.CONTACT_OPEN,
                `mobile_card_nexus_contact_${companyInfo.name}`
              );
              setShowContactModal(true);
            }}
              className="text-xs text-primary hover:text-primary-dark flex items-center"
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
              onClick={() => {
                // ✅ Добавляем трекинг
                trackEvent(
                  EVENT_CATEGORIES.UI_INTERACTION,
                  EVENT_ACTIONS.LINK_CLICK,
                  `mobile_card_visit_${companyInfo.name}`
                );
              }}
              className="text-xs text-primary hover:text-primary-dark flex items-center"
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
              onClick={() => {
                // ✅ Добавляем трекинг
                trackEvent(
                  EVENT_CATEGORIES.UI_INTERACTION,
                  EVENT_ACTIONS.LINK_CLICK,
                  `mobile_card_download_key_app_${company}`
                );
              }}
              className="text-xs text-primary hover:text-primary-dark flex items-center"
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

MobileCompanyCard.propTypes = {
  company: PropTypes.string.isRequired,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default React.memo(MobileCompanyCard);