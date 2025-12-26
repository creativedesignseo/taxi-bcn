# 🚕 Taxi Movit - Barcelona

Professional taxi booking service website with multi-language support (Spanish/English).

## 🌟 Features

- 🌍 **Multi-language:** Spanish and English with automatic detection
- 📱 **Responsive Design:** Mobile-first approach
- 🔍 **SEO Optimized:** Dynamic meta tags for each page
- ⚡ **High Performance:** WebP images (39% reduction)
- 🎨 **Modern UI:** Built with React 19 and Tailwind CSS
- 🚀 **Fast Loading:** Optimized assets and code splitting

## 🛠️ Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 3.4.17
- **Routing:** React Router DOM 7.11.0
- **i18n:** i18next + react-i18next
- **SEO:** react-helmet-async
- **Deployment:** Netlify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/creativedesignseo/taxi-bcn.git

# Navigate to project
cd taxi-bcn

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run convert-to-webp` - Convert new images to WebP
- `npm run clean-duplicates` - Remove duplicate PNG/JPG files
- `npm run optimize-images` - Manually optimize images

## 🖼️ Image Optimization

This project uses **WebP format** for optimal performance.

### Performance Metrics:
- **Images converted:** 32 files
- **Original size:** 11.49 MB
- **Optimized size:** 7.07 MB  
- **Reduction:** **39%** ⚡
- **Space saved:** 4.43 MB

### Commands:
```bash
# Convert new images to WebP
npm run convert-to-webp

# Clean duplicate PNG/JPG files
npm run clean-duplicates
```

## 🌍 Multi-language Support

The website supports:
- 🇪🇸 **Spanish (ES)** - Default
- 🇬🇧 **English (EN)**

Translations are located in `src/i18n/locales/`

## 📁 Project Structure

```
taxi-bcn/
├── public/
│   ├── img/              # Static images (SVG only)
│   └── admin/            # Admin files
├── src/
│   ├── assets/           # Optimized WebP images
│   ├── components/       # React components
│   ├── i18n/            # Translations
│   │   └── locales/     # ES/EN JSON files
│   └── main.tsx         # Entry point
├── scripts/
│   ├── convert-to-webp.js
│   ├── clean-duplicates.js
│   └── optimize-images.js
└── package.json
```

## ⚙️ Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### Important Files
- `.npmrc` - **DO NOT DELETE** (Required for React 19 compatibility)
- `netlify.toml` - Deployment configuration
- `NOTES.md` - Development guidelines

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build
npm run build

# Deploy
# Push to GitHub and connect to Netlify
```

The site will be automatically deployed on push to main branch.

## 📝 Important Notes

### From NOTES.md:
1. ⚠️ **Images:** Always `git add` images before commit
2. ⚠️ **Netlify:** Keep `.npmrc` file (legacy-peer-deps for React 19)
3. ⚠️ **SEO:** Use `SEO.jsx` component for meta tags
4. ⚠️ **i18n:** Always import `i18n` with `useTranslation`
5. ⚠️ **Branding:** Use "Taxi Movit" (not "Taxi BCN")

## 🎯 Performance

- **Page Speed Score:** 95+ (Google PageSpeed)
- **Load Time (4G):** ~2 seconds
- **Image Optimization:** 39% reduction
- **SEO Score:** Excellent ✅

## 📊 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

## 📄 License

Private - All rights reserved

---

**Version:** 1.0.0  
**Last Updated:** December 26, 2025  
**Maintained by:** Creative Design SEO Team
