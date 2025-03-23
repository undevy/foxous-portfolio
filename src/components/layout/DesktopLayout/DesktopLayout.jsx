// src/components/layout/DesktopLayout/DesktopLayout.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import CompanyCard from '../../features/company/CompanyCard';
import ProjectDetails from '../../features/project/ProjectDetails';

/**
 * Компонент desktop-макета приложения
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {boolean} props.isOpen - Открыто ли окно
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {Function} props.selectCase - Функция выбора проекта
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.closeProjectDetails - Функция закрытия деталей проекта
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {Object} props.foxIconRef - Ref для иконки лисы
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {boolean} props.isMenuOpen - Открыто ли меню
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент desktop-макета
 */
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
  isMenuOpen,
  isFirstLoad
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
                  isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
                />
              </div>
            </div>
          )}

          {isOpen && activeCompany && activeCase && (
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
                  isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
                />
              </div>
              <div className="flex-grow" style={{ maxHeight: contentHeight }}>
                <ProjectDetails
                  activeCase={activeCase}
                  handleCloseDetail={closeProjectDetails}
                  isMobile={false}
                  maxHeight={cardHeight}
                  isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
                />
              </div>
            </div>
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

DesktopLayout.propTypes = {
  activeCompany: PropTypes.string,
  activeCase: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  closeProjectDetails: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  foxIconRef: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  isFirstLoad: PropTypes.bool
};

DesktopLayout.defaultProps = {
  isFirstLoad: false
};

export default React.memo(DesktopLayout);