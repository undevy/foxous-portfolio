import React, { useEffect } from 'react';
import './App.css';
import PortfolioLayout from './components/layout/PortfolioLayout';

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
      } catch (err) {
        console.error('Error preloading images:', err);
      }
    };

    preloadAll();
  }, []);

  return (
    <div className="App">
      <PortfolioLayout />
    </div>
  );
}

export default App;