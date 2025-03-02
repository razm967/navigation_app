import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const saveRecentSearch = async (
  searchQuery: string,
  coordinates: [number, number],
  placeName: string
) => {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('recent_searches')
      .insert({
        user_id: user.id,
        search_query: searchQuery,
        coordinates: `(${coordinates[0]},${coordinates[1]})`,
        place_name: placeName
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving recent search:', error)
    return null
  }
}

export const getRecentSearches = async () => {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('recent_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching recent searches:', error)
    return []
  }
}

export const addToFavorites = async (
  placeName: string,
  coordinates: string,
  notes: string = ''
) => {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        place_name: placeName,
        coordinates,
        notes
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return null
  }
}

export const getFavorites = async () => {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
}

export const updateFavorite = async (
  id: string,
  updates: { place_name?: string; notes?: string }
) => {
  const supabase = createClientComponentClient()
  
  try {
    const { data, error } = await supabase
      .from('favorites')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating favorite:', error)
    return null
  }
}

export const deleteFavorite = async (id: string) => {
  const supabase = createClientComponentClient()
  
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting favorite:', error)
    return false
  }
} 