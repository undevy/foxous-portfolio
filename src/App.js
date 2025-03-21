// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import PortfolioLayout from './components/layout/PortfolioLayout';
import Loader from './components/ui/Loader';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeMeta from './components/utils/ThemeMeta';
import { ImageViewerProvider } from './contexts/ImageViewerContext';
import { initAnalytics, trackUserMetadata, trackWebVitals } from './services/analytics';

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
  '/assets/svgs/Youtube.svg',
  '/assets/images/tradepage.webp',
  '/assets/images/gasless.webp',
  '/assets/images/pools.webp',
  '/assets/images/multichain.webp',
  '/assets/images/stablecoin.webp',
  '/assets/images/android.webp',
  '/assets/images/research.webp',
  '/assets/images/design.webp',
  '/assets/images/nftmarketplace.webp',
  '/assets/images/walletonboarding.webp',
  '/assets/images/developertools.webp',
  '/assets/images/gameintegration.webp',
  '/assets/images/designsystem.webp',
  '/assets/images/supplierportal.webp',
  '/assets/images/paymentapp.webp',
  '/assets/images/documentapp.webp'
];

function App() {
  // Состояние загрузки приложения
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация аналитики при загрузке приложения
  useEffect(() => {
    // Инициализируем системы аналитики
    initAnalytics();
    
    // Отслеживаем метрики веб-страницы
    trackWebVitals();
    
    // Отслеживаем метаданные пользователя (устройство, браузер, тему и т.д.)
    trackUserMetadata();
    
    // Настройка отладочной панели для разработки
    if (process.env.NODE_ENV === 'development') {
      import('./services/analytics/debug').then(({ setupDebugMode }) => {
        return setupDebugMode();
      }).catch(err => console.error('Failed to load debug mode:', err));
    }
    
    // Устанавливаем слушатель для отправки всех данных перед уходом пользователя
    const handleBeforeUnload = () => {
      if (window.analytics && window.analytics.sendUserPathOnExit) {
        window.analytics.sendUserPathOnExit();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
      <ImageViewerProvider>
        {/* Компонент для управления мета-тегами в соответствии с темой */}
        <ThemeMeta />
        <div className="App">
          {isLoading ? (
            <Loader />
          ) : (
            <PortfolioLayout />
          )}
        </div>
      </ImageViewerProvider>
    </ThemeProvider>
  );
}

export default App;