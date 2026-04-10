import { generateItinerary, analyzeSentiment } from '../services/ai.js';
import Trip from '../models/Trip.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/v1/itinerary/generate
// Body: { destination, lat, lng, days, budget, travelStyle, places[] }
export async function generate(req, res, next) {
  try {
    const { destination, days = 3, budget = 'mid-range', travelStyle = 'solo', places = [] } = req.body;

    if (!destination) throw new AppError('destination is required', 400);
    if (days < 1 || days > 14) throw new AppError('days must be between 1 and 14', 400);

    const itinerary = await generateItinerary({ destination, days, budget, travelStyle, places });

    // If user is logged in, auto-save the trip
    if (req.user) {
      await Trip.create({
        user:        req.user._id,
        destination,
        budget,
        travelStyle,
        itinerary,
        places: places.slice(0, 30),
      });
    }

    res.json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/itinerary/sentiment
// Body: { reviews: string[] }
export async function sentiment(req, res, next) {
  try {
    const { reviews } = req.body;
    const result = await analyzeSentiment(reviews);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}