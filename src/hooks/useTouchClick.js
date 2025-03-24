// src/hooks/useTouchClick.js
import { useCallback, useEffect, useState } from 'react';
import { useDevice } from '../contexts/DeviceContext';

/**
 * Хук для универсальной обработки клика/касания на любых устройствах
 * Автоматически определяет тип устройства и предоставляет оптимальные обработчики событий
 * 
 * @param {Function} onClick - функция, которая будет вызвана при клике/касании
 * @param {Object} options - дополнительные опции
 * @returns {Object} - объект с обработчиками событий для использования компонентом
 */
const useTouchClick = (onClick, options = {}) => {
  const { preventDefault = true, stopPropagation = true } = options;
  
  // Используем данные из DeviceContext для определения типа устройства
  // Если DeviceContext недоступен, делаем проверку внутри хука
  const deviceContext = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useDevice();
    } catch (e) {
      // Устройства не определено через контекст
      return null;
    }
  })();
  
  // Если контекст доступен, используем его, иначе определяем локально
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (deviceContext) {
      return deviceContext.isTouchDevice;
    }
    return false; // По умолчанию не определено
  });
  
  // Определяем тип устройства при монтировании, если контекст недоступен
  useEffect(() => {
    if (deviceContext) return; // Используем данные из контекста
    
    // Более надежное определение тач-устройств, включая iPad
    const isTouch = 'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0 || 
                    navigator.msMaxTouchPoints > 0 ||
                    // Специально для iPad на новых версиях iOS
                    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    
    setIsTouchDevice(isTouch);
  }, [deviceContext]);
  
  // Обработчик для touchstart (важен для iOS Safari)
  const handleTouchStart = useCallback((e) => {
    if (isTouchDevice && preventDefault) {
      e.preventDefault();
    }
  }, [isTouchDevice, preventDefault]);
  
  // Обработчик для touchend - основное событие касания
  const handleTouchEnd = useCallback((e) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    if (stopPropagation) {
      // Предотвращаем всплытие события, чтобы избежать двойного срабатывания
      e.stopPropagation();
    }
    
    // Добавляем проверку на срабатывание в пределах элемента (только для touch события)
    const el = e.currentTarget;
    const touch = e.changedTouches[0];
    if (touch) {
      const rect = el.getBoundingClientRect();
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Проверяем, что касание завершилось внутри элемента
      if (
        x >= rect.left && 
        x <= rect.right && 
        y >= rect.top && 
        y <= rect.bottom
      ) {
        onClick(e);
      }
    } else {
      // Если это не touch-событие, просто вызываем onClick
      onClick(e);
    }
  }, [onClick, preventDefault, stopPropagation]);
  
  // Обработчик стандартного клика - для не-тач устройств
  const handleClick = useCallback((e) => {
    if (isTouchDevice) {
      // На тач-устройствах обрабатываем через touch-события
      return;
    }
    
    if (stopPropagation) {
      e.stopPropagation();
    }
    
    onClick(e);
  }, [onClick, isTouchDevice, stopPropagation]);
  
  // Возвращаем разные наборы обработчиков в зависимости от типа устройства
  return {
    // Общие свойства
    role: "button",
    tabIndex: 0,
    // Обработчики событий
    onClick: handleClick,
    onTouchStart: isTouchDevice ? handleTouchStart : undefined,
    onTouchEnd: isTouchDevice ? handleTouchEnd : undefined,
    // Базовые стили для улучшения UX на тач-устройствах
    style: isTouchDevice ? { 
      WebkitTapHighlightColor: 'transparent', 
      touchAction: 'manipulation', // Оптимизирует обработку тач-событий
    } : undefined,
    // Передаем флаг типа устройства для условного рендеринга
    'data-is-touch': isTouchDevice || undefined
  };
};

export default useTouchClick;