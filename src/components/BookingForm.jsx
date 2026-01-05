import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Loader2, Locate, ArrowRight, Users, Briefcase } from 'lucide-react';
import { getPlaceSuggestions, getRouteData, reverseGeocode, getPlaceDetails, generateSessionToken } from '../lib/mapbox';
import { getCurrentLocation } from '../lib/whatsapp';

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
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Mapbox Session Token (Search Box API)
  const [sessionToken] = useState(generateSessionToken());

  // New Fields State
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [transferType, setTransferType] = useState('oneWay');

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
                  const bookingData = {
                      origin: { address: origin, coordinates: originCoords },
                      destination: { address: destination, coordinates: destCoords },
                      date: t('hero.timeNow', 'Ahora'),
                      time: t('hero.immediate', 'Inmediato'),
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


    </div>
  );
};

export default BookingForm;
