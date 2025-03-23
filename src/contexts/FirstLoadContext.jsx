// src/contexts/FirstLoadContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const FirstLoadContext = createContext();

/**
 * Провайдер контекста первой загрузки
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} - Компонент провайдера
 */
export const FirstLoadProvider = ({ children }) => {
  // По умолчанию считаем, что это первая загрузка
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Функция для сброса флага первой загрузки
  const completeFirstLoad = () => {
    setIsFirstLoad(false);
  };
  
  // Функция для сброса состояния и возвращения к первой загрузке
  const resetFirstLoad = () => {
    setIsFirstLoad(true);
  };
  
  return (
    <FirstLoadContext.Provider value={{ isFirstLoad, completeFirstLoad, resetFirstLoad }}>
      {children}
    </FirstLoadContext.Provider>
  );
};

/**
 * Хук для использования контекста первой загрузки
 * @returns {Object} - Объект с флагом первой загрузки и функциями
 */
export const useFirstLoad = () => {
  const context = useContext(FirstLoadContext);
  if (context === undefined) {
    throw new Error('useFirstLoad должен использоваться внутри FirstLoadProvider');
  }
  return context;
};