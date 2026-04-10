import { Router } from 'express';
import { search } from '../controllers/searchController.js';
import { cache } from '../middleware/cache.js';
export default Router().post('/', cache(3600), search);