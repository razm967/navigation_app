'use client'

export default function RoutesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Routes</h1>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Plan Your Route</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Starting point"
                className="p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Destination"
                className="p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
              />
            </div>
            <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors">
              Get Directions
            </button>
          </div>
        </div>
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Recent Routes</h2>
          <p className="text-gray-500 dark:text-gray-400">Your recent routes will appear here</p>
        </div>
      </div>
    </div>
  )
} 