// src/components/ui/ImageViewer/ImageViewer.jsx
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Компонент для просмотра изображений на весь экран
 * @param {Object} props - Свойства компонента
 * @param {string} props.src - Путь к изображению
 * @param {string} props.alt - Альтернативный текст для изображения
 * @param {Function} props.onClose - Функция закрытия просмотрщика
 * @returns {JSX.Element} Компонент просмотрщика изображений
 */
const ImageViewer = ({ src, alt, onClose }) => {
  // Блокируем прокрутку body при открытии просмотрщика
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Предотвращаем закрытие при клике на изображение
  const handleImageClick = (e) => {
    e.stopPropagation();
  };

  const handleClose = useCallback((e) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
      onTouchEnd={handleClose} // Добавляем обработку касания
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
          className="w-full h-auto object-contain rounded-xl"
          onClick={handleImageClick}
          style={{ maxHeight: 'calc(100vh - 32px)' }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
          aria-label="Закрыть"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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

export default ImageViewer;