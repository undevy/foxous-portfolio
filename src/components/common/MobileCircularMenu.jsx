// src/components/common/MobileCircularMenu.jsx
import React from 'react';
import { companyData } from '../../data/companies';

const MobileCircularMenu = ({ 
  isOpen, 
  onClose, 
  toggleCompany, 
  activeCompany 
}) => {
  // Идентификаторы компаний для иконок
  const companyIds = {
    gmx: 'Gmx',
    nexus: 'Nexus',
    p2p: 'P2P',
    wildberries: 'Wb'
  };
  
  // Фиксированные позиции иконок в круговом меню (из Figma-макета)
  const companyPositions = {
    gmx: { top: '72px', left: '24px' },
    nexus: { top: '72px', left: '120px' },
    p2p: { top: '116px', left: '46px' },
    wildberries: { top: '116px', left: '98px' }
  };
  
  // Обработчик клика по иконке компании
  const handleCompanyClick = (companyId, event) => {
    event.stopPropagation();
    toggleCompany(companyId);
    onClose();
  };

  return (
    <div 
      className={`absolute left-1/2 transform -translate-x-1/2 w-44 h-44 transition-all duration-300 ease-out overflow-visible ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      style={{ 
        transform: isOpen ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0)',
        top: '-88px',
        zIndex: 60,
        borderRadius: '12.5rem',
        border: '1px solid rgba(255, 255, 255, 0.60)',
        background: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Иконки компаний */}
      {Object.keys(companyData).map((companyId, index) => (
        <div 
          key={companyId} 
          className="absolute w-8 h-8"
          style={{
            ...companyPositions[companyId],
            opacity: isOpen ? 1 : 0,
            transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${index * 50}ms`,
          }}
        >
          <button 
            onClick={(e) => handleCompanyClick(companyId, e)}
            className="w-8 h-8 rounded-lg flex items-center justify-center outline-none focus:outline-none"
            aria-label={companyData[companyId].name}
          >
            <img 
              src={`/assets/svgs/${companyIds[companyId]}.svg`} 
              alt={companyData[companyId].name}
              className="w-8 h-8 nav-icon"
            />
          </button>
        </div>
      ))}
      
      {/* Кнопка закрытия с белым фоном */}
      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ease-out shadow-sm">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default React.memo(MobileCircularMenu);