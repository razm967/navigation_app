'use client'

export default function SearchPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Search Places</h1>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for places, addresses, or landmarks..."
            className="w-full p-4 pr-12 border rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
            🔍
          </button>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Restaurants', 'Hotels', 'Gas Stations', 'Parking', 'Shopping', 'Parks'].map((category) => (
              <button
                key={category}
                className="p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 