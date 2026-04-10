import { Router } from 'express';
import { getPlaces, getPlaceDetail } from '../controllers/placesController.js';
import { cache } from '../middleware/cache.js';
const r = Router();
r.get('/',      cache(1800), getPlaces);
r.get('/:xid',  cache(3600), getPlaceDetail);
export default r;