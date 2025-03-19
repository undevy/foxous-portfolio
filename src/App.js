// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import PortfolioLayout from './components/layout/PortfolioLayout';
import Loader from './components/ui/Loader';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeMeta from './components/utils/ThemeMeta';

// Список всех изображений для предзагрузки
const imagesToPreload = [
  '/assets/images/GMX.webp',
  '/assets/images/Nexus.webp',
  '/assets/images/KeyApp.webp',
  '/assets/images/Wb.webp',
  '/assets/svgs/Fox.svg',
  '/assets/svgs/Fox-Dark.svg',
  '/assets/svgs/Gmx.svg',
  '/assets/svgs/Nexus.svg',
  '/assets/svgs/P2P.svg',
  '/assets/svgs/Wb.svg',
  '/assets/svgs/Sun.svg',
  '/assets/svgs/Moon.svg',
  '/assets/svgs/Github.svg',
  '/assets/svgs/Youtube.svg'
];

function App() {
  // Состояние загрузки приложения
  const [isLoading, setIsLoading] = useState(true);

  // Предзагружаем изображения при монтировании компонента
  useEffect(() => {
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };
  
    const preloadAll = async () => {
      try {
        await Promise.all(imagesToPreload.map(src => preloadImage(src)));
        
        // Минимальное время отображения лоадера
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (err) {
        console.error('Error preloading images:', err);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };
  
    preloadAll();
    
    // Резервный таймер
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  
    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <ThemeProvider>
      {/* Компонент для управления мета-тегами в соответствии с темой */}
      <ThemeMeta />
      <div className="App">
        {isLoading ? (
          <Loader />
        ) : (
          <PortfolioLayout />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;