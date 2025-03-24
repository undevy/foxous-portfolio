// src/components/ui/ImageViewer/ImageViewer.jsx
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDevice } from '../../../contexts/DeviceContext';
import useTouchClick from '../../../hooks/useTouchClick';
import { trackEvent, startTimingEvent, endTimingEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '../../../services/analytics';

/**
 * Компонент для просмотра изображений на весь экран
 * Оптимизирован для тач-устройств и добавлен трекинг взаимодействий
 * @param {Object} props - Свойства компонента
 * @param {string} props.src - Путь к изображению
 * @param {string} props.alt - Альтернативный текст для изображения
 * @param {Function} props.onClose - Функция закрытия просмотрщика
 * @returns {JSX.Element} Компонент просмотрщика изображений
 */
const ImageViewer = ({ src, alt, onClose }) => {
  // Определяем тип устройства
  const { isTouchDevice, isTablet, isIOS } = useDevice();
  
  // Блокируем прокрутку body при открытии просмотрщика и отслеживаем просмотр
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Начинаем отслеживать время просмотра
    const imageId = src.split('/').pop().split('.')[0];
    startTimingEvent(`image_view_${imageId}`);
    
    // Отслеживаем открытие просмотрщика
    trackEvent(
      EVENT_CATEGORIES.CONTENT_VIEW,
      EVENT_ACTIONS.CARD_VIEW, // Используем константу вместо строкового литерала
      `${imageId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    return () => {
      document.body.style.overflow = 'auto';
      
      // Фиксируем время просмотра при закрытии
      endTimingEvent(
        EVENT_CATEGORIES.ENGAGEMENT,
        'image_view_duration',
        imageId
      );
    };
  }, [src, isTouchDevice]);

  // Обработчик закрытия
  const handleClose = useCallback((e) => {
    e.preventDefault();
    
    // Отслеживаем закрытие просмотрщика
    const imageId = src.split('/').pop().split('.')[0];
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.BUTTON_CLICK, // Используем константу вместо строкового литерала
      `${imageId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
    
    onClose();
  }, [onClose, src, isTouchDevice]);

  // Хук для обработки кликов и касаний для кнопки закрытия
  const closeTouchProps = useTouchClick(handleClose);
  
  // Предотвращаем закрытие при клике на изображение
  const handleImageClick = useCallback((e) => {
    e.stopPropagation();
    
    // Отслеживаем клик по изображению в просмотрщике
    const imageId = src.split('/').pop().split('.')[0];
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      EVENT_ACTIONS.IMAGE_CLICK, // Используем константу вместо строкового литерала
      `${imageId}_${isTouchDevice ? 'touch' : 'mouse'}`
    );
  }, [src, isTouchDevice]);
  
  // Хук для обработки кликов и касаний для изображения
  const imageTouchProps = useTouchClick(handleImageClick);

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 ${
        isTouchDevice ? 'touch-overlay' : ''
      }`}
      onClick={onClose}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)'
      }}
    >
      <div 
        className="relative w-full max-w-[1000px] mx-auto"
        style={{ maxHeight: 'calc(100vh - 32px)' }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-contain rounded-xl ${
            isTablet || isIOS ? 'animation-optimized' : ''
          }`}
          {...imageTouchProps}
          style={{ 
            maxHeight: 'calc(100vh - 32px)',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}
        />
        <button
          {...closeTouchProps}
          className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200 ${
            isTouchDevice ? 'touch-button' : ''
          }`}
          aria-label="Закрыть"
          style={{
            ...(isTouchDevice && {
              height: '44px',
              width: '44px',
              top: '8px',
              right: '8px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            })
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isTouchDevice ? '24' : '16'}
            height={isTouchDevice ? '24' : '16'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

ImageViewer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default React.memo(ImageViewer);