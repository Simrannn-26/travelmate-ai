import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destination: { type: String, required: true },
  startDate:   Date,
  endDate:     Date,
  budget:      { type: String, enum: ['budget', 'mid-range', 'luxury'] },
  travelStyle: String,
  itinerary:   [{ // Stored AI output as structured JSON
    day:    Number,
    date:   String,
    title:  String,
    slots:  [{
      time:        String, // "09:00"
      period:      String, // "morning" | "afternoon" | "evening"
      activity:    String,
      place:       String,
      duration:    String, // "2 hours"
      tip:         String,
      type:        String, // "attraction" | "food" | "transport"
    }]
  }],
  places:      [{ // Cached place data so user doesn't re-fetch
    name: String, category: String, rating: Number, lat: Number, lng: Number,
  }],
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);