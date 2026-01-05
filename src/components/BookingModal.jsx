import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Clock, Euro, Phone, User, Mail } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/whatsapp';

export default function BookingModal({ isOpen, onClose, bookingData }) {
  const { t } = useTranslation();
  const [isGuest, setIsGuest] = useState(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = (userData) => {
    const whatsappLink = generateWhatsAppLink(bookingData, userData);
    window.open(whatsappLink, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('booking.modal.title', 'Confirmar Reserva')}
          </h2>

          {/* Route Summary */}
          <div className="space-y-3 bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400">{t('booking.modal.from', 'Recogida')}</p>
                <p className="text-white font-medium">{bookingData.origin.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400">{t('booking.modal.to', 'Destino')}</p>
                <p className="text-white font-medium">{bookingData.destination.address}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400" size={16} />
                <span className="text-white text-sm font-medium">
                  {bookingData.date} - {bookingData.time}
                </span>
                <span className="text-gray-400 text-xs ml-1">({bookingData.timeEstimate} min)</span>
              </div>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-700 text-sm">
               <span className="text-gray-300">
                 {bookingData.transferType === 'oneWay' ? t('booking.form.oneWay') : t('booking.form.roundTrip')}
               </span>
               <span className="text-gray-300">
                 {bookingData.passengers} pax, {bookingData.luggage} bags
               </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Toggle Guest/Login */}
          {isGuest ? (
            <div>
              <p className="text-gray-300 mb-4 text-sm">
                {t('booking.modal.guestInfo', 'Completa tus datos para continuar')}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="inline mr-2" size={16} />
                    {t('booking.modal.name', 'Nombre')}
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: t('booking.modal.nameRequired', 'El nombre es obligatorio'),
                      minLength: { 
                        value: 2, 
                        message: t('booking.modal.nameMin', 'Mínimo 2 caracteres') 
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder={t('booking.modal.namePlaceholder', 'Tu nombre completo')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="inline mr-2" size={16} />
                    {t('booking.modal.phone', 'Teléfono')}
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: t('booking.modal.phoneRequired', 'El teléfono es obligatorio'),
                      pattern: {
                        value: /^(\+34|0034|34)?[6789]\d{8}$/,
                        message: t('booking.modal.phoneInvalid', 'Teléfono inválido (ej: 612345678)')
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder={t('booking.modal.phonePlaceholder', '612345678')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02]"
                >
                  {t('booking.modal.bookWhatsApp', 'Enviar por WhatsApp')}
                </button>

                {/* Login Link */}
                <button
                  type="button"
                  onClick={() => setIsGuest(false)}
                  className="w-full text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {t('booking.modal.haveAccount', '¿Ya tienes cuenta? Iniciar sesión')}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">
                {t('booking.modal.loginComingSoon', 'Inicio de sesión próximamente')}
              </p>
              <button
                onClick={() => setIsGuest(true)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {t('booking.modal.backToGuest', '← Volver a reserva de invitado')}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
