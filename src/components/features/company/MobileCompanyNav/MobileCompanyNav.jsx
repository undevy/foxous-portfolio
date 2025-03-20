// src/components/features/company/MobileCompanyNav/MobileCompanyNav.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { companyData } from '../../../../data/companies';
import { projectsByCompany } from '../../../../data/projects';

/**
 * Компонент компактной навигационной панели компании для мобильных устройств
 * @param {Object} props - Свойства компонента
 * @param {string} props.company - ID компании
 * @param {string} props.activeCase - ID активного кейса
 * @param {Function} props.selectCase - Функция выбора кейса
 * @param {Function} props.backToCompanyCard - Функция возврата к карточке компании
 * @param {Function} props.setShowContactModal - Функция показа модального окна контактов
 * @returns {JSX.Element} Компонент компактной навигационной панели
 */
const MobileCompanyNav = ({
  company,
  activeCase,
  selectCase,
  backToCompanyCard,
  setShowContactModal
}) => {
  const companyInfo = companyData[company];
  const companyProjects = projectsByCompany[company] || [];

  return (
    <div 
      className="card-glassmorphism rounded-t-3xl shadow-sm overflow-hidden transform-card-transition"
      style={{ 
        minHeight: '100px',
        position: 'relative',
        zIndex: 30,
        marginTop: '-50px',
        paddingTop: '30px'
      }}
    >
      {/* Горизонтальная прокрутка с табами проектов */}
      <div 
        className="overflow-x-auto custom-scrollbar scrollbar-hide pb-4 horizontal-scroll" 
        style={{ 
          WebkitOverflowScrolling: 'touch', 
          paddingTop: '30px',
          paddingBottom: '12px'
        }}
      >
        <div className="flex space-x-1 px-4 pb-3 min-w-max">
          {/* Кнопка "Назад к компании" */}
          <button
            onClick={backToCompanyCard}
            className="border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-black dark:text-white" 
            style={{
              display: 'flex',
              padding: '8px 20px',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              border: '1px solid var(--color-button-border)',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: '600',
              width: 'auto'
            }}
          >
            ⬅️ To {companyInfo.name}
          </button>
          
          {/* Кнопки проектов (кроме активного) */}
          {companyProjects.map((project) => {
            // Не отображаем активный проект
            if (activeCase === project.id) return null;
            
            return (
              <button
                key={project.id}
                onClick={() => selectCase(project.id)}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                style={{
                  display: 'flex',
                  padding: '8px 20px',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-button-border)',
                  fontSize: '14px',
                  fontWeight: '600',
                  width: 'auto'
                }}
              >
                {project.shortName}
              </button>
            );
          })}
          
          {/* Кнопка "Other" */}
          <button
            onClick={() => setShowContactModal(true)}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
            style={{
              display: 'flex',
              padding: '8px 20px',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              border: '1px solid var(--color-button-border)',
              fontSize: '14px',
              fontWeight: '600',
              width: 'auto'
            }}
          >
            🔍 Other
          </button>
        </div>
      </div>
    </div>
  );
};

MobileCompanyNav.propTypes = {
  company: PropTypes.string.isRequired,
  activeCase: PropTypes.string,
  selectCase: PropTypes.func.isRequired,
  backToCompanyCard: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired
};

export default React.memo(MobileCompanyNav);