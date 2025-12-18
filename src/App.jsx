import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LegalNotice, PrivacyPolicy, CookiesPolicy } from './pages/LegalPages';
import FAQ from './components/FAQ';
import PaymentMethods from './components/PaymentMethods';
import SEO from './components/SEO';
import { Phone, MessageCircle, MapPin, Clock, Shield, Star, Menu, X, ChevronRight, Zap, Globe } from 'lucide-react';
import LanguageSwitcher from './components/LanguageSwitcher';

const App = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // book | rates | fleet

  // Datos del formulario de reserva rápida
  const [bookingData, setBookingData] = useState({
    origin: '',
    destination: '',
    pickupTime: 'Ahora mismo'
  });

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

  // Función inteligente para construir el mensaje de WhatsApp
  const handleWhatsAppBooking = (e) => {
    if (e) e.preventDefault();

    const origin = bookingData.origin || "Mi ubicación actual";
    const dest = bookingData.destination || "A consultar";
    const time = bookingData.pickupTime;

    const text = `Hola, quiero pedir un taxi.%0A🚖 *Origen:* ${origin}%0A📍 *Destino:* ${dest}%0A⏰ *Hora:* ${time}`;

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
  }, [location.pathname]);

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const MobileLink = ({ href, children }) => {
    const isAnchor = href.startsWith('#');
    const handleClick = (e) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (isAnchor) {
        handleNavClick(href.substring(1));
      } else {
        navigate(href);
      }
    };
    return (
      <a href={href} onClick={handleClick} className="text-2xl font-bold text-white border-b border-gray-800 pb-4">
        {children}
      </a>
    );
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-yellow-400 selection:text-black">
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        lang={i18n.language}
      />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/img/logo-final.svg"
              alt="Taxi Movit Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.home')}</button>
            <button onClick={() => handleNavClick('servicios')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.services')}</button>
            <button onClick={() => handleNavClick('tarifas')} className="text-white hover:text-yellow-400 font-medium transition-colors">{t('nav.rates')}</button>
            <LanguageSwitcher />
            <button
              onClick={handleCall}
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Phone size={18} />
              {PHONE_DISPLAY}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden">
          <MobileLink href="#top">{t('nav.home')}</MobileLink>
          <MobileLink href="#servicios">{t('nav.services')}</MobileLink>
          <MobileLink href="#tarifas">{t('nav.rates')}</MobileLink>

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
        <Route path="/" element={<>
          {/* --- HERO SECTION --- */}
          <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Images with Effects */}
            <div className="absolute inset-0 z-0">
              {/* Mobile Image */}
              <div
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{ backgroundImage: "url('/img/Mobile_hero_2.jpg')" }}
              ></div>
              {/* Desktop Image */}
              <div
                className="absolute inset-0 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: "url('/img/Desktop_hero_4.jpg')" }}
              ></div>

              {/* Overlay for Harmony */}
              <div className="absolute inset-0 bg-black/70"></div>

              {/* Subtle Glows (kept for premium feel) */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[150px]"></div>
            </div>


            <div className="container mx-auto px-4 z-10 relative mt-16 md:mt-0">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="space-y-6 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-sm font-semibold animate-fade-in-up">
                    <Zap size={14} className="fill-yellow-400" />
                    {t('hero.badge')}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                    {t('hero.title')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                    {t('hero.subtitle')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                    <button
                      onClick={handleWhatsAppBooking}
                      className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group"
                    >
                      <MessageCircle className="group-hover:scale-110 transition-transform" />
                      {t('hero.ctaWhatsApp')}
                    </button>
                    <button
                      onClick={handleCall}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={20} />
                      {t('hero.ctaCall')}
                    </button>
                  </div>
                </div>

                {/* Fast Booking Card (Simulated App UI) */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent"></div>

                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Clock className="text-yellow-400" /> {t('hero.bookingTitle')}
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder={t('hero.pickupPlaceholder')}
                        className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                        value={bookingData.origin}
                        onChange={(e) => setBookingData({ ...bookingData, origin: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-[1.15rem] -top-4 h-4 w-0.5 bg-gray-700/50"></div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder={t('hero.destinationPlaceholder')}
                        className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                        value={bookingData.destination}
                        onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })}
                      />
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                        <Clock size={16} />
                      </div>
                      <select
                        className="bg-transparent w-full text-white focus:outline-none appearance-none cursor-pointer"
                        value={bookingData.pickupTime}
                        onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
                      >
                        <option className="bg-slate-900 text-white" value="Ahora mismo">{t('hero.timeNow')}</option>
                        <option className="bg-slate-900 text-white" value="En 15 minutos">{t('hero.time15')}</option>
                        <option className="bg-slate-900 text-white" value="En 30 minutos">{t('hero.time30')}</option>
                        <option className="bg-slate-900 text-white" value="Programar más tarde">{t('hero.timeLater')}</option>
                      </select>
                    </div>

                    <button
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl mt-4 transition-all hover:scale-[1.02] flex justify-center items-center gap-2 text-lg shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                    >
                      {t('hero.requestButton')} <ChevronRight size={20} />
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-2">
                      {t('hero.responseTime')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
              <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </header>

          {/* --- SPECIALIZED SERVICES / TOURISM --- */}
          <section className="py-20 px-4 bg-slate-50">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('services.title')}</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  {t('services.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: t('services.airport.title'),
                    desc: t('services.airport.desc'),
                    img: "/img/Aerepuertos.jpg",
                    tag: t('services.airport.tag')
                  },
                  {
                    title: t('services.port.title'),
                    desc: t('services.port.desc'),
                    img: "/img/Puerto-barcelona.jpg",
                    tag: t('services.port.tag')
                  },
                  {
                    title: t('services.cityTour.title'),
                    desc: t('services.cityTour.desc'),
                    img: "/img/Barcelona-cidudad.jpg",
                    tag: t('services.cityTour.tag')
                  },
                  {
                    title: t('services.business.title'),
                    desc: t('services.business.desc'),
                    img: "/img/Hombre_Ejecutivo_en_taxi.jpg",
                    tag: t('services.business.tag')
                  }
                ].map((service, idx) => (
                  <div
                    key={idx}
                    className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10"
                  >
                    {/* Background Image */}
                    <img
                      src={service.img}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full uppercase">
                          {service.tag}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-gray-300 text-sm max-w-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {service.desc}
                      </p>

                      <div className="mt-4 flex items-center text-yellow-400 font-bold text-sm">
                        <button onClick={handleWhatsAppBooking} className="flex items-center gap-2">
                          Reservar Servicio <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- ESTIMATED RATES --- */}
          <section id="tarifas" className="py-20 px-4 bg-slate-900 text-white">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-8 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">{t('rates.title')}</h2>
                  <p className="text-gray-400">{t('rates.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full bg-white text-black font-semibold text-sm">{t('rates.tariff1')}</button>
                  <button className="px-4 py-2 rounded-full border border-gray-700 text-gray-400 font-semibold text-sm">{t('rates.tariff2')}</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { dest: t('rates.airport'), time: "25 min" },
                  { dest: t('rates.port'), time: "15 min" },
                  { dest: t('rates.sants'), time: "12 min" },
                  { dest: t('rates.parkGuell'), time: "20 min" },
                ].map((route, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-yellow-400/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-yellow-400/10 p-2 rounded-lg">
                        <MapPin className="text-yellow-400" size={20} />
                      </div>
                      <span className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-1 rounded">~{route.time}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-4">{route.dest}</h4>
                    <button
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                    >
                      {t('rates.consultRate')} <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- REVIEWS / SOCIAL PROOF --- */}
          <section className="py-20 px-4 bg-white">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={24} />)}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">"{t('testimonials.quote')}"</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src="/img/Cliente.png" alt="User" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">{t('testimonials.name')}</p>
                  <p className="text-sm text-gray-500">{t('testimonials.verified')}</p>
                </div>
              </div>
            </div>
          </section>

          <FAQ />
          <PaymentMethods />
        </>} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
      </Routes>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
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
              <li onClick={() => navigate('/aviso-legal')} className="hover:text-white cursor-pointer">{t('footer.legalNotice')}</li>
              <li onClick={() => navigate('/privacidad')} className="hover:text-white cursor-pointer">{t('footer.privacy')}</li>
              <li onClick={() => navigate('/cookies')} className="hover:text-white cursor-pointer">{t('footer.cookies')}</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </footer>

      {/* --- STICKY MOBILE ACTION BAR --- */}
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

    </div >
  );
};

export default App;
