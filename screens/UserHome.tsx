
import React, { useState, useEffect, useMemo, useRef } from 'react';
import RealMap from '../components/RealMap';
import { Search, MapPin, Send, Navigation, Loader2, MousePointer2 } from 'lucide-react';
import { VehicleType, RideStatus, RideRequest } from '../types';
import { VEHICLE_CONFIG } from '../constants';
import { searchOsmPlaces, calculateDistance, calculatePrice } from '../utils/geo';

interface UserHomeProps {
  user: any;
  onRequestRide: (request: Partial<RideRequest>) => void;
  onCancelRide: () => void;
  activeRide: RideRequest | null;
}

const UserHome: React.FC<UserHomeProps> = ({ user, onRequestRide, onCancelRide, activeRide }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | undefined>(undefined);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | undefined>(undefined);
  const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.CAR);
  const [locating, setLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([33.5731, -7.5898]);
  const [focusedField, setFocusedField] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<{ name: string, coords: [number, number] }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<any>(null);

  const handleInputChange = (value: string, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') setPickup(value);
    else setDropoff(value);
    
    setFocusedField(type);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (value.length > 2) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        const results = await searchOsmPlaces(value);
        setSuggestions(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const selectSuggestion = (suggestion: { name: string, coords: [number, number] }) => {
    if (focusedField === 'pickup') {
      setPickup(suggestion.name);
      setPickupCoords(suggestion.coords);
      setMapCenter(suggestion.coords);
    } else {
      setDropoff(suggestion.name);
      setDropoffCoords(suggestion.coords);
      setMapCenter(suggestion.coords);
    }
    setSuggestions([]);
  };

  const handleMapClick = (coords: [number, number]) => {
    if (focusedField === 'pickup') {
      setPickupCoords(coords);
      setPickup(`Pinned: ${coords[0].toFixed(3)}, ${coords[1].toFixed(3)}`);
    } else {
      setDropoffCoords(coords);
      setDropoff(`Pinned: ${coords[0].toFixed(3)}, ${coords[1].toFixed(3)}`);
    }
  };

  const { distance, price } = useMemo(() => {
    if (pickupCoords && dropoffCoords) {
      const dist = calculateDistance(pickupCoords[0], pickupCoords[1], dropoffCoords[0], dropoffCoords[1]);
      const basePrice = calculatePrice(dist);
      const finalPrice = Math.round(basePrice * (VEHICLE_CONFIG[vehicle] as any).baseMultiplier);
      return { distance: dist.toFixed(1), price: finalPrice };
    }
    return { distance: '0', price: 0 };
  }, [pickupCoords, dropoffCoords, vehicle]);

  const handleGetCurrentLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setMapCenter(coords);
        setPickupCoords(coords);
        setPickup(`My Current Location`);
        setLocating(false);
      }, () => {
        setLocating(false);
      });
    } else {
      setLocating(false);
    }
  };

  const handleRequest = () => {
    if (!dropoffCoords || !pickupCoords) return;
    onRequestRide({
      pickup: { address: pickup, lat: pickupCoords[0], lng: pickupCoords[1] },
      dropoff: { address: dropoff, lat: dropoffCoords[0], lng: dropoffCoords[1] },
      offeredPrice: price,
      vehicleType: vehicle,
      status: RideStatus.PENDING,
      passengerName: user.name,
      passengerId: user.id,
      timestamp: Date.now()
    });
  };

  if (activeRide) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 relative">
           <RealMap 
             pickupCoords={[activeRide.pickup.lat, activeRide.pickup.lng]} 
             dropoffCoords={[activeRide.dropoff.lat, activeRide.dropoff.lng]} 
           />
           <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/50">
                 <h3 className="font-bold text-lg mb-1">
                   {activeRide.status === RideStatus.PENDING ? 'Finding Drivers...' : 
                    activeRide.status === RideStatus.ACCEPTED ? 'Driver is arriving' :
                    'On your way'}
                 </h3>
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>{activeRide.vehicleType.toUpperCase()} • {activeRide.offeredPrice} DH</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t z-20">
          {activeRide.status === RideStatus.PENDING ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-semibold text-gray-700">Finding nearby {activeRide.vehicleType}s...</p>
              <button 
                className="mt-4 text-red-500 font-bold active:scale-95 transition-all" 
                onClick={onCancelRide}
              >
                Cancel Request
              </button>
            </div>
          ) : (
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                   {activeRide.driverName?.[0] || 'D'}
                 </div>
                 <div>
                   <h4 className="font-bold text-lg">{activeRide.driverName || 'Driver'}</h4>
                   <p className="text-gray-500 text-sm">Active Trip • 4.9 ★</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <RealMap 
          center={mapCenter} 
          pickupCoords={pickupCoords} 
          dropoffCoords={dropoffCoords} 
          onMapClick={handleMapClick}
        />
        
        <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-xl p-2 flex flex-col gap-2 border border-gray-100 z-[1001]">
           <div className={`flex items-center gap-3 p-2 rounded-xl relative transition-all ${focusedField === 'pickup' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-transparent'}`}>
              <MapPin className="text-green-600 w-5 h-5 shrink-0" />
              <input 
                className="bg-transparent w-full text-sm outline-none font-medium"
                value={pickup}
                onFocus={() => setFocusedField('pickup')}
                onChange={(e) => handleInputChange(e.target.value, 'pickup')}
                placeholder="Pickup Neighborhood or Tap Map"
              />
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleGetCurrentLocation}
                  disabled={locating}
                  className="p-1.5 bg-white shadow-sm rounded-lg text-blue-600 active:scale-90"
                >
                  {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setFocusedField('pickup')}
                  className={`p-1.5 rounded-lg transition-all ${focusedField === 'pickup' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}
                >
                  <MousePointer2 className="w-4 h-4" />
                </button>
              </div>
           </div>

           <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${focusedField === 'dropoff' ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-transparent'}`}>
              <Search className="text-blue-600 w-5 h-5 shrink-0" />
              <input 
                className="bg-transparent w-full text-sm outline-none font-medium"
                value={dropoff}
                onFocus={() => setFocusedField('dropoff')}
                onChange={(e) => handleInputChange(e.target.value, 'dropoff')}
                placeholder="Where to?"
              />
              <button 
                onClick={() => setFocusedField('dropoff')}
                className={`p-1.5 rounded-lg transition-all ${focusedField === 'dropoff' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
           </div>

           {(isSearching || suggestions.length > 0) && (
             <div className="bg-white border-t rounded-b-xl overflow-hidden divide-y max-h-48 overflow-y-auto">
               {isSearching && (
                 <div className="p-3 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
                   <Loader2 className="w-3 h-3 animate-spin" /> Searching OpenStreetMap...
                 </div>
               )}
               {suggestions.map((s, i) => (
                 <button 
                   key={i}
                   onClick={() => selectSuggestion(s)}
                   className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700"
                 >
                   <MapPin className="w-4 h-4 text-gray-300" />
                   <span className="truncate">{s.name}</span>
                 </button>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-t-3xl shadow-2xl space-y-4 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Select Ride</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{distance} km trip</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-blue-600">{price} <span className="text-sm">DH</span></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fixed Fare</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {Object.entries(VEHICLE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setVehicle(type as VehicleType)}
              className={`flex-1 min-w-[100px] flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                vehicle === type ? 'border-blue-600 bg-blue-50 shadow-inner' : 'border-gray-100 bg-white'
              }`}
            >
              <div className={`${(config as any).color} p-2 rounded-xl text-white mb-2 shadow-sm`}>
                {(config as any).icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-tighter">{(config as any).label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleRequest}
          disabled={!pickupCoords || !dropoffCoords}
          className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
            (pickupCoords && dropoffCoords) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          REQUEST NOW <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UserHome;
