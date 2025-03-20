// src/contexts/ImageViewerContext.jsx
import React, { createContext, useState, useContext } from 'react';
import ImageViewer from '../components/ui/ImageViewer';

// Создаем контекст
const ImageViewerContext = createContext();

/**
 * Провайдер контекста для просмотрщика изображений
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 */
export const ImageViewerProvider = ({ children }) => {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    imageSrc: '',
    imageAlt: ''
  });

  // Функция для открытия просмотрщика
  const openViewer = (src, alt) => {
    setViewerState({
      isOpen: true,
      imageSrc: src,
      imageAlt: alt || 'Изображение'
    });
  };

  // Функция для закрытия просмотрщика
  const closeViewer = () => {
    setViewerState({
      ...viewerState,
      isOpen: false
    });
  };

  return (
    <ImageViewerContext.Provider value={{ openViewer, closeViewer }}>
      {children}
      {viewerState.isOpen && (
        <ImageViewer
          src={viewerState.imageSrc}
          alt={viewerState.imageAlt}
          onClose={closeViewer}
        />
      )}
    </ImageViewerContext.Provider>
  );
};

// Хук для использования контекста
export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('useImageViewer должен использоваться внутри ImageViewerProvider');
  }
  return context;
};