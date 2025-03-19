import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { contactInfo } from '../../../data/contacts';

/**
 * Компонент модального окна контактов
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.showContactModal - Показывать ли модальное окно
 * @param {Function} props.setShowContactModal - Функция управления видимостью окна
 * @param {string} props.activeCompany - ID активной компании
 * @returns {JSX.Element} Компонент модального окна контактов
 */
const ContactModal = ({ showContactModal, setShowContactModal, activeCompany }) => {
  // Состояния для отслеживания копирования
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isTelegramCopied, setIsTelegramCopied] = useState(false);
  
  const companyData = {
    nexus: {
      name: "Nexus Network"
    }
  };
  
  // Получаем название компании, если она активна
  const companyName = activeCompany && companyData[activeCompany] ? companyData[activeCompany].name : "";
  
  // Функция копирования в буфер обмена с появлением tooltip
  const copyToClipboard = (text, type) => {
    // Создаем функцию-обертку для различных методов копирования
    const performCopy = async () => {
      let success = false;
      
      // Метод 1: Современный Clipboard API (работает в большинстве браузеров)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch (err) {
          console.warn('Clipboard API недоступен:', err);
        }
      }
      
      // Метод 2: Fallback для iOS Safari и старых браузеров
      if (!success) {
        try {
          // Создаем временный элемент textarea
          const textarea = document.createElement('textarea');
          textarea.value = text;
          
          // Делаем элемент невидимым
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          textarea.style.top = '0';
          textarea.style.left = '0';
          
          // Добавляем в DOM и выбираем текст
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          
          // Выполняем копирование старым методом
          const successful = document.execCommand('copy');
          success = successful;
          
          // Удаляем временный элемент
          document.body.removeChild(textarea);
        } catch (err) {
          console.warn('Fallback метод копирования не сработал:', err);
        }
      }
      
      // Обновляем состояние, если копирование успешно
      if (success) {
        if (type === 'email') {
          setIsEmailCopied(true);
          setTimeout(() => setIsEmailCopied(false), 2000);
        } else if (type === 'telegram') {
          setIsTelegramCopied(true);
          setTimeout(() => setIsTelegramCopied(false), 2000);
        }
      }
    };
    
    // Запускаем копирование
    performCopy();
  };
  
  // Функция для получения текста модального окна
  const getModalText = () => {
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
          <button 
            onClick={() => setShowContactModal(false)} 
            className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {getModalText()}
        
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
                onClick={() => copyToClipboard(contactInfo.email, 'email')}
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
                onClick={() => copyToClipboard(contactInfo.telegram, 'telegram')}
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
      </div>
    </div>
  );
};

ContactModal.propTypes = {
  showContactModal: PropTypes.bool.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
  activeCompany: PropTypes.string
};

export default React.memo(ContactModal, (prevProps, nextProps) => {
  return (
    prevProps.showContactModal === nextProps.showContactModal &&
    prevProps.activeCompany === nextProps.activeCompany
  );
});