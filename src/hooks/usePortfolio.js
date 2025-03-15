//src/hooks/usePortfolio.js
import { useState, useEffect } from 'react';

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
  
  // Новое состояние: трансформирована ли карточка компании в компактный вид
  const [isCompanyCardTransformed, setIsCompanyCardTransformed] = useState(false);

  // Отладочный лог при изменении состояния трансформации
  useEffect(() => {
    console.log("🔍 isCompanyCardTransformed изменилось:", isCompanyCardTransformed);
  }, [isCompanyCardTransformed]);

  // Отладочный лог при изменении активного проекта
  useEffect(() => {
    console.log("🔍 activeCase изменился:", activeCase);
  }, [activeCase]);

  // Функция для переключения компании
  const toggleCompany = (companyId) => {
    console.log("🔍 toggleCompany вызван с companyId:", companyId);
    
    if (companyId === 'contact') {
      setShowContactModal(true);
      return;
    }
    
    if (activeCompany === companyId) {
      // Если нажимаем на ту же компанию - закрываем ее
      setActiveCompany(null);
      setActiveCase(null);
      setIsOpen(false);
      setIsCompanyCardTransformed(false); // Сбрасываем состояние трансформации
      console.log("🔍 Закрываем компанию:", companyId);
    } else {
      // Иначе открываем новую компанию
      setActiveCompany(companyId);
      
      // Восстанавливаем сохраненный проект для этой компании или устанавливаем первый проект по умолчанию
      const savedCase = savedProjects[companyId];
      if (savedCase) {
        setActiveCase(savedCase);
        setIsCompanyCardTransformed(true); // Если есть сохраненный проект, трансформируем карточку
        console.log("🔍 Открываем компанию с сохраненным проектом:", companyId, savedCase);
      } else {
        // Здесь можно установить проект по умолчанию, если нужно
        setActiveCase(null);
        setIsCompanyCardTransformed(false); // Если нет проекта, показываем полную карточку
        console.log("🔍 Открываем компанию без проекта:", companyId);
      }
      
      setIsOpen(true);
    }
  };

  // Функция для выбора проекта
  const selectCase = (caseId) => {
    console.log("🔍 selectCase вызван с caseId:", caseId);
    setActiveCase(caseId);
    setIsCompanyCardTransformed(true); // При выборе проекта трансформируем карточку
    console.log("🔍 Устанавливаем isCompanyCardTransformed в true");
    
    // Сохраняем выбор проекта для текущей компании
    setSavedProjects({
      ...savedProjects,
      [activeCompany]: caseId
    });
  };

  // Функция для возврата к полной карточке компании
  const backToCompanyCard = () => {
    console.log("🔍 backToCompanyCard вызван");
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
    console.log("🔍 Устанавливаем isCompanyCardTransformed в false");
  };

  // Функция закрытия сайдбара (закрывает все окна)
  const closeSidebar = () => {
    console.log("🔍 closeSidebar вызван");
    setIsOpen(false);
    setActiveCompany(null);
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  // Функция закрытия только окна деталей проекта
  const closeProjectDetails = () => {
    console.log("🔍 closeProjectDetails вызван");
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  // Функция для открытия модального окна контактов
  const openContactModal = () => {
    console.log("🔍 openContactModal вызван");
    setShowContactModal(true);
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
    openContactModal
  };
};

export default usePortfolio;