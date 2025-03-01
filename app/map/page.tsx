'use client'

import { useEffect } from 'react'

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Map</h1>
      <div className="w-full h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 rounded-lg">
        {/* Map component will be added here */}
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">Map will be displayed here</p>
        </div>
      </div>
    </div>
  )
} 