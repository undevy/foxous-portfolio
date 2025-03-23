// src/components/layout/MobileLayout/MobileLayout.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import ProjectDetails from '../../features/project/ProjectDetails';
import TransformingCompanyHeader from '../../features/company/TransformingCompanyHeader';
import ContactInfo from '../../ui/ContactInfo';

/**
 * Компонент мобильного макета приложения
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {boolean} props.isOpen - Открыто ли окно
 * @param {boolean} props.isCompanyCardTransformed - Трансформирована ли карточка компании
 * @param {Function} props.toggleCompany - Функция переключения компании
 * @param {Function} props.selectCase - Функция выбора проекта
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.closeProjectDetails - Функция закрытия деталей проекта
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {Object} props.foxIconRef - Ref для иконки лисы
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {boolean} props.isMenuOpen - Открыто ли меню
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
 * @returns {JSX.Element} Компонент мобильного макета
 */
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
  isMenuOpen,
  isFirstLoad
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
                maxHeight={'calc(100dvh - 120px)'} // Уменьшаем отступ
                onHeightChange={() => {}}
                isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
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
                  maxHeight="min(80dvh, calc(100dvh - 180px))" // Увеличиваем относительную высоту
                  hideCloseButton={true} // Скрываем кнопку закрытия
                  squareTopCorners={true} // Прямые верхние углы
                  isFirstLoad={isFirstLoad} // Передаем флаг первой загрузки
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

MobileLayout.propTypes = {
  activeCompany: PropTypes.string,
  activeCase: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isCompanyCardTransformed: PropTypes.bool.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  closeProjectDetails: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  foxIconRef: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  isFirstLoad: PropTypes.bool
};

MobileLayout.defaultProps = {
  isFirstLoad: false
};

export default React.memo(MobileLayout);