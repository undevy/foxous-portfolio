import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080"
      >
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
          
          {/* Градиент для второго слоя */}
          <radialGradient id="gradientBlue2" cx="70%" cy="60%" r="80%" fx="70%" fy="60%">
            <stop offset="0%" stopColor="#64B5F6">
              <animate 
                attributeName="stop-color" 
                values="#64B5F6;#BBDEFB;#90CAF9;#64B5F6" 
                dur="18s"
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor="#E3F2FD">
              <animate 
                attributeName="stop-color" 
                values="#E3F2FD;#90CAF9;#BBDEFB;#E3F2FD" 
                dur="23s"
                repeatCount="indefinite" 
              />
            </stop>
            <animate 
              attributeName="cx" 
              values="70%;65%;75%;70%" 
              dur="28s" 
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            <animate 
              attributeName="cy" 
              values="60%;55%;65%;60%" 
              dur="22s" 
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </radialGradient>
          
          {/* Градиент для третьего слоя */}
          <radialGradient id="gradientBlue3" cx="40%" cy="70%" r="70%" fx="40%" fy="70%">
            <stop offset="0%" stopColor="#BBDEFB">
              <animate 
                attributeName="stop-color" 
                values="#BBDEFB;#90CAF9;#64B5F6;#BBDEFB" 
                dur="25s"
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor="#E3F2FD">
              <animate 
                attributeName="stop-color" 
                values="#E3F2FD;#BBDEFB;#90CAF9;#E3F2FD" 
                dur="20s"
                repeatCount="indefinite" 
              />
            </stop>
            <animate 
              attributeName="cx" 
              values="40%;45%;38%;40%" 
              dur="24s" 
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            <animate 
              attributeName="cy" 
              values="70%;65%;72%;70%" 
              dur="26s" 
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </radialGradient>
        </defs>
        
        {/* Фоновый прямоугольник с базовым цветом */}
        <rect width="100%" height="100%" fill="#E3F2FD" />
        
        {/* Первый слой размытого эффекта */}
        <ellipse cx="30%" cy="30%" rx="80%" ry="80%" fill="url(#gradientBlue1)" opacity="0.5" filter="url(#softBlur)">
          <animate 
            attributeName="rx" 
            values="80%;85%;75%;80%" 
            dur="26s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate 
            attributeName="ry" 
            values="80%;75%;85%;80%" 
            dur="29s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </ellipse>
        
        {/* Второй слой размытого эффекта */}
        <ellipse cx="70%" cy="60%" rx="70%" ry="70%" fill="url(#gradientBlue2)" opacity="0.5" filter="url(#softBlur)">
          <animate 
            attributeName="rx" 
            values="70%;75%;65%;70%" 
            dur="24s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate 
            attributeName="ry" 
            values="70%;65%;75%;70%" 
            dur="27s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </ellipse>
        
        {/* Третий слой размытого эффекта */}
        <ellipse cx="40%" cy="70%" rx="60%" ry="60%" fill="url(#gradientBlue3)" opacity="0.5" filter="url(#softBlur)">
          <animate 
            attributeName="rx" 
            values="60%;65%;55%;60%" 
            dur="28s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate 
            attributeName="ry" 
            values="60%;55%;65%;60%" 
            dur="25s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </ellipse>
        
        {/* Дополнительный слой для усиления эффекта размытия */}
        <rect width="100%" height="100%" fill="transparent" filter="url(#lightBlur)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;