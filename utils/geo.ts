
export const CASABLANCA_PLACES: Record<string, [number, number]> = {
  'Maarif': [33.5784, -7.6331],
  'Anfa': [33.5951, -7.6664],
  'Bourgone': [33.5989, -7.6417],
  'Oulfa': [33.5547, -7.6718],
  'Hay Hassani': [33.5516, -7.6592],
  'Sidi Maarouf': [33.5356, -7.6251],
  'Morocco Mall': [33.5884, -7.7058],
  'Hassan II Mosque': [33.6085, -7.6327],
};

/**
 * Real-time location search using OpenStreetMap Nominatim API
 */
export const searchOsmPlaces = async (query: string): Promise<{ name: string; coords: [number, number] }[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    // Append 'Casablanca, Morocco' to focus results locally
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Casablanca Morocco')}&limit=5`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'fr,en'
      }
    });
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.display_name.split(',').slice(0, 2).join(','), // Shorten the name
      coords: [parseFloat(item.lat), parseFloat(item.lon)] as [number, number]
    }));
  } catch (error) {
    console.error("OSM Search Error:", error);
    // Fallback to static list if API fails
    const normalized = query.toLowerCase();
    return Object.entries(CASABLANCA_PLACES)
      .filter(([name]) => name.toLowerCase().includes(normalized))
      .map(([name, coords]) => ({ name, coords }));
  }
};

/**
 * Calculates distance between two points in km using Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; 
  return d;
};

export const calculatePrice = (distance: number): number => {
  // 8 DH for first 1km, 3 DH per added km
  const basePrice = 8;
  if (distance <= 1) return basePrice;
  return Math.round(basePrice + (distance - 1) * 3);
};
