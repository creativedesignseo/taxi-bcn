import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, lang }) => {
    return (
        <Helmet>
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href="https://taximovit.com" />

            {/* Hreflang for Multilingual SEO */}
            <link rel="alternate" href="https://taximovit.com" hreflang="x-default" />
            <link rel="alternate" href="https://taximovit.com" hreflang="es" />
            <link rel="alternate" href="https://taximovit.com/en" hreflang="en" />

            {/* Open Graph (Facebook/LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content="Taxi Movit BCN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
