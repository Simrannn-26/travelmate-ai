// Wraps OpenTripMap API — free, no billing required, solid data
import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const BASE = 'https://api.opentripmap.com/0.1/en/places';

const otm = axios.create({
  baseURL: BASE,
  params: { apikey: env.OPENTRIPMAP_KEY },
  timeout: 8000,
});

// Kinds: accommodation, foods, tourist_facilities, museums, natural, sport, amusement...
export async function fetchPlacesByRadius({ lat, lng, radius = 10000, kinds = 'interesting_places', limit = 20 }) {
  const { data } = await otm.get('/radius', {
    params: { lat, lon: lng, radius, kinds, limit, format: 'json', rate: 3 },
  });
  return data;
}

export async function fetchPlaceDetail(xid) {
  const { data } = await otm.get(`/xid/${xid}`);
  // Normalize the wildly varied API response shape
  return {
    id:          data.xid,
    name:        data.name,
    description: data.wikipedia_extracts?.text || data.info?.descr || '',
    address:     data.address?.road ? `${data.address.road}, ${data.address.city || ''}` : '',
    rating:      data.rate ? parseFloat(data.rate) : null,
    image:       data.preview?.source || null,
    website:     data.url || null,
    kinds:       data.kinds?.split(',') || [],
    lat:         data.point?.lat,
    lng:         data.point?.lon,
    wikipedia:   data.wikipedia || null,
  };
}

export async function geocodeCity(name) {
  // Use OpenTripMap's geoname endpoint to resolve city → lat/lng
  const { data } = await otm.get('/geoname', { params: { name } });
  if (!data.lat) throw new AppError(`Destination "${name}" not found. Try a different spelling.`, 404);
  return { lat: data.lat, lng: data.lon, city: data.name, country: data.country };
}