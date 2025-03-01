'use client'

import MapComponent from '../components/Map'

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Interactive Map</h1>
      <div className="w-full h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <MapComponent />
      </div>
    </div>
  )
} 