// src/components/features/company/MobileCompanyCard/MobileCompanyCard.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';
import { getCompanyImage } from '../../../../utils/companyUtils';
import { useImageViewer } from '../../../../contexts/ImageViewerContext';
import { getCompanyPngImage } from '../../../../utils/companyUtils';
import { useDevice } from '../../../../contexts/DeviceContext';
import useTouchClick from '../../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../../services/analytics';

/**
 * Компонент карточки компании для мобильных устройств
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {string|number} props.maxHeight - Максимальная высота компонента
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент карточки компании для мобильных устройств
 */
const MobileCompanyCard = ({
  company,
  selectCase,
  closeSidebar,
  setShowContactModal,
  maxHeight,
  isFirstLoad
}) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];
  const { openViewer } = useImageViewer();
  
  // Состояние для отслеживания развернутости текста
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // Состояние для изображения
  const [imageLoading, setImageLoading] = useState(true);
  
  // Обработчик клика по изображению
  const handleImageClick = useCallback(() => {
    // Отслеживаем клик по изображению компании
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'image_click',
      `mobile_company_image_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    openViewer(getCompanyPngImage(company), companyInfo.name);
  }, [company, companyInfo, openViewer, isTouchDevice]);
  
  // Хук для обработки кликов и касаний
  const touchProps = useTouchClick(handleImageClick);
  
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
      `mobile_description_${company}_${!isDescriptionExpanded ? 'expand' : 'collapse'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }, [isDescriptionExpanded, company, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для кнопки "more"/"less"
  const descriptionToggleTouchProps = useTouchClick(toggleDescription);

  // Обработчик закрытия карточки 
  const handleClose = useCallback(() => {
    // Отслеживаем закрытие карточки компании
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'close_company_card',
      `mobile_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    closeSidebar();
  }, [closeSidebar, company, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для кнопки закрытия
  const closeTouchProps = useTouchClick(handleClose);
  
  // Обработчик выбора проекта
  const handleProjectSelect = useCallback((projectId) => {
    // Отслеживаем выбор проекта из мобильной карточки
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION, 
      EVENT_ACTIONS.PROJECT_SELECT,
      `mobile_card_${company}_${projectId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    selectCase(projectId);
  }, [selectCase, company, isTouchDevice]);
  
  // Обработчик открытия контактов
  const handleOpenContacts = useCallback(() => {
    // Отслеживаем нажатие на кнопку "Other"
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.CONTACT_OPEN,
      `mobile_card_other_projects_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setShowContactModal(true);
  }, [setShowContactModal, company, isTouchDevice]);

  // Обработчик клика по ссылке на сайт компании
  const handleCompanyLinkClick = useCallback(() => {
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.LINK_CLICK,
      `mobile_card_visit_${companyInfo.name}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [companyInfo.name, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для ссылки на сайт компании
  const companyLinkTouchProps = useTouchClick(handleCompanyLinkClick);
  
  // Обработчик клика по ссылке на приложение
  const handleAppLinkClick = useCallback(() => {
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.LINK_CLICK,
      `mobile_card_download_key_app_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [company, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для ссылки на приложение
  const appLinkTouchProps = useTouchClick(handleAppLinkClick);

  // Определяем класс для анимации в зависимости от флага первой загрузки
  const transitionClass = isFirstLoad ? '' : 'transform-card-transition';

  return (
    <div
      className={`card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden ${transitionClass}`}
      style={{
        height: '100%',
        maxHeight: maxHeight || 'calc(100vh - 120px)',
        zIndex: 10
      }}
    >
      {/* Фиксированный заголовок */}
      <div className="sticky top-0 z-10 card-glassmorphism-bottom-border p-6 pb-1">
        <button
          {...closeTouchProps}
          className={`absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-40 ${
            isTouchDevice ? 'touch-button' : ''
          }`}
          style={{
            ...(isTouchDevice && {
              height: '44px',
              width: '44px',
              top: '8px',
              right: '8px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            })
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isTouchDevice ? "20" : "12"}
            height={isTouchDevice ? "20" : "12"}
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
          className={`image-hover-effect mb-4 cursor-pointer ${
            isTouchDevice ? 'touch-image-container' : ''
          }`}
          {...touchProps}
        >
          <img 
            src={getCompanyImage(company)}
            alt={companyInfo.name}
            className={`w-full h-auto transition-all ${
              isTablet || isIOS 
                ? 'duration-300 ease-out' // Более быстрые и простые анимации для iPad
                : 'duration-500 ease-in-out'
            } ${imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            onLoad={() => {
              // Отслеживаем успешную загрузку изображения
              trackEvent(
                EVENT_CATEGORIES.CONTENT_VIEW,
                'image_loaded',
                `mobile_company_image_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
              );
              setImageLoading(false);
            }}
            style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-left text-gray-900 dark:text-white">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемое содержимое */}
      <div
        className="p-6 pt-2 overflow-y-auto custom-scrollbar"
        style={{ 
          maxHeight: contentHeight, 
          minHeight: '150px',
          WebkitOverflowScrolling: isIOS ? 'touch' : 'auto' // Улучшает плавность прокрутки на iOS
        }}
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
            {...descriptionToggleTouchProps}
            className={`text-primary font-normal text-xs mt-1 ${
              isTouchDevice ? 'touch-button py-1 px-2' : ''
            }`}
            style={{
              ...(isTouchDevice && {
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              })
            }}
          >
            {isDescriptionExpanded ? 'less' : 'more'}
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-medium text-black dark:text-white mb-2 text-left">Get a Sneak Peek</h3>
          
          {/* Горизонтальный скролл для списка проектов */}
          <div 
            className="overflow-x-auto custom-scrollbar scrollbar-hide pb-4 horizontal-scroll ios-scrolling" 
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
                  className={`border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${
                    isTouchDevice ? 'touch-button' : ''
                  }`}
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
                    width: 'auto',
                    ...(isTouchDevice && {
                      minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    })
                  }}
                >
                  {project.shortName}
                </button>
              ))}
              <button
                onClick={handleOpenContacts}
                className={`border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${
                  isTouchDevice ? 'touch-button' : ''
                }`}
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
                  width: 'auto',
                  ...(isTouchDevice && {
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  })
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
                // Отслеживаем клик по кнопке контактов для Nexus
                trackEvent(
                  EVENT_CATEGORIES.UI_INTERACTION,
                  EVENT_ACTIONS.CONTACT_OPEN,
                  `mobile_card_nexus_contact_${companyInfo.name}_${isTouchDevice ? 'touch' : 'mouse'}`
                );
                setShowContactModal(true);
              }}
              className={`text-xs text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link py-2' : ''
              }`}
              style={{
                ...(isTouchDevice && {
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
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
              {...companyLinkTouchProps}
              className={`text-xs text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link py-2' : ''
              }`}
              style={{
                ...(isTouchDevice && {
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
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
              {...appLinkTouchProps}
              className={`text-xs text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link py-2' : ''
              }`}
              style={{
                ...(isTouchDevice && {
                  minHeight: '44px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
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
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFirstLoad: PropTypes.bool
};

MobileCompanyCard.defaultProps = {
  isFirstLoad: false
};

export default React.memo(MobileCompanyCard);