/**
 * Утилитарные функции для работы с данными компаний
 */

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