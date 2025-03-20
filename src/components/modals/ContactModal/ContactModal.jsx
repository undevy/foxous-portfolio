import React from 'react';
import PropTypes from 'prop-types';
import ContactDisplay from '../../ui/ContactDisplay';

/**
 * Компонент модального окна контактов для десктопной версии
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.showContactModal - Показывать ли модальное окно
 * @param {Function} props.setShowContactModal - Функция управления видимостью окна
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент модального окна контактов
 */
const ContactModal = ({ showContactModal, setShowContactModal, activeCompany }) => {
  if (!showContactModal) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" 
      onClick={() => setShowContactModal(false)}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)'
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg max-w-lg w-full mx-auto overflow-y-auto" 
        onClick={e => e.stopPropagation()}
      >
        <ContactDisplay 
          activeCompany={activeCompany} 
          onClose={() => setShowContactModal(false)} 
        />
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  showContactModal: PropTypes.bool.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(ContactModal);