import { useState, useEffect } from 'react';

/**
 * Хук для отслеживания размеров окна
 * @returns {Object} Объект с шириной и высотой окна
 */
const useWindowSize = () => {
  // Инициализация состояния с undefined для предотвращения SSR несоответствий
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Обработчик изменения размера окна
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Добавляем обработчик события
    window.addEventListener('resize', handleResize);
    
    // Вызываем обработчик сразу, чтобы установить начальное значение
    handleResize();
    
    // Убираем обработчик события при размонтировании
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Пустой массив зависимостей, чтобы эффект выполнялся только один раз

  return windowSize;
};

export default useWindowSize;