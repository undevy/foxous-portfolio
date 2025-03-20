// Создайте новый файл: src/utils/projectUtils.js
/**
 * Возвращает путь к изображению проекта по его ID
 * @param {string} projectId - ID проекта
 * @returns {string} - Путь к изображению проекта
 */
export const getProjectImage = (projectId) => {
    return `/assets/images/${projectId}.webp`;
  };
/**
 * Возвращает путь к PNG-версии изображения проекта
 * @param {string} projectId - ID проекта
 * @returns {string} - Путь к PNG-изображению проекта
 */
export const getProjectPngImage = (projectId) => {
    return `/assets/images/${projectId}.png`;
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