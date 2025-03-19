import React, { useState, useEffect, useMemo } from 'react';
import { useTheme, COMPANY_COLOR_SCHEMES } from '../../../contexts/ThemeContext';

/**
 * Компонент анимированного градиентного фона с плавными переходами
 * @returns {JSX.Element} Компонент анимированного фона
 */
const AnimatedBackground = () => {
  // Получаем данные напрямую из контекста
  const { isDarkMode, activeCompany } = useTheme();
  
  // Состояние для отслеживания предыдущих цветов (для анимации)
  const [prevColors, setPrevColors] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Определяем активную цветовую схему
  const colorScheme = useMemo(() => {
    // Получаем схему для активной компании или используем дефолтную
    const scheme = COMPANY_COLOR_SCHEMES[activeCompany] || COMPANY_COLOR_SCHEMES.default;
    
    // Возвращаем схему в зависимости от текущей темы
    return isDarkMode ? scheme.dark : scheme.light;
  }, [isDarkMode, activeCompany]);
  
  // Извлекаем нужные цвета из схемы
  const gradientColors = useMemo(() => {
    return {
      primary: colorScheme.gradientPrimary || colorScheme.primary,
      secondary: colorScheme.gradientSecondary || colorScheme.primaryLight,
      tertiary: colorScheme.gradientTertiary || colorScheme.primaryDark,
      background: colorScheme.background
    };
  }, [colorScheme]);
  
  // Эффект для запуска анимации перехода при изменении цветов
  useEffect(() => {
    // Если это первый рендер, просто устанавливаем текущие цвета
    if (!prevColors) {
      setPrevColors(gradientColors);
      return;
    }
    
    // Если цвета изменились, запускаем анимацию
    if (
      prevColors.primary !== gradientColors.primary ||
      prevColors.secondary !== gradientColors.secondary ||
      prevColors.tertiary !== gradientColors.tertiary ||
      prevColors.background !== gradientColors.background
    ) {
      setIsTransitioning(true);
      
      // Через время анимации обновляем предыдущие цвета
      const timer = setTimeout(() => {
        setPrevColors(gradientColors);
        setIsTransitioning(false);
      }, 500); // Длительность анимации
      
      return () => clearTimeout(timer);
    }
  }, [gradientColors, prevColors]);
  
  // Свойства для анимации
  const transitionClasses = "transition-all duration-500 ease-in-out";

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: gradientColors.background,
        transition: 'background-color 0.5s ease-in-out',
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)'
      }}
    >
      {/* Слой с основными градиентами */}
      <div className="absolute inset-0 w-full h-full">
        {/* Первый градиентный круг */}
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '140%',
            height: '140%',
            top: '-20%',
            left: '-20%',
            background: `radial-gradient(circle at 30% 30%, ${gradientColors.primary}33 0%, ${gradientColors.background}00 70%)`,
            filter: 'blur(60px)',
            opacity: 0.8,
            animation: 'pulse 15s infinite alternate',
            transform: 'scale(0.95)',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        
        {/* Второй градиентный круг */}
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '120%',
            height: '120%',
            bottom: '-10%',
            right: '-10%',
            background: `radial-gradient(circle at 70% 70%, ${gradientColors.secondary}33 0%, ${gradientColors.background}00 70%)`,
            filter: 'blur(50px)',
            opacity: 0.7,
            animation: 'pulse 20s infinite alternate-reverse',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        
        {/* Третий градиентный круг */}
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '100%',
            height: '100%',
            top: '20%',
            left: '30%',
            background: `radial-gradient(circle at 40% 60%, ${gradientColors.tertiary}33 0%, ${gradientColors.background}00 60%)`,
            filter: 'blur(40px)',
            opacity: 0.6,
            animation: 'pulse 18s infinite alternate',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        
        {/* Четвертый градиентный круг */}
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '60%',
            height: '60%',
            bottom: '10%',
            left: '10%',
            background: `radial-gradient(circle at 50% 50%, ${gradientColors.primary}22 0%, ${gradientColors.background}00 70%)`,
            filter: 'blur(30px)',
            opacity: 0.5,
            animation: 'pulse 25s infinite alternate-reverse',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
      </div>
      
      {/* Слой с предыдущими градиентами для анимации */}
      {isTransitioning && prevColors && (
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
          style={{
            opacity: 0, // Плавно исчезает
            zIndex: 1
          }}
        >
          {/* Предыдущие градиенты (те же самые, но с предыдущими цветами) */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '140%',
              height: '140%',
              top: '-20%',
              left: '-20%',
              background: `radial-gradient(circle at 30% 30%, ${prevColors.primary}33 0%, ${prevColors.background}00 70%)`,
              filter: 'blur(60px)',
              opacity: 0.8,
              mixBlendMode: isDarkMode ? 'screen' : 'multiply'
            }}
          />
          
          <div 
            className="absolute rounded-full"
            style={{
              width: '120%',
              height: '120%',
              bottom: '-10%',
              right: '-10%',
              background: `radial-gradient(circle at 70% 70%, ${prevColors.secondary}33 0%, ${prevColors.background}00 70%)`,
              filter: 'blur(50px)',
              opacity: 0.7,
              mixBlendMode: isDarkMode ? 'screen' : 'multiply'
            }}
          />
          
          <div 
            className="absolute rounded-full"
            style={{
              width: '100%',
              height: '100%',
              top: '20%',
              left: '30%',
              background: `radial-gradient(circle at 40% 60%, ${prevColors.tertiary}33 0%, ${prevColors.background}00 60%)`,
              filter: 'blur(40px)',
              opacity: 0.6,
              mixBlendMode: isDarkMode ? 'screen' : 'multiply'
            }}
          />
          
          <div 
            className="absolute rounded-full"
            style={{
              width: '60%',
              height: '60%',
              bottom: '10%',
              left: '10%',
              background: `radial-gradient(circle at 50% 50%, ${prevColors.primary}22 0%, ${prevColors.background}00 70%)`,
              filter: 'blur(30px)',
              opacity: 0.5,
              mixBlendMode: isDarkMode ? 'screen' : 'multiply'
            }}
          />
        </div>
      )}
      
      {/* Глобальные анимации */}
      <style jsx="true">{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }
        
        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(2%, 1%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(AnimatedBackground);