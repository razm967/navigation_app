'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Clock, MapPin, Navigation2, Search, Star, Plus, X, Edit2, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getRecentSearches, getFavorites, addToFavorites, updateFavorite, deleteFavorite } from '@/utils/supabase-client';

interface SavedPlace {
  id: string;
  place_name: string;
  coordinates: string;
  created_at: string;
  search_query: string;
}

interface Favorite {
  id: string;
  place_name: string;
  coordinates: string;
  notes: string;
  created_at: string;
}

export default function FavoritesPage() {
  const [recentSearches, setRecentSearches] = useState<SavedPlace[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [newFavorite, setNewFavorite] = useState({ place_name: '', coordinates: '', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ place_name: '', notes: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [searches, favs] = await Promise.all([
          getRecentSearches(),
          getFavorites()
        ]);
        setRecentSearches(searches);
        setFavorites(favs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToFavorites = async (place: SavedPlace) => {
    try {
      const favorite = await addToFavorites(place.place_name, place.coordinates);
      if (favorite) {
        setFavorites(prev => [favorite, ...prev]);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleSaveNewFavorite = async () => {
    try {
      const favorite = await addToFavorites(
        newFavorite.place_name,
        newFavorite.coordinates,
        newFavorite.notes
      );
      if (favorite) {
        setFavorites(prev => [favorite, ...prev]);
        setShowAddFavorite(false);
        setNewFavorite({ place_name: '', coordinates: '', notes: '' });
      }
    } catch (error) {
      console.error('Error adding new favorite:', error);
    }
  };

  const handleUpdateFavorite = async (id: string) => {
    try {
      const updated = await updateFavorite(id, editForm);
      if (updated) {
        setFavorites(prev => prev.map(f => f.id === id ? { ...f, ...editForm } : f));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleDeleteFavorite = async (id: string) => {
    try {
      const success = await deleteFavorite(id);
      if (success) {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  const startEdit = (favorite: Favorite) => {
    setEditingId(favorite.id);
    setEditForm({ place_name: favorite.place_name, notes: favorite.notes || '' });
  };

  const filteredContent = (items: any[], type: 'recent' | 'favorite') => {
    return items.filter(item =>
      item.place_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading places...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Favorites Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Favorites
                </h2>
                <button
                  onClick={() => setShowAddFavorite(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Plus size={20} />
                  Add New
                </button>
              </div>

              {showAddFavorite && (
                <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Place name"
                      value={newFavorite.place_name}
                      onChange={(e) => setNewFavorite(prev => ({ ...prev, place_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Coordinates (lat,lng)"
                      value={newFavorite.coordinates}
                      onChange={(e) => setNewFavorite(prev => ({ ...prev, coordinates: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                    <textarea
                      placeholder="Notes"
                      value={newFavorite.notes}
                      onChange={(e) => setNewFavorite(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddFavorite(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNewFavorite}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {filteredContent(favorites, 'favorite').map((favorite) => (
                  <div
                    key={favorite.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                  >
                    {editingId === favorite.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editForm.place_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, place_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                        />
                        <textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg"
                          placeholder="Add notes..."
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-600 hover:text-gray-800"
                          >
                            <X size={20} />
                          </button>
                          <button
                            onClick={() => handleUpdateFavorite(favorite.id)}
                            className="p-2 text-emerald-600 hover:text-emerald-700"
                          >
                            <Save size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {favorite.place_name}
                            </h3>
                            {favorite.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {favorite.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/map?destination=${encodeURIComponent(favorite.coordinates)}&place=${encodeURIComponent(favorite.place_name)}`}
                              className="p-2 text-emerald-600 hover:text-emerald-700"
                            >
                              <Navigation2 size={20} />
                            </Link>
                            <button
                              onClick={() => startEdit(favorite)}
                              className="p-2 text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteFavorite(favorite.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Searches
              </h2>
              <div className="grid gap-4">
                {filteredContent(recentSearches, 'recent').map((place) => (
                  <div
                    key={place.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {place.place_name}
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(place.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToFavorites(place)}
                          className="p-2 text-yellow-500 hover:text-yellow-600"
                          title="Add to favorites"
                        >
                          <Star size={20} />
                        </button>
                        <Link
                          href={`/map?destination=${encodeURIComponent(place.coordinates)}&place=${encodeURIComponent(place.place_name)}`}
                          className="p-2 text-emerald-600 hover:text-emerald-700"
                          title="Get directions"
                        >
                          <Navigation2 size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 