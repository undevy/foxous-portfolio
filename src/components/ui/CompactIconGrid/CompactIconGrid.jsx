import React from 'react';
import PropTypes from 'prop-types';

/**
 * Компактная сетка иконок для мобильного отображения
 * @param {Object} props - Свойства компонента
 * @param {Function} props.onOpen - Функция, вызываемая при клике на сетку
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент компактной сетки иконок
 */
const CompactIconGrid = ({ onOpen, activeCompany }) => {
  // Идентификаторы компаний для иконок
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Порядок компаний в сетке
  const gridOrder = [
    'gmx',      // верхний левый
    'nexus',    // верхний правый
    'p2p',      // нижний левый
    'wildberries' // нижний правый
  ];

  return (
    <button 
      className="w-10 h-10 rounded-lg flex items-center justify-center bg-white bg-opacity-80 shadow-sm"
      onClick={onOpen}
      aria-label="Открыть меню компаний"
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-8 h-8">
        {gridOrder.map(companyId => (
          <div 
            key={companyId}
            className="flex items-center justify-center overflow-hidden rounded-sm"
            style={{ width: '16px', height: '16px' }}
          >
            <img 
              src={`/assets/svgs/${companyIds[companyId]}.svg`} 
              alt={companyId}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </button>
  );
};

CompactIconGrid.propTypes = {
  onOpen: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(CompactIconGrid);