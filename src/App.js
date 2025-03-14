import React, { useEffect, useState } from 'react';
import './App.css';
import PortfolioLayout from './components/layout/PortfolioLayout';
import Loader from './components/common/Loader';

// Список всех изображений для предзагрузки
const imagesToPreload = [
  '/assets/images/GMX.webp',
  '/assets/images/Nexus.webp',
  '/assets/images/KeyApp.webp',
  '/assets/images/Wb.webp',
  '/assets/svgs/Fox.svg',
  '/assets/svgs/Gmx.svg',
  '/assets/svgs/Nexus.svg',
  '/assets/svgs/P2P.svg',
  '/assets/svgs/Wb.svg'
];

function App() {
  // Состояние загрузки приложения
  const [isLoading, setIsLoading] = useState(true);

  // Предзагружаем изображения при монтировании компонента
  useEffect(() => {
    // Функция для предзагрузки изображения
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    // Предзагружаем все изображения параллельно
    const preloadAll = async () => {
      try {
        await Promise.all(imagesToPreload.map(src => preloadImage(src)));
        console.log('All images preloaded successfully');
        
        // Устанавливаем минимальное время отображения лоадера (2 секунды)
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (err) {
        console.error('Error preloading images:', err);
        // Даже при ошибке скрываем лоадер через 2 секунды
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    preloadAll();
    
    // Резервное скрытие лоадера через 5 секунд (если что-то пойдет не так)
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loader />
      ) : (
        <PortfolioLayout />
      )}
    </div>
  );
}

export default App;