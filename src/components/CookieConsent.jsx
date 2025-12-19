import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar si ya aceptó las cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Si no ha aceptado, mostramos el aviso tras un pequeño retardo
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        // Guardar consentimiento
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-gray-800 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50 animate-fade-in-up">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-300 text-sm text-center md:text-left">
                    {t('cookiesBanner.message')}{' '}
                    <Link to="/cookies" className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2">
                        {t('cookiesBanner.link')}
                    </Link>
                </div>
                <button
                    onClick={handleAccept}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded-lg transition-colors shadow-lg whitespace-nowrap text-sm"
                >
                    {t('cookiesBanner.accept')}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
