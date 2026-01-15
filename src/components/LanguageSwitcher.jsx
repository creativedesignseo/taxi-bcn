import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ];

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

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Get only the first 2 characters of the language code (e.g., 'es' from 'es-419')
    const currentLangCode = i18n.language ? i18n.language.split('-')[0] : 'es';
    const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Minimalist Globe Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white hover:text-yellow-400 transition-all duration-200 focus:outline-none group"
                aria-label="Change language"
            >
                <Globe 
                    size={20} 
                    className="opacity-80 group-hover:opacity-100 transition-opacity" 
                    strokeWidth={1.5}
                />
                <span className="text-sm font-medium uppercase tracking-wide">{currentLang.code}</span>
            </button>

            {/* Dropdown with Rounded Flags */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[180px] max-h-[320px] overflow-y-auto border border-gray-100 animate-fade-in">
                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-all duration-150 flex items-center gap-3 ${
                                    currentLangCode === lang.code 
                                        ? 'bg-yellow-100 font-semibold text-black' 
                                        : 'text-gray-700'
                                }`}
                            >
                                {/* Rounded Flag Container */}
                                <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-lg overflow-hidden shadow-sm border border-gray-200">
                                    {lang.flag}
                                </span>
                                <span className="text-sm">{lang.name}</span>
                                {currentLangCode === lang.code && (
                                    <span className="ml-auto text-yellow-500">✓</span>
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
