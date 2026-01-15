import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja', 'ar', 'hi', 'ru'];
const DOMAIN = 'https://taximovit.com';

const SEO = ({ title, description, lang }) => {
    const location = useLocation();
    
    // Determine current canonical URL
    const getCurrentCanonical = () => {
        // Remove trailing slash and query params for canonical
        let path = location.pathname.endsWith('/') 
            ? location.pathname.slice(0, -1) 
            : location.pathname;
            
        return `${DOMAIN}${path}`;
    };

    return (
        <Helmet>
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />
            
            {/* Canonical URL - self referencing */}
            <link rel="canonical" href={getCurrentCanonical()} />

            {/* Hreflang for Multilingual SEO */}
            <link rel="alternate" href={`${DOMAIN}/`} hreflang="x-default" />
            
            {SUPPORTED_LANGUAGES.map((language) => (
                <link 
                    key={language} 
                    rel="alternate" 
                    href={language === 'es' ? `${DOMAIN}/` : `${DOMAIN}/${language}`} 
                    hreflang={language} 
                />
            ))}

            {/* Open Graph (Facebook/LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Taxi Movit BCN" />
            <meta property="og:url" content={getCurrentCanonical()} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
