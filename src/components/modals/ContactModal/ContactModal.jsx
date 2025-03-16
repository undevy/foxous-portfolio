import React from 'react';
import PropTypes from 'prop-types';

/**
 * Компонент модального окна контактов
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.showContactModal - Показывать ли модальное окно
 * @param {Function} props.setShowContactModal - Функция управления видимостью окна
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент модального окна контактов
 */
const ContactModal = ({ showContactModal, setShowContactModal, activeCompany }) => {
  // Предполагаем, что эти данные будут импортированы из соответствующих файлов
  const contactInfo = {
    email: "foxous@proton.me",
    telegram: "@foxous"
  };
  
  const companyData = {
    nexus: {
      name: "Nexus Network"
    }
  };
  
  // Получаем название компании, если она активна
  const companyName = activeCompany && companyData[activeCompany] ? companyData[activeCompany].name : "";
  
  // Функция для получения текста модального окна
  const getModalText = () => {
    if (activeCompany === 'nexus') {
      return (
        <>
          <p className="text-gray-600 mb-4">
            <strong>Note:</strong> Due to a Non-Disclosure Agreement, I cannot reveal the actual name of this company. 
            I'd be happy to share more details during a personal conversation.
          </p>
          <p className="text-gray-600 mb-4">
            If you'd like to learn more about my work at {companyName} or discuss other aspects of the project, 
            please feel free to reach out through any of the following channels:
          </p>
        </>
      );
    } else if (activeCompany) {
      return (
        <p className="text-gray-600 mb-8">
          If you'd like to learn more about my work at {companyName} or discuss other aspects of the project, 
          please feel free to reach out through any of the following channels:
        </p>
      );
    } else {
      return (
        <p className="text-gray-600 mb-8">
          If you'd like to discuss my work or opportunities for collaboration, 
          please feel free to reach out through any of the following channels:
        </p>
      );
    }
  };
  
  if (!showContactModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowContactModal(false)}>
      <div className="bg-white rounded-3xl p-8 shadow-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <button onClick={() => setShowContactModal(false)} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {getModalText()}
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-3">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-800">
                {contactInfo.email}
              </a>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(contactInfo.email);
                alert('Email copied to clipboard!');
              }}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-3">
                <path d="M21.8 17.8C21.2 17.2 20.4 16.8 19.6 16.6C18.7 16.4 17.9 16.2 17 16C16.7 15.9 16.4 16 16.2 16.2L14.8 17.6C13 16.7 11.3 15 10.4 13.2L11.8 11.8C12 11.6 12.1 11.3 12 11C11.8 10.1 11.6 9.3 11.4 8.4C11.2 7.6 10.8 6.8 10.2 6.2C9.6 5.6 8.8 5.2 8 5.2C7.2 5.2 6.4 5.6 5.8 6.2C4.2 7.8 4 11.8 5.6 15.6C6.8 18.1 8.8 20.1 11.3 21.3C12.5 21.9 13.8 22.2 15 22.2C16.2 22.2 17.3 21.9 18.2 21C19.1 20.4 21.2 18.4 21.8 17.8Z"></path>
              </svg>
              <a href={`https://t.me/${contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {contactInfo.telegram}
              </a>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(contactInfo.telegram);
                alert('Telegram username copied to clipboard!');
              }}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  showContactModal: PropTypes.bool.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

// Добавляем мемоизацию с пользовательским сравнением пропсов
export default React.memo(ContactModal, (prevProps, nextProps) => {
  return (
    prevProps.showContactModal === nextProps.showContactModal &&
    prevProps.activeCompany === nextProps.activeCompany
  );
});