interface Point {
  x: number; // longitude
  y: number; // latitude
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodingResult {
  formatted_address: string;
  address_components: AddressComponent[];
}

interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

/**
 * Converts a PostgreSQL point (longitude, latitude) into a "City, Region" location string using
 * Google Maps Geocoding API.
 * @param point {Point} - The geographic point with longitude (x) and latitude (y).
 * @returns {Promise<string>} - A string describing the location, e.g. "San Francisco, CA".
 */
export async function pointToLocationString(point: Point): Promise<string> {
  const { x: longitude, y: latitude } = point;
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; // Replace with your own Google Maps API key

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error(
      'Invalid point object. Must contain numeric latitude and longitude.',
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data: GeocodingResponse = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;

      let city = '';
      let region = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          region = component.short_name;
        }
      }

      if (city && region) {
        return `${city}, ${region}`;
      }

      // Fallback if city/region not found
      return data.results[0].formatted_address || 'Unknown Location';
    } else {
      throw new Error(`No results found or invalid status: ${data.status}`);
    }
  } catch (error) {
    console.error('Error converting point to location string:', error);
    throw error;
  }
}
