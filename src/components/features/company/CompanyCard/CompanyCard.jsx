// src/components/features/company/CompanyCard/CompanyCard.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';
import { getCompanyImage } from '../../../../utils/companyUtils';
import { useImageViewer } from '../../../../contexts/ImageViewerContext';
import { getCompanyPngImage } from '../../../../utils/companyUtils';
import useTouchClick from '../../../../hooks/useTouchClick';
import { useDevice } from '../../../../contexts/DeviceContext';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../../services/analytics';

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
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент карточки компании
 */
const CompanyCard = ({
  company,
  activeCase,
  setActiveCase,
  handleCloseSidebar,
  setShowContactModal,
  maxHeight,
  onHeightChange,
  isFirstLoad
}) => {
  // State
  const [imageLoading, setImageLoading] = useState(true);
  
  // Refs
  const cardRef = useRef(null);
  
  // Hooks
  const { openViewer } = useImageViewer();
  
  // Используем DeviceContext для определения типа устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Данные
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];

  // Обработчик клика по изображению
  const handleImageClick = useCallback((e) => {
    // Отслеживаем клик по изображению с информацией об устройстве
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.IMAGE_CLICK,
      `company_card_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    // Открываем просмотрщик изображений с PNG-версией
    openViewer(getCompanyPngImage(company), companyInfo.name);
    
    // Логируем для отладки устройств
    if (process.env.NODE_ENV === 'development') {
      console.log('Image click device info:', { 
        isTouchDevice, 
        isTablet, 
        isIOS, 
        userAgent: navigator.userAgent 
      });
    }
  }, [company, companyInfo, openViewer, isTouchDevice, isTablet, isIOS]);

  // Используем улучшенный хук для обработки как клика, так и касания
  const touchProps = useTouchClick(handleImageClick, {
    preventDefault: true,
    stopPropagation: true
  });

  // Вычисляем высоту контента для прокрутки
  const contentHeight = maxHeight
    ? `calc(${typeof maxHeight === 'string' ? maxHeight : maxHeight + 'px'} - 240px)`
    : `calc(100vh - 240px)`;

  // Открываем модальное окно контактов
  const openContactModal = useCallback(() => {
    setShowContactModal(true);
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.CONTACT_OPEN,
      `company_card_${company}`
    );
  }, [setShowContactModal, company]);

  // Обработчик кликов по внешним ссылкам
  const handleExternalLinkClick = useCallback((linkType, url) => {
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.LINK_CLICK,
      `${linkType}_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [company, isTouchDevice]);

  // Эффект для отслеживания изменений высоты карточки
  useEffect(() => {
    if (!cardRef.current || !onHeightChange) return;
    
    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      onHeightChange(height);
    });
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  // Определяем класс для анимации в зависимости от флага первой загрузки
  const transitionClass = isFirstLoad ? '' : 'transform-card-transition';
  
  // Определяем дополнительные классы для тач-устройств
  const touchClass = isTouchDevice ? 'touch-enhanced' : '';
  const tabletClass = isTablet ? 'tablet-optimized' : '';
  const iosClass = isIOS ? 'ios-specific' : '';

  return (
    <div
      ref={cardRef}
      className={`card-glassmorphism rounded-3xl shadow-sm relative overflow-hidden ${transitionClass} ${touchClass} ${tabletClass} ${iosClass}`}
      style={{
        height: '100%',
        maxHeight: maxHeight || 'none'
      }}
    >
      {/* Фиксированный заголовок карточки */}
      <div className="sticky top-0 z-10 card-glassmorphism-bottom-border p-6 pb-4">
        <button
          onClick={() => {
            trackEvent(
              EVENT_CATEGORIES.UI_INTERACTION,
              'close_company_card',
              company
            );
            handleCloseSidebar();
          }}
          className="absolute top-3 right-3 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-40"
        >
          <svg className="text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" x2="6" y1="6" y2="18"></line>
            <line x1="6" x2="18" y1="6" y2="18"></line>
          </svg>
        </button>

        {/* Контейнер изображения с улучшенной обработкой касаний */}
        <div
          className={`image-hover-effect mb-4 cursor-pointer ${isTouchDevice ? 'touch-active' : ''}`}
          {...touchProps}
          aria-label={`Просмотреть изображение ${companyInfo.name}`}
        >
          <img
            src={getCompanyImage(company)}
            alt={companyInfo.name}
            className={`w-full h-auto transition-all ${
              isTablet || isIOS 
                ? 'duration-300 ease-out' // Более быстрый transition для iPad
                : 'duration-500 ease-in-out'
            } ${imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            onLoad={() => {
              trackEvent(
                EVENT_CATEGORIES.CONTENT_VIEW,
                'image_loaded',
                `company_image_${company}`
              );
              setImageLoading(false);
            }}
            onError={() => {
              trackEvent(
                EVENT_CATEGORIES.CONTENT_VIEW,
                'image_error',
                `company_image_${company}`
              );
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-left text-gray-900 dark:text-white">{companyInfo.name}</h2>
      </div>

      {/* Прокручиваемая область с контентом */}
      <div
        className="p-6 pt-6 overflow-y-auto custom-scrollbar"
        style={{ 
          maxHeight: contentHeight, 
          minHeight: '150px',
          // Улучшаем плавность прокрутки на iOS
          WebkitOverflowScrolling: isIOS ? 'touch' : 'auto'
        }}
      >
        {/* Описание компании */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-left">
          {companyInfo.description}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-black dark:text-white mb-3 text-left">Get a Sneak Peek</h3>
          <div className={`flex flex-wrap gap-3 ${isTablet || isIOS ? 'touch-projects' : ''}`}>
            {companyProjects.map((project) => (
              // Не отображать активный проект в десктопной версии
              activeCase !== project.id && (
                <button
                  key={project.id || project.title}
                  onClick={() => {
                    trackEvent(
                      EVENT_CATEGORIES.NAVIGATION,
                      EVENT_ACTIONS.PROJECT_SELECT,
                      `${company}_${project.id}_from_card_${isTouchDevice ? 'touch' : 'mouse'}`
                    );
                    setActiveCase(project.id);
                  }}
                  className={`border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white project-tag-button ${
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
                    fontSize: '16px',
                    fontWeight: '500',
                    width: 'auto',
                    // Увеличиваем область касания на тач-устройствах
                    ...(isTouchDevice && {
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    })
                  }}
                >
                  {project.shortName}
                </button>
              )
            ))}
            <button
              onClick={() => {
                trackEvent(
                  EVENT_CATEGORIES.UI_INTERACTION,
                  EVENT_ACTIONS.BUTTON_CLICK,
                  `other_projects_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
                );
                openContactModal();
              }}
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
                fontSize: '16px',
                fontWeight: '500',
                width: 'auto',
                // Увеличиваем область касания на тач-устройствах
                ...(isTouchDevice && {
                  minHeight: '44px',
                  touchAction: 'manipulation'
                })
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
              className={`text-sm text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link' : ''
              }`}
              style={{
                ...(isTouchDevice && {
                  minHeight: '36px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
            >
              <span>Contact about {companyInfo.name}</span>
              <svg className="ml-1" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <line x1="7" x2="17" y1="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          ) : (
            // Для остальных компаний - обычная ссылка
            <a
              href={companyInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link' : ''
              }`}
              onClick={() => handleExternalLinkClick('website', companyInfo.url)}
              style={{
                ...(isTouchDevice && {
                  minHeight: '36px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
            >
              <span>Visit {companyInfo.name}</span>
              <svg className="ml-1" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" x2="17" y1="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          )}

          {companyInfo.keyAppUrl && (
            <a
              href={companyInfo.keyAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-primary hover:text-primary-dark flex items-center ${
                isTouchDevice ? 'touch-link' : ''
              }`}
              onClick={() => handleExternalLinkClick('app_download', companyInfo.keyAppUrl)}
              style={{
                ...(isTouchDevice && {
                  minHeight: '36px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                })
              }}
            >
              <span>Download Key App</span>
              <svg className="ml-1" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" x2="17" y1="17" y2="7"></line>
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
  onHeightChange: PropTypes.func,
  isFirstLoad: PropTypes.bool
};

CompanyCard.defaultProps = {
  onHeightChange: () => {},
  isFirstLoad: false
};

export default React.memo(CompanyCard);