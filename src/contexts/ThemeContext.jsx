import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { updateUserProperty, trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS, USER_PROPERTIES } from '../services/analytics';

// Контекст для управления темой
export const ThemeContext = createContext();

// Цветовые схемы для компаний
export const COMPANY_COLOR_SCHEMES = {
  // GMX - оттенки синего (текущий дизайн)
  gmx: {
    light: {
      primary: '#3b82f6',
      primaryLight: '#E4ECFF',
      primaryDark: '#74A0FF',
      background: '#E3F2FD',
      gradientPrimary: '#90CAF9',
      gradientSecondary: '#64B5F6',
      gradientTertiary: '#BBDEFB',
    },
    dark: {
      primary: '#4a81f2',
      primaryLight: '#242F55',
      primaryDark: '#5780EA',
      background: '#121212',
      gradientPrimary: '#1E3A8A',
      gradientSecondary: '#3B82F6',
      gradientTertiary: '#60A5FA',
    },
  },
  
  // Nexus - оттенки оранжевого
  nexus: {
    light: {
      primary: '#f97316',
      primaryLight: '#ffedd5',
      primaryDark: '#ea580c',
      background: '#FFF7ED',
      gradientPrimary: '#FDBA74',
      gradientSecondary: '#FB923C',
      gradientTertiary: '#FFD8A8',
    },
    dark: {
      primary: '#ea580c',
      primaryLight: '#32211A',
      primaryDark: '#973D13',
      background: '#121212',
      gradientPrimary: '#7C2D12',
      gradientSecondary: '#C2410C',
      gradientTertiary: '#EA580C',
    },
  },
  
  // WB (Wildberries) - оттенки розового/пурпурного
  wildberries: {
    light: {
      primary: '#a92896',
      primaryLight: '#fce7f3',
      primaryDark: '#be185d',
      background: '#FDF2F8',
      gradientPrimary: '#F9A8D4',
      gradientSecondary: '#EC4899',
      gradientTertiary: '#FBCFE8',
    },
    dark: {
      primary: '#9C3392',
      primaryLight: '#371D43',
      primaryDark: '#9d174d',
      background: '#121212',
      gradientPrimary: '#831843',
      gradientSecondary: '#BE185D',
      gradientTertiary: '#DB2777',
    },
  },
  
  // P2P - насыщенные оттенки синего
  p2p: {
    light: {
      primary: '#1347ff',
      primaryLight: '#d6e4ff',
      primaryDark: '#1e40af',
      background: '#EFF6FF',
      gradientPrimary: '#93C5FD',
      gradientSecondary: '#3B82F6',
      gradientTertiary: '#BFDBFE',
    },
    dark: {
      primary: '#1347FF',
      primaryLight: '#152047',
      primaryDark: '#0E38CA',
      background: '#121212',
      gradientPrimary: '#1E3A8A',
      gradientSecondary: '#1D4ED8',
      gradientTertiary: '#3B82F6',
    },
  },
  
  // Default - базовая схема (идентична GMX)
  default: {
    light: {
      primary: '#3b82f6',
      primaryLight: '#93c5fd',
      primaryDark: '#2563eb',
      background: '#E3F2FD',
      gradientPrimary: '#90CAF9',
      gradientSecondary: '#64B5F6',
      gradientTertiary: '#BBDEFB',
    },
    dark: {
      primary: '#4a81f2',
      primaryLight: '#5c90f5',
      primaryDark: '#2563eb',
      background: '#121212',
      gradientPrimary: '#1E3A8A',
      gradientSecondary: '#3B82F6',
      gradientTertiary: '#60A5FA',
    },
  }
};

export const ThemeProvider = ({ children }) => {
  // Определение системной темы
  const prefersDarkMode = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Состояния
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : prefersDarkMode;
  });
  
  const [activeCompany, setActiveCompany] = useState('default');
  
  // Функция обновления CSS-переменных
  const updateColorScheme = useCallback(() => {
    const root = document.documentElement;
    const scheme = COMPANY_COLOR_SCHEMES[activeCompany] || COMPANY_COLOR_SCHEMES.default;
    const colors = isDarkMode ? scheme.dark : scheme.light;
    
    // Установка класса для темной темы
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Установка CSS-переменных
    Object.entries(colors).forEach(([key, value]) => {
      // Преобразование camelCase в kebab-case для CSS-переменных
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, [activeCompany, isDarkMode]);
  
  // Обработчик переключения темы
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');

    // Отслеживаем изменение темы
    updateUserProperty(USER_PROPERTIES.THEME, newValue ? 'dark' : 'light');
    trackEvent(
      EVENT_CATEGORIES.USER_PREFERENCE, 
      EVENT_ACTIONS.THEME_CHANGE, 
      newValue ? 'dark' : 'light'
    );
  };
  
  // Обновление компании
  const setCompanyTheme = (companyId) => {
    setActiveCompany(companyId || 'default');

    // Отслеживаем изменение цветовой схемы компании
    if (companyId && companyId !== 'default') {
      trackEvent(
        EVENT_CATEGORIES.USER_PREFERENCE,
        'company_theme_change',
        companyId
      );
    }
  };
  
  // Обновление при изменении состояния
  useEffect(() => {
    updateColorScheme();
  }, [updateColorScheme, activeCompany]);
  
  // Слушатель изменений системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Изменять тему только если пользователь не задал её вручную
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Используем правильный API в зависимости от браузера
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Для старых браузеров
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode, 
        toggleDarkMode, 
        activeCompany, 
        setCompanyTheme,
        colorSchemes: COMPANY_COLOR_SCHEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для удобного использования контекста темы
export const useTheme = () => useContext(ThemeContext);