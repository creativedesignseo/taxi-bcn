import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LegalNotice, PrivacyPolicy, CookiesPolicy } from './pages/LegalPages';
import { Helmet } from 'react-helmet-async';
import { Phone, MessageCircle, Menu, X } from 'lucide-react';
import LanguageSwitcher from './components/LanguageSwitcher';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';

// MobileLink component extracted to avoid re-creation on every render
const MobileLink = ({ href, children, onClick }) => {
  return (
    <a href={href} onClick={(e) => { e.preventDefault(); onClick(href); }} className="text-2xl font-bold text-white border-b border-gray-800 pb-4">
      {children}
    </a>
  );
};
// MobileLink component extracted to avoid re-creation on every render
import BookingPage from './pages/BookingPage'; // [NEW]
import ToursPage from './pages/ToursPage';

// Supported languages list (matches other files)
const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja', 'ar', 'hi', 'ru'];

const App = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Número de la empresa (con prefijo internacional para llamadas)
  const PHONE_NUMBER = "+34625030000";
  const PHONE_DISPLAY = "+34 625 03 00 00";

  // Efecto para la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función inteligente para realizar reservas por WhatsApp
  const handleWhatsAppBooking = (e, customMsg = null) => {
    if (e && e.preventDefault) e.preventDefault();

    let text = '';
    if (customMsg) {
      text = encodeURIComponent(customMsg);
    } else {
      text = encodeURIComponent(t('whatsapp.defaultMessage', "Hola, quiero pedir un taxi. Necesito más información."));
    }

    // Google Tag Manager Event Tracking
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'whatsapp_booking',
        'service_message': customMsg || 'Generic Request',
        'language': i18n.language
      });
    }

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    if (location.state?.scrollTo) return; // Let the specific scroller handle it if state is passed
    window.scrollTo(0, 0);
  }, [location.pathname, location.state?.scrollTo]);

  const handleNavClick = (sectionId) => {
    // Determine target path based on current language
    const currentLang = i18n.language.split('-')[0];
    const isDefaultLang = currentLang === 'es' || !SUPPORTED_LANGUAGES.includes(currentLang);
    const basePath = isDefaultLang ? '/' : `/${currentLang}`;

    // If not on home page (of the current language), navigate there
    if (location.pathname !== basePath && location.pathname !== basePath + '/') {
      navigate(basePath);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileLinkClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      handleNavClick(href.substring(1));
    } else {
      // Modify href to include language prefix if needed, but for now simple navigation
      navigate(href);
    }
  };

  // Route Definitions to generate paths efficiently
  const routeDefs = [
    { path: "", element: <HomePage /> }, // Index
    { path: "reservar", element: <BookingPage /> },
    { path: "tours", element: <ToursPage /> },
    { 
      path: "aviso-legal", 
      element: (
        <>
          <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
          <LegalNotice />
        </>
      ) 
    },
    { 
      path: "privacidad", 
      element: (
        <>
          <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
          <PrivacyPolicy />
        </>
      ) 
    },
    { 
      path: "cookies", 
      element: (
        <>
          <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
          <CookiesPolicy />
        </>
      ) 
    }
  ];

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-yellow-400 selection:text-black">
      
      {/* Navigation - Hidden on Booking Page (check path ending) */}
      {!location.pathname.endsWith('/reservar') && (
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleNavClick('top')}>
            <img
              src="/img/logo-final.svg"
              alt="Taxi Movit Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('top')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.home')}</button>
            <button onClick={() => handleNavClick('servicios')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.services')}</button>
            <button onClick={() => handleNavClick('tarifas')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.rates')}</button>
            {/* DISABLED: Tours section temporarily hidden
            <button onClick={() => navigate('/tours')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.tours', 'Tours')}</button>
            */}
            <LanguageSwitcher />
            <button
              onClick={handleCall}
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Phone size={18} />
              {PHONE_DISPLAY}
            </button>
          </div>

          {/* Mobile: Language + Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden">
          <MobileLink href="#top" onClick={handleMobileLinkClick}>{t('nav.home')}</MobileLink>
          <MobileLink href="#servicios" onClick={handleMobileLinkClick}>{t('nav.services')}</MobileLink>
          <MobileLink href="#tarifas" onClick={handleMobileLinkClick}>{t('nav.rates')}</MobileLink>
          {/* DISABLED: Tours section temporarily hidden
          <MobileLink href="/tours" onClick={handleMobileLinkClick}>{t('nav.tours', 'Tours')}</MobileLink>
          */}

          {/* Language Switcher for Mobile */}
          <div className="border-b border-gray-800 pb-4">
            <LanguageSwitcher />
          </div>

          <button onClick={handleCall} className="mt-4 w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
            <Phone /> {t('hero.ctaCall')}
          </button>
        </div>
      )}

      <Routes>
        {/* Generate Default Routes (No prefix) */}
        {routeDefs.map((route, index) => (
          <Route 
            key={`default-${index}`} 
            path={`/${route.path}`} 
            element={route.element} 
          />
        ))}

        {/* Generate Language Prefixed Routes */}
        {SUPPORTED_LANGUAGES.map(lang => (
          routeDefs.map((route, index) => (
            <Route 
              key={`${lang}-${index}`} 
              path={`/${lang}/${route.path}`} 
              element={route.element} 
            />
          ))
        ))}
      </Routes>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-12 border-t border-gray-800 relative z-50">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img
                src="/img/logo-final.svg"
                alt="Taxi Movit"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-500 max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors" onClick={handleCall}>{PHONE_DISPLAY}</li>
              <li>{t('footer.email')}</li>
              <li>{t('footer.location')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li onClick={() => navigate(`/${i18n.language === 'es' ? '' : i18n.language + '/'}aviso-legal`.replace('//', '/'))} className="hover:text-white cursor-pointer">{t('footer.legalNotice')}</li>
              <li onClick={() => navigate(`/${i18n.language === 'es' ? '' : i18n.language + '/'}privacidad`.replace('//', '/'))} className="hover:text-white cursor-pointer">{t('footer.privacy')}</li>
              <li onClick={() => navigate(`/${i18n.language === 'es' ? '' : i18n.language + '/'}cookies`.replace('//', '/'))} className="hover:text-white cursor-pointer">{t('footer.cookies')}</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </footer>

      {/* --- STICKY MOBILE ACTION BAR --- */}
      {location.pathname !== '/reservar' && (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden flex gap-3">
        <button
          onClick={handleCall}
          className="flex-1 bg-black text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 border border-gray-800"
        >
          <Phone size={20} /> {t('mobile.call')}
        </button>
        <button
          onClick={handleWhatsAppBooking}
          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> {t('mobile.whatsapp')}
        </button>
      </div>
      )}

      <CookieConsent />
    </div >
  );
};

export default App;
