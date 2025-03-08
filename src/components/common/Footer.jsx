import React from 'react';

const Footer = ({ activeCompany, toggleCompany }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div>
          {/* Лого-иконка лисы */}
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 3A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6.5 3h11z"></path>
              <path d="M9.5 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
              <path d="M14.5 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
              <path d="M9.5 15.5s1.5 2 2.5 2 2.5-2 2.5-2"></path>
              <path d="M19 9V5.5a2.5 2.5 0 0 0-5 0v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a2.5 2.5 0 0 0-5 0V9"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex space-x-3">
          {/* Центральные иконки */}
          <button 
            onClick={() => toggleCompany('gmx')}
            className={`w-10 h-10 ${activeCompany === 'gmx' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} rounded-lg flex items-center justify-center hover:bg-blue-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
        
        <div>
          {/* Кнопка Connect */}
          <button 
            onClick={() => toggleCompany('contact')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;