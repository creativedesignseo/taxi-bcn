import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';

i18n
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es },
            de: { translation: de },
            fr: { translation: fr },
            pt: { translation: pt },
            zh: { translation: zh },
            ja: { translation: ja },
            ar: { translation: ar },
            hi: { translation: hi },
            ru: { translation: ru }
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
