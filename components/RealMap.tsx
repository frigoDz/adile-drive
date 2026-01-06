
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface RealMapProps {
  pickupCoords?: [number, number];
  dropoffCoords?: [number, number];
  center?: [number, number];
  zoom?: number;
  isTracking?: boolean;
  onMapClick?: (coords: [number, number]) => void;
}

const RealMap: React.FC<RealMapProps> = ({ 
  pickupCoords, 
  dropoffCoords, 
  center = [33.5731, -7.5898], 
  zoom = 13,
  isTracking,
  onMapClick
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  
  // Use a ref for the click handler to avoid stale closures with React state
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, zoom);

    // Add Light Mode Tile Layer (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Click listener for pinning using the latest ref
    mapRef.current.on('click', (e) => {
      onMapClickRef.current?.([e.latlng.lat, e.latlng.lng]);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync center with stabilization
  useEffect(() => {
    if (mapRef.current && center) {
      const currentCenter = mapRef.current.getCenter();
      const latDiff = Math.abs(currentCenter.lat - center[0]);
      const lngDiff = Math.abs(currentCenter.lng - center[1]);
      
      if (latDiff > 0.001 || lngDiff > 0.001) {
        mapRef.current.flyTo(center, mapRef.current.getZoom(), { 
          duration: 1.2,
          easeLinearity: 0.25
        });
      }
    }
  }, [center]);

  // Handle Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Pickup Marker (Green - 20px)
    if (pickupCoords) {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="flex items-center justify-center">
                <div class="bg-white p-0.5 rounded-full shadow-lg border-2 border-green-500">
                  <div class="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                </div>
              </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(pickupCoords);
        pickupMarkerRef.current.setIcon(icon);
      } else {
        pickupMarkerRef.current = L.marker(pickupCoords, { icon }).addTo(mapRef.current);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    // Dropoff Marker (Red - 20px)
    if (dropoffCoords) {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="flex items-center justify-center">
                <div class="bg-white p-0.5 rounded-full shadow-lg border-2 border-red-500">
                  <div class="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                </div>
              </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng(dropoffCoords);
        dropoffMarkerRef.current.setIcon(icon);
      } else {
        dropoffMarkerRef.current = L.marker(dropoffCoords, { icon }).addTo(mapRef.current);
      }
    } else if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }

    // Auto-zoom to fit both pins
    if (pickupCoords && dropoffCoords && mapRef.current) {
      const bounds = L.latLngBounds([pickupCoords, dropoffCoords]);
      mapRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-100">
      <div className="absolute bottom-12 right-4 z-[1000] flex flex-col gap-3">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-white text-slate-900 rounded-xl shadow-xl flex items-center justify-center font-black text-lg hover:bg-slate-50 active:scale-90 transition-all border border-slate-200"
        >
          +
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-white text-slate-900 rounded-xl shadow-xl flex items-center justify-center font-black text-lg hover:bg-slate-50 active:scale-90 transition-all border border-slate-200"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default RealMap;
