import { Router } from 'express';
import { generate, sentiment } from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
const r = Router();
r.post('/generate', aiRateLimiter, protect(true), generate);  // Optional auth
r.post('/sentiment', sentiment);
export default r;