import { useState } from 'react';
import { travelApi } from '../../api/travelApi';

export function PlaceCard({ place, onSelect }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const CATEGORY_COLORS = {
    museums:     'bg-purple-100 text-purple-700',
    foods:       'bg-orange-100 text-orange-700',
    natural:     'bg-green-100 text-green-700',
    accomodations: 'bg-blue-100 text-blue-700',
    historic:    'bg-amber-100 text-amber-700',
    default:     'bg-gray-100 text-gray-700',
  };

  const getColor = (kinds = []) => {
    for (const k of kinds) {
      if (CATEGORY_COLORS[k]) return CATEGORY_COLORS[k];
    }
    return CATEGORY_COLORS.default;
  };

  const loadDetail = async () => {
    if (detail) { setExpanded(e => !e); return; }
    setLoading(true);
    try {
      const res = await travelApi.getPlaceDetail(place.id);
      setDetail(res.data);
      setExpanded(true);
    } catch {
      setExpanded(e => !e);
    } finally {
      setLoading(false);
    }
  };

  const stars = place.rate ? Math.round(parseFloat(place.rate)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image placeholder with gradient */}
      {detail?.image ? (
        <img src={detail.image} alt={place.name} className="w-full h-40 object-cover"/>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
          <span className="text-4xl">🗺️</span>
        </div>
      )}

      <div className="p-4">
        {/* Category badges */}
        <div className="flex gap-1 flex-wrap mb-2">
          {place.kinds?.slice(0, 2).map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full font-medium ${getColor([k])}`}>
              {k.replace(/_/g, ' ')}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight">{place.name}</h3>

        {/* Star rating */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < stars ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
          ))}
          {place.dist && (
            <span className="text-xs text-gray-400 ml-1">{(place.dist / 1000).toFixed(1)} km away</span>
          )}
        </div>

        {/* Expanded detail */}
        {expanded && detail?.description && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
            {detail.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={loadDetail}
            className="flex-1 text-xs py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading…' : expanded ? 'Less' : 'Details'}
          </button>
          <button
            onClick={() => onSelect?.(place)}
            className="flex-1 text-xs py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            + Add to trip
          </button>
        </div>
      </div>
    </div>
  );
}