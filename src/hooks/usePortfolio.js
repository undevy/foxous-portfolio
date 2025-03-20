import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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

  // Установка начального состояния в зависимости от типа устройства
  useEffect(() => {
    // Устанавливаем GMX как активную компанию в любом случае
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
  }, [isMobile, setCompanyTheme]);

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
      return;
    }
    
    // Переключаем активную компанию
    if (activeCompany === companyId) {
      // Закрываем текущую компанию
      setActiveCompany(null);
      setActiveCase(null);
      setIsOpen(false);
      setIsCompanyCardTransformed(false);
      
      // Сбрасываем тему компании на дефолтную
      setCompanyTheme('default');
    } else {
      // Открываем новую компанию
      setActiveCompany(companyId);
      
      if (!isMobile) {
        // На десктопе автоматически открываем первый проект
        const savedCase = savedProjects[companyId] || 
          (companyId === 'gmx' ? 'tradepage' : null);
        
        if (savedCase) {
          setActiveCase(savedCase);
          setIsCompanyCardTransformed(true);
        } else {
          // Если нет сохраненного проекта, но это десктоп,
          // попробуем найти первый проект для этой компании
          import('../data/projects').then(module => {
            const projects = module.projectsByCompany[companyId];
            if (projects && projects.length > 0) {
              const firstProjectId = projects[0].id;
              setActiveCase(firstProjectId);
              setIsCompanyCardTransformed(true);
              
              // Сохраняем для будущего использования
              setSavedProjects(prev => ({
                ...prev,
                [companyId]: firstProjectId
              }));
            }
          }).catch(() => {
            // Если ошибка при импорте, просто не открываем проект
            setActiveCase(null);
            setIsCompanyCardTransformed(false);
          });
        }
      } else {
        // На мобильных только открываем карточку компании
        setActiveCase(null);
        setIsCompanyCardTransformed(false);
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
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  /**
   * Закрывает сайдбар (все окна)
   */
  const closeSidebar = () => {
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