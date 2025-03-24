// src/components/features/menu/MainMenu/MainMenu.jsx

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ThemeToggle from '../../../ui/ThemeToggle';
import YoutubePlayer from '../../../ui/YoutubePlayer';
import StatusIndicator from '../../../ui/StatusIndicator';
import GithubLink from '../../../ui/GithubLink';
import PowerOff from '../../../ui/PowerOff';
import { useTheme } from '../../../../contexts/ThemeContext';
import { trackEvent, EVENT_CATEGORIES } from '../../../../services/analytics';

/**
 * Компонент главного меню
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Открыто ли меню
 * @param {Object} props.position - Позиция меню {x, y, height, width}
 * @param {Function} props.onClose - Функция закрытия меню
 * @param {boolean} props.isMobile - Флаг мобильного устройства
 * @returns {JSX.Element} Компонент главного меню
 */
const MainMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  isMobile 
}) => {
  const menuRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Получаем текущую тему
  const { isDarkMode } = useTheme();
  
  // Состояние для анимации выключения
  const [isPoweringOff, setIsPoweringOff] = useState(false);

  // Управление появлением/исчезновением меню
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      // Задержка перед удалением из DOM для анимации
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Длительность анимации
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Обработчик выключения
  const handlePowerOff = () => {
    // Отслеживаем событие в аналитике
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'power_off_click',
      'main_menu'
    );
    
    // Закрываем меню
    onClose();
    
    // Запускаем анимацию выключения
    setIsPoweringOff(true);
    
    // Последовательность анимации выключения
    // 1. Сначала вспышка (0.3s)
    // 2. Скрытие окон контента (0.5s после вспышки)
    document.body.classList.add('power-off-sequence');
    
    // Цепочка последовательных действий (сохраняем исходную структуру)
    setTimeout(() => {
      // Скрытие окон - добавляем класс hide-windows к body
      document.body.classList.add('hide-windows');
      
      setTimeout(() => {
        // Скрытие футера - добавляем класс hide-footer к body
        document.body.classList.add('hide-footer');
        
        // После некоторой паузы перезагружаем страницу
        setTimeout(() => {
          window.location.reload();
        }, 2500); // Увеличенная задержка перед перезагрузкой для лучшего эффекта
      }, 800); // Увеличенная задержка между скрытием окон и футера
    }, 500); // Увеличенная задержка после вспышки
  };

  if (!shouldRender) return null;

  // Правильное позиционирование согласно макету
  const menuStyle = {
    position: 'fixed',
    zIndex: 100,
    minWidth: '280px',
    ...(isMobile ? {
      top: position ? position.y + position.height + 10 : '70px',
      left: position ? position.x - 16 : '50%',
      transform: 'translateX(-20px)',
    } : {
      bottom: position ? window.innerHeight - position.y + 10 : '70px',
      left: position ? position.x - 20 : '50%',
    })
  };

  // Определяем класс анимации
  const animationClass = isMobile
    ? (isExiting ? 'menu-mobile-exit' : 'menu-mobile-enter')
    : (isExiting ? 'menu-desktop-exit' : 'menu-desktop-enter');

  // Элементы меню
  const menuItems = [
    {
      id: 'profile',
      component: (
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
          <img 
            src={isDarkMode ? "/assets/svgs/Fox-Dark.svg" : "/assets/svgs/Fox.svg"} 
            alt="Foxous" 
            className="w-10 h-10"
          />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Foxous</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Designer / Developer</div>
          </div>
        </div>
      ),
      divider: false,
      clickable: false
    },
    {
      id: 'status',
      component: <StatusIndicator />,
      divider: true, 
      clickable: false
    },
    {
      id: 'theme',
      component: <ThemeToggle />,
      divider: false,
      clickable: true
    },
    {
      id: 'github',
      component: <GithubLink />,
      divider: false,
      clickable: true
    },
    {
      id: 'youtube',
      component: <YoutubePlayer />,
      divider: false,
      clickable: true
    },
    {
      id: 'power-off',
      component: <PowerOff onPowerOff={handlePowerOff} />,
      divider: false, 
      clickable: true
    }
  ];

  return (
    <>
      {/* Анимация выключения */}
      {isPoweringOff && (
        <div className="power-off-overlay">
          <div className="power-off-effect"></div>
        </div>
      )}
      
      <div 
        ref={menuRef}
        className={`glassmorphism rounded-2xl shadow-lg p-2 overflow-hidden transform-card-transition ${animationClass}`}
        style={menuStyle}
      >
        <div className="flex flex-col">
          {menuItems.map((item, index) => {
            // Проверяем, нужно ли добавить разделитель перед PowerOff
            const showDividerBeforePowerOff = index === 5 && item.id === 'power-off';
            
            return (
              <div key={item.id}>
                {/* Добавляем разделитель перед PowerOff */}
                {showDividerBeforePowerOff && (
                  <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>
                )}
                
                <div className={`${item.clickable ? 'menu-item menu-item-hover cursor-pointer' : ''}`}>
                  {item.component}
                </div>
                
                {/* Добавляем разделитель после элементов, которые требуют его */}
                {item.divider && (
                  <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

MainMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default MainMenu;