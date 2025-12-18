import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

i18n
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es }
        },
        fallbackLng: 'es', // Default language is Spanish
        detection: {
            order: ['path', 'localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false // React already escapes
        }
    });

export default i18n;
