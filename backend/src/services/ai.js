// AI service using Anthropic Claude for itinerary generation & sentiment analysis
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

/**
 * Generates a day-by-day itinerary using structured prompt engineering.
 * Returns a parsed JSON array of days.
 */
export async function generateItinerary({ destination, days, budget, travelStyle, places }) {
  const placeList = places
    .slice(0, 20)
    .map(p => `- ${p.name} (${p.category}, rating: ${p.rating || 'N/A'})`)
    .join('\n');

  const systemPrompt = `You are TravelMate AI, an expert travel planner. 
You create realistic, time-optimized itineraries based on real places.
Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

  const userPrompt = `Create a ${days}-day itinerary for ${destination}.
Travel style: ${travelStyle}. Budget level: ${budget}.

Available places to incorporate:
${placeList}

Return a JSON array with this exact structure:
[
  {
    "day": 1,
    "title": "Arrival & City Centre",
    "theme": "One sentence mood of the day",
    "slots": [
      {
        "time": "09:00",
        "period": "morning",
        "activity": "Visit the old town market",
        "place": "Grand Bazaar",
        "duration": "2 hours",
        "tip": "Go early to avoid crowds",
        "type": "attraction",
        "estimatedCost": "$0–5"
      }
    ]
  }
]

Rules:
- morning slots: 08:00–12:00, afternoon: 12:00–17:00, evening: 17:00–22:00
- Include meals (breakfast, lunch, dinner) with local restaurant suggestions
- Add travel time between distant attractions
- Tailor intensity to travelStyle: solo trips can be dense, family trips need rest time
- Respect budget: budget = free/cheap activities, luxury = premium experiences
- Be specific — use real place names from the list above`;

  const message = await client.messages.create({
    model:      'claude-opus-4-5',
    max_tokens: 4000,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const raw = message.content[0].text.trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Try to extract JSON if model added any surrounding text
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned malformed JSON. Please retry.');
  }
}

/**
 * Summarizes sentiment from an array of review strings.
 */
export async function analyzeSentiment(reviews) {
  if (!reviews?.length) return { positive: [], negative: [], summary: '' };

  const message = await client.messages.create({
    model:      'claude-haiku-4-5',
    max_tokens: 500,
    messages:   [{
      role:    'user',
      content: `Analyze these travel reviews. Return JSON only:
{"positive": ["up to 3 key positives"], "negative": ["up to 3 key negatives"], "summary": "one sentence overall", "score": 0-10}

Reviews:
${reviews.slice(0, 10).join('\n---\n')}`,
    }],
  });

  try {
    return JSON.parse(message.content[0].text.trim());
  } catch {
    return { positive: [], negative: [], summary: 'Unable to analyze reviews.', score: 0 };
  }
}