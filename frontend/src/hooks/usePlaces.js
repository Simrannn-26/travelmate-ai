import { useCallback } from 'react';
import { travelApi } from '../api/travelApi';
import { useTravel } from '../context/TravelContext';

export function usePlaces() {
  const { state, dispatch } = useTravel();

  const fetchPlaces = useCallback(async (category = 'all') => {
    if (!state.location) return;
    dispatch({ type: 'LOADING', payload: { places: true } });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const res = await travelApi.getPlaces({
        lat:      state.location.lat,
        lng:      state.location.lng,
        category,
        limit:    16,
      });
      dispatch({ type: 'SET_PLACES', payload: res.data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'LOADING', payload: { places: false } });
    }
  }, [state.location, dispatch]);

  return { places: state.places, loading: state.loading.places, fetchPlaces };
}