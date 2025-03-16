// src/components/layout/DesktopLayout.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import Footer from '../common/Footer';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';

// Компонент только с карточкой компании
const CompanyCardOnly = React.memo(({ 
  activeCompany, 
  activeCase, 
  selectCase, 
  closeSidebar, 
  setShowContactModal,
  contentHeight, 
  setCardHeight 
}) => (
  <div className="flex justify-center">
    <div className="w-[384px]" style={{ maxHeight: contentHeight }}>
      <CompanyCard
        company={activeCompany}
        activeCase={activeCase}
        setActiveCase={selectCase}
        handleCloseSidebar={closeSidebar}
        setShowContactModal={setShowContactModal}
        isMobile={false}
        maxHeight={contentHeight}
        onHeightChange={setCardHeight}
      />
    </div>
  </div>
));

// Компонент с карточкой компании и деталями проекта
const CompanyAndProjectCards = React.memo(({ 
  activeCompany, 
  activeCase, 
  selectCase, 
  closeSidebar, 
  setShowContactModal,
  closeProjectDetails,
  contentHeight, 
  cardHeight, 
  setCardHeight 
}) => (
  <div className="flex gap-6">
    <div className="w-[384px] shrink-0" style={{ maxHeight: contentHeight }}>
      <CompanyCard
        company={activeCompany}
        activeCase={activeCase}
        setActiveCase={selectCase}
        handleCloseSidebar={closeSidebar}
        setShowContactModal={setShowContactModal}
        isMobile={false}
        maxHeight={contentHeight}
        onHeightChange={setCardHeight}
      />
    </div>
    <div className="flex-grow" style={{ maxHeight: contentHeight }}>
      <ProjectDetails
        activeCase={activeCase}
        handleCloseDetail={closeProjectDetails}
        isMobile={false}
        maxHeight={cardHeight}
      />
    </div>
  </div>
));

const DesktopLayout = ({
  activeCompany,
  activeCase,
  isOpen,
  toggleCompany,
  selectCase,
  closeSidebar,
  closeProjectDetails,
  setShowContactModal,
  foxIconRef,
  isMobile,
  isMenuOpen
}) => {
  const footerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');
  const [cardHeight, setCardHeight] = useState('auto');

  useEffect(() => {
    // Функция для расчета высоты контента
    const calculateContentHeight = () => {
      if (footerRef.current) {
        const viewportHeight = window.innerHeight;
        const footerHeight = footerRef.current.offsetHeight;
        const footerMargin = 24;
        setContentHeight(`calc(${viewportHeight}px - ${footerHeight}px - ${footerMargin}px)`);
      }
    };

    calculateContentHeight();
    
    // Добавляем слушатель событий для изменения размера окна
    window.addEventListener('resize', calculateContentHeight);
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', calculateContentHeight);
    };
  }, []);

  // Мемоизируем футер для предотвращения ненужных перерисовок
  const footerComponent = useMemo(() => (
    <Footer 
      activeCompany={activeCompany} 
      toggleCompany={toggleCompany} 
      isMobile={false}
      foxIconRef={foxIconRef}
      isMenuOpen={isMenuOpen}
    />
  ), [activeCompany, toggleCompany, foxIconRef, isMenuOpen]);

  return (
    <>
      {/* Основной контент */}
      <div className="flex justify-center items-center" style={{ height: contentHeight }}>
        <div className="w-full px-6 mx-auto" style={{ maxWidth: '1048px' }}>
          {isOpen && activeCompany && !activeCase && (
            <CompanyCardOnly 
              activeCompany={activeCompany}
              activeCase={activeCase}
              selectCase={selectCase}
              closeSidebar={closeSidebar}
              setShowContactModal={setShowContactModal}
              contentHeight={contentHeight}
              setCardHeight={setCardHeight}
            />
          )}

          {isOpen && activeCompany && activeCase && (
            <CompanyAndProjectCards 
              activeCompany={activeCompany}
              activeCase={activeCase}
              selectCase={selectCase}
              closeSidebar={closeSidebar}
              closeProjectDetails={closeProjectDetails}
              setShowContactModal={setShowContactModal}
              contentHeight={contentHeight}
              cardHeight={cardHeight}
              setCardHeight={setCardHeight}
            />
          )}
        </div>
      </div>

      {/* Футер внизу */}
      <div ref={footerRef} className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6">
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
          {footerComponent}
        </div>
      </div>
    </>
  );
};

export default React.memo(DesktopLayout);