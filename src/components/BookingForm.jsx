import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Navigation, Loader2, Locate, ArrowRight } from 'lucide-react';
import { getPlaceSuggestions, getRouteData } from '../lib/mapbox';
import { getCurrentLocation } from '../lib/whatsapp';
import BookingModal from './BookingModal';

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
      const coords = [position.longitude, position.latitude];
      
      // Reverse geocode to get address
      const suggestions = await getPlaceSuggestions(`${position.latitude},${position.longitude}`);
      
      if (suggestions.length > 0) {
        const place = suggestions[0];
        setOrigin(place.place_name);
        setOriginCoords(coords);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      alert('No se pudo obtener tu ubicación. Por favor, verifica los permisos del navegador.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      
      {/* FORM PANEL */}
      <div className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Navigation className="text-yellow-400" /> 
          {t('hero.bookingTitle', 'Reserva Express')}
        </h3>

        <div className="space-y-6 flex-grow">
          {/* Origin Input */}
          <div className="relative">
            <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">RECOGIDA</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-all">
                <MapPin className="text-green-400 mr-3" size={20} />
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => setActiveInput('origin')}
                  placeholder="¿Dónde te recogemos?"
                  className="bg-transparent w-full text-white placeholder-gray-500 outline-none font-medium"
                />
                {origin && <button onClick={() => {setOrigin(''); setOriginCoords(null)}} className="text-gray-500 hover:text-white"><div className="text-xs">✕</div></button>}
              </div>
              
              {/* My Location Button */}
              <button
                onClick={handleUseMyLocation}
                disabled={isLoadingLocation}
                className="flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 hover:bg-gray-700 hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Usar mi ubicación"
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

          {/* Destination Input */}
          <div className="relative">
             <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">DESTINO</label>
            <div className="flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-all">
              <MapPin className="text-red-400 mr-3" size={20} />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setActiveInput('destination')}
                placeholder="¿A dónde vas?"
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

          {/* Route Details & Price */}
          {routeInfo && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 animate-fade-in-up">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">Tiempo estimado</p>
                  <p className="text-2xl font-bold text-white">{~~(routeInfo.durationSeconds / 60)} min</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2 border-t border-gray-700 pt-2">
                Distancia: {(routeInfo.distanceMeters / 1000).toFixed(1)} km
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
                Confirmar Ruta
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
            timeEstimate: ~~(routeInfo.durationSeconds / 60),
            priceEstimate: parseFloat(estimatePrice(routeInfo.distanceMeters))
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;
