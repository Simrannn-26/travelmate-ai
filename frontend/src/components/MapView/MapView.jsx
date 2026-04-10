// Mapbox GL JS map with place markers
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTravel } from '../../context/TravelContext';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const CATEGORY_COLORS = {
  attractions: '#6366f1',
  restaurants: '#f97316',
  hotels:      '#3b82f6',
  default:     '#8b5cf6',
};

export function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const { state } = useTravel();

  // Initialize map when location is available
  useEffect(() => {
    if (!state.location || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:     'mapbox://styles/mapbox/streets-v12',
      center:    [state.location.lng, state.location.lat],
      zoom:      12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl());

    // Center marker
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([state.location.lng, state.location.lat])
      .setPopup(new mapboxgl.Popup().setHTML(
        `<strong>${state.location.city}</strong><br/>${state.location.country}`
      ))
      .addTo(map.current);
  }, [state.location]);

  // Update place markers when places change
  useEffect(() => {
    if (!map.current || !state.places.length) return;

    // Clear previous markers
    markers.current.forEach(m => m.remove());
    markers.current = [];

    state.places.forEach(place => {
      if (!place.lat || !place.lng) return;

      const category = place.kinds?.[0] || 'default';
      const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

      // Custom colored marker element
      const el = document.createElement('div');
      el.style.cssText = `
        width: 24px; height: 24px; border-radius: 50%;
        background: ${color}; border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer;
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.lng, place.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 15 }).setHTML(
            `<div style="font-family: sans-serif; max-width: 160px">
              <strong>${place.name}</strong>
              ${place.rate ? `<br/><span style="color:#f59e0b">${'★'.repeat(Math.round(place.rate))}</span>` : ''}
            </div>`
          )
        )
        .addTo(map.current);

      markers.current.push(marker);
    });

    // Fit map to markers
    if (state.places.length > 1) {
      const coords = state.places.filter(p => p.lat && p.lng).map(p => [p.lng, p.lat]);
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    }
  }, [state.places]);

  if (!state.location) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div ref={mapContainer} style={{ height: '420px' }}/>
    </div>
  );
}
