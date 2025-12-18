import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Update URL path
        const currentPath = window.location.pathname;
        if (lng === 'es') {
            if (!currentPath.startsWith('/es')) {
                window.history.pushState({}, '', '/es' + currentPath);
            }
        } else {
            window.history.pushState({}, '', currentPath.replace('/es', '') || '/');
        }
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors">
                <Globe size={20} />
                <span className="text-sm font-medium uppercase">{i18n.language}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full px-4 py-2 text-left hover:bg-yellow-400 transition-colors ${i18n.language === 'en' ? 'bg-yellow-100 font-bold' : 'text-gray-700'
                        }`}
                >
                    🇬🇧 English
                </button>
                <button
                    onClick={() => changeLanguage('es')}
                    className={`w-full px-4 py-2 text-left hover:bg-yellow-400 transition-colors ${i18n.language === 'es' ? 'bg-yellow-100 font-bold' : 'text-gray-700'
                        }`}
                >
                    🇪🇸 Español
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
