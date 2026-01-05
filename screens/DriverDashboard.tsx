
import React, { useState, useEffect } from 'react';
import { RideRequest, RideStatus, User } from '../types';
import { MapPin, Navigation, Clock, Car, LocateFixed, ShieldCheck } from 'lucide-react';
import { VEHICLE_CONFIG } from '../constants';
import { calculateDistance } from '../utils/geo';

interface DriverDashboardProps {
  user: User;
  requests: RideRequest[];
  onAccept: (rideId: string) => void;
  activeRide: RideRequest | null;
  onComplete: (rideId: string) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, requests, onAccept, activeRide, onComplete }) => {
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null);
  const MAX_RADIUS_KM = 20;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setDriverLoc([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation denied. Proximity filtering may be inaccurate.")
      );
    }
  }, []);

  // Filter requests by distance (within 20km)
  const nearbyRequests = requests.filter(req => {
    if (!driverLoc) return true; // Show all if location is unknown
    const dist = calculateDistance(driverLoc[0], driverLoc[1], req.pickup.lat, req.pickup.lng);
    return dist <= MAX_RADIUS_KM;
  });

  if (activeRide) {
    return (
      <div className="h-full flex flex-col p-6 space-y-6">
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl">
           <div className="flex justify-between items-start mb-2">
             <h2 className="text-2xl font-black uppercase tracking-tighter italic">ACTIVE TRIP</h2>
             <div className="bg-white/20 p-2 rounded-xl">
               <Car className="w-5 h-5" />
             </div>
           </div>
           <p className="opacity-80 text-sm font-bold">{user.vehicleModel} • {user.licensePlate}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex-1 space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">👤</div>
              <div>
                 <h3 className="text-xl font-black">{activeRide.passengerName}</h3>
                 <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Passenger • 4.9 Rating</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-10 bg-gray-100"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                 </div>
                 <div className="flex-1 space-y-6">
                    <div>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pickup</p>
                       <p className="font-bold text-slate-700 truncate">{activeRide.pickup.address}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dropoff</p>
                       <p className="font-bold text-slate-700 truncate">{activeRide.dropoff.address}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t flex items-center justify-between">
              <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Earnings</p>
                 <p className="text-3xl font-black text-blue-600">{activeRide.offeredPrice} <span className="text-sm">DH</span></p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
                 <p className="text-sm font-black text-green-600 uppercase">
                    {activeRide.status === RideStatus.ACCEPTED ? 'Arriving' : 'En Route'}
                 </p>
              </div>
           </div>
        </div>

        <button 
           onClick={() => onComplete(activeRide.id)}
           className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {activeRide.status === RideStatus.ACCEPTED ? 'ARRIVED AT PICKUP' : 'COMPLETE TRIP'}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-6 bg-white border-b sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">Requests</h2>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nearby (20km)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{user.vehicleModel}</p>
           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.vehicleType === 'car' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
             {user.vehicleType}
           </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {nearbyRequests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <LocateFixed className="w-10 h-10 text-slate-300 animate-pulse" />
            </div>
            <p className="font-black text-slate-400 text-lg uppercase tracking-tighter">Searching nearby...</p>
            <p className="text-sm text-slate-300 font-medium">Staying within 20km of your position</p>
          </div>
        ) : (
          nearbyRequests.map(req => {
            const distance = driverLoc ? calculateDistance(driverLoc[0], driverLoc[1], req.pickup.lat, req.pickup.lng).toFixed(1) : '?';
            
            return (
              <div key={req.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-950 p-3 rounded-2xl text-white">
                      {VEHICLE_CONFIG[req.vehicleType].icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{req.passengerName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                          {distance} km away
                        </span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          4.8 ★
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">{req.offeredPrice} <span className="text-xs">DH</span></p>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Offer</p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                    <p className="text-xs font-bold text-slate-600 truncate">{req.pickup.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                    <p className="text-xs font-bold text-slate-600 truncate">{req.dropoff.address}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                     onClick={() => onAccept(req.id)}
                     className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                  >
                    ACCEPT RIDE <Navigation className="w-4 h-4" />
                  </button>
                  <button className="flex-1 border border-slate-200 rounded-2xl font-black text-xs text-slate-400 uppercase tracking-widest active:bg-slate-50">
                    Skip
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
