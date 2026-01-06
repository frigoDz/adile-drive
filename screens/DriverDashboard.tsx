
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

  const nearbyRequests = requests.filter(req => {
    if (!driverLoc) return true;
    const dist = calculateDistance(driverLoc[0], driverLoc[1], req.pickup.lat, req.pickup.lng);
    return dist <= MAX_RADIUS_KM;
  });

  if (activeRide) {
    return (
      <div className="h-full flex flex-col p-6 space-y-6 bg-slate-950">
        <div className="bg-blue-600 text-white p-7 rounded-[32px] shadow-2xl shadow-blue-900/20">
           <div className="flex justify-between items-start mb-2">
             <h2 className="text-2xl font-black uppercase tracking-tighter italic">ACTIVE TRIP</h2>
             <div className="bg-white/20 p-2.5 rounded-xl">
               <Car className="w-6 h-6" />
             </div>
           </div>
           <p className="opacity-90 text-sm font-black tracking-widest uppercase">{user.vehicleModel} • {user.licensePlate}</p>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-7 shadow-xl border border-slate-800 flex-1 space-y-7">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg text-white font-black">
                {activeRide.passengerName?.[0]}
              </div>
              <div>
                 <h3 className="text-xl font-black text-white">{activeRide.passengerName}</h3>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Passenger • 4.9 Rating</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex gap-5">
                 <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                    <div className="w-0.5 h-12 bg-slate-800"></div>
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                 </div>
                 <div className="flex-1 space-y-8">
                    <div>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Pickup</p>
                       <p className="font-bold text-slate-200 text-sm">{activeRide.pickup.address}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Dropoff</p>
                       <p className="font-bold text-slate-200 text-sm">{activeRide.dropoff.address}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Earnings</p>
                 <p className="text-3xl font-black text-blue-500">{activeRide.offeredPrice} <span className="text-sm font-black text-slate-500">DH</span></p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Status</p>
                 <p className="text-xs font-black text-green-500 uppercase tracking-widest">
                    {activeRide.status === RideStatus.ACCEPTED ? 'Arriving' : 'En Route'}
                 </p>
              </div>
           </div>
        </div>

        <button 
           onClick={() => onComplete(activeRide.id)}
           className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xl shadow-xl shadow-blue-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          {activeRide.status === RideStatus.ACCEPTED ? 'ARRIVED AT PICKUP' : 'COMPLETE TRIP'}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="p-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Requests</h2>
          <div className="flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-600/20">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Nearby (20km)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{user.vehicleModel}</p>
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.vehicleType === 'car' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'}`}>
             {user.vehicleType}
           </div>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {nearbyRequests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              <LocateFixed className="w-10 h-10 text-slate-700 animate-pulse" />
            </div>
            <p className="font-black text-white text-lg uppercase tracking-tighter">Searching nearby...</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Ready for next passenger</p>
          </div>
        ) : (
          nearbyRequests.map(req => {
            const distance = driverLoc ? calculateDistance(driverLoc[0], driverLoc[1], req.pickup.lat, req.pickup.lng).toFixed(1) : '?';
            
            return (
              <div key={req.id} className="bg-slate-900 rounded-[32px] p-6 shadow-xl border border-slate-800 space-y-5 hover:border-blue-600/50 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-950 p-4 rounded-[20px] text-white border border-slate-800 group-hover:border-blue-600/30 transition-colors">
                      {VEHICLE_CONFIG[req.vehicleType].icon}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-lg">{req.passengerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                          {distance} km away
                        </span>
                        <span className="text-slate-700 text-[10px]">•</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          4.8 ★
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-500 leading-none">{req.offeredPrice} <span className="text-xs">DH</span></p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Offer</p>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-950/80 p-5 rounded-[24px] border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
                    <p className="text-xs font-bold text-slate-400 truncate">{req.pickup.address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>
                    <p className="text-xs font-bold text-slate-400 truncate">{req.dropoff.address}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                     onClick={() => onAccept(req.id)}
                     className="flex-[2] bg-blue-600 text-white py-4.5 rounded-[20px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 active:scale-[0.98] transition-all"
                  >
                    ACCEPT <Navigation className="w-4 h-4" />
                  </button>
                  <button className="flex-1 bg-slate-800 border border-slate-700 rounded-[20px] font-black text-[10px] text-slate-400 uppercase tracking-widest active:bg-slate-700 transition-colors">
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
