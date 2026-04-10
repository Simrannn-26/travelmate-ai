import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
// import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

import searchRoutes from './routes/search.js';
import placesRoutes from './routes/places.js';
import itineraryRoutes from './routes/itinerary.js';
import authRoutes from './routes/auth.js';

const app = express();

// 🛡️ Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(globalRateLimiter);

// ✅ Root route (IMPORTANT for testing)
app.get('/', (req, res) => {
  res.json({ message: 'TravelMate API is running 🚀' });
});

// ❤️ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// 📡 API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/places', placesRoutes);
app.use('/api/v1/itinerary', itineraryRoutes);

// ❌ 404 handler (must be LAST before error handler)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ⚠️ Error handler
app.use(errorHandler);

// 🚀 Server start
const PORT = env.PORT || process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TravelMate API running on port ${PORT}`);
});