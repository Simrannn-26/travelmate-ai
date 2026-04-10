import {
  fetchPlacesByRadius,
  fetchPlaceDetail,
} from '../services/openTripMap.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/v1/places?lat=48.85&lng=2.35&category=museums&limit=12
export async function getPlaces(req, res, next) {
  try {
    const { lat, lng, category = 'interesting_places', limit = 12 } = req.query;
    if (!lat || !lng) throw new AppError('lat and lng are required', 400);

    // Map our UI categories to OpenTripMap "kinds"
    const KINDS_MAP = {
      attractions: 'interesting_places,architecture,historic',
      restaurants: 'foods',
      hotels:      'accomodations',
      shopping:    'shops',
      nature:      'natural',
      museums:     'museums',
      all:         'interesting_places',
    };

    const kinds = KINDS_MAP[category] || 'interesting_places';
    const raw = await fetchPlacesByRadius({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      kinds,
      limit: Math.min(parseInt(limit), 50), // Cap at 50
    });

    // Filter out places without names & return lean objects
    const places = raw
      .filter(p => p.name)
      .map(p => ({
        id:       p.xid,
        name:     p.name,
        kinds:    p.kinds?.split(',') || [],
        lat:      p.point?.lat,
        lng:      p.point?.lon,
        dist:     p.dist,
        rate:     p.rate,
      }));

    res.json({ success: true, data: places, total: places.length });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/places/:xid — full detail for a single place
export async function getPlaceDetail(req, res, next) {
  try {
    const detail = await fetchPlaceDetail(req.params.xid);
    res.json({ success: true, data: detail });
  } catch (err) {
    next(err);
  }
}