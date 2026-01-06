
import React, { useEffect, useState } from 'react';
import { RideRequest, RideStatus } from '../types';
import { Calendar, MapPin, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { VEHICLE_CONFIG } from '../constants';

const History: React.FC<{ user: any }> = ({ user }) => {
  const [history, setHistory] = useState<RideRequest[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('adile_rides') || '[]');
    const userHistory = saved.filter((r: any) => 
      (r.passengerId === user.id || r.driverId === user.id) && 
      (r.status === RideStatus.COMPLETED || r.status === RideStatus.CANCELLED)
    ).sort((a: any, b: any) => b.timestamp - a.timestamp);
    setHistory(userHistory);
  }, [user]);

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
           <HistoryIcon className="w-10 h-10 text-slate-700" />
        </div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">No History Yet</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Your completed rides will appear here</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 bg-slate-950 min-h-full">
      {history.map((ride) => (
        <div key={ride.id} className="bg-slate-900 p-6 rounded-[28px] shadow-xl border border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{new Date(ride.timestamp).toLocaleDateString()}</span>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
              ride.status === RideStatus.COMPLETED ? 'bg-green-600/10 text-green-500 border border-green-600/20' : 'bg-red-600/10 text-red-500 border border-red-600/20'
            }`}>
              {ride.status}
            </span>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white">
              {VEHICLE_CONFIG[ride.vehicleType].icon}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm font-bold text-slate-300 truncate">{ride.pickup.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm font-bold text-slate-300 truncate">{ride.dropoff.address}</p>
              </div>
            </div>
            <div className="text-right flex flex-col justify-center pl-2">
              <p className="font-black text-xl text-white">{ride.offeredPrice} <span className="text-xs text-slate-500">DH</span></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
