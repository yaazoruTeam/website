// src/i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import heTranslation from './locales/he/translation.json';

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation
    },
    he: {
      translation: heTranslation
    }
  },
  lng: 'he', // ברירת מחדל (למשל עברית)
  fallbackLng: 'en', // שפה חלופין אם אין תרגום
  interpolation: {
    escapeValue: false // לא צריך להימנע מ-HTML
  }
});

export default i18next;
