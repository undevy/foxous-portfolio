// src/components/features/company/MobileCompanyNav/MobileCompanyNav.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';
import { useDevice } from '../../../../contexts/DeviceContext';
import useTouchClick from '../../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../../services/analytics';

/**
 * Компонент компактной навигационной панели компании для мобильных устройств
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент компактной навигационной панели
 */
const MobileCompanyNav = ({
  company,
  activeCase,
  selectCase,
  backToCompanyCard,
  setShowContactModal,
  isFirstLoad
}) => {
  // Используем DeviceContext для определения типа устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];

  // Обработчик возврата к карточке компании
  const handleBackToCompany = useCallback(() => {
    // Отслеживаем возврат к полной карточке
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.BACK_NAVIGATION,
      `from_${activeCase}_to_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    backToCompanyCard();
  }, [backToCompanyCard, activeCase, company, isTouchDevice]);
  
  // Создаем touchProps для кнопки возврата к компании
  const backTouchProps = useTouchClick(handleBackToCompany);
  
  // Обработчик открытия контактов - определяем на верхнем уровне
  const handleOpenContacts = useCallback(() => {
    // Отслеживаем нажатие на кнопку "Other"
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.CONTACT_OPEN,
      `mobile_nav_other_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setShowContactModal(true);
  }, [setShowContactModal, company, isTouchDevice]);
  
  // Создаем touchProps для кнопки Other/контактов
  const contactsTouchProps = useTouchClick(handleOpenContacts);
  
  // ИСПРАВЛЕНИЕ: Создаем единый обработчик для всех проектов
  const handleProjectClick = useCallback((projectId) => {
    // Отслеживаем переключение между проектами
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.PROJECT_SELECT,
      `mobile_nav_switch_from_${activeCase}_to_${projectId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    selectCase(projectId);
  }, [activeCase, selectCase, isTouchDevice]);

  // Определяем класс для анимации в зависимости от флага первой загрузки и типа устройства
  const transitionClass = isFirstLoad ? '' : 'transform-card-transition';
  
  // Используем isTablet для определения оптимизированного класса анимации
  const tabletAnimationClass = isTablet ? 'tablet-animation-optimized' : '';

  return (
    <div 
      className={`card-glassmorphism rounded-t-3xl shadow-sm overflow-hidden ${transitionClass} ${tabletAnimationClass}`}
      style={{ 
        minHeight: '100px',
        position: 'relative',
        zIndex: 30,
        marginTop: '-50px',
        paddingTop: '30px',
        // Применяем разные стили анимации для планшетов и iOS-устройств
        transition: isTablet || isIOS ? 'all 0.2s ease-out' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Горизонтальная прокрутка с табами проектов */}
      <div 
        className="overflow-x-auto custom-scrollbar scrollbar-hide pb-4 horizontal-scroll" 
        style={{ 
          WebkitOverflowScrolling: isIOS ? 'touch' : 'auto', 
          paddingTop: '30px',
          paddingBottom: '12px'
        }}
      >
        <div className="flex space-x-1 px-4 pb-3 min-w-max">
          {/* Кнопка "Назад к компании" */}
          <button
            {...backTouchProps}
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
              fontWeight: '600',
              width: 'auto',
              minHeight: isTouchDevice ? '44px' : 'auto',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            ⬅️ To {companyInfo.name}
          </button>
          
          {/* Кнопки проектов (кроме активного) */}
          {companyProjects.map((project) => {
            // Не отображаем активный проект
            if (activeCase === project.id) return null;
            
            // ИСПРАВЛЕНИЕ: Используем вспомогательную функцию для создания обработчика для каждой кнопки
            // без вызова хуков внутри цикла
            const projectTouchHandler = (e) => {
              // Предотвращаем стандартное поведение для тач-событий
              if (e.type === 'touchend') {
                e.preventDefault();
              }
              e.stopPropagation();
              
              // Вызываем общий обработчик
              handleProjectClick(project.id);
            };
            
            return (
              <button
                key={project.id}
                onClick={projectTouchHandler}
                onTouchEnd={projectTouchHandler}
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
                  width: 'auto',
                  minHeight: isTouchDevice ? '44px' : 'auto',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  // Различные эффекты перехода для разных устройств
                  transition: isTablet ? 'background-color 0.2s ease-out' : 
                                isIOS ? 'background-color 0.25s ease' : 
                                'all 0.3s ease-in-out'
                }}
              >
                {project.shortName}
              </button>
            );
          })}
          
          {/* Кнопка "Other" */}
          <button
            {...contactsTouchProps}
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
              width: 'auto',
              minHeight: isTouchDevice ? '44px' : 'auto',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              // Различные эффекты перехода для разных устройств
              transition: isTablet ? 'all 0.2s ease-out' : 
                          isIOS ? 'all 0.25s ease' : 
                          'all 0.3s ease-in-out'
            }}
          >
            🔍 Other
          </button>
        </div>
      </div>
    </div>
  );
};

MobileCompanyNav.propTypes = {
  company: PropTypes.string.isRequired,
  activeCase: PropTypes.string,
  selectCase: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  isFirstLoad: PropTypes.bool
};

MobileCompanyNav.defaultProps = {
  isFirstLoad: false
};

export default React.memo(MobileCompanyNav);