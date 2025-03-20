import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { contactInfo } from '../../../data/contacts';
import { companyData } from '../../../data/companies';
import { copyToClipboard } from '../../../utils/clipboard';

/**
 * Базовый компонент для отображения контактной информации
 * @param {Object} props - Свойства компонента
 * @param {string} props.activeCompany - ID активной компании
 * @param {Function} props.onClose - Функция закрытия
 * @returns {JSX.Element} Компонент контактной информации
 */
const ContactDisplay = ({ activeCompany, onClose }) => {
  // Состояния для отслеживания копирования
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isTelegramCopied, setIsTelegramCopied] = useState(false);
  
  // Получаем название компании из централизованного хранилища
  const company = activeCompany && companyData[activeCompany] 
    ? companyData[activeCompany] 
    : null;
  
  const companyName = company ? company.name : "";
  
  // Обработчики копирования в буфер обмена
  const handleCopyEmail = () => {
    copyToClipboard(contactInfo.email, () => {
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2000);
    });
  };
  
  const handleCopyTelegram = () => {
    copyToClipboard(contactInfo.telegram, () => {
      setIsTelegramCopied(true);
      setTimeout(() => setIsTelegramCopied(false), 2000);
    });
  };
  
  // Функция для получения текста
  const getContactText = () => {
    if (activeCompany === 'nexus') {
      return (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>Note:</strong> Due to a Non-Disclosure Agreement, I cannot reveal the actual name of this company. 
            I'd be happy to share more details during a personal conversation.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you'd like to learn more about my work at {companyName} or discuss other aspects of the project, 
            please feel free to reach out through any of the following channels:
          </p>
        </>
      );
    } else if (activeCompany) {
      return (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you'd like to learn more about my work at {companyName} or discuss other aspects of the project, 
          please feel free to reach out through any of the following channels:
        </p>
      );
    } else {
      return (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you'd like to discuss my work or opportunities for collaboration, 
          please feel free to reach out through any of the following channels:
        </p>
      );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
        <button 
          onClick={onClose} 
          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {getContactText()}
      
      <div className="flex flex-col space-y-4">
        {/* Email контакт */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center">
            <img 
              src="/assets/icons/email-icon.svg" 
              alt="Email" 
              className="w-5 h-5 mr-3" 
              style={{ filter: 'var(--icon-filter, none)' }}
            />
            <a href={`mailto:${contactInfo.email}`} className="text-primary hover:text-primary-dark">
              {contactInfo.email}
            </a>
          </div>
          <div className="relative">
            <button 
              onClick={handleCopyEmail}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2"
              aria-label="Copy email"
            >
              {isEmailCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
            {/* Tooltip при копировании */}
            {isEmailCopied && (
              <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
                Copied!
              </div>
            )}
          </div>
        </div>
        
        {/* Telegram контакт */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center">
            <img 
              src="/assets/icons/telegram-icon.svg" 
              alt="Telegram" 
              className="w-5 h-5 mr-3" 
              style={{ filter: 'var(--icon-filter, none)' }}
            />
            <a href={`https://t.me/${contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
              {contactInfo.telegram}
            </a>
          </div>
          <div className="relative">
            <button 
              onClick={handleCopyTelegram}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2"
              aria-label="Copy telegram username"
            >
              {isTelegramCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
            {/* Tooltip при копировании */}
            {isTelegramCopied && (
              <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

ContactDisplay.propTypes = {
  activeCompany: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default React.memo(ContactDisplay);