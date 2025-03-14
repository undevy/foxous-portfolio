import React from 'react';
import Footer from '../common/Footer';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';

// Подкомпонент для отображения только карточки компании
const MobileCompanyOnly = React.memo(({ 
  activeCompany, 
  activeCase, 
  selectCase, 
  closeSidebar, 
  setShowContactModal 
}) => (
  <div
    className="w-full"
    style={{ maxHeight: 'calc(100dvh - 160px)' }}
  >
    <CompanyCard
      company={activeCompany}
      activeCase={activeCase}
      setActiveCase={selectCase}
      handleCloseSidebar={closeSidebar}
      setShowContactModal={setShowContactModal}
      isMobile={true}
      maxHeight={'calc(100dvh - 160px)'}
    />
  </div>
));

// Подкомпонент для отображения карточки компании и проекта
const MobileCompanyAndProject = React.memo(({ 
  activeCompany, 
  activeCase, 
  selectCase, 
  closeSidebar, 
  setShowContactModal,
  closeProjectDetails
}) => (
  <div className="relative">
    {/* Карточка компании с адаптивной высотой */}
    <div
      className="w-full"
      style={{ maxHeight: 'min(40dvh, 300px)' }}
    >
      <CompanyCard
        company={activeCompany}
        activeCase={activeCase}
        setActiveCase={selectCase}
        handleCloseSidebar={closeSidebar}
        setShowContactModal={setShowContactModal}
        isMobile={true}
        maxHeight={'min(40dvh, 300px)'}
      />
    </div>

    {/* Карточка проекта с увеличенным отступом снизу */}
    <div
      className="w-full"
      style={{
        marginTop: '-70px',
        position: 'relative',
        zIndex: 20,
        paddingBottom: '20px' // добавлен дополнительный отступ снизу
      }}
    >
      <ProjectDetails
        activeCase={activeCase}
        handleCloseDetail={closeProjectDetails}
        isMobile={true}
        maxHeight="min(60dvh, calc(100dvh - 260px))"
      />
    </div>
  </div>
));

// Основной компонент
const MobileLayout = ({
  activeCompany,
  activeCase,
  isOpen,
  toggleCompany,
  selectCase,
  closeSidebar,
  closeProjectDetails,
  setShowContactModal,
}) => {
  // Используем useMemo для запоминания вычисляемых значений
  const footerComponent = React.useMemo(() => (
    <Footer activeCompany={activeCompany} toggleCompany={toggleCompany} isMobile={true} />
  ), [activeCompany, toggleCompany]);

  return (
    <>
      {/* Заголовок вверху */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
        <div className="mx-auto" style={{ maxWidth: '1048px' }}>
          {footerComponent}
        </div>
      </div>

      {/* Контент */}
      <div className="pt-20 px-4 pb-4">
        {isOpen && activeCompany && (
          activeCase ? (
            <MobileCompanyAndProject 
              activeCompany={activeCompany}
              activeCase={activeCase}
              selectCase={selectCase}
              closeSidebar={closeSidebar}
              closeProjectDetails={closeProjectDetails}
              setShowContactModal={setShowContactModal}
            />
          ) : (
            <MobileCompanyOnly
              activeCompany={activeCompany}
              activeCase={activeCase}
              selectCase={selectCase}
              closeSidebar={closeSidebar}
              setShowContactModal={setShowContactModal}
            />
          )
        )}
      </div>
    </>
  );
};

export default React.memo(MobileLayout);