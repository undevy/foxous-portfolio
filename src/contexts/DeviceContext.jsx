// src/contexts/DeviceContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * Контекст для определения типа устройства и его возможностей
 * Позволяет централизованно определять и использовать информацию о платформе
 */
export const DeviceContext = createContext();

/**
 * Провайдер контекста для информации об устройстве
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 */
export const DeviceProvider = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
    isSafari: false,
    isIOS: false,
    viewport: { width: 0, height: 0 }
  });

  useEffect(() => {
    // Получаем информацию о User Agent
    const ua = navigator.userAgent;
    
    // Определение iOS устройств 
    // Обратите внимание: мы избегаем использования устаревшего navigator.platform
    const isIOS = /iPad|iPhone|iPod/.test(ua) || 
                 (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    
    // Определение браузера Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    
    // Определение планшетов
    const isTablet = /iPad/.test(ua) || 
                     (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) ||
                     (/Android/.test(ua) && !/Mobile/.test(ua));
    
    // Определение мобильных устройств или малых экранов
    const isMobile = /iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua) || 
                     window.innerWidth < 768;
    
    // Определение тач-устройств через наличие тач-событий и количество точек касания
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          navigator.msMaxTouchPoints > 0;

    // Обновляем состояние с информацией об устройстве
    setDeviceInfo({
      isMobile,
      isTablet,
      isTouchDevice,
      isSafari,
      isIOS,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });

    // Добавляем CSS-классы на body для возможности использования селекторов в CSS
    if (isTouchDevice) document.body.classList.add('touch-device');
    if (isIOS) document.body.classList.add('ios-device');
    if (isTablet) document.body.classList.add('tablet-device');
    if (isMobile) document.body.classList.add('mobile-device');

    // Функция для обновления размеров viewport при изменении размера окна
    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        // Обновляем isMobile при изменении размера окна
        isMobile: prev.isMobile || window.innerWidth < 768
      }));
    };

    // Подписываемся на изменение размера окна
    window.addEventListener('resize', handleResize);
    
    // Проверяем смену ориентации на мобильных устройствах
    window.addEventListener('orientationchange', handleResize);
    
    // Отписываемся от всех событий при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      // Удаляем классы при размонтировании
      document.body.classList.remove(
        'touch-device', 
        'ios-device', 
        'tablet-device', 
        'mobile-device'
      );
    };
  }, []);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

/**
 * Хук для использования информации об устройстве
 * @returns {Object} Объект с информацией об устройстве и его возможностях
 */
export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice должен использоваться внутри DeviceProvider');
  }
  return context;
};