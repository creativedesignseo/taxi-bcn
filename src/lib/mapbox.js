

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Validation standard: Barcelona Bounding Box to restrict search (approximate)
export const BCN_BBOX = [1.9, 41.1, 2.3, 41.5]; // [minLng, minLat, maxLng, maxLat]

export const getPlaceSuggestions = async (query) => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&bbox=${BCN_BBOX.join(',')}&country=es&types=address,poi,place&limit=5&language=es`
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Mapbox Geocoding Error:", error);
    return [];
  }
};

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
