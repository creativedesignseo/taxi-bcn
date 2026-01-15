import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, ChevronRight, ChevronLeft, Zap, Star } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import FAQ from '../components/FAQ';
import PaymentMethods from '../components/PaymentMethods';
import SEO from '../components/SEO';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Consolidate functionality from App.jsx
  const PHONE_NUMBER = "+34625030000";
  const PHONE_DISPLAY = "+34 625 03 00 00";

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

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        lang={i18n.language}
      />
      {/* --- HERO SECTION --- */}
      <header className="relative md:min-h-screen flex items-start pt-20 pb-24 md:py-0 md:pt-40 justify-center overflow-hidden bg-black">
        {/* Background Images with Effects */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Image */}
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/img/Mobile_hero_2.webp')" }}></div>
          {/* Desktop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ backgroundImage: "url('/img/Desktop_hero_4.webp')" }}
          ></div>

          {/* Overlay for Harmony */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Subtle Glows (kept for premium feel) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[150px]"></div>
        </div>


        <div className="container mx-auto px-4 z-10 relative mt-0 md:mt-0">
          <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-center">

            {/* Text Content */}
            <div className="space-y-3 md:space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-sm font-semibold animate-fade-in-up">
                <Zap size={14} className="fill-yellow-400" />
                {t('hero.badge')}
              </div>

              {/* Phone Number Display for Desktop & Mobile */}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="block text-2xl md:text-4xl font-black text-white hover:text-yellow-400 transition-colors tracking-tighter"
              >
                {PHONE_DISPLAY}
              </a>
              <h1 className="mb-0 md:mb-auto text-4xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                {/* Mobile: SEO keyword */}
                <span className="md:hidden">
                  Taxi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Barcelona</span>
                </span>
                {/* Desktop: full text */}
                <span className="hidden md:block">
                  Taxi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Barcelona</span>
                </span>
              </h1>
              <p className="hidden md:block text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                {t('hero.subtitle')}
              </p>

              <div className="hidden md:flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
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

            {/* Booking Form - Right Column */}
            <div className="pb-4 md:pb-8">
               <BookingForm />
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
      <section id="servicios" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('services.title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: t('services.airport.title'),
                desc: t('services.airport.desc'),
                img: "/img/Cluster 1-1 aereo.webp",
                tag: t('services.airport.tag')
              },
              {
                title: t('services.port.title'),
                desc: t('services.port.desc'),
                img: "/img/Puerto-2.webp",
                tag: t('services.port.tag')
              },
              {
                title: t('services.fira.title'),
                desc: t('services.fira.desc'),
                img: "/img/Fira.webp",
                tag: t('services.fira.tag')
              },
              {
                title: t('services.cityTour.title'),
                desc: t('services.cityTour.desc'),
                img: "/img/Sagrada-familia-02.webp",
                tag: t('services.cityTour.tag')
              },
              {
                title: t('services.business.title'),
                desc: t('services.business.desc'),
                img: "/img/Hombre_Ejecutivo_en_taxi.webp",
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
      {t('rates.active') !== 'false' && (
        <section id="tarifas" className="py-20 px-4 bg-slate-900 text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 border-b border-gray-800 pb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">{t('rates.title')}</h2>
              <p className="text-gray-400">{t('rates.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
              {[
                {
                  title: t('rates.babySeat'),
                  desc: t('rates.babySeatDesc'),
                  msg: t('rates.babySeatMsg'),
                  img: "/img/Taxi con silla infantil  silla para niños 2.webp"
                },
                {
                  title: t('rates.petFriendly'),
                  desc: t('rates.petFriendlyDesc'),
                  msg: t('rates.petFriendlyMsg'),
                  img: "/img/Animales.webp"
                },
                {
                  title: t('rates.pmr'),
                  desc: t('rates.pmrDesc'),
                  msg: t('rates.pmrMsg'),
                  img: "/img/Persona con movilidad reducida (PMR).webp"
                },
                {
                  title: t('rates.bigLuggage'),
                  desc: t('rates.bigLuggageDesc'),
                  msg: t('rates.bigLuggageMsg'),
                  img: "/img/coches con maletero grandes.webp"
                },
              ].map((service, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-2xl border border-white/5 hover:border-yellow-400/50 transition-all group overflow-hidden flex flex-col">
                  <div className="h-44 overflow-hidden relative">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-yellow-400 text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Oficial</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg mb-2 text-white leading-tight">{service.title}</h4>
                    <p className="text-gray-400 text-xs mb-4 flex-grow line-clamp-2">
                      {service.desc}
                    </p>
                    <button
                      onClick={(e) => handleWhatsAppBooking(e, service.msg)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1 text-[13px]"
                    >
                      {t('rates.consultRate')} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- REVIEWS / SOCIAL PROOF --- */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              {t('testimonials.subtitle')}
            </p>
            <div className="flex justify-center items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={28} />
              ))}
              <span className="ml-3 text-gray-900 text-xl font-semibold">5.0</span>
              <span className="text-gray-500 ml-2">({t('testimonials.reviews', { returnObjects: true }).length} {t('testimonials.reviews_count')})</span>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.querySelector('.testimonials-scroll');
                container.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-yellow-400 text-gray-800 hover:text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.querySelector('.testimonials-scroll');
                container.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-yellow-400 text-gray-800 hover:text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div className="testimonials-scroll overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
              <div className="flex gap-6 px-4">
                {t('testimonials.reviews', { returnObjects: true }).map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-400 h-full">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 text-base leading-relaxed mb-6 italic min-h-[100px]">
                        {testimonial.text}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Hint for Mobile */}
            <div className="text-center mt-6 md:hidden">
              <p className="text-gray-400 text-sm">← Desliza para ver más →</p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              ✓ {t('testimonials.verified')}
            </p>
          </div>
        </div>
      </section>

      <FAQ />
      <PaymentMethods />
    </>
  );
};

export default HomePage;
