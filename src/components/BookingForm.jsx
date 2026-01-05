import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Navigation, Loader2, Locate, ArrowRight, Calendar, Users, Briefcase, ChevronDown, X } from 'lucide-react';
import { getPlaceSuggestions, getRouteData, reverseGeocode, getPlaceDetails, generateSessionToken } from '../lib/mapbox';
import { getCurrentLocation } from '../lib/whatsapp';
import CustomDatePicker from './CustomDatePicker';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const BookingForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
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
  const [showScheduleModal, setShowScheduleModal] = useState(false); // Modal for choosing "Now" vs "Later"
  const [bookingType, setBookingType] = useState('now'); // 'now' | 'later'
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [tick, setTick] = useState(0); // Force re-render for time slots
  
  // Mapbox Session Token (Search Box API)
  const [sessionToken] = useState(generateSessionToken());

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
      // Pass sessionToken to suggestion service
      if (activeInput === 'origin' && origin.length > 2) {
        const results = await getPlaceSuggestions(origin, sessionToken);
        setSuggestions(results);
      } else if (activeInput === 'destination' && destination.length > 2) {
        const results = await getPlaceSuggestions(destination, sessionToken);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [origin, destination, activeInput, sessionToken]);

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

  const handleSelectPlace = async (feature) => {
    let coords = null;
    let placeName = feature.place_name;

    // Retrieve details if coordinate is missing (Search Box API flow)
    if (feature.action === 'retrieve') {
      const details = await getPlaceDetails(feature.id, sessionToken);
      if (details) {
        coords = details.center;
        placeName = details.place_name || feature.place_name;
      }
    } else {
      coords = feature.center;
    }

    if (!coords) return; // Error handling

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
    <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 relative">
      
      {/* FORM PANEL */}
      <div className="p-4 md:p-8">
        <h3 className="text-3xl md:text-5xl font-black text-black mb-8 flex items-center gap-2 tracking-tight">
          {t('hero.bookingTitle', 'Viaja a cualquier lugar')}
        </h3>

        <div className="space-y-3 flex-grow">
          
          {/* Schedule Pill */}
          <div className="flex justify-start">
             <button 
               onClick={() => setShowScheduleModal(true)}
               className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-black"
             >
               <Clock size={16} className="text-black" />
               <span>
                 {bookingType === 'now' 
                   ? t('booking.form.pickupNow', 'Recoger ahora') 
                   : `${date.split('-').reverse().join('-')} - ${time}`}
               </span>
               <ChevronDown size={16} className="text-black" />
             </button>
          </div>

          {/* Row 2: Origin Input */}
          <div className={`relative mt-4 ${activeInput === 'origin' ? 'z-50' : 'z-20'}`}>
            <div className="flex gap-2">
              <div className="flex-1 relative group">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                  <label className="text-xs font-bold text-gray-900">{t('booking.form.pickupLabel', 'Ubicación de recogida')}</label>
                </div>
                <div className="flex items-center bg-white border-2 border-gray-200 group-focus-within:border-black rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all">
                  <div className="mr-3 p-1.5 bg-black rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <input 
                    type="text" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    onFocus={() => setActiveInput('origin')}
                    placeholder=""
                    className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none"
                  />
                {origin && <button onClick={() => {setOrigin(''); setOriginCoords(null)}} className="text-gray-500 hover:text-white"><div className="text-xs">✕</div></button>}
                </div>
              </div>
              
              {/* My Location Button */}
              <button
                onClick={handleUseMyLocation}
                disabled={isLoadingLocation}
                className="flex items-center justify-center bg-gray-100 border-2 border-transparent hover:border-black rounded-lg px-3 md:px-4 transition-all disabled:opacity-50"
                title={t('booking.form.useLocation', 'Usar mi ubicación')}
              >
                  {isLoadingLocation ? <Loader2 className="animate-spin text-black" size={24} /> : <Locate className="text-black" size={24} />}
              </button>
            </div>
            
            {/* Suggestions Dropdown */}
            {activeInput === 'origin' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl mt-2 z-50 shadow-xl max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => handleSelectPlace(s)}
                    className="p-3 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm border-b border-gray-100 last:border-0 flex items-start gap-2"
                  >
                    <MapPin size={14} className="mt-1 flex-shrink-0 text-gray-400" />
                    <span>{s.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 3: Destination Input */}
          <div className={`relative mt-4 ${activeInput === 'destination' ? 'z-50' : 'z-10'}`}>
             <div className="relative group">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                   <label className="text-xs font-bold text-gray-900">{t('booking.form.destinationLabel', 'Destino')}</label>
                </div>
                <div className="flex items-center bg-white border-2 border-gray-200 group-focus-within:border-black rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all">
                  <div className="mr-3 p-1.5 bg-black rounded-md">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setActiveInput('destination')}
                    placeholder=""
                    className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none"
                  />
                  {destination && <button onClick={() => {setDestination(''); setDestCoords(null)}} className="text-gray-400 hover:text-black"><div className="text-xs">✕</div></button>}
                </div>
              {destination && <button onClick={() => {setDestination(''); setDestCoords(null)}} className="text-gray-500 hover:text-white"><div className="text-xs">✕</div></button>}
            </div>

            {/* Suggestions Dropdown */}
            {activeInput === 'destination' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl mt-2 z-50 shadow-xl max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => handleSelectPlace(s)}
                    className="p-3 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm border-b border-gray-100 last:border-0 flex items-start gap-2"
                  >
                    <MapPin size={14} className="mt-1 flex-shrink-0 text-gray-400" />
                    <span>{s.place_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 4: Passengers & Luggage (Now Dropdowns) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Passengers */}
             {/* Passengers */}
             <div className="relative group h-[58px]">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                   <label className="text-xs font-bold text-gray-900">{t('booking.form.passengersLabel', 'Pasajeros')}</label>
                </div>
                <div className="flex items-center bg-white border-2 border-gray-200 group-focus-within:border-black hover:border-black rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all h-full">
                   <Users className="text-black mr-2 md:mr-3 z-10 flex-shrink-0" size={20} />
                   <select 
                     value={passengers}
                     onChange={(e) => setPassengers(Number(e.target.value))}
                     className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none appearance-none cursor-pointer"
                   >
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                       <option key={num} value={num} className="text-black bg-white py-2">
                         {num} {num === 1 ? t('booking.form.passenger', 'Pasajero') : t('booking.form.passengers', 'Pasajeros')}
                       </option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-black">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                </div>
             </div>
             {/* Luggage */}
             <div className="relative group h-[58px]">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                   <label className="text-xs font-bold text-gray-900">{t('booking.form.luggageLabel', 'Maletas')}</label>
                </div>
                <div className="flex items-center bg-white border-2 border-gray-200 group-focus-within:border-black hover:border-black rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all h-full">
                   <Briefcase className="text-black mr-2 md:mr-3 z-10 flex-shrink-0" size={20} />
                   <select 
                     value={luggage}
                     onChange={(e) => setLuggage(Number(e.target.value))}
                     className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none appearance-none cursor-pointer"
                   >
                     {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                       <option key={num} value={num} className="text-black bg-white py-2">
                         {num} {num === 1 ? t('booking.form.suitcase', 'Maleta') : t('booking.form.suitcases', 'Maletas')}
                       </option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-black">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                </div>
             </div>
          </div>

          {/* Route Details & Price */}
          {routeInfo && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 animate-fade-in-up">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-bold">{t('booking.form.estimatedTime', 'Tiempo estimado')}</p>
                  <p className="text-2xl font-bold text-gray-900">{~~(routeInfo.durationSeconds / 60)} min</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2 border-t border-gray-200 pt-2">
                {t('booking.form.distance', 'Distancia')}: {(routeInfo.distanceMeters / 1000).toFixed(1)} km
              </p>
            </div>
          )}

          {/* Action Button */}
          <button 
            type="button"
            disabled={!routeInfo}
            onClick={() => {
              if (origin && destination && routeInfo) {
                  // Default to 'now' if not set, or use current date/time
                  const isImmediate = bookingType === 'now';
                  
                  const bookingData = {
                      origin: { address: origin, coordinates: originCoords },
                      destination: { address: destination, coordinates: destCoords },
                      date: isImmediate ? t('hero.timeNow', 'Ahora') : date,
                      time: isImmediate ? 'Inmediato' : time,
                      passengers,
                      luggage,
                      vehicle: passengers > 4 ? 'Minivan' : 'Standard',
                      price: 'Approx',
                      timeEstimate: Math.round(routeInfo.durationSeconds / 60)
                  };
                  
                  console.log("Navigating to /reservar with:", bookingData); // Debug
                  navigate('/reservar', { 
                    state: { 
                      bookingData,
                      routeGeometry: routeInfo.geometry,
                      originCoords,
                      destCoords
                    } 
                  });
              } else {
                console.log("Missing data for navigation:", { origin, destination, routeInfo });
              }
            }}
            className={`w-full py-4 rounded-xl font-bold text-xl flex justify-center items-center gap-2 transition-all shadow-lg mt-4
              ${routeInfo 
                ? 'bg-black text-white hover:bg-gray-800 transform hover:scale-[1.02]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isLoadingRoute ? <Loader2 className="animate-spin" /> : (
              <>
                {t('booking.form.confirmRoute', 'Confirmar Ruta')}
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Schedule Selection Modal (Now vs Later) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => setShowScheduleModal(false)}></div>
            
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Title */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                  <h3 className="font-bold text-xl text-black">{t('booking.form.whenTitle', '¿Cuándo te recogen?')}</h3>
                  <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-black"/>
                  </button>
                </div>
                
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Option 1: Pickup Now */}
                  <div 
                      onClick={() => setBookingType('now')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${bookingType === 'now' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                      <div className="flex items-center gap-3">
                        <Clock size={20} className={bookingType === 'now' ? "text-black" : "text-gray-400"} />
                        <span className="font-bold text-black text-lg">{t('booking.form.pickupNow', 'Recoger ahora')}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${bookingType === 'now' ? 'border-black' : 'border-gray-300'}`}>
                          {bookingType === 'now' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                  </div>

                  {/* Option 2: Schedule for later */}
                  <div 
                      onClick={() => setBookingType('later')}
                      className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${bookingType === 'later' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                      <div className="flex items-center justify-between w-full mb-3">
                          <div className="flex items-center gap-3">
                             <Calendar size={20} className={bookingType === 'later' ? "text-black" : "text-gray-400"} />
                             <span className="font-bold text-black text-lg">{t('booking.form.scheduleLater', 'Programar para más tarde')}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${bookingType === 'later' ? 'border-black' : 'border-gray-300'}`}>
                              {bookingType === 'later' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                          </div>
                      </div>
                      
                      {/* Embedded Calendar & Time Logic (Only if 'later' is selected) */}
                      {bookingType === 'later' && (
                          <div className="mt-2 space-y-4 animate-slideDown" onClick={(e) => e.stopPropagation()}>
                              {/* Date Picker (Inline - Clean) */}
                              <div className="pt-2">
                                <CustomDatePicker 
                                  selectedDate={date} 
                                  onChange={(newDate) => setDate(newDate)} 
                                />
                              </div>

                              {/* Time Selector */}
                              <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">{t('booking.form.timeLabel', 'HORA')}</label>
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-black transition-colors">
                                  <Clock className="text-black mr-3" size={20} />
                                  <select 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="bg-transparent w-full text-black font-bold text-lg outline-none cursor-pointer appearance-none"
                                  >
                                    {availableSlots.map(slot => (
                                      <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                    {availableSlots.length === 0 && <option disabled>No hours available</option>}
                                  </select>
                                </div>
                              </div>
                          </div>
                      )}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                  <button 
                    onClick={() => setShowScheduleModal(false)}
                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg"
                  >
                    {t('booking.form.confirm', 'Confirmar')}
                  </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
