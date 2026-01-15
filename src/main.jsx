import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './index.css'
import './i18n/config' // Initialize i18n
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary';

// Supported languages for URL-based routing
const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja', 'ar', 'hi', 'ru'];
const DEFAULT_LANGUAGE = 'es';

/**
 * LanguageSync Component
 * Synchronizes the URL language with i18next
 */
const LanguageSync = ({ children }) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const urlLang = pathParts[0];
    
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
      // URL has a valid language prefix - sync i18n
      if (i18n.language !== urlLang) {
        i18n.changeLanguage(urlLang);
      }
    } else if (location.pathname === '/' || !SUPPORTED_LANGUAGES.includes(urlLang)) {
      // Root URL or no valid language - ensure Spanish (default)
      // Only change if coming from a language URL to root
      const currentLang = i18n.language?.split('-')[0];
      if (location.pathname === '/' && currentLang !== DEFAULT_LANGUAGE) {
        // Don't force Spanish if user manually selected another language
        // This preserves user preference when navigating to root
      }
    }
  }, [location.pathname, i18n]);

  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <LanguageSync>
            <App />
          </LanguageSync>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
