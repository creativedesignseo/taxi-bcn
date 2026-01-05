

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const BCN_COORDS = '2.1734,41.3851'; // Barcelona Center

// Helper for Session Token (UUID v4)
export const generateSessionToken = () => {
  return crypto.randomUUID();
};

// New Search Box API (v1/suggest)
export const getPlaceSuggestions = async (query, sessionToken) => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&proximity=${BCN_COORDS}&language=es&limit=8&types=address,poi,district,place,locality`
    );
    const data = await response.json();
    
    // Map Suggestions to a usable format
    return (data.suggestions || []).map(s => ({
      id: s.mapbox_id,
      name: s.name,
      full_address: s.full_address || s.place_formatted,
      place_name: s.name + (s.full_address ? `, ${s.full_address}` : ''),
      action: 'retrieve' // Signal that we need to fetch details
    }));
  } catch (error) {
    console.error("Mapbox Suggest Error:", error);
    return [];
  }
};

// Retrieve Details (Coordinates) for a Suggestion
export const getPlaceDetails = async (mapboxId, sessionToken) => {
  if (!mapboxId) return null;
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}`
    );
    const data = await response.json();
    const feature = data.features?.[0];
    
    if (feature) {
      return {
        center: feature.geometry.coordinates, // [lng, lat]
        place_name: feature.properties.name_preferred || feature.properties.name,
        full_name: feature.properties.full_address || feature.properties.place_formatted
      };
    }
    return null;
  } catch (error) {
    console.error("Mapbox Retrieve Error:", error);
    return null;
  }
};

// Keep Geocoding v5 only for Reverse Geocoding (Coords -> Address)
export const reverseGeocode = async (lng, lat) => {
  if (!lng || !lat) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=es`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0];
    }
    return null;
  } catch (error) {
    console.error("Mapbox Reverse Geocoding Error:", error);
    return null;
  }
};

export const getRouteData = async (startCoords, endCoords) => {
  if (!startCoords || !endCoords) return null;

  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(',')};${endCoords.join(',')}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    return {
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      geometry: route.geometry
    };
  } catch (error) {
    console.error("Mapbox Directions Error:", error);
    return null;
  }
};
