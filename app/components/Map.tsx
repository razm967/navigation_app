'use client';

import { useRef, useState, useEffect } from 'react';
import { Map } from 'react-map-gl';
import { NavigationControl, GeolocateControl, Marker } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { Feature, LineString } from 'geojson';
import mapboxgl from 'mapbox-gl';
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

  // State for origin and destination points
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<Feature<LineString> | null>(null);

  // Function to fetch directions from Mapbox API
  const getDirections = async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      const json = await query.json();
      
      if (json.routes && json.routes[0]) {
        const route = json.routes[0];
        const routeFeature: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        };
        setRouteGeometry(routeFeature);

        // Fit the map to the route bounds
        if (mapRef.current) {
          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
            return bounds.extend(coord as mapboxgl.LngLatLike);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          mapRef.current.fitBounds(bounds, {
            padding: 50
          });
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  // Handle map clicks to set origin and destination
  const handleMapClick = (event: { lngLat: { lng: number; lat: number } }) => {
    const { lng: longitude, lat: latitude } = event.lngLat;
    
    if (!origin) {
      setOrigin([longitude, latitude]);
    } else if (!destination) {
      setDestination([longitude, latitude]);
    } else {
      // Reset points if both are already set
      setOrigin([longitude, latitude]);
      setDestination(null);
      setRouteGeometry(null);
    }
  };

  // Fetch directions when both points are set
  useEffect(() => {
    if (origin && destination) {
      getDirections(origin, destination);
    }
  }, [origin, destination]);

  useEffect(() => {
    if (mapRef.current && routeGeometry) {
      const map = mapRef.current.getMap();
      
      // Add the route source and layer
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: routeGeometry
        });
      } else {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(routeGeometry);
      }

      if (!map.getLayer('route')) {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b9ddd',
            'line-width': 8,
            'line-opacity': 0.8
          }
        });
      }
    }
  }, [routeGeometry]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapLib={mapboxgl}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={true}
        onClick={handleMapClick}
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

        {/* Render markers for origin and destination */}
        {origin && (
          <Marker 
            longitude={origin[0]} 
            latitude={origin[1]} 
            color="#22c55e"  // green-500
          />
        )}
        {destination && (
          <Marker 
            longitude={destination[0]} 
            latitude={destination[1]} 
            color="#ef4444"  // red-500
          />
        )}
      </Map>

      {/* Instructions for users */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-10">
        <h3 className="font-bold mb-2">How to use:</h3>
        <ol className="list-decimal pl-4">
          <li>Click on the map to set starting point (green marker)</li>
          <li>Click again to set destination (red marker)</li>
          <li>Click again to reset and start over</li>
        </ol>
      </div>
    </div>
  );
};

export default MapComponent; 