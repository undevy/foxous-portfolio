// src/hooks/useTouchClick.js
import { useCallback } from 'react';

/**
 * Хук для универсальной обработки клика/касания на любых устройствах
 * @param {Function} onClick - функция, которая будет вызвана при клике/касании
 * @param {Object} options - дополнительные опции
 * @returns {Object} - объект с обработчиками событий
 */
const useTouchClick = (onClick, options = {}) => {
  const { preventDefault = true } = options;
  
  // Обработчик для touchstart+touchend на мобильных устройствах
  const handleTouch = useCallback((e) => {
    if (preventDefault) {
      e.preventDefault();
    }
    e.stopPropagation();
    onClick(e);
  }, [onClick, preventDefault]);
  
  // Возвращаем все обработчики для использования в компоненте
  return {
    onClick: onClick, // Стандартный клик для десктопов
    onTouchEnd: handleTouch, // Touch для мобильных
    role: "button",
    tabIndex: 0,
  };
};

export default useTouchClick;