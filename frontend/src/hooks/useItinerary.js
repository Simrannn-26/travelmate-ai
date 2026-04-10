import { useCallback } from 'react';
import { travelApi } from '../api/travelApi';
import { useTravel } from '../context/TravelContext';

export function useItinerary() {
  const { state, dispatch } = useTravel();

  const generate = useCallback(async () => {
    if (!state.location) return;
    dispatch({ type: 'LOADING', payload: { itinerary: true } });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const res = await travelApi.generateItinerary({
        destination: `${state.location.city}, ${state.location.country}`,
        lat:         state.location.lat,
        lng:         state.location.lng,
        days:        state.days,
        budget:      state.budget,
        travelStyle: state.travelStyle,
        places:      state.places,
      });
      dispatch({ type: 'SET_ITINERARY', payload: res.data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'LOADING', payload: { itinerary: false } });
    }
  }, [state, dispatch]);

  return { itinerary: state.itinerary, loading: state.loading.itinerary, generate };
}