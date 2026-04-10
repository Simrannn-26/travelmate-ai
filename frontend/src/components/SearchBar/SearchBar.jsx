import { useState, useRef } from 'react';
import { travelApi } from '../../api/travelApi';
import { useTravel } from '../../context/TravelContext';
import { usePlaces } from '../../hooks/usePlaces';

export function SearchBar() {
  const { state, dispatch } = useTravel();
  const { fetchPlaces } = usePlaces();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Voice input — browser native, no library needed
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = 'en-US';
    rec.onresult = (e) => setQuery(e.results[0][0].transcript);
    rec.start();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    dispatch({ type: 'LOADING', payload: { search: true } });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const res = await travelApi.search(query);
      dispatch({ type: 'SET_LOCATION', payload: res.data.resolved });
      await fetchPlaces('attractions');
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'LOADING', payload: { search: false } });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search icon */}
        <span className="pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Where do you want to go? (e.g. Tokyo, Paris, Bali)"
          className="flex-1 px-4 py-4 text-lg bg-transparent text-gray-800 dark:text-white placeholder-gray-400 outline-none"
          disabled={state.loading.search}
        />

        {/* Voice input button */}
        <button
          type="button"
          onClick={startVoice}
          className="px-3 text-gray-400 hover:text-indigo-500 transition-colors"
          title="Voice search"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>

        <button
          type="submit"
          disabled={state.loading.search}
          className="m-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
        >
          {state.loading.search ? 'Searching…' : 'Explore'}
        </button>
      </div>

      {/* Error message */}
      {state.error && (
        <p className="mt-2 text-center text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}