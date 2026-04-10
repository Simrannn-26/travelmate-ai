// Main explore page — ties all components together
import { useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { usePlaces } from '../hooks/usePlaces';
import { PlaceCard } from '../components/PlaceCard/PlaceCard';
import { MapView } from '../components/MapView/MapView';
import { ItineraryView } from '../components/ItineraryView/ItineraryView';

const TABS = [
  { id: 'attractions', label: '🏛 Attractions' },
  { id: 'restaurants', label: '🍜 Food' },
  { id: 'hotels',      label: '🏨 Hotels' },
  { id: 'shopping',    label: '🛍 Shopping' },
  { id: 'nature',      label: '🌿 Nature' },
];

export function Explore() {
  const { state, dispatch } = useTravel();
  const { places, loading, fetchPlaces } = usePlaces();

  // Fetch places when tab changes
  useEffect(() => {
    if (state.location) fetchPlaces(state.activeTab);
  }, [state.activeTab, state.location]);

  if (!state.location) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Location header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {state.location.city}
          <span className="ml-2 text-lg font-normal text-gray-500">{state.location.country}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {state.location.lat.toFixed(4)}, {state.location.lng.toFixed(4)}
        </p>
      </div>

      {/* Map */}
      <MapView/>

      {/* Category tabs */}
      <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              state.activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Places grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {places.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelect={(p) => console.log('Selected:', p)} // Hook into trip builder
            />
          ))}
        </div>
      )}

      {/* Itinerary section */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ✨ AI-Generated Itinerary
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Personalized day-by-day plan based on your travel style and budget.
        </p>
        <ItineraryView/>
      </div>
    </div>
  );
}