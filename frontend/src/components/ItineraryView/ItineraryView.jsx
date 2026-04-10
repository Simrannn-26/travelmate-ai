import { useItinerary } from '../../hooks/useItinerary';
import { useTravel } from '../../context/TravelContext';

const PERIOD_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌆' };
const TYPE_COLORS = {
  attraction: 'border-l-indigo-500',
  food:       'border-l-orange-400',
  transport:  'border-l-gray-400',
  shopping:   'border-l-pink-400',
};

export function ItineraryView() {
  const { state, dispatch } = useTravel();
  const { generate, loading } = useItinerary();

  if (!state.location) return null;

  return (
    <div className="mt-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Duration</label>
          <select
            value={state.days}
            onChange={e => dispatch({ type: 'SET_DAYS', payload: Number(e.target.value) })}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[1,2,3,4,5,7,10,14].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Budget</label>
          <select
            value={state.budget}
            onChange={e => dispatch({ type: 'SET_BUDGET', payload: e.target.value })}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="budget">💰 Budget</option>
            <option value="mid-range">💳 Mid-range</option>
            <option value="luxury">💎 Luxury</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Travel style</label>
          <select
            value={state.travelStyle}
            onChange={e => dispatch({ type: 'SET_STYLE', payload: e.target.value })}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="solo">🧳 Solo</option>
            <option value="family">👨‍👩‍👧 Family</option>
            <option value="backpacking">🎒 Backpacking</option>
            <option value="luxury">✨ Luxury</option>
            <option value="adventure">🏔️ Adventure</option>
          </select>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors ml-auto"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              AI is planning…
            </span>
          ) : '✨ Generate Itinerary'}
        </button>
      </div>

      {/* Day-by-day timeline */}
      {state.itinerary.map((day) => (
        <div key={day.day} className="mb-8">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-bold text-indigo-600">Day {day.day}</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{day.title}</h3>
            {day.theme && <span className="text-sm text-gray-400 italic">{day.theme}</span>}
          </div>

          <div className="space-y-3">
            {day.slots?.map((slot, i) => (
              <div
                key={i}
                className={`flex gap-4 pl-4 border-l-4 ${TYPE_COLORS[slot.type] || 'border-l-gray-300'} py-2`}
              >
                {/* Time column */}
                <div className="w-16 shrink-0 text-right">
                  <p className="text-xs font-mono font-semibold text-gray-500">{slot.time}</p>
                  <span className="text-sm">{PERIOD_ICONS[slot.period]}</span>
                </div>

                {/* Content column */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{slot.activity}</p>
                  {slot.place && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">📍 {slot.place}</p>
                  )}
                  <div className="flex gap-3 mt-1">
                    {slot.duration && <span className="text-xs text-gray-400">⏱ {slot.duration}</span>}
                    {slot.estimatedCost && <span className="text-xs text-green-600">{slot.estimatedCost}</span>}
                  </div>
                  {slot.tip && (
                    <p className="mt-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                      💡 {slot.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}