import React from 'react';
import Footer from '../common/Footer';
import CompanyCard from '../company/CompanyCard';
import ProjectDetails from '../company/ProjectDetails';

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
  return (
    <>
      {/* Заголовок вверху */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
        <div className="mx-auto" style={{ maxWidth: '1048px' }}>
          <Footer activeCompany={activeCompany} toggleCompany={toggleCompany} isMobile={true} />
        </div>
      </div>

      {/* Контент */}
      <div className="pt-20 px-4 pb-4">
        {isOpen && activeCompany && (
          <div className="relative">
            {/* Карточка компании с адаптивной высотой */}
            <div
              className="w-full"
              style={{
                maxHeight: activeCase ? 'min(40dvh, 300px)' : 'calc(100dvh - 160px)',
              }}
            >
              <CompanyCard
                company={activeCompany}
                activeCase={activeCase}
                setActiveCase={selectCase}
                handleCloseSidebar={closeSidebar}
                setShowContactModal={setShowContactModal}
                isMobile={true}
                maxHeight={activeCase ? 'min(40dvh, 300px)' : 'calc(100dvh - 160px)'}
              />
            </div>

            {/* Карточка проекта с увеличенным отступом снизу */}
            {activeCase && (
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
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MobileLayout;