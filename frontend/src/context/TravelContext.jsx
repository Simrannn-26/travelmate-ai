// Global state — avoids prop drilling across the entire app
import { createContext, useContext, useReducer } from 'react';

const TravelContext = createContext(null);

const initialState = {
  location:    null,      // { lat, lng, city, country }
  places:      [],
  itinerary:   [],
  activeTab:   'attractions',
  budget:      'mid-range',
  travelStyle: 'solo',
  days:        3,
  loading:     { search: false, places: false, itinerary: false },
  error:       null,
  user:        null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':    return { ...state, location: action.payload, places: [], itinerary: [] };
    case 'SET_PLACES':      return { ...state, places: action.payload };
    case 'SET_ITINERARY':   return { ...state, itinerary: action.payload };
    case 'SET_TAB':         return { ...state, activeTab: action.payload };
    case 'SET_BUDGET':      return { ...state, budget: action.payload };
    case 'SET_STYLE':       return { ...state, travelStyle: action.payload };
    case 'SET_DAYS':        return { ...state, days: action.payload };
    case 'SET_USER':        return { ...state, user: action.payload };
    case 'LOADING':         return { ...state, loading: { ...state.loading, ...action.payload } };
    case 'ERROR':           return { ...state, error: action.payload };
    case 'CLEAR_ERROR':     return { ...state, error: null };
    default:                return state;
  }
}

export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TravelContext.Provider value={{ state, dispatch }}>
      {children}
    </TravelContext.Provider>
  );
}

export const useTravel = () => {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be used inside TravelProvider');
  return ctx;
};