import { useRef, useEffect } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteMap = ({ originCoords, destCoords, routeGeometry }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !originCoords || !destCoords) return;

    // Fit bounds to show both points with padding
    const bounds = new mapboxgl.LngLatBounds()
      .extend(originCoords)
      .extend(destCoords);

    mapRef.current.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      duration: 1000
    });
  }, [originCoords, destCoords]);

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
        interactive={false} // Static map feeling
        attributionControl={false}
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
      
      {/* Overlay to Prevent Interaction */}
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto cursor-default"></div>
    </div>
  );
};

export default RouteMap;
