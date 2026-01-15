import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://taximovit.com';
const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja', 'ar', 'hi', 'ru'];
const DEFAULT_LANGUAGE = 'es';

// Pages that exist for all languages
const PAGES = [
    '', // Home
    'reservar',
    // 'tours' is currently disabled in App.jsx, so we exclude it
    'aviso-legal',
    'privacidad',
    'cookies'
];

const generateSitemap = () => {
    let urls = [];
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    SUPPORTED_LANGUAGES.forEach(lang => {
        PAGES.forEach(page => {
            let urlPath = '';

            if (lang === DEFAULT_LANGUAGE) {
                // Default language (es) has no prefix
                urlPath = page ? `/${page}` : '/';
            } else {
                // Other languages have prefix
                urlPath = page ? `/${lang}/${page}` : `/${lang}`;
            }

            // Ensure no double slashes if I messed up logic
            const fullUrl = `${DOMAIN}${urlPath}`.replace(/([^:]\/)\/+/g, "$1");
            
            urls.push(`
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${page === '' || page === 'reservar' ? 'daily' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : (page === 'reservar' ? '0.9' : '0.5')}</priority>
  </url>`);
        });
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
    
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`✅ Sitemap generated at ${outputPath} with ${urls.length} URLs.`);
};

generateSitemap();
