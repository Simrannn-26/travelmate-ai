// Validates all required env vars at startup — fail fast, not at runtime
import { cleanEnv, str, port } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV:         str({ choices: ['development', 'production', 'test'] }),
  PORT:             port({ default: 5000 }),
  MONGODB_URI:      str(),
  JWT_SECRET:       str(),
  JWT_EXPIRES_IN:   str({ default: '7d' }),
  REDIS_URL:        str({ default: '' }),
  OPENTRIPMAP_KEY:  str(),
  MAPBOX_TOKEN:     str(),
  OPENWEATHER_KEY:  str(),
  ANTHROPIC_API_KEY: str(),
});