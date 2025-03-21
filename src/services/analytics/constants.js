// Категории событий
export const EVENT_CATEGORIES = {
    NAVIGATION: 'navigation',
    UI_INTERACTION: 'ui_interaction',
    ENGAGEMENT: 'engagement',
    CONTENT_VIEW: 'content_view',
    USER_PREFERENCE: 'user_preference',
  };
  
  // Действия для событий
  export const EVENT_ACTIONS = {
    // Навигация
    COMPANY_SELECT: 'company_select',
    PROJECT_SELECT: 'project_select',
    MENU_OPEN: 'menu_open',
    MENU_CLOSE: 'menu_close',
    
    // UI взаимодействия
    BUTTON_CLICK: 'button_click',
    TOGGLE: 'toggle_click',
    SCROLL: 'scroll_action',
    EXPAND_COLLAPSE: 'expand_collapse',
    
    // Взаимодействие с контентом
    CARD_VIEW: 'card_view',
    LINK_CLICK: 'link_click',
    CONTACT_OPEN: 'contact_open',
    COPY_TEXT: 'copy_text',
    
    // Пользовательские предпочтения
    THEME_CHANGE: 'theme_change',
  };
  
  // Пользовательские свойства
  export const USER_PROPERTIES = {
    THEME: 'user_theme_preference',
    DEVICE_TYPE: 'device_type',
    VIEWPORT_SIZE: 'viewport_size',
    BROWSER: 'browser',
    OPERATING_SYSTEM: 'operating_system',
  };