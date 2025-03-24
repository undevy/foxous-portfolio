// src/components/ui/ContactInfo/ContactInfo.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ContactDisplay from '../ContactDisplay';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Встроенный компонент контактной информации (для мобильной версии)
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {boolean} props.showContacts - Флаг видимости компонента
 * @param {Function} props.setShowContacts - Функция управления видимостью
 * @returns {JSX.Element} Компонент контактной информации
 */
const ContactInfo = ({ activeCompany, showContacts, setShowContacts }) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // ИСПРАВЛЕНИЕ: Перемещаем все определения обработчиков и вызовы хуков 
  // на верхний уровень, чтобы они вызывались независимо от условий рендеринга
  
  // Обработчик закрытия модального окна
  const handleClose = useCallback(() => {
    // Отслеживаем закрытие модального окна
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.MENU_CLOSE, // Используем константу вместо строкового литерала
      `${activeCompany || 'general'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setShowContacts(false);
  }, [activeCompany, isTouchDevice, setShowContacts]);
  
  // Хук для обработки кликов и касаний по затемненному фону
  const backgroundTouchProps = useTouchClick(handleClose, {
    preventDefault: true
  });
  
  // Обработчик для предотвращения закрытия при клике на контент
  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
    
    // Возможно, хотим отследить клики по модальному окну
    if (process.env.NODE_ENV === 'development') {
      console.log('ContactInfo content click, device info:', { 
        isTouchDevice, 
        isTablet, 
        isIOS 
      });
    }
  }, [isTouchDevice, isTablet, isIOS]);
  
  // Хук для предотвращения закрытия при клике на контент
  const contentTouchProps = useTouchClick(handleContentClick);
  
  // Обработчик для кнопки закрытия в ContactDisplay
  const handleDisplayClose = useCallback(() => {
    // Отслеживаем закрытие через кнопку в ContactDisplay
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.BUTTON_CLICK, // Используем константу вместо строкового литерала
      `${activeCompany || 'general'}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    setShowContacts(false);
  }, [activeCompany, isTouchDevice, setShowContacts]);

  // Если контакты не отображаются, не рендерим компонент
  if (!showContacts) return null;
  
  // Определяем дополнительные классы для тач-устройств
  const touchClass = isTouchDevice ? 'touch-enhanced' : '';
  const tabletClass = isTablet ? 'tablet-optimized' : '';
  const iosClass = isIOS ? 'ios-specific' : '';

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 ${touchClass} ${tabletClass} ${iosClass}`}
      {...backgroundTouchProps}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg w-full max-w-lg mx-4 ${
          isTablet || isIOS ? 'animation-optimized' : ''
        }`}
        {...contentTouchProps}
        style={{
          ...(isTouchDevice && {
            touchAction: 'manipulation'
          }),
          maxHeight: isIOS ? '-webkit-fill-available' : '90vh',
          overflow: 'auto',
          WebkitOverflowScrolling: isIOS ? 'touch' : 'auto'
        }}
      >
        <ContactDisplay 
          activeCompany={activeCompany} 
          onClose={handleDisplayClose} 
        />
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  activeCompany: PropTypes.string,
  showContacts: PropTypes.bool.isRequired,
  setShowContacts: PropTypes.func.isRequired
};

export default React.memo(ContactInfo);