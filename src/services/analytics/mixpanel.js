import mixpanel from 'mixpanel-browser';

// Инициализация Mixpanel
export const initMixpanel = (token) => {
  if (!token) {
    console.warn('Mixpanel token is missing');
    return;
  }
  
  mixpanel.init(token, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: false,
    persistence: 'localStorage',
    api_host: "https://api-eu.mixpanel.com", // Используйте это, если ваши данные должны храниться в ЕС
  });
  
  console.log('Mixpanel initialized with token:', token);
};

// Отслеживание просмотра страницы
export const trackPageView = (pagePath, properties = {}) => {
  if (!pagePath) {
    pagePath = window.location.pathname + window.location.search;
  }
  
  console.log(`Mixpanel: Tracking page view: ${pagePath}`);
  mixpanel.track('Page View', {
    page: pagePath,
    title: document.title,
    url: window.location.href,
    referrer: document.referrer,
    ...properties
  });
};

// Отслеживание события
export const trackEvent = (eventName, properties = {}) => {
  console.log(`Mixpanel: Tracking event - ${eventName}`, properties);
  mixpanel.track(eventName, {
    timestamp: new Date().toISOString(),
    ...properties
  });
};

// Установка пользовательских свойств
export const setUserProperties = (properties) => {
  if (!properties || Object.keys(properties).length === 0) return;
  
  console.log('Mixpanel: Setting user properties:', properties);
  mixpanel.register(properties);
};

// Отслеживание времени
export const timeEvent = (eventName) => {
  console.log(`Mixpanel: Starting timing for ${eventName}`);
  mixpanel.time_event(eventName);
};

// Создание или обновление профиля (если нужно)
export const identifyUser = (userId, properties = {}) => {
  if (!userId) return;
  
  console.log(`Mixpanel: Identifying user ${userId}`);
  mixpanel.identify(userId);
  if (Object.keys(properties).length > 0) {
    mixpanel.people.set(properties);
  }
};