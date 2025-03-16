import React from 'react';

/**
 * Компонент анимированного градиентного фона
 * @returns {JSX.Element} Компонент анимированного фона
 */
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{
      // Более надежные настройки для iOS
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0, // Вместо z-[-1]
      // Важно правильно обработать безопасные зоны
      paddingTop: 'env(safe-area-inset-top, 0)',
      paddingRight: 'env(safe-area-inset-right, 0)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      paddingLeft: 'env(safe-area-inset-left, 0)'
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080"
      >
        {/* Остальной код SVG без изменений */}
        <defs>
          {/* Основной фильтр размытия */}
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="70" />
          </filter>
          
          {/* Более тонкое размытие для переходов */}
          <filter id="lightBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          
          {/* Фильтр турбулентности для создания случайных вариаций */}
          <filter id="turbulence" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
          
          {/* Градиент для первого слоя */}
          <radialGradient id="gradientBlue1" cx="30%" cy="30%" r="80%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#90CAF9">
              <animate 
                attributeName="stop-color" 
                values="#90CAF9;#64B5F6;#BBDEFB;#90CAF9" 
                dur="20s"
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor="#E3F2FD">
              <animate 
                attributeName="stop-color" 
                values="#E3F2FD;#BBDEFB;#90CAF9;#E3F2FD" 
                dur="15s"
                repeatCount="indefinite" 
              />
            </stop>
            <animate 
              attributeName="cx" 
              values="30%;40%;35%;30%" 
              dur="25s" 
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" 
            />
            <animate 
              attributeName="cy" 
              values="30%;35%;25%;30%" 
              dur="30s" 
              repeatCount="indefinite"
              calcMode="spline" 
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </radialGradient>
          
          {/* Остальные градиенты без изменений... */}
        </defs>
        
        {/* Фоновый прямоугольник с базовым цветом */}
        <rect width="100%" height="100%" fill="#E3F2FD" />
        
        {/* Остальные элементы SVG без изменений... */}
      </svg>
    </div>
  );
};

// Добавляем мемоизацию - компонент не имеет пропсов
export default React.memo(AnimatedBackground);