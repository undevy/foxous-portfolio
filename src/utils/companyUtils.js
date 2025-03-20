// src/utils/companyUtils.js - обновите существующий файл!

/**
 * Возвращает путь к изображению компании по ее ID
 * @param {string} companyId - ID компании
 * @returns {string} - Путь к изображению компании
 */
export const getCompanyImage = (companyId) => {
  const imageMap = {
    'gmx': '/assets/images/GMX.webp',
    'nexus': '/assets/images/Nexus.webp',
    'p2p': '/assets/images/KeyApp.webp',
    'wildberries': '/assets/images/Wb.webp'
  };
  
  return imageMap[companyId] || '/api/placeholder/400/250';
};

/**
* Возвращает путь к PNG-версии изображения компании
* @param {string} companyId - ID компании
* @returns {string} - Путь к PNG-изображению компании
*/
export const getCompanyPngImage = (companyId) => {
// Используем Map для соответствия ID компаний и имен файлов PNG
const imageMap = {
  'gmx': '/assets/images/GMX.png',
  'nexus': '/assets/images/Nexus.png',
  'p2p': '/assets/images/KeyApp.png',
  'wildberries': '/assets/images/Wb.png'
};

return imageMap[companyId] || '/api/placeholder/1000/600';
};