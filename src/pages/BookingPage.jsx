import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { countries } from '../lib/countries';
import RouteMap from '../components/RouteMap';
import { Helmet } from 'react-helmet-async';

export default function BookingPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [defaultPrefix, setDefaultPrefix] = useState('+34');
  
  // Retrieve passed state (booking details)
  const bookingData = location.state?.bookingData;
  const routeGeometry = location.state?.routeGeometry;
  const originCoords = location.state?.originCoords;
  const destCoords = location.state?.destCoords;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Redirect if no data (user accessed /reservar directly)
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  // Auto-detect Country
  useEffect(() => {
    const browserLocale = navigator.language || 'es-ES';
    const region = browserLocale.split('-')[1];
    if (region) {
      const found = countries.find(c => c.code === region.toUpperCase());
      if (found) {
        setDefaultPrefix(found.dial_code);
        setValue('prefix', found.dial_code);
      }
    }
  }, [setValue]);

  const onSubmit = (userData) => {
    console.log("Form Submitted", userData);
    const fullPhone = `${userData.prefix || defaultPrefix} ${userData.phone}`;
    const finalUserData = { ...userData, phone: fullPhone.trim() };

    try {
        const whatsappLink = generateWhatsAppLink(bookingData, finalUserData);
        console.log("WhatsApp Link:", whatsappLink);
        window.open(whatsappLink, '_blank');
    } catch (e) {
        console.error("Error generating WhatsApp link:", e);
    }
  };

  const onError = (errors) => {
    console.log("Form Errors:", errors);
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Helmet>
        <title>{t('seo.bookingTitle', 'Confirmar Reserva - Taxi Movit')}</title>
      </Helmet>

      {/* --- LEFT COLUMN (Desktop) / BOTTOM (Mobile): FORM --- */}
      <div className="order-2 md:order-1 w-full md:w-1/2 lg:w-5/12 p-6 md:p-12 overflow-y-auto h-[60vh] md:h-screen flex flex-col relative z-[100] bg-white -mt-6 md:mt-0 rounded-t-3xl md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">
        
        {/* Back Button */}
        <button 
          type="button"
          onClick={() => {
            console.log("Back clicked");
            navigate(-1);
          }} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mb-6 cursor-pointer relative z-50"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('booking.modal.title', 'Confirmar Reserva')}</h1>
        <p className="text-gray-500 mb-8">{t('booking.modal.guestInfo', 'Revisa tu viaje y completa tus datos')}</p>

        {/* Route Summary Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 transition-all hover:bg-gray-100/80">
          <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-gray-300 ml-2">
            
            {/* Origin */}
            <div className="relative">
               <div className="absolute -left-[31px] top-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('booking.modal.from', 'RECOGIDA')}</p>
               <p className="text-gray-900 font-semibold leading-tight">{bookingData.origin.address}</p>
            </div>

            {/* Destination */}
            <div className="relative">
               <div className="absolute -left-[31px] top-1 w-4 h-4 bg-black rounded-full border-2 border-white shadow-sm"></div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('booking.modal.to', 'DESTINO')}</p>
               <p className="text-gray-900 font-semibold leading-tight">{bookingData.destination.address}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
             <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Clock className="text-yellow-500" size={18} />
                <span>{bookingData.date} - {bookingData.time}</span>
             </div>
             <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
               {bookingData.passengers} Pax • {bookingData.luggage} Maletas
             </span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('booking.modal.name', 'Nombre Completo')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  {...register('name', { required: true, minLength: 2 })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl text-gray-900 font-medium outline-none transition-all placeholder-gray-400"
                  placeholder={t('booking.modal.namePlaceholder', 'Tu nombre')}
                />
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('booking.modal.phone', 'Teléfono de Contacto')}
              </label>
              <div className="flex gap-3">
                 <div className="relative w-[110px]">
                    <select
                      {...register('prefix')}
                      className="w-full h-full pl-4 pr-8 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl font-medium appearance-none outline-none cursor-pointer"
                      defaultValue={defaultPrefix}
                    >
                       {countries.map((c) => (
                         <option key={c.code} value={c.dial_code}>{c.flag} {c.dial_code}</option>
                       ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                 </div>
                 <input
                    type="tel"
                    {...register('phone', { required: true, pattern: /^[0-9]{6,15}$/ })}
                    className="flex-1 px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl text-gray-900 font-medium outline-none transition-all placeholder-gray-400"
                    placeholder="612 34 56 78"
                 />
              </div>
           </div>
           
           <button
             type="submit"
             className="w-full bg-black text-white font-bold text-lg py-5 rounded-xl shadow-2xl shadow-gray-400/50 hover:bg-gray-900 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
           >
             <span>{t('booking.modal.bookWhatsApp', 'Confirmar Reserva')}</span>
             <CheckCircle className="text-yellow-400" size={24} />
           </button>
           
           <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
             Al confirmar, serás redirigido a WhatsApp para finalizar la gestión con uno de nuestros operadores.
           </p>
        </form>
      </div>

      {/* --- RIGHT COLUMN (Desktop) / TOP (Mobile): MAP --- */}
      <div className="order-1 md:order-2 w-full md:w-1/2 lg:w-7/12 h-[45vh] md:h-screen sticky top-0 md:relative">
         <div className="w-full h-full relative">
            {/* The Map */}
            <RouteMap 
               originCoords={originCoords} 
               destCoords={destCoords} 
               routeGeometry={routeGeometry} 
            />
            
            {/* Gradient Overlay for Mobile Bottom Blend */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent md:hidden pointer-events-none z-10"></div>
         </div>
      </div>

    </div>
  );
}
