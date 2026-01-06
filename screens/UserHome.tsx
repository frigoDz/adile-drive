
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
  
  const [focusedField, setFocusedField] = useState<'pickup' | 'dropoff'>('pickup');
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

  // HANDLE MAP CLICK - UPDATES BASED ON CURRENT FOCUS
  const handleMapClick = (coords: [number, number]) => {
    if (focusedField === 'pickup') {
      setPickupCoords(coords);
      setPickup(`Pinned Pickup Point`);
    } else {
      setDropoffCoords(coords);
      setDropoff(`Pinned Destination`);
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
    setFocusedField('pickup');
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
      <div className="h-full flex flex-col bg-slate-950">
        <div className="flex-1 relative">
           <RealMap 
             pickupCoords={[activeRide.pickup.lat, activeRide.pickup.lng]} 
             dropoffCoords={[activeRide.dropoff.lat, activeRide.dropoff.lng]} 
           />
           <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-800">
                 <h3 className="font-bold text-lg mb-1 text-white">
                   {activeRide.status === RideStatus.PENDING ? 'Finding Drivers...' : 
                    activeRide.status === RideStatus.ACCEPTED ? 'Driver is arriving' :
                    'On your way'}
                 </h3>
                 <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="font-bold uppercase tracking-wider">{activeRide.vehicleType} • {activeRide.offeredPrice} DH</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-slate-800 z-20">
          {activeRide.status === RideStatus.PENDING ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="font-black text-white uppercase tracking-tighter text-lg">Finding nearby {activeRide.vehicleType}s...</p>
              <button 
                className="mt-6 text-red-500 font-black uppercase text-xs tracking-widest active:scale-95 transition-all" 
                onClick={onCancelRide}
              >
                Cancel Request
              </button>
            </div>
          ) : (
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                   {activeRide.driverName?.[0] || 'D'}
                 </div>
                 <div>
                   <h4 className="font-black text-lg text-white">{activeRide.driverName || 'Driver'}</h4>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active Trip • 4.9 ★</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="flex-1 relative">
        <RealMap 
          center={mapCenter} 
          pickupCoords={pickupCoords} 
          dropoffCoords={dropoffCoords} 
          onMapClick={handleMapClick}
        />
        
        <div className="absolute top-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2.5 border border-slate-800 z-10">
           <div 
            onClick={() => setFocusedField('pickup')}
            className={`flex items-center gap-3 p-3 rounded-xl relative transition-all border-2 cursor-pointer ${focusedField === 'pickup' ? 'bg-blue-600/20 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.25)]' : 'bg-slate-950/50 border-transparent'}`}>
              <MapPin className="text-green-500 w-5 h-5 shrink-0" />
              <input 
                className="bg-transparent w-full text-sm outline-none font-bold text-white placeholder-slate-600"
                value={pickup}
                onFocus={() => setFocusedField('pickup')}
                onChange={(e) => handleInputChange(e.target.value, 'pickup')}
                placeholder="Where to pick you up?"
              />
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleGetCurrentLocation(); }}
                  disabled={locating}
                  className="p-2 bg-slate-800 hover:bg-slate-700 shadow-md rounded-lg text-blue-500 active:scale-90 transition-all"
                >
                  {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                </button>
                <div className={`p-2 rounded-lg transition-all ${focusedField === 'pickup' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <MousePointer2 className="w-4 h-4" />
                </div>
              </div>
           </div>

           <div 
            onClick={() => setFocusedField('dropoff')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all border-2 cursor-pointer ${focusedField === 'dropoff' ? 'bg-blue-600/20 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.25)]' : 'bg-slate-950/50 border-transparent'}`}>
              <Search className="text-red-500 w-5 h-5 shrink-0" />
              <input 
                className="bg-transparent w-full text-sm outline-none font-bold text-white placeholder-slate-600"
                value={dropoff}
                onFocus={() => setFocusedField('dropoff')}
                onChange={(e) => handleInputChange(e.target.value, 'dropoff')}
                placeholder="Where are you going?"
              />
              <div className={`p-2 rounded-lg transition-all ${focusedField === 'dropoff' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <MousePointer2 className="w-4 h-4" />
              </div>
           </div>

           {(isSearching || suggestions.length > 0) && (
             <div className="bg-slate-900 border-t border-slate-800 rounded-b-xl overflow-hidden divide-y divide-slate-800 max-h-56 overflow-y-auto shadow-2xl">
               {isSearching && (
                 <div className="p-4 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                   <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" /> Searching...
                 </div>
               )}
               {suggestions.map((s, i) => (
                 <button 
                   key={i}
                   onClick={() => selectSuggestion(s)}
                   className="w-full text-left p-4 hover:bg-slate-800 flex items-center gap-4 text-sm font-bold text-slate-300 transition-colors"
                 >
                   <MapPin className="w-4 h-4 text-slate-600" />
                   <span className="truncate">{s.name}</span>
                 </button>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.6)] space-y-5 border-t border-slate-800 z-20">
        <div className="flex justify-between items-center px-2">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white leading-tight">Select Ride</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{distance} km trip</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-blue-500 leading-none">{price} <span className="text-sm font-black text-slate-400">DH</span></span>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1">Negotiated</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
          {Object.entries(VEHICLE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setVehicle(type as VehicleType)}
              className={`flex-1 min-w-[95px] flex flex-col items-center justify-center py-5 px-1 rounded-[28px] border-2 transition-all active:scale-95 ${
                vehicle === type 
                ? 'border-blue-600 bg-blue-600/10' 
                : 'border-slate-800 bg-slate-950/50'
              }`}
            >
              <div className={`${(config as any).color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg shrink-0 overflow-visible`}>
                 {(config as any).icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${vehicle === type ? 'text-white' : 'text-slate-500'}`}>
                {(config as any).label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleRequest}
          disabled={!pickupCoords || !dropoffCoords}
          className={`w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all ${
            (pickupCoords && dropoffCoords) 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 active:scale-[0.98]' 
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          CONFIRM REQUEST <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UserHome;
