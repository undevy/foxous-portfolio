import { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Компонент для динамического обновления мета-тегов в зависимости от темы
 * Особенно важен для iOS, чтобы область Dynamic Island и статус-бар 
 * соответствовала цветовой схеме приложения
 */
const ThemeMeta = () => {
  const { isDarkMode, activeCompany, colorSchemes } = useTheme();
  
  useEffect(() => {
    // Получаем текущую цветовую схему
    const scheme = colorSchemes[activeCompany] || colorSchemes.default;
    const colors = isDarkMode ? scheme.dark : scheme.light;
    
    // Получаем мета-тег theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Если мета-тега нет, создаем его
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    // Обновляем цвет в мета-теге
    metaThemeColor.content = colors.background;
    
    // Также обновляем статус бар для Apple устройств
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaStatusBar) {
      // Для темной темы используем black-translucent для лучшей интеграции с Dynamic Island
      metaStatusBar.content = isDarkMode ? 'black-translucent' : 'default';
    }
    
  }, [isDarkMode, activeCompany, colorSchemes]);
  
  // Этот компонент не рендерит никакой UI
  return null;
};

export default ThemeMeta;