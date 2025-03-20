import React from 'react';
import PropTypes from 'prop-types';
import ContactDisplay from '../ContactDisplay';

/**
 * Встроенный компонент контактной информации (для мобильной версии)
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {boolean} props.showContacts - Флаг видимости компонента
 * @param {Function} props.setShowContacts - Функция управления видимостью
 * @returns {JSX.Element} Компонент контактной информации
 */
const ContactInfo = ({ activeCompany, showContacts, setShowContacts }) => {
  if (!showContacts) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={() => setShowContacts(false)}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)'
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
      >
        <ContactDisplay 
          activeCompany={activeCompany} 
          onClose={() => setShowContacts(false)} 
        />
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  activeCompany: PropTypes.string,
  showContacts: PropTypes.bool.isRequired,
  setShowContacts: PropTypes.func.isRequired
};

export default React.memo(ContactInfo);