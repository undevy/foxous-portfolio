// src/hooks/usePortfolio.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../services/analytics';

/**
 * Хук управления состоянием портфолио
 * @returns {Object} Объект с состояниями и функциями управления портфолио
 */
const usePortfolio = () => {
  // Получаем функцию для изменения цветовой схемы компании
  const { setCompanyTheme } = useTheme();

  // Определение типа устройства при инициализации
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768; // Стандартная точка разрыва для мобильных устройств
  });

  // Основные состояния с начальными значениями, зависящими от типа устройства
  const [activeCompany, setActiveCompany] = useState('gmx');
  const [activeCase, setActiveCase] = useState(null); // Изначально не устанавливаем проект
  const [savedProjects, setSavedProjects] = useState({
    'gmx': 'tradepage'
  });
  const [isOpen, setIsOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isCompanyCardTransformed, setIsCompanyCardTransformed] = useState(false);
  
  // Состояния для меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const foxIconRef = useRef(null);

  // Функция для проверки размера экрана
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Слушатель изменения размера окна
  useEffect(() => {
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [checkIfMobile]);

  // Установка начального состояния только при первой загрузке
  useEffect(() => {
    // Устанавливаем GMX только при первой загрузке
    setCompanyTheme('gmx');
    
    if (!isMobile) {
      // Для десктопа - открываем первый проект
      setActiveCase('tradepage');
      setIsCompanyCardTransformed(true);
    } else {
      // Для мобильных - только карточка компании
      setActiveCase(null);
      setIsCompanyCardTransformed(false);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Отдельный эффект для обработки изменения размера экрана
  useEffect(() => {
    if (!isMobile) {
      // Для десктопа - открываем первый проект если нет активного
      if (!activeCase) {
        setActiveCase('tradepage');
        setIsCompanyCardTransformed(true);
      }
    } else {
      // Для мобильных логика может быть другой
      // Можно оставить текущий кейс или сбросить его
    }
  }, [isMobile, activeCase]);

  /**
   * Переключает видимость компании
   * @param {string} companyId - ID компании
   */
  const toggleCompany = (companyId) => {
  
    // Обрабатываем меню отдельно
    if (companyId === 'menu') {
      toggleMenu();
      return;
    }
    
    // Обрабатываем модальное окно контактов
    if (companyId === 'contact') {
      setShowContactModal(true);

      // Отслеживаем открытие контактов
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION, 
        EVENT_ACTIONS.CONTACT_OPEN,
        'footer_button'
      );
      return;
    }
    
    // Переключаем активную компанию
    if (activeCompany === companyId) {
      // Закрываем текущую компанию
      setActiveCompany(null);
      setActiveCase(null);
      setIsOpen(false);
      setIsCompanyCardTransformed(false);

      // Отслеживаем закрытие компании
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        'company_close',
        companyId
      );
      
      // Сбрасываем тему компании на дефолтную
      setCompanyTheme('default');
    } else {
      // Открываем новую компанию
      setActiveCompany(companyId);

      // Отслеживаем открытие компании
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        EVENT_ACTIONS.COMPANY_SELECT,
        companyId
      );

      // Начинаем отслеживать время просмотра компании
      startTimingEvent(`company_view_${companyId}`);
      
      if (!isMobile) {
        // Отслеживаем, что пользователь зашел на десктопе
        trackEvent(
          EVENT_CATEGORIES.NAVIGATION,
          'initial_load',
          `desktop_device_${companyId}`
        );
        
        // На десктопе автоматически открываем первый проект
        const savedCase = savedProjects[companyId] || 
          (companyId === 'gmx' ? 'tradepage' : null);
        
        // Начинаем отслеживать время просмотра компании сразу при загрузке
        startTimingEvent(`company_view_${companyId}`);
        
        if (savedCase) {
          setActiveCase(savedCase);
          setIsCompanyCardTransformed(true);
          
          // Отслеживаем автоматическое открытие/восстановление проекта
          trackEvent(
            EVENT_CATEGORIES.NAVIGATION,
            'auto_open_project',
            `${companyId}_${savedCase}_from_saved`
          );
          
          // Начинаем отслеживать время просмотра проекта
          startTimingEvent(`project_view_${companyId}_${savedCase}`);
          
          // Отслеживаем просмотр контента
          trackEvent(
            EVENT_CATEGORIES.CONTENT_VIEW,
            'auto_project_view',
            `${companyId}_${savedCase}`
          );
        } else {
          // Если нет сохраненного проекта, но это десктоп,
          // попробуем найти первый проект для этой компании
          trackEvent(
            EVENT_CATEGORIES.NAVIGATION,
            'searching_first_project',
            companyId
          );
          
          import('../data/projects').then(module => {
            const projects = module.projectsByCompany[companyId];
            if (projects && projects.length > 0) {
              const firstProjectId = projects[0].id;
              setActiveCase(firstProjectId);
              setIsCompanyCardTransformed(true);
              
              // Отслеживаем автоматическое открытие первого проекта из списка
              trackEvent(
                EVENT_CATEGORIES.NAVIGATION,
                'auto_open_project',
                `${companyId}_${firstProjectId}_from_list`
              );
              
              // Начинаем отслеживать время просмотра проекта
              startTimingEvent(`project_view_${companyId}_${firstProjectId}`);
              
              // Отслеживаем просмотр контента первого проекта
              trackEvent(
                EVENT_CATEGORIES.CONTENT_VIEW,
                'auto_project_view',
                `${companyId}_${firstProjectId}`
              );
              
              // Сохраняем для будущего использования
              setSavedProjects(prev => ({
                ...prev,
                [companyId]: firstProjectId
              }));
            } else {
              // Отслеживаем, что проекты не найдены
              trackEvent(
                EVENT_CATEGORIES.NAVIGATION,
                'no_projects_found',
                companyId
              );
              
              // Если проектов нет, не открываем проект
              setActiveCase(null);
              setIsCompanyCardTransformed(false);
            }
          }).catch((error) => {
            // Отслеживаем ошибку импорта
            trackEvent(
              EVENT_CATEGORIES.NAVIGATION,
              'import_error',
              `${companyId}_${error.message}`
            );
            
            // Если ошибка при импорте, просто не открываем проект
            setActiveCase(null);
            setIsCompanyCardTransformed(false);
          });
        }
      } else {
        // На мобильных только открываем карточку компании
        setActiveCase(null);
        setIsCompanyCardTransformed(false);
        
        // Отслеживаем, что пользователь зашел на мобильном устройстве
        trackEvent(
          EVENT_CATEGORIES.NAVIGATION,
          'initial_load',
          `mobile_device_${companyId}`
        );
        
        // Отслеживаем просмотр только карточки компании на мобильном
        trackEvent(
          EVENT_CATEGORIES.CONTENT_VIEW,
          'mobile_company_card_view',
          companyId
        );
        
        // Начинаем отслеживать время просмотра компании
        startTimingEvent(`company_view_${companyId}`);
      }
      
      setIsOpen(true);
      
      // Устанавливаем цветовую схему для выбранной компании
      setCompanyTheme(companyId);
    }
  };

  /**
   * Выбирает проект
   * @param {string} caseId - ID проекта
   */
  const selectCase = (caseId) => {
    setActiveCase(caseId);
    setIsCompanyCardTransformed(true);
    
    // Отслеживаем выбор проекта
    trackEvent(
      EVENT_CATEGORIES.NAVIGATION,
      EVENT_ACTIONS.PROJECT_SELECT,
      `${activeCompany}_${caseId}`
    );
    
    // Начинаем отслеживать время просмотра проекта
    startTimingEvent(`project_view_${activeCompany}_${caseId}`);

    // Сохраняем выбор проекта для этой компании
    setSavedProjects(prev => ({
      ...prev,
      [activeCompany]: caseId
    }));
  };

  /**
   * Возвращает к полной карточке компании
   */
  const backToCompanyCard = () => {
    if (activeCase) {
      // Отслеживаем завершение просмотра проекта
      endTimingEvent(
        EVENT_CATEGORIES.ENGAGEMENT,
        `project_view_duration`,
        `${activeCompany}_${activeCase}`
      );
      
      // Отслеживаем возврат к компании
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        'back_to_company',
        activeCompany
      );
    }
    
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  /**
   * Закрывает сайдбар (все окна)
   */
  const closeSidebar = () => {
    if (activeCompany) {
      // Отслеживаем завершение просмотра компании
      endTimingEvent(
        EVENT_CATEGORIES.ENGAGEMENT,
        `company_view_duration`,
        activeCompany
      );
      
      if (activeCase) {
        // Отслеживаем завершение просмотра проекта
        endTimingEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          `project_view_duration`,
          `${activeCompany}_${activeCase}`
        );
      }
      
      // Отслеживаем закрытие сайдбара
      trackEvent(
        EVENT_CATEGORIES.NAVIGATION,
        'close_sidebar',
        activeCompany
      );
    }

    setIsOpen(false);
    setActiveCompany(null);
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
    
    // Сбрасываем тему компании на дефолтную
    setCompanyTheme('default');
  };

  /**
   * Закрывает только детали проекта
   */
  const closeProjectDetails = () => {
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  /**
   * Открывает модальное окно контактов
   */
  const openContactModal = () => {
    setShowContactModal(true);
  };
  
  /**
   * Переключает состояние меню
   */
  const toggleMenu = () => {
    // Если меню открыто, закрываем его
    if (isMenuOpen) {
      setIsMenuOpen(false);
      
      // Отслеживаем закрытие меню
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        EVENT_ACTIONS.MENU_CLOSE,
        'toggle_button'
      );
      return;
    }
    
    // Получаем позицию для размещения меню
    if (foxIconRef.current) {
      const rect = foxIconRef.current.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.top,
        height: rect.height,
        width: rect.width
      };
      setMenuPosition(position);
    }
    
    // Открываем меню
    setIsMenuOpen(true);
    
    // Отслеживаем открытие меню
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.MENU_OPEN,
      'fox_icon'
    );
  };
  
  /**
   * Закрывает меню
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return {
    activeCompany,
    activeCase,
    isOpen,
    showContactModal,
    isCompanyCardTransformed,
    setShowContactModal,
    toggleCompany,
    selectCase,
    closeSidebar,
    closeProjectDetails,
    backToCompanyCard,
    openContactModal,
    isMenuOpen,
    menuPosition,
    toggleMenu,
    closeMenu,
    foxIconRef,
    isMobile // Экспортируем флаг типа устройства
  };
};

export default usePortfolio;