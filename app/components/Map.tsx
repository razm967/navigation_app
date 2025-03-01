'use client';

import { useRef, useState, useEffect } from 'react';
import { Map, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Debug logging
console.log('Environment variables:', {
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NODE_ENV: process.env.NODE_ENV
});

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Debug logging
console.log('Using token:', MAPBOX_TOKEN);

const MapComponent = () => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 34.7818,  // Israel coordinates
    latitude: 32.0853,
    zoom: 10
  });

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapLib={import('mapbox-gl')}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={true}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          onGeolocate={({ coords }) => {
            setViewState({
              longitude: coords.longitude,
              latitude: coords.latitude,
              zoom: 14
            });
          }}
        />
      </Map>
    </div>
  );
};

export default MapComponent; 