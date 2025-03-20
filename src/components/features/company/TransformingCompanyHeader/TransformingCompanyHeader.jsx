// src/components/features/company/TransformingCompanyHeader/TransformingCompanyHeader.jsx
import React from 'react';
import PropTypes from 'prop-types';
import MobileCompanyCard from '../MobileCompanyCard';
import MobileCompanyNav from '../MobileCompanyNav';

/**
 * Компонент, который трансформируется из карточки компании в навигационный элемент
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.closeSidebar - Функция закрытия сайдбара
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @param {boolean} props.isTransformed - Флаг трансформации
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @param {string|number} props.maxHeight - Максимальная высота компонента
 * @param {Function} props.onHeightChange - Функция обратного вызова при изменении высоты
 * @returns {JSX.Element} Компонент трансформирующегося заголовка компании
 */
const TransformingCompanyHeader = ({
  company,
  activeCase,
  selectCase,
  closeSidebar,
  backToCompanyCard,
  setShowContactModal,
  isTransformed,
  maxHeight
}) => {
  // Трансформированный режим (компактная панель с табами)
  if (isTransformed) {
    return (
      <MobileCompanyNav
        company={company}
        activeCase={activeCase}
        selectCase={selectCase}
        backToCompanyCard={backToCompanyCard}
        setShowContactModal={setShowContactModal}
      />
    );
  }

  // Полная карточка компании
  return (
    <MobileCompanyCard
      company={company}
      selectCase={selectCase}
      closeSidebar={closeSidebar}
      setShowContactModal={setShowContactModal}
      maxHeight={maxHeight}
    />
  );
};

TransformingCompanyHeader.propTypes = {
  company: PropTypes.string.isRequired,
  activeCase: PropTypes.string,
  selectCase: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  isTransformed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onHeightChange: PropTypes.func
};

export default React.memo(TransformingCompanyHeader);