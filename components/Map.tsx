'use client';

import { useRef, useState, useEffect } from 'react';
import { Map, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { Feature, LineString } from 'geojson';
import mapboxgl, { MapboxEvent } from 'mapbox-gl';
import { CarFront, PersonStanding, Bike, Clock } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Debug logging
console.log('Environment variables:', {
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NODE_ENV: process.env.NODE_ENV
});

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type TransportMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

const transportModes = [
  { id: 'driving', label: 'Driving', icon: CarFront, color: '#3b82f6' },
  { id: 'walking', label: 'Walking', icon: PersonStanding, color: '#22c55e' },
  { id: 'cycling', label: 'Cycling', icon: Bike, color: '#f59e0b' },
  { id: 'driving-traffic', label: 'Traffic', icon: Clock, color: '#ef4444' },
] as const;

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface MapComponentProps {
  selectedLocation: {
    coordinates: [number, number];
    placeName: string;
  } | null;
}

const MapComponent = ({ selectedLocation }: MapComponentProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 34.7818,  // Israel coordinates
    latitude: 32.0853,
    zoom: 10
  });

  // State for origin, destination, and transport mode
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<Feature<LineString> | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>('driving');
  const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);

  // Function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Function to format distance
  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(1)}km` : `${Math.round(meters)}m`;
  };

  // Function to fetch directions from Mapbox API
  const getDirections = async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
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
        setRouteInfo({
          duration: route.duration / 60, // Convert seconds to minutes
          distance: route.distance // In meters
        });

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
      setRouteInfo(null);
    }
  };

  // Fetch directions when both points are set or transport mode changes
  useEffect(() => {
    if (origin && destination) {
      getDirections(origin, destination);
    }
  }, [origin, destination, transportMode]);

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
            'line-color': transportModes.find(m => m.id === transportMode)?.color || '#3b9ddd',
            'line-width': 8,
            'line-opacity': 0.8
          }
        });
      } else {
        map.setPaintProperty('route', 'line-color', 
          transportModes.find(m => m.id === transportMode)?.color || '#3b9ddd'
        );
      }
    }
  }, [routeGeometry, transportMode]);

  // Update view when location is selected from search
  useEffect(() => {
    if (selectedLocation) {
      setViewState({
        longitude: selectedLocation.coordinates[0],
        latitude: selectedLocation.coordinates[1],
        zoom: 14
      });
    }
  }, [selectedLocation]);

  return (
    <div className="h-screen w-full relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: { viewState: ViewState }) => setViewState(evt.viewState)}
        mapLib={mapboxgl}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={true}
        onClick={handleMapClick}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          onGeolocate={(position: GeolocationPosition) => {
            setViewState({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              zoom: 14
            });
          }}
        />

        {/* Render markers for origin and destination */}
        {origin && mapRef.current && (
          <div 
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: mapRef.current.getMap().project(origin).x,
              top: mapRef.current.getMap().project(origin).y
            }}
          >
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
        )}
        {destination && mapRef.current && (
          <div 
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: mapRef.current.getMap().project(destination).x,
              top: mapRef.current.getMap().project(destination).y
            }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full" />
          </div>
        )}
      </Map>

      {/* Transport mode selection */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg">
        {transportModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setTransportMode(mode.id as TransportMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                transportMode === mode.id
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={mode.label}
            >
              <Icon 
                size={24} 
                className={transportMode === mode.id ? 'text-emerald-600' : 'text-gray-500'}
              />
            </button>
          );
        })}
      </div>

      {/* Route information */}
      {routeInfo && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Route Info:</h3>
          <p>Duration: {formatDuration(routeInfo.duration)}</p>
          <p>Distance: {formatDistance(routeInfo.distance)}</p>
        </div>
      )}

      {/* Instructions */}
      {!origin && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">How to use:</h3>
          <ol className="list-decimal pl-4">
            <li>Click on the map to set starting point (green marker)</li>
            <li>Click again to set destination (red marker)</li>
            <li>Select your preferred transport mode below</li>
            <li>Click again to reset and start over</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 