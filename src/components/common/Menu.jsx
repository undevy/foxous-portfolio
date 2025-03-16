// src/components/common/Menu.jsx
import React, { useRef, useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import YoutubePlayer from './YoutubePlayer';
import StatusIndicator from './StatusIndicator';
import GithubLink from './GithubLink';

const Menu = ({ 
  isOpen, 
  position, 
  onClose, 
  isMobile 
}) => {
  const menuRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

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
              src="/assets/svgs/Fox.svg" 
              alt="Foxous" 
              className="w-10 h-10"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">Foxous</div>
            <div className="text-sm text-gray-500">Designer / Developer</div>
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
    }
  ];

  return (
    <div 
      ref={menuRef}
      className={`glassmorphism rounded-2xl shadow-lg p-2 overflow-hidden ${animationClass}`}
      style={menuStyle}
    >
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <div key={item.id} className={`${item.clickable ? 'menu-item menu-item-hover cursor-pointer' : ''}`}>
            {item.component}
            {item.divider && <div className="border-b border-gray-200 my-2"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;