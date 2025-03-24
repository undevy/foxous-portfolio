// src/components/features/company/TransformingCompanyHeader/TransformingCompanyHeader.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MobileCompanyCard from '../MobileCompanyCard';
import MobileCompanyNav from '../MobileCompanyNav';
import { useDevice } from '../../../../contexts/DeviceContext';
import { trackEvent, EVENT_CATEGORIES } from '../../../../services/analytics';

/**
 * Компонент, который трансформируется из карточки компании в навигационный элемент
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
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
 * @param {boolean} props.isFirstLoad - Флаг первой загрузки
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
  isMobile,
  maxHeight,
  onHeightChange,
  isFirstLoad
}) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Логирование в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    console.log('TransformingCompanyHeader rendered with device info:', { 
      isTouchDevice, isTablet, isIOS, 
      component: 'TransformingCompanyHeader',
      state: isTransformed ? 'transformed' : 'normal',
      activeCase
    });
  }
  
  // Отслеживаем трансформацию компонента
  useEffect(() => {
    if (isTransformed) {
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        'company_header_transform',
        `to_nav_${company}_${activeCase}_${isTouchDevice ? 'touch' : 'mouse'}`
      );
    } else {
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        'company_header_transform',
        `to_card_${company}_${isTouchDevice ? 'touch' : 'mouse'}`
      );
    }
  }, [isTransformed, company, activeCase, isTouchDevice]);

  // Трансформированный режим (компактная панель с табами)
  if (isTransformed) {
    return (
      <MobileCompanyNav
        company={company}
        activeCase={activeCase}
        selectCase={selectCase}
        backToCompanyCard={backToCompanyCard}
        setShowContactModal={setShowContactModal}
        isFirstLoad={isFirstLoad}
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
      isFirstLoad={isFirstLoad}
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
  onHeightChange: PropTypes.func,
  isFirstLoad: PropTypes.bool
};

TransformingCompanyHeader.defaultProps = {
  onHeightChange: () => {},
  isFirstLoad: false
};

export default React.memo(TransformingCompanyHeader);