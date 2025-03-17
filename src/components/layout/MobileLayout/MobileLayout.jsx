// src/components/layout/MobileLayout/MobileLayout.jsx
import React, { useState } from 'react';
import Footer from '../Footer';
import ProjectDetails from '../../features/project/ProjectDetails';
import TransformingCompanyHeader from '../../features/company/TransformingCompanyHeader';
import ContactInfo from '../../ui/ContactInfo';

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
  isMenuOpen
}) => {
  // Состояние для отображения контактной информации
  const [showContacts, setShowContacts] = useState(false);
  
  // Перехватываем вызов модального окна
  const handleContactClick = () => {
    // Вместо открытия модального окна, показываем встроенный компонент
    setShowContacts(true);
  };

  // Используем useMemo для запоминания вычисляемых значений
  const footerComponent = React.useMemo(() => (
    <Footer 
      activeCompany={activeCompany} 
      toggleCompany={(companyId) => {
        // Перехватываем нажатие на контакт
        if (companyId === 'contact') {
          handleContactClick();
        } else {
          toggleCompany(companyId);
        }
      }} 
      isMobile={true}
      foxIconRef={foxIconRef}
      isMenuOpen={isMenuOpen}
    />
  ), [activeCompany, toggleCompany, foxIconRef, isMenuOpen]);

  return (
    <>
      {/* Футер вверху (шапка в мобильной версии) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
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
      <div className="pt-20 px-4 pb-4">
        {isOpen && activeCompany && (
          <div className="relative">
            {/* Контейнер для TransformingCompanyHeader */}
            <div 
              className="relative z-30" 
              style={{ 
                marginBottom: isCompanyCardTransformed ? '2px' : '0'
              }}
            >
              <TransformingCompanyHeader
                company={activeCompany}
                activeCase={activeCase}
                selectCase={selectCase}
                closeSidebar={closeSidebar}
                backToCompanyCard={backToCompanyCard}
                setShowContactModal={showContacts ? () => {} : setShowContactModal}
                isTransformed={isCompanyCardTransformed}
                isMobile={true}
                maxHeight={'calc(100dvh - 160px)'}
                onHeightChange={() => {}}
              />
            </div>

            {/* Контейнер для ProjectDetails */}
            {activeCase && (
              <div
                className="relative z-20"
                style={{
                  boxShadow: 'none', // Убираем тень
                }}
              >
                <ProjectDetails
                  activeCase={activeCase}
                  handleCloseDetail={backToCompanyCard}
                  isMobile={true}
                  maxHeight="min(60dvh, calc(100dvh - 260px))"
                  hideCloseButton={true} // Скрываем кнопку закрытия
                  squareTopCorners={true} // Прямые верхние углы
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(MobileLayout);