import { useState } from 'react';

const usePortfolio = () => {
  // Состояние для активной компании
  const [activeCompany, setActiveCompany] = useState(null);
  
  // Состояние для активного кейса (проекта)
  const [activeCase, setActiveCase] = useState(null);
  
  // Для сохранения выбранных проектов для каждой компании
  const [savedProjects, setSavedProjects] = useState({});
  
  // Состояние открыто/закрыто основное окно
  const [isOpen, setIsOpen] = useState(false);
  
  // Состояние модального окна контактов
  const [showContactModal, setShowContactModal] = useState(false);

  // Функция для переключения компании
  const toggleCompany = (companyId) => {
    if (companyId === 'contact') {
      setShowContactModal(true);
      return;
    }
    
    if (activeCompany === companyId) {
      // Если нажимаем на ту же компанию - закрываем ее
      setActiveCompany(null);
      setActiveCase(null);
      setIsOpen(false);
    } else {
      // Иначе открываем новую компанию
      setActiveCompany(companyId);
      
      // Восстанавливаем сохраненный проект для этой компании или устанавливаем первый проект по умолчанию
      const savedCase = savedProjects[companyId];
      if (savedCase) {
        setActiveCase(savedCase);
      } else {
        // Здесь можно установить проект по умолчанию, если нужно
        setActiveCase(null);
      }
      
      setIsOpen(true);
    }
  };

  // Функция для выбора проекта
  const selectCase = (caseId) => {
    setActiveCase(caseId);
    
    // Сохраняем выбор проекта для текущей компании
    setSavedProjects({
      ...savedProjects,
      [activeCompany]: caseId
    });
  };

  // Функция закрытия сайдбара (закрывает все окна)
  const closeSidebar = () => {
    setIsOpen(false);
    setActiveCompany(null);
    setActiveCase(null);
  };

  // Функция закрытия только окна деталей проекта
  const closeProjectDetails = () => {
    setActiveCase(null);
  };

  // Функция для открытия модального окна контактов
  const openContactModal = () => {
    setShowContactModal(true);
  };

  return {
    activeCompany,
    activeCase,
    isOpen,
    showContactModal,
    setShowContactModal,
    toggleCompany,
    selectCase,
    closeSidebar,
    closeProjectDetails,
    openContactModal
  };
};

export default usePortfolio;