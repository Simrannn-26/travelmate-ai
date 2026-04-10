import axios from "axios";

const API_URL = "https://travelmate-ai-qy2d.onrender.com/api/v1";

// 🔍 Search API
export const searchCity = async (city) => {
  const res = await axios.get(`${API_URL}/search?city=${city}`);
  return res.data;
};

// 📍 Places API
export const getPlaces = async (city) => {
  const res = await axios.get(`${API_URL}/places?city=${city}`);
  return res.data;
};

// 🧠 Itinerary API
export const getItinerary = async (data) => {
  const res = await axios.post(`${API_URL}/itinerary`, data);
  return res.data;
};