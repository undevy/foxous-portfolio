// ga4.js
import ReactGA from 'react-ga4';
import { EVENT_CATEGORIES } from './constants'; // ✅ Import константы

// Инициализация GA4
export const initGA = (measurementId) => {
  if (!measurementId) {
    console.warn('GA4 Measurement ID is missing');
    return;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      debug_mode: process.env.NODE_ENV !== 'production',
    },
    gtagOptions: {
      send_page_view: false // Будем отправлять вручную для большего контроля
    }
  });
  
  console.log('GA4 initialized with ID:', measurementId);
};

// Отслеживание просмотра страницы
export const trackPageView = (pagePath, pageTitle) => {
  if (!pagePath) {
    pagePath = window.location.pathname + window.location.search;
  }
  
  console.log(`GA4: Tracking page view: ${pagePath}`);
  ReactGA.send({ 
    hitType: 'pageview',
    page: pagePath,
    title: pageTitle || document.title
  });
};

// Отслеживание события
export const trackEvent = (category, action, label, value, nonInteraction = false) => {
  console.log(`GA4: Tracking event - ${category} / ${action} / ${label}`);
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
  });
};

// Установка пользовательских свойств
export const setUserProperties = (properties) => {
  if (!properties || Object.keys(properties).length === 0) return;
  
  console.log('GA4: Setting user properties:', properties);
  ReactGA.gtag('set', 'user_properties', properties);
};

// Замер времени (для длительных действий)
export const timingEvent = (category, variable, value, label) => {
  console.log(`GA4: Timing - ${category} / ${variable} / ${value}ms`);
  ReactGA.gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: label
  });
};

// Отслеживание Web Vitals
export const trackWebVitals = () => {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });

  function sendToAnalytics({ name, value, id, delta, rating, attribution }) {
    // Отправка как кастомное событие в GA4
    trackEvent(
      EVENT_CATEGORIES.ENGAGEMENT, // Категория "Engagement" или "Performance" - **Исправлено: добавление импорта констант и использование EVENT_CATEGORIES**
      `web_vitals_${name}`,        // Действие, например 'web_vitals_CLS'
      rating,                     // Label - good, needs-improvement, poor
      Math.round(value),           // Value - числовое значение метрики
    );
  }
};