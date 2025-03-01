'use client'

export default function FavoritesPage() {
  const dummyFavorites = [
    { id: 1, name: 'Home', address: '123 Main St', type: 'home' },
    { id: 2, name: 'Work', address: '456 Office Ave', type: 'work' },
    { id: 3, name: 'Gym', address: '789 Fitness Blvd', type: 'other' },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Saved Places</h1>
      <div className="grid gap-4">
        <button className="w-full p-4 border-2 border-dashed rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
          + Add New Place
        </button>
        {dummyFavorites.map((place) => (
          <div key={place.id} className="p-4 border rounded-lg dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{place.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{place.address}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                  📍
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                  ✏️
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500 dark:text-red-400">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 