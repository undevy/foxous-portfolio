/**
 * Утилита для копирования текста в буфер обмена с поддержкой различных браузеров
 * @param {string} text - Текст для копирования
 * @param {Function} onSuccess - Функция обратного вызова при успешном копировании
 * @returns {Promise<boolean>} - Результат операции копирования
 */
export const copyToClipboard = async (text, onSuccess) => {
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
    
    // Вызываем функцию обратного вызова при успехе
    if (success && typeof onSuccess === 'function') {
      onSuccess();
    }
    
    return success;
  };
  
  export default copyToClipboard;