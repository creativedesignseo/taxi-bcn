import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2, Locate, ArrowRight, Users, Briefcase, Clock, Calendar } from 'lucide-react';
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

  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Mapbox Session Token (Search Box API)
  const [sessionToken] = useState(generateSessionToken());

  // New Fields State
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);


  // Scheduling State
  const [bookingType, setBookingType] = useState('now'); // 'now' | 'scheduled'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Generate time slots (every 30 minutes, future-only if today)
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) { // 30-minute intervals
        const slotTime = new Date();
        slotTime.setHours(hour, minutes, 0, 0);
        
        // If today, only show future times (with 30 min buffer)
        if (isToday) {
          const bufferTime = new Date(now.getTime() + 30 * 60000); // 30 min from now
          if (slotTime <= bufferTime) continue;
        }
        
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
          
          {/* Row 2: Origin Input */}


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

          {/* Row: Scheduling (When) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Column 1: When/Date Selector */}
            {bookingType === 'now' ? (
              /* Ahora/Programar Dropdown */
              <div className="relative group h-[58px]">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                  <label className="text-xs font-bold text-gray-900">{t('booking.form.whenLabel', '¿Cuándo?')}</label>
                </div>
                <div className="flex items-center bg-white border-2 border-gray-200 group-focus-within:border-black hover:border-black rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all h-full">
                  <Calendar className="text-black mr-2 md:mr-3 z-10 flex-shrink-0" size={20} />
                  <select 
                    value={bookingType}
                    onChange={(e) => {
                      setBookingType(e.target.value);
                      if (e.target.value === 'scheduled') {
                        setShowCalendarModal(true);
                      }
                    }}
                    className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none appearance-none cursor-pointer"
                  >
                    <option value="now">{t('booking.form.now', 'Ahora')}</option>
                    <option value="scheduled">{t('booking.form.schedule', 'Programar')}</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            ) : (
              /* Date Selector Button (when scheduled) */
              <div className="relative group h-[58px]">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                  <label className="text-xs font-bold text-gray-900">{t('booking.form.dateLabel', 'Fecha')}</label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(true)}
                  className={`flex items-center bg-white border-2 rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all h-full w-full ${!selectedDate ? 'border-red-400' : 'border-gray-200 hover:border-black'}`}
                >
                  <Calendar className="text-black mr-2 md:mr-3 z-10 flex-shrink-0" size={20} />
                  <span className="text-black font-medium text-base md:text-lg truncate">
                    {selectedDate ? selectedDate : t('booking.form.selectDate', 'Seleccionar...')}
                  </span>
                </button>
              </div>
            )}

            {/* Column 2: Time Selector (only if scheduled) OR empty placeholder */}
            {bookingType === 'scheduled' ? (
              <div className="relative group h-[58px]">
                <div className="absolute -top-2.5 left-4 bg-white px-1 z-10">
                  <label className="text-xs font-bold text-gray-900">{t('booking.form.timeLabel', 'Hora')}</label>
                </div>
                <div className={`flex items-center bg-white border-2 rounded-lg px-3 py-3 md:px-4 md:py-3 transition-all h-full ${!selectedTime ? 'border-red-400' : 'border-gray-200 group-focus-within:border-black hover:border-black'}`}>
                  <Clock className="text-black mr-2 md:mr-3 z-10 flex-shrink-0" size={20} />
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-transparent w-full text-black font-medium text-base md:text-lg outline-none appearance-none cursor-pointer"
                  >
                    <option value="">{t('booking.form.selectTime', 'Seleccionar...')}</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            ) : (
              /* Placeholder to maintain grid when "Ahora" is selected */
              <div className="h-[58px]"></div>
            )}
          </div>

          {/* Calendar Modal (Full Screen on Mobile) */}
          {showCalendarModal && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-black">{t('booking.form.selectDate', 'Seleccionar fecha')}</h3>
                  <button 
                    onClick={() => setShowCalendarModal(false)}
                    className="text-gray-400 hover:text-black text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <CustomDatePicker 
                  selectedDate={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
                
                <button
                  onClick={() => setShowCalendarModal(false)}
                  disabled={!selectedDate}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all
                    ${selectedDate 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {t('booking.form.confirmDate', 'Confirmar Fecha')}
                </button>
              </div>
            </div>
          )}

          {/* Row 4: Passengers & Luggage (Now Dropdowns) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
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
          {/* Validation: If scheduled, require date AND time */}
          {(() => {
            const isScheduleIncomplete = bookingType === 'scheduled' && (!selectedDate || !selectedTime);
            const isButtonDisabled = !routeInfo || isScheduleIncomplete;
            return (
          <button 
            type="button"
            disabled={isButtonDisabled}
            onClick={() => {
              if (origin && destination && routeInfo) {
                  const bookingData = {
                      origin: { address: origin, coordinates: originCoords },
                      destination: { address: destination, coordinates: destCoords },
                      date: bookingType === 'now' ? t('hero.timeNow', 'Ahora') : selectedDate,
                      time: bookingType === 'now' ? t('hero.immediate', 'Inmediato') : selectedTime,
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
              ${!isButtonDisabled 
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
            );
          })()}
        </div>
      </div>


    </div>
  );
};

export default BookingForm;
