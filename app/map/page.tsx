'use client'

import { useState } from 'react'
import MapComponent from '../../components/Map'
import SearchBar from '../../components/SearchBar'

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number];
    placeName: string;
  } | null>(null);

  const handleLocationSelect = (coordinates: [number, number], placeName: string) => {
    setSelectedLocation({ coordinates, placeName });
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <SearchBar onSelectLocation={handleLocationSelect} />
      <MapComponent selectedLocation={selectedLocation} />
    </div>
  )
} 