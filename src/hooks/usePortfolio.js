import { useState, useRef } from 'react';

/**
 * Хук управления состоянием портфолио
 * @returns {Object} Объект с состояниями и функциями управления портфолио
 */
const usePortfolio = () => {
  // Основные состояния
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [savedProjects, setSavedProjects] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isCompanyCardTransformed, setIsCompanyCardTransformed] = useState(false);
  
  // Состояния для меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const foxIconRef = useRef(null);

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
    } else {
      // Открываем новую компанию
      setActiveCompany(companyId);
      
      // Восстанавливаем сохраненный проект или сбрасываем
      const savedCase = savedProjects[companyId];
      if (savedCase) {
        setActiveCase(savedCase);
        setIsCompanyCardTransformed(true);
      } else {
        setActiveCase(null);
        setIsCompanyCardTransformed(false);
      }
      
      setIsOpen(true);
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
    setSavedProjects({
      ...savedProjects,
      [activeCompany]: caseId
    });
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
    foxIconRef
  };
};

export default usePortfolio;