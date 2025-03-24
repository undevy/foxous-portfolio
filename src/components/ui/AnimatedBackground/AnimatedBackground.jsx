import React, { useState, useEffect, useMemo } from 'react';
import { useTheme, COMPANY_COLOR_SCHEMES } from '../../../contexts/ThemeContext';

/**
 * Компонент анимированного градиентного фона с плавными переходами
 * Оптимизирован для работы на различных устройствах, включая iPad и планшеты
 * @returns {JSX.Element} Компонент анимированного фона
 */
const AnimatedBackground = () => {
  const { isDarkMode, activeCompany } = useTheme();
  const [prevColors, setPrevColors] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Определяем тип устройства для оптимизаций
  const [deviceInfo, setDeviceInfo] = useState({
    isTablet: false,
    isIOS: false,
    isTouchDevice: false
  });
  
  // Инициализация определения устройства при монтировании
  useEffect(() => {
    const ua = navigator.userAgent;
    // Определение iOS устройств без использования устаревшего navigator.platform
    const isIOS = /iPad|iPhone|iPod/.test(ua) || 
                 (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    
    // Определение планшетов (iPad, Android tablets)
    const isTablet = /iPad/.test(ua) || 
                    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) ||
                    (/Android/.test(ua) && !/Mobile/.test(ua));
    
    // Определение устройств с тачскрином
    const isTouchDevice = 'ontouchstart' in window || 
                         navigator.maxTouchPoints > 0 || 
                         navigator.msMaxTouchPoints > 0;
    
    setDeviceInfo({ isTablet, isIOS, isTouchDevice });
    
    // Добавляем классы на body для потенциального использования в CSS
    if (isTablet) document.body.classList.add('tablet-device');
    if (isIOS) document.body.classList.add('ios-device');
    if (isTouchDevice) document.body.classList.add('touch-device');
    
    // Очистка при размонтировании
    return () => {
      document.body.classList.remove('tablet-device', 'ios-device', 'touch-device');
    };
  }, []);

  // Определяем, нужно ли использовать упрощенную версию
  const useSimplifiedVersion = deviceInfo.isTablet || deviceInfo.isIOS;

  // Получаем цветовую схему для текущей компании и темы
  const colorScheme = useMemo(() => {
    const scheme = COMPANY_COLOR_SCHEMES[activeCompany] || COMPANY_COLOR_SCHEMES.default;
    return isDarkMode ? scheme.dark : scheme.light;
  }, [isDarkMode, activeCompany]);

  // Извлекаем и подготавливаем цвета для градиентов
  const gradientColors = useMemo(() => {
    return {
      primary: colorScheme.gradientPrimary || colorScheme.primary,
      secondary: colorScheme.gradientSecondary || colorScheme.primaryLight,
      tertiary: colorScheme.gradientTertiary || colorScheme.primaryDark,
      background: colorScheme.background
    };
  }, [colorScheme]);

  // Управление переходами при изменении цветов
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

  // Оптимизированная функция преобразования hex в RGB с кэшированием
  const hexToRgb = useMemo(() => {
    const cache = {};
    
    return (hex) => {
      if (cache[hex]) return cache[hex];
      
      let cleanedHex = hex.replace('#', '');
      if (cleanedHex.length === 3) {
        cleanedHex = cleanedHex.split('').map(char => char + char).join('');
      }
      const bigint = parseInt(cleanedHex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      const result = `${r}, ${g}, ${b}`;
      cache[hex] = result;
      return result;
    };
  }, []);

  // Классы для анимационных переходов
  const transitionClasses = "transition-all duration-500 ease-in-out";

  // Функция для создания градиентной строки с использованием rgba
  const createGradient = (color, bg, alpha, stop) => {
    return `radial-gradient(circle at 50% 50%, rgba(${hexToRgb(color)}, ${alpha}) 0%, rgba(${hexToRgb(bg)}, 0) ${stop}%)`;
  };

  // Рендер компонента с выбором между стандартной и упрощенной версиями
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
        paddingLeft: 'env(safe-area-inset-left, 0)',
        willChange: 'background-color' // Подсказка браузеру для оптимизации
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {/* Выбор между стандартной и упрощенной версиями фона */}
        {!useSimplifiedVersion ? (
          // СТАНДАРТНАЯ ВЕРСИЯ - с полными эффектами и анимациями
          // Эта версия будет использоваться на десктопах и мощных устройствах
          <>
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
                mixBlendMode: isDarkMode ? 'screen' : 'multiply',
                willChange: 'transform, opacity' // Подсказка браузеру
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
          </>
        ) : (
          // УПРОЩЕННАЯ ВЕРСИЯ - с минимальными эффектами для iPad и планшетов
          // Эта версия исключает тяжелые эффекты размытия и сложные анимации
          // для повышения производительности на менее мощных устройствах
          <>
            <div 
              className={`absolute inset-0 ${transitionClasses}`}
              style={{
                background: `linear-gradient(135deg, 
                  rgba(${hexToRgb(gradientColors.primary)}, 0.08) 0%, 
                  rgba(${hexToRgb(gradientColors.secondary)}, 0.08) 35%, 
                  rgba(${hexToRgb(gradientColors.tertiary)}, 0.08) 100%)`,
                opacity: 0.9,
                mixBlendMode: isDarkMode ? 'screen' : 'multiply'
              }}
            />
            {/* Статические элементы без анимации и размытия */}
            <div 
              className={`absolute rounded-full ${transitionClasses}`}
              style={{
                width: '90%',
                height: '70%',
                top: '10%',
                left: '5%',
                background: `radial-gradient(circle at 50% 50%, 
                  rgba(${hexToRgb(gradientColors.primary)}, 0.05) 0%, 
                  rgba(${hexToRgb(gradientColors.background)}, 0) 80%)`,
                // Без эффекта размытия (filter: blur)
                opacity: 0.7,
                mixBlendMode: isDarkMode ? 'screen' : 'multiply'
              }}
            />
            <div 
              className={`absolute rounded-full ${transitionClasses}`}
              style={{
                width: '80%',
                height: '60%',
                bottom: '5%',
                right: '5%',
                background: `radial-gradient(circle at 50% 50%, 
                  rgba(${hexToRgb(gradientColors.secondary)}, 0.05) 0%, 
                  rgba(${hexToRgb(gradientColors.background)}, 0) 80%)`,
                // Без эффекта размытия
                opacity: 0.6,
                mixBlendMode: isDarkMode ? 'screen' : 'multiply'
              }}
            />
          </>
        )}
      </div>
      
      {/* Переходный слой - появляется при смене цветов */}
      {isTransitioning && prevColors && (
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
          style={{
            opacity: 0,
            zIndex: 1
          }}
        >
          {!useSimplifiedVersion ? (
            // Стандартная версия переходного слоя
            <>
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
            </>
          ) : (
            // Упрощенная версия переходного слоя для iPad и планшетов
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(${hexToRgb(prevColors.primary)}, 0.08) 0%, 
                  rgba(${hexToRgb(prevColors.secondary)}, 0.08) 35%, 
                  rgba(${hexToRgb(prevColors.tertiary)}, 0.08) 100%)`,
                opacity: 0.9,
                mixBlendMode: isDarkMode ? 'screen' : 'multiply'
              }}
            />
          )}
        </div>
      )}
      
      {/* CSS-анимации с оптимизацией для iPad */}
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
        
        /* Оптимизированные анимации для планшетов - с меньшей нагрузкой */
        @media (hover: none) and (pointer: coarse) {
          @keyframes pulse {
            0%, 100% {
              transform: scale(0.97);
            }
            50% {
              transform: scale(1);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(AnimatedBackground);