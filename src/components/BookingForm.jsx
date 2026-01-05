import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Navigation, Loader2, Locate, ArrowRight, Calendar, Users, Briefcase } from 'lucide-react';
import { getPlaceSuggestions, getRouteData, reverseGeocode } from '../lib/mapbox';
import { getCurrentLocation } from '../lib/whatsapp';
import BookingModal from './BookingModal';
import CustomDatePicker from './CustomDatePicker';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const BookingForm = () => {
  const { t } = useTranslation();
  
  // State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // 'origin' | 'destination'
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // New state for calendar visibility
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [tick, setTick] = useState(0); // Force re-render for time slots

  // New Fields State (Moved up to avoid ReferenceError)
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [time, setTime] = useState(''); // Will be set by effect
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [transferType, setTransferType] = useState('oneWay'); 

  // Generate 30-minute time slots (Static list)
  const allTimeSlots = React.useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0');
        slots.push(`${hour}:00`);
        slots.push(`${hour}:30`);
    }
    return slots;
  }, []);

  // Filter slots based on selected date
  const getAvailableTimeSlots = useCallback(() => {
    const today = new Date();
    // Use local date string (YYYY-MM-DD) instead of UTC
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    // If selected date is today, filter past times
    if (date === todayStr) {
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();
      
      // Add a small buffer (e.g. 15 mins) so user doesn't book a taxi for "1 min ago" or "right now" which is impossible
      const bufferMinutes = 15; 
      
      return allTimeSlots.filter(slot => {
        const [slotHour, slotMin] = slot.split(':').map(Number);
        const slotTimeInMinutes = slotHour * 60 + slotMin;
        const currentTimeInMinutes = currentHour * 60 + currentMinutes;
        
        return slotTimeInMinutes > (currentTimeInMinutes + bufferMinutes);
      });
    }
    
    // If future date, show all
    return allTimeSlots;
  }, [date, allTimeSlots, tick]);

  const availableSlots = getAvailableTimeSlots();

  useEffect(() => {
    const slots = getAvailableTimeSlots();
    if (slots.length > 0 && !slots.includes(time)) {
       // If current selected time is invalid (e.g. in the past), snap to the first available
       setTime(slots[0]);
    }
  }, [date, getAvailableTimeSlots]); // We don't include 'time' to avoid loops

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (activeInput === 'origin' && origin.length > 2) {
        const results = await getPlaceSuggestions(origin);
        setSuggestions(results);
      } else if (activeInput === 'destination' && destination.length > 2) {
        const results = await getPlaceSuggestions(destination);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [origin, destination, activeInput]);

  // Calculate Route when both points are set
  useEffect(() => {
    const calculateRoute = async () => {
      if (originCoords && destCoords) {
        setIsLoadingRoute(true);
        const data = await getRouteData(originCoords, destCoords);
        if (data) {
          setRouteInfo(data);
        }
        setIsLoadingRoute(false);
      }
    };
    calculateRoute();
  }, [originCoords, destCoords]);

  const handleSelectPlace = (feature) => {
    const coords = feature.center; // [lng, lat]
    const placeName = feature.place_name;

    if (activeInput === 'origin') {
      setOrigin(placeName);
      setOriginCoords(coords);
    } else {
      setDestination(placeName);
      setDestCoords(coords);
    }
    setSuggestions([]);
    setActiveInput(null);
  };

  const estimatePrice = (meters) => {
    // Taxi BCN standard rates (approximate logic for demo)
    // Base: 2.55€, Km: 1.23€ (T1)
    const km = meters / 1000;
    const base = 2.55;
    const price = base + (km * 1.30); // 1.30 average/km
    return price < 7 ? 7.00 : price.toFixed(2); // Minimum ~7€
  };

  const handleUseMyLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await getCurrentLocation();
      const { longitude, latitude } = position;
      const coords = [longitude, latitude];
      
      // Reverse geocode to get address using the new dedicated function
      const place = await reverseGeocode(longitude, latitude);
      
      if (place) {
        setOrigin(place.place_name);
        setOriginCoords(coords);
      } else {
         // Fallback if no specific address found
        setOrigin(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setOriginCoords(coords);
      }
      
      // Clear search state to "confirm" the selection and hide dropdown
      setSuggestions([]);
      setActiveInput(null);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('No se pudo obtener tu ubicación. Por favor, verifica los permisos del navegador.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl shadow-2xl border border-gray-800 relative">
      
      {/* FORM PANEL */}
      <div className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Navigation className="text-yellow-400" /> 
          {t('hero.bookingTitle', 'Reserva Express')}
        </h3>

        <div className="space-y-4 flex-grow">
          
          {/* Row 1: Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="relative">
              <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.dateLabel', 'FECHA')}</label>
              
              {/* Trigger Input - LOOKS like an input but toggles the calendar */}
              <div 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4 hover:border-yellow-400 transition-colors cursor-pointer"
              >
                <Calendar className="text-blue-400 mr-3" size={24} />
                <span className="text-white font-bold text-lg">
                  {date.split('-').reverse().join('-')}
                </span>
              </div>

              {/* Custom Date Picker Popover */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 z-50 animate-fadeIn">
                  {/* Backdrop to close when clicking outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)}></div>
                  
                  <div className="relative z-50">
                    <CustomDatePicker 
                      selectedDate={date} 
                      onChange={(newDate) => {
                        setDate(newDate);
                        setShowDatePicker(false);
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Time */}
            <div>
              <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.timeLabel', 'HORA')}</label>
              <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4 relative hover:border-yellow-400 transition-colors">
                <Clock className="text-blue-400 mr-3 z-10" size={24} />
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  onFocus={() => setTick(t => t + 1)} // Refresh slots when user opens menu
                  className="bg-transparent w-full text-white outline-none font-bold text-lg appearance-none relative z-20 cursor-pointer pl-1"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot} className="text-black bg-white py-2">
                      {slot}
                    </option>
                  ))}
                  {availableSlots.length === 0 && (
                     <option disabled>No hours available</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Origin Input */}
          <div className={`relative ${activeInput === 'origin' ? 'z-50' : 'z-20'}`}>
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.pickupLabel', 'RECOGIDA')}</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-all">
                <MapPin className="text-green-400 mr-3" size={20} />
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => setActiveInput('origin')}
                  placeholder={t('booking.form.pickupPlaceholder', '¿Dónde te recogemos?')}
                  className="bg-transparent w-full text-white placeholder-gray-500 outline-none font-medium"
                />
                {origin && <button onClick={() => {setOrigin(''); setOriginCoords(null)}} className="text-gray-500 hover:text-white"><div className="text-xs">✕</div></button>}
              </div>
              
              {/* My Location Button */}
              <button
                onClick={handleUseMyLocation}
                disabled={isLoadingLocation}
                className="flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 hover:bg-gray-700 hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('booking.form.useLocation', 'Usar mi ubicación')}
              >
                {isLoadingLocation ? (
                  <Loader2 className="text-yellow-400 animate-spin" size={20} />
                ) : (
                  <Locate className="text-yellow-400" size={20} />
                )}
              </button>
            </div>
            
            {/* Suggestions Dropdown */}
            {activeInput === 'origin' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-xl mt-2 z-50 shadow-xl max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => handleSelectPlace(s)}
                    className="p-3 hover:bg-gray-800 cursor-pointer text-gray-300 text-sm border-b border-gray-800 last:border-0 flex items-start gap-2"
                  >
                    <MapPin size={14} className="mt-1 flex-shrink-0 text-gray-500" />
                    <span>{s.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 3: Destination Input */}
          <div className={`relative ${activeInput === 'destination' ? 'z-50' : 'z-10'}`}>
             <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.destinationLabel', 'DESTINO')}</label>
            <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-all">
              <MapPin className="text-red-400 mr-3" size={20} />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setActiveInput('destination')}
                placeholder={t('booking.form.destinationPlaceholder', '¿A dónde vas?')}
                className="bg-transparent w-full text-white placeholder-gray-500 outline-none font-medium"
              />
              {destination && <button onClick={() => {setDestination(''); setDestCoords(null)}} className="text-gray-500 hover:text-white"><div className="text-xs">✕</div></button>}
            </div>

            {/* Suggestions Dropdown */}
            {activeInput === 'destination' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-xl mt-2 z-50 shadow-xl max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => handleSelectPlace(s)}
                    className="p-3 hover:bg-gray-800 cursor-pointer text-gray-300 text-sm border-b border-gray-800 last:border-0 flex items-start gap-2"
                  >
                    <MapPin size={14} className="mt-1 flex-shrink-0 text-gray-500" />
                    <span>{s.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 4: Transfer Type */}
          <div>
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.transferTypeLabel', 'TIPO DE TRAYECTO')}</label>
             <div className="grid grid-cols-2 gap-2 bg-gray-800/50 p-1 rounded-xl border border-gray-700">
               <button 
                onClick={() => setTransferType('oneWay')}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${transferType === 'oneWay' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
               >
                 {t('booking.form.oneWay', 'Solo Ida')}
               </button>
               <button 
                onClick={() => setTransferType('roundTrip')}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${transferType === 'roundTrip' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
               >
                 {t('booking.form.roundTrip', 'Ida y Vuelta')}
               </button>
             </div>
          </div>

          {/* Row 5: Passengers & Luggage */}
          <div className="grid grid-cols-2 gap-4">
            {/* Passengers */}
             <div>
              <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.passengersLabel', 'PASAJEROS')}</label>
              <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3">
                 <div className="flex items-center gap-2">
                   <Users className="text-purple-400" size={18} />
                   <span className="text-white font-bold">{passengers}</span>
                 </div>
                 <div className="flex gap-1">
                   <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600">-</button>
                   <button onClick={() => setPassengers(Math.min(8, passengers + 1))} className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600">+</button>
                 </div>
              </div>
            </div>
             {/* Luggage */}
             <div>
              <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">{t('booking.form.luggageLabel', 'MALETAS')}</label>
              <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3">
                 <div className="flex items-center gap-2">
                   <Briefcase className="text-orange-400" size={18} />
                   <span className="text-white font-bold">{luggage}</span>
                 </div>
                 <div className="flex gap-1">
                   <button onClick={() => setLuggage(Math.max(0, luggage - 1))} className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600">-</button>
                   <button onClick={() => setLuggage(Math.min(10, luggage + 1))} className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600">+</button>
                 </div>
              </div>
            </div>
          </div>

          {/* Route Details & Price */}
          {routeInfo && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 animate-fade-in-up">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">{t('booking.form.estimatedTime', 'Tiempo estimado')}</p>
                  <p className="text-2xl font-bold text-white">{~~(routeInfo.durationSeconds / 60)} min</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2 border-t border-gray-700 pt-2">
                {t('booking.form.distance', 'Distancia')}: {(routeInfo.distanceMeters / 1000).toFixed(1)} km
              </p>
            </div>
          )}

          {/* Action Button */}
          <button 
            disabled={!routeInfo}
            onClick={() => setShowModal(true)}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg
              ${routeInfo 
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black hover:scale-[1.02] shadow-yellow-400/20' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            {isLoadingRoute ? <Loader2 className="animate-spin" /> : (
              <>
                {t('booking.form.confirmRoute', 'Confirmar Ruta')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {routeInfo && (
        <BookingModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          bookingData={{
            origin: {
              address: origin,
              coordinates: originCoords
            },
            destination: {
              address: destination,
              coordinates: destCoords
            },
            date,
            time,
            passengers,
            luggage,
            transferType,
            timeEstimate: ~~(routeInfo.durationSeconds / 60),
            priceEstimate: parseFloat(estimatePrice(routeInfo.distanceMeters))
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;
