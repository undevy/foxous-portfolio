import React, { useState, useEffect, useMemo } from 'react';
import { useTheme, COMPANY_COLOR_SCHEMES } from '../../../contexts/ThemeContext';

// Функция для преобразования hex в формат "R, G, B"
const hexToRgb = (hex) => {
  let cleanedHex = hex.replace('#', '');
  if (cleanedHex.length === 3) {
    cleanedHex = cleanedHex.split('').map(char => char + char).join('');
  }
  const bigint = parseInt(cleanedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

/**
 * Компонент анимированного градиентного фона с плавными переходами
 * @returns {JSX.Element} Компонент анимированного фона
 */
const AnimatedBackground = () => {
  const { isDarkMode, activeCompany } = useTheme();
  const [prevColors, setPrevColors] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const colorScheme = useMemo(() => {
    const scheme = COMPANY_COLOR_SCHEMES[activeCompany] || COMPANY_COLOR_SCHEMES.default;
    return isDarkMode ? scheme.dark : scheme.light;
  }, [isDarkMode, activeCompany]);

  const gradientColors = useMemo(() => {
    return {
      primary: colorScheme.gradientPrimary || colorScheme.primary,
      secondary: colorScheme.gradientSecondary || colorScheme.primaryLight,
      tertiary: colorScheme.gradientTertiary || colorScheme.primaryDark,
      background: colorScheme.background
    };
  }, [colorScheme]);

  useEffect(() => {
    if (!prevColors) {
      setPrevColors(gradientColors);
      return;
    }

    if (
      prevColors.primary !== gradientColors.primary ||
      prevColors.secondary !== gradientColors.secondary ||
      prevColors.tertiary !== gradientColors.tertiary ||
      prevColors.background !== gradientColors.background
    ) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevColors(gradientColors);
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gradientColors, prevColors]);

  const transitionClasses = "transition-all duration-500 ease-in-out";

  // Функция для создания градиентной строки с использованием rgba
  const createGradient = (color, bg, alpha, stop) => {
    return `radial-gradient(circle at 50% 50%, rgba(${hexToRgb(color)}, ${alpha}) 0%, rgba(${hexToRgb(bg)}, 0) ${stop}%)`;
  };

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
      <div className="absolute inset-0 w-full h-full">
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '140%',
            height: '140%',
            top: '-20%',
            left: '-20%',
            background: createGradient(gradientColors.primary, gradientColors.background, 0.2, 70),
            filter: 'blur(60px)',
            opacity: 0.8,
            animation: 'pulse 15s infinite alternate',
            transform: 'scale(0.95)',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '120%',
            height: '120%',
            bottom: '-10%',
            right: '-10%',
            background: createGradient(gradientColors.secondary, gradientColors.background, 0.2, 70),
            filter: 'blur(50px)',
            opacity: 0.7,
            animation: 'pulse 20s infinite alternate-reverse',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '100%',
            height: '100%',
            top: '20%',
            left: '30%',
            background: createGradient(gradientColors.tertiary, gradientColors.background, 0.2, 60),
            filter: 'blur(40px)',
            opacity: 0.6,
            animation: 'pulse 18s infinite alternate',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
        <div 
          className={`absolute rounded-full ${transitionClasses}`}
          style={{
            width: '60%',
            height: '60%',
            bottom: '10%',
            left: '10%',
            background: createGradient(gradientColors.primary, gradientColors.background, 0.13, 70),
            filter: 'blur(30px)',
            opacity: 0.5,
            animation: 'pulse 25s infinite alternate-reverse',
            mixBlendMode: isDarkMode ? 'screen' : 'multiply'
          }}
        />
      </div>
      
      {isTransitioning && prevColors && (
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
          style={{
            opacity: 0,
            zIndex: 1
          }}
        >
          <div 
            className="absolute rounded-full"
            style={{
              width: '140%',
              height: '140%',
              top: '-20%',
              left: '-20%',
              background: createGradient(prevColors.primary, prevColors.background, 0.2, 70),
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
              background: createGradient(prevColors.secondary, prevColors.background, 0.2, 70),
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
              background: createGradient(prevColors.tertiary, prevColors.background, 0.2, 60),
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
              background: createGradient(prevColors.primary, prevColors.background, 0.13, 70),
              filter: 'blur(30px)',
              opacity: 0.5,
              mixBlendMode: isDarkMode ? 'screen' : 'multiply'
            }}
          />
        </div>
      )}
      
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