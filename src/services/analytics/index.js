// src/services/analytics/index.js
import * as GA4 from './ga4';
import * as Mixpanel from './mixpanel';
import { EVENT_CATEGORIES, EVENT_ACTIONS, USER_PROPERTIES } from './constants';

let userPath = [];

// Добавление шага в путь пользователя
export const addToUserPath = (step) => {
  if (!isAnalyticsEnabled()) return;

  const stepWithTimestamp = {
    ...step,
    timestamp: new Date().toISOString(),
  };

  userPath.push(stepWithTimestamp);

  if (userPath.length > 20) { // Ограничиваем длину
    userPath = userPath.slice(-20);
  }
};

// Отправка пути пользователя на выходе
export const sendUserPathOnExit = () => {
  if (!isAnalyticsEnabled() || userPath.length === 0) return;
};

// Экспорт констант
export { EVENT_CATEGORIES, EVENT_ACTIONS, USER_PROPERTIES };

// Экспортируем trackWebVitals из ga4.js - **Исправлено: Экспорт trackWebVitals**
export const trackWebVitals = GA4.trackWebVitals;

// Проверка, включена ли аналитика
const isAnalyticsEnabled = () => {
  return process.env.REACT_APP_ANALYTICS_ENABLED === 'true';
};

// Инициализация обеих платформ
export const initAnalytics = () => {
  if (!isAnalyticsEnabled()) {
    console.log('Analytics is disabled');
    return;
  }

  const ga4MeasurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
  const mixpanelToken = process.env.REACT_APP_MIXPANEL_TOKEN;

  if (ga4MeasurementId) {
    GA4.initGA(ga4MeasurementId);
  }

  if (mixpanelToken) {
    Mixpanel.initMixpanel(mixpanelToken);
  }

  // Установить базовые метаданные пользователя
  trackUserMetadata();
};

// Отслеживание основных метаданных пользователя
export const trackUserMetadata = () => {
  if (!isAnalyticsEnabled()) return;

  const userProperties = {
    [USER_PROPERTIES.THEME]: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    [USER_PROPERTIES.DEVICE_TYPE]: getDeviceType(),
    [USER_PROPERTIES.VIEWPORT_SIZE]: `${window.innerWidth}x${window.innerHeight}`,
    [USER_PROPERTIES.BROWSER]: getBrowserInfo(),
    [USER_PROPERTIES.OPERATING_SYSTEM]: getOSInfo(),
  };

  GA4.setUserProperties(userProperties);
  Mixpanel.setUserProperties(userProperties);
};

// Отслеживание просмотра страницы
export const trackPageView = (pagePath, pageTitle) => {
  if (!isAnalyticsEnabled()) return;

  GA4.trackPageView(pagePath, pageTitle);
  Mixpanel.trackPageView(pagePath, { title: pageTitle });
};

// Отслеживание события
export const trackEvent = (category, action, label, value = null) => {
  if (!isAnalyticsEnabled()) return;

  // Для GA4
  GA4.trackEvent(category, action, label, value);

  // Для Mixpanel (преобразуем формат)
  const eventName = `${category}_${action}`;
  Mixpanel.trackEvent(eventName, {
    label: label,
    value: value,
    category: category,
    action: action,
  });
};

// Отслеживание длительности
export const trackTiming = (category, variable, duration, label) => {
  if (!isAnalyticsEnabled()) return;

  GA4.timingEvent(category, variable, duration, label);
  // Для Mixpanel нет прямого эквивалента, но можно отправить как событие
  Mixpanel.trackEvent('timing', {
    category: category,
    variable: variable,
    duration: duration,
    label: label,
  });
};

// Начало отслеживания времени
export const startTimingEvent = (eventName) => {
  if (!isAnalyticsEnabled()) return;

  // Сохраняем время начала в localStorage
  localStorage.setItem(`timing_${eventName}`, Date.now().toString());

  // Для Mixpanel можно использовать встроенную функцию
  Mixpanel.timeEvent(eventName);
};

// Завершение отслеживания времени
export const endTimingEvent = (category, variable, label) => {
  if (!isAnalyticsEnabled()) return;

  const eventKey = `timing_${category}_${variable}`;
  const startTime = localStorage.getItem(eventKey);

  if (startTime) {
    const duration = Date.now() - parseInt(startTime, 10);
    trackTiming(category, variable, duration, label);
    localStorage.removeItem(eventKey);
  }

  // Для Mixpanel событие завершится при следующем track с тем же именем
  Mixpanel.trackEvent(`${category}_${variable}`, {
    label: label,
    category: category,
  });
};

// Обновление пользовательских свойств (например, смена темы)
export const updateUserProperty = (property, value) => {
  if (!isAnalyticsEnabled()) return;

  const properties = {
    [property]: value,
  };

  GA4.setUserProperties(properties);
  Mixpanel.setUserProperties(properties);
};

// Вспомогательные функции
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else {
    browserName = "Unknown";
  }

  return browserName;
};

const getOSInfo = () => {
  const userAgent = navigator.userAgent;
  let os;

  if (userAgent.indexOf("Win") !== -1) os = "Windows";
  else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
  else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
  else if (userAgent.indexOf("Android") !== -1) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";
  else os = "Unknown";

  return os;
};

// Функция для тестовой отправки всех типов событий
export const testAnalytics = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.log('=== STARTING ANALYTICS TEST ===');

  // Тест инициализации
  initAnalytics();

  // Тест PageView
  trackPageView('/test-page', 'Test Page');

  // Тест базовых событий
  trackEvent(EVENT_CATEGORIES.UI_INTERACTION, EVENT_ACTIONS.BUTTON_CLICK, 'test_button');
  trackEvent(EVENT_CATEGORIES.NAVIGATION, EVENT_ACTIONS.COMPANY_SELECT, 'test_company');
  trackEvent(EVENT_CATEGORIES.CONTENT_VIEW, 'test_view', 'test_content');

  // Тест пользовательских свойств
  updateUserProperty(USER_PROPERTIES.THEME, 'test_theme');

  // Тест времени
  startTimingEvent('test_timing');
  setTimeout(() => {
    endTimingEvent(EVENT_CATEGORIES.ENGAGEMENT, 'test_timing', 'test_duration');
  }, 1000);

  // Тест пути пользователя
  addToUserPath({ action: 'test_step_1', location: '/test-page/step-1' });
  setTimeout(() => {
    addToUserPath({ action: 'test_step_2', location: '/test-page/step-2' });
  }, 500);
  setTimeout(() => {
    sendUserPathOnExit();
  }, 1500);

  console.log('=== ANALYTICS TEST COMPLETE ===');
};