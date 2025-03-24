import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PowerButton from './PowerButton';
import BootAnimation from './BootAnimation';
import FooterAppearance from './FooterAppearance';
import ProjectLoader from './ProjectLoader';
import { trackEvent, EVENT_CATEGORIES } from '../../../services/analytics';

/**
 * Улучшенный компонент загрузки с анимацией "включения системы"
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onLoadComplete - Функция завершения загрузки
 * @param {boolean} props.imagesPreloaded - Флаг предзагрузки изображений
 * @returns {JSX.Element} - Компонент загрузки
 */
const EnhancedLoader = ({ onLoadComplete, imagesPreloaded }) => {
  // Состояние процесса загрузки
  const [loadingState, setLoadingState] = useState('initial');
  
  // Добавляем класс к body для блокировки прокрутки
  useEffect(() => {
    document.body.classList.add('loading-active');
    
    return () => {
      document.body.classList.remove('loading-active');
    };
  }, []);
  
  // Отслеживаем предзагрузку изображений
  useEffect(() => {
    if (imagesPreloaded) {
      // Если изображения загружены, можно отобразить кнопку включения
      console.log('Все изображения предзагружены');
    }
  }, [imagesPreloaded]);
  
  // Функция запуска цепочки анимаций
  const handlePowerOn = () => {
    // Отслеживаем событие включения
    trackEvent(
      EVENT_CATEGORIES.UI_INTERACTION,
      'power_button_click',
      'enhanced_loader'
    );
    
    // Начинаем переходы между состояниями с задержками
    setLoadingState('powering');
    
    // Цепочка таймаутов для смены состояния загрузки
    setTimeout(() => {
      setLoadingState('booting');
      
      setTimeout(() => {
        setLoadingState('footer');
        
        setTimeout(() => {
          setLoadingState('app');
          
          setTimeout(() => {
            setLoadingState('complete');
            // Завершаем загрузку
            onLoadComplete();
          }, 2000);
        }, 2500);
      }, 2500);
    }, 1500);
  };
  
  // Рендерим разные компоненты в зависимости от состояния загрузки
  return (
    <div className={`enhanced-loader state-${loadingState}`}>
      {/* Анимация вспышки при включении */}
      <div className="power-flash"></div>
      
      {/* Контейнер контента загрузчика */}
      <div className="loader-content">
        {loadingState === 'initial' && (
          <PowerButton onClick={handlePowerOn} />
        )}
        
        {loadingState === 'booting' && (
          <BootAnimation />
        )}
        
        {loadingState === 'footer' && (
          <FooterAppearance />
        )}
        
        {loadingState === 'app' && (
          <ProjectLoader />
        )}
      </div>
    </div>
  );
};

EnhancedLoader.propTypes = {
  onLoadComplete: PropTypes.func.isRequired,
  imagesPreloaded: PropTypes.bool.isRequired
};

export default EnhancedLoader;