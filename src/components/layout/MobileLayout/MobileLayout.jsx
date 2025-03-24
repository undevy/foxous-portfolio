// src/components/layout/MobileLayout/MobileLayout.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import ProjectDetails from '../../features/project/ProjectDetails';
import TransformingCompanyHeader from '../../features/company/TransformingCompanyHeader';
import ContactInfo from '../../ui/ContactInfo';
import { useDevice } from '../../../contexts/DeviceContext';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент мобильного макета приложения
 * Оптимизирован для тач-устройств и iOS с полным трекингом взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {boolean} props.isOpen - Открыто ли окно
 * @param {boolean} props.isCompanyCardTransformed - Трансформирована ли карточка компании
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {Function} props.selectCase - Функция выбора проекта
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.closeProjectDetails - Функция закрытия деталей проекта
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {Object} props.foxIconRef - Ref для иконки лисы
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {boolean} props.isMenuOpen - Открыто ли меню
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент мобильного макета
 */
const MobileLayout = ({
  activeCompany,
  activeCase,
  isOpen,
  isCompanyCardTransformed,
  toggleCompany,
  selectCase,
  closeSidebar,
  backToCompanyCard,
  closeProjectDetails,
  setShowContactModal,
  foxIconRef,
  isMobile,
  isMenuOpen,
  isFirstLoad
}) => {
  // Состояние для отображения контактной информации
  const [showContacts, setShowContacts] = useState(false);
  
  // Определяем тип устройства
  const { isTablet, isIOS } = useDevice();
  
  // Обработка загрузки страницы
  useEffect(() => {
    // Отслеживаем загрузку мобильного макета
    trackEvent(
      EVENT_CATEGORIES.CONTENT_VIEW,
      'mobile_layout_loaded',
      `${isIOS ? 'ios' : 'other_mobile'}_${activeCompany || 'no_company'}`
    );
    
    // Начинаем отслеживать время пребывания
    startTimingEvent('mobile_layout_view');
    
    return () => {
      // Завершаем отслеживание времени
      endTimingEvent(
        EVENT_CATEGORIES.ENGAGEMENT,
        'mobile_layout_duration',
        isIOS ? 'ios_device' : 'other_mobile'
      );
    };
  }, [isIOS, activeCompany]);
  
  // Отслеживание переключения компаний
  useEffect(() => {
    if (activeCompany) {
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        'active_company_changed',
        `mobile_layout_${activeCompany}_${isIOS ? 'ios' : 'other_mobile'}`
      );
    }
  }, [activeCompany, isIOS]);
  
  // Отслеживание переключения проектов
  useEffect(() => {
    if (activeCase) {
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        'active_case_changed',
        `mobile_layout_${activeCompany}_${activeCase}_${isIOS ? 'ios' : 'other_mobile'}`
      );
    }
  }, [activeCase, activeCompany, isIOS]);
  
  // Перехватываем вызов модального окна
  const handleContactClick = useCallback(() => {
    // Отслеживаем открытие контактов
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.CONTACT_OPEN,
      `mobile_header_${activeCompany || 'no_company'}_${isIOS ? 'ios' : 'other_mobile'}`
    );
    
    // Вместо открытия модального окна, показываем встроенный компонент
    setShowContacts(true);
  }, [activeCompany, isIOS]);

  // Перехватываем функцию переключения компании для добавления трекинга
  const handleToggleCompany = useCallback((companyId) => {
    // Перехватываем нажатие на контакт
    if (companyId === 'contact') {
      handleContactClick();
    } else {
      // Отслеживаем переключение компании
      if (companyId && companyId !== activeCompany) {
        trackEvent(
          EVENT_CATEGORIES.NAVIGATION,
          EVENT_ACTIONS.COMPANY_SELECT,
          `mobile_footer_${companyId}_${isIOS ? 'ios' : 'other_mobile'}`
        );
      }
      
      toggleCompany(companyId);
    }
  }, [toggleCompany, handleContactClick, activeCompany, isIOS]);
  
  // Перехватываем функцию выбора проекта для добавления трекинга
  const handleSelectCase = useCallback((caseId) => {
    // Отслеживаем выбор проекта
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.PROJECT_SELECT,
      `mobile_card_${activeCompany}_${caseId}_${isIOS ? 'ios' : 'other_mobile'}`
    );
    
    selectCase(caseId);
  }, [selectCase, activeCompany, isIOS]);
  
  // Перехватываем функцию возврата к карточке компании для добавления трекинга
  const handleBackToCompanyCard = useCallback(() => {
    // Отслеживаем возврат к карточке компании
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      'back_to_company_card',
      `mobile_header_${activeCompany}_${activeCase}_${isIOS ? 'ios' : 'other_mobile'}`
    );
    
    backToCompanyCard();
  }, [backToCompanyCard, activeCompany, activeCase, isIOS]);

  // Используем useMemo для запоминания вычисляемых значений
  const footerComponent = useMemo(() => (
    <Footer 
      activeCompany={activeCompany} 
      toggleCompany={handleToggleCompany} 
      isMobile={true}
      foxIconRef={foxIconRef}
      isMenuOpen={isMenuOpen}
    />
  ), [activeCompany, handleToggleCompany, foxIconRef, isMenuOpen]);

  // Высчитываем оптимальные размеры для контейнеров в зависимости от устройства
  const containerStyles = useMemo(() => {
    // iOS-специфичные стили для решения проблем с safe areas и scrolling
    const iosStyles = isIOS ? {
      paddingTop: 'env(safe-area-inset-top, 0)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      WebkitOverflowScrolling: 'touch'
    } : {};
    
    // Базовые стили с учетом типа устройства
    return {
      mainContainer: {
        paddingTop: isTablet ? '24px' : '20px',
        paddingBottom: isTablet ? '12px' : '4px',
        paddingLeft: isTablet ? '16px' : '4px',
        paddingRight: isTablet ? '16px' : '4px',
        ...iosStyles
      },
      projectHeight: isTablet 
        ? "min(85dvh, calc(100dvh - 160px))" 
        : "min(80dvh, calc(100dvh - 180px))"
    };
  }, [isTablet, isIOS]);

  return (
    <>
      {/* Футер вверху (шапка в мобильной версии) */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 mobile-safe-top ${
          isIOS ? 'ios-specific' : ''
        }`}
      >
        <div className="mx-auto" style={{ maxWidth: '1048px' }}>
          {footerComponent}
        </div>
      </div>

      {/* Компонент ContactInfo (отображается как оверлей) */}
      <ContactInfo 
        activeCompany={activeCompany} 
        showContacts={showContacts} 
        setShowContacts={setShowContacts} 
      />

      {/* Контент */}
      <div 
        className={`pt-20 px-4 pb-4 mobile-safe-bottom ${
          isIOS ? 'ios-scrolling' : ''
        }`}
        style={containerStyles.mainContainer}
      >
        {isOpen && activeCompany && (
          <div 
            className="relative"
            onScroll={isIOS ? (e) => {
              // Явная оптимизация для iOS scrolling
              e.currentTarget.style.WebkitOverflowScrolling = 'touch';
            } : undefined}
          >
            {/* Контейнер для TransformingCompanyHeader */}
            <div 
              className={`relative z-30 ${
                isTablet || isIOS ? 'animation-optimized' : ''
              }`} 
              style={{ 
                marginBottom: isCompanyCardTransformed ? '2px' : '0',
                transition: isTablet || isIOS 
                  ? 'margin-bottom 0.2s ease-out' 
                  : 'margin-bottom 0.3s ease-in-out'
              }}
            >
              <TransformingCompanyHeader
                company={activeCompany}
                activeCase={activeCase}
                selectCase={handleSelectCase}
                closeSidebar={closeSidebar}
                backToCompanyCard={handleBackToCompanyCard}
                setShowContactModal={showContacts ? () => {} : setShowContactModal}
                isTransformed={isCompanyCardTransformed}
                isMobile={true}
                maxHeight={isTablet ? 'calc(100dvh - 110px)' : 'calc(100dvh - 120px)'}
                onHeightChange={() => {}}
                isFirstLoad={isFirstLoad}
              />
            </div>

            {/* Контейнер для ProjectDetails */}
            {activeCase && (
              <div
                className={`relative z-20 ${isTablet || isIOS ? 'animation-optimized' : ''}`}
                style={{
                  boxShadow: 'none', // Убираем тень для лучшей производительности на мобильных
                }}
              >
                <ProjectDetails
                  activeCase={activeCase}
                  handleCloseDetail={handleBackToCompanyCard}
                  isMobile={true}
                  maxHeight={containerStyles.projectHeight}
                  hideCloseButton={true} // Скрываем кнопку закрытия
                  squareTopCorners={true} // Прямые верхние углы
                  isFirstLoad={isFirstLoad}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

MobileLayout.propTypes = {
  activeCompany: PropTypes.string,
  activeCase: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isCompanyCardTransformed: PropTypes.bool.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  closeProjectDetails: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  foxIconRef: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  isFirstLoad: PropTypes.bool
};

MobileLayout.defaultProps = {
  isFirstLoad: false
};

export default React.memo(MobileLayout, (prevProps, nextProps) => {
  // Оптимизация рендеринга с кастомной функцией сравнения
  return (
    prevProps.activeCompany === nextProps.activeCompany &&
    prevProps.activeCase === nextProps.activeCase &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.isCompanyCardTransformed === nextProps.isCompanyCardTransformed &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.isMenuOpen === nextProps.isMenuOpen &&
    prevProps.isFirstLoad === nextProps.isFirstLoad
  );
});