import React, { useEffect } from 'react';
import Footer from '../common/Footer';
import ProjectDetails from '../company/ProjectDetails';
import TransformingCompanyHeader from '../common/TransformingCompanyHeader';

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
}) => {
  // Добавим логи для отладки
  useEffect(() => {
    console.log("🔍 MobileLayout рендерится со следующими пропсами:");
    console.log("🔍 activeCompany:", activeCompany);
    console.log("🔍 activeCase:", activeCase);
    console.log("🔍 isOpen:", isOpen);
    console.log("🔍 isCompanyCardTransformed:", isCompanyCardTransformed);
  }, [activeCompany, activeCase, isOpen, isCompanyCardTransformed]);

  // Используем useMemo для запоминания вычисляемых значений
  const footerComponent = React.useMemo(() => (
    <Footer activeCompany={activeCompany} toggleCompany={toggleCompany} isMobile={true} />
  ), [activeCompany, toggleCompany]);

  return (
    <>
      {/* Футер вверху (шапка в мобильной версии) */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
        <div className="mx-auto" style={{ maxWidth: '1048px' }}>
          {footerComponent}
        </div>
      </div>

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
                setShowContactModal={setShowContactModal}
                isTransformed={isCompanyCardTransformed}
                isMobile={true}
                maxHeight={'calc(100dvh - 160px)'}
                onHeightChange={() => {
                  console.log("🔍 onHeightChange вызван в TransformingCompanyHeader");
                }}
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