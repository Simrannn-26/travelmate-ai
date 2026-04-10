import { geocodeCity } from '../services/openTripMap.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/v1/search
// Body: { query: "Paris" }
export async function search(req, res, next) {
  try {
    const { query } = req.body;
    if (!query?.trim()) throw new AppError('Search query is required', 400);

    // Trim and sanitize
    const sanitized = query.trim().slice(0, 100);
    const location = await geocodeCity(sanitized);

    res.json({
      success: true,
      data: {
        query:   sanitized,
        resolved: location, // { lat, lng, city, country }
      },
    });
  } catch (err) {
    next(err);
  }
}