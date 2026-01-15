import { useRef, useEffect, useCallback } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = ({ originCoords, destCoords, routeGeometry }) => {
  const mapRef = useRef(null);

  // Function to fit map to markers and route
  const fitMapToRoute = useCallback((mapInstance) => {
    if (!originCoords || !destCoords) return;

    const bounds = new mapboxgl.LngLatBounds();

    // 1. Always include Origin & Destination markers
    bounds.extend(originCoords);
    bounds.extend(destCoords);

    // 2. Include the Route path if available
    if (routeGeometry && routeGeometry.coordinates) {
      routeGeometry.coordinates.forEach(coord => bounds.extend(coord));
    }

    // 3. Fit bounds with responsive padding
    if (!bounds.isEmpty()) {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile 
        ? { top: 60, bottom: 60, left: 40, right: 40 }
        : { top: 100, bottom: 100, left: 100, right: 100 };

      mapInstance.fitBounds(bounds, {
        padding,
        duration: 1000
      });
    }
  }, [originCoords, destCoords, routeGeometry]);

  useEffect(() => {
    if (mapRef.current) {
        fitMapToRoute(mapRef.current);
    }
  }, [fitMapToRoute]);

  const routeGeoJSON = {
    type: 'Feature',
    properties: {},
    geometry: routeGeometry
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: Number(originCoords[0]) || 2.1734,
          latitude: Number(originCoords[1]) || 41.3851,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={true}
        attributionControl={false}
        onLoad={(e) => fitMapToRoute(e.target)}
      >
        {/* Origin Marker */}
        <Marker longitude={originCoords[0]} latitude={originCoords[1]} color="#EAB308" />

        {/* Destination Marker */}
        <Marker longitude={destCoords[0]} latitude={destCoords[1]} color="#22C55E" />

        {/* Route Line */}
        {routeGeometry && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#000000',
                'line-width': 4,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default RouteMap;
