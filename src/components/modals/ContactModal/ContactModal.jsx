// src/components/modals/ContactModal/ContactModal.jsx
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContactDisplay from '../../ui/ContactDisplay';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент модального окна контактов для десктопной версии
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.showContactModal - Показывать ли модальное окно
 * @param {Function} props.setShowContactModal - Функция управления видимостью окна
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент модального окна контактов
 */
const ContactModal = ({ showContactModal, setShowContactModal, activeCompany }) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Отслеживаем время показа модального окна
  useEffect(() => {
    if (showContactModal) {
      // Начало отслеживания времени
      startTimingEvent(`contact_modal_view_${activeCompany || 'general'}`);
      
      // Отслеживаем открытие модального окна
      trackEvent(
        EVENT_CATEGORIES.UI_INTERACTION,
        EVENT_ACTIONS.CONTACT_OPEN,
        `contact_modal_${activeCompany || 'general'}_${isTouchDevice ? 'touch' : 'mouse'}`
      );
      
      // Предотвращаем прокрутку фона при открытом модальном окне
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Восстанавливаем прокрутку
        document.body.style.overflow = 'auto';
        
        // Завершаем отслеживание времени при закрытии
        endTimingEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          'contact_modal_duration',
          `${activeCompany || 'general'}`
        );
      };
    }
  }, [showContactModal, activeCompany, isTouchDevice]);
  
  // Обработчик закрытия модального окна
  const handleClose = useCallback(() => {
    // Отслеживаем закрытие модального окна с учетом типа устройства
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'contact_modal_close',
      `background_click_${activeCompany || 'general'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setShowContactModal(false);
  }, [setShowContactModal, activeCompany, isTouchDevice]);
  
  // Хук для обработки клика/касания на фон модального окна
  const backdropTouchProps = useTouchClick(handleClose, {
    stopPropagation: true
  });
  
  // Предотвращаем всплытие событий при клике на контент
  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);
  
  // Хук для обработки клика/касания на контент
  const contentTouchProps = useTouchClick(handleContentClick);
  
  // Если модальное окно не показывается, не рендерим его
  if (!showContactModal) return null;
  
  // Применяем оптимизированные стили для разных устройств
  const modalBackdropStyle = {
    paddingTop: 'env(safe-area-inset-top, 0)',
    paddingBottom: 'env(safe-area-inset-bottom, 0)'
  };
  
  const modalContentStyle = {
    ...(isTouchDevice && {
      WebkitOverflowScrolling: 'touch',
      maxHeight: isIOS ? 'calc(100% - 40px)' : '85vh',
      touchAction: 'pan-y'
    })
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 ${
        isTouchDevice ? 'touch-backdrop' : ''
      }`}
      {...backdropTouchProps}
      style={modalBackdropStyle}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg max-w-lg w-full mx-auto overflow-y-auto ${
          isTablet || isIOS ? 'hardware-accelerated' : ''
        } ${
          isTouchDevice ? 'touch-content' : ''
        }`}
        {...contentTouchProps}
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <ContactDisplay 
          activeCompany={activeCompany} 
          onClose={() => {
            // Отслеживаем закрытие модального окна через кнопку закрытия
            trackEvent(
              EVENT_CATEGORIES.UI_INTERACTION,
              'contact_modal_close',
              `close_button_${activeCompany || 'general'}_${isTouchDevice ? 'touch' : 'mouse'}`
            );
            
            setShowContactModal(false);
          }} 
        />
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  showContactModal: PropTypes.bool.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(ContactModal, (prevProps, nextProps) => {
  // Оптимизированное сравнение для предотвращения лишних ререндеров
  return (
    prevProps.showContactModal === nextProps.showContactModal &&
    prevProps.activeCompany === nextProps.activeCompany
  );
});