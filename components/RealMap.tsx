
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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, zoom);

    // Add Free OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Click listener for pinning
    mapRef.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync center
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.flyTo(center, mapRef.current.getZoom(), { duration: 1 });
    }
  }, [center]);

  // Handle Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Pickup Marker
    if (pickupCoords) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(pickupCoords);
      } else {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-white p-1 rounded-full shadow-lg border-2 border-green-500">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>`,
          iconSize: [20, 20]
        });
        pickupMarkerRef.current = L.marker(pickupCoords, { icon }).addTo(mapRef.current);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    // Dropoff Marker
    if (dropoffCoords) {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng(dropoffCoords);
      } else {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-white p-1 rounded-full shadow-lg border-2 border-red-500">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>`,
          iconSize: [20, 20]
        });
        dropoffMarkerRef.current = L.marker(dropoffCoords, { icon }).addTo(mapRef.current);
      }
    } else if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }

    // Bounds fit
    if (pickupCoords && dropoffCoords && mapRef.current) {
      const bounds = L.latLngBounds([pickupCoords, dropoffCoords]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-90 transition-all"
        >
          +
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-90 transition-all"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default RealMap;
