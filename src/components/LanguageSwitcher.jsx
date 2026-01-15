import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

// Supported languages - must match main.jsx
const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja', 'ar', 'hi', 'ru'];
const DEFAULT_LANGUAGE = 'es';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Languages with SVG flag URLs (using Wise's CDN for circular flags)
    const languages = [
        { code: 'es', name: 'Español', flagCode: 'es' },
        { code: 'en', name: 'English', flagCode: 'gb' },
        { code: 'de', name: 'Deutsch', flagCode: 'de' },
        { code: 'fr', name: 'Français', flagCode: 'fr' },
        { code: 'pt', name: 'Português', flagCode: 'pt' },
        { code: 'zh', name: '中文', flagCode: 'cn' },
        { code: 'ja', name: '日本語', flagCode: 'jp' },
        { code: 'ar', name: 'العربية', flagCode: 'sa' },
        { code: 'hi', name: 'हिन्दी', flagCode: 'in' },
        { code: 'ru', name: 'Русский', flagCode: 'ru' },
    ];

    // Generate flag URL (using Wise's CDN for high-quality circular flags)
    const getFlagUrl = (flagCode) => `https://wise.com/web-art/assets/flags/${flagCode}.svg`;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Get current path without language prefix
     */
    const getPathWithoutLang = () => {
        const path = location.pathname;
        // Remove language prefix if present
        const langRegex = new RegExp(`^/(${SUPPORTED_LANGUAGES.join('|')})`);
        return path.replace(langRegex, '') || '/';
    };

    /**
     * Build URL for a specific language
     */
    const buildLanguageUrl = (langCode) => {
        const pathWithoutLang = getPathWithoutLang();
        
        // Spanish is default - no prefix needed
        if (langCode === DEFAULT_LANGUAGE) {
            return pathWithoutLang;
        }
        
        // Other languages get prefix
        if (pathWithoutLang === '/') {
            return `/${langCode}`;
        }
        return `/${langCode}${pathWithoutLang}`;
    };

    const changeLanguage = (langCode) => {
        // Change i18n language
        i18n.changeLanguage(langCode);
        
        // Navigate to new URL with language prefix
        const newUrl = buildLanguageUrl(langCode);
        navigate(newUrl);
        
        setIsOpen(false);
    };

    // Get only the first 2 characters of the language code (e.g., 'es' from 'es-419')
    const currentLangCode = i18n.language ? i18n.language.split('-')[0] : 'es';
    const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Large Round SVG Flag Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-yellow-400 transition-all duration-200 focus:outline-none shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                aria-label="Change language"
            >
                <img 
                    src={getFlagUrl(currentLang.flagCode)} 
                    alt={currentLang.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                />
            </button>

            {/* Dropdown with SVG Flags */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[200px] max-h-[350px] overflow-y-auto border border-gray-100">
                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full px-4 py-3 text-left hover:bg-yellow-50 transition-all duration-150 flex items-center gap-3 ${
                                    currentLangCode === lang.code 
                                        ? 'bg-yellow-100 font-semibold text-black' 
                                        : 'text-gray-700'
                                }`}
                            >
                                {/* Round SVG Flag */}
                                <img 
                                    src={getFlagUrl(lang.flagCode)} 
                                    alt={lang.name}
                                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
                                    loading="lazy"
                                />
                                <span className="text-sm font-medium">{lang.name}</span>
                                {currentLangCode === lang.code && (
                                    <span className="ml-auto text-yellow-500 text-lg">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
