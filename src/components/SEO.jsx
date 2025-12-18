import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, lang }) => {
    return (
        <Helmet>
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />

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
