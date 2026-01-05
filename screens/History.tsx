
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
        <HistoryIcon className="w-20 h-20 mb-4" />
        <h3 className="text-xl font-bold">No History Found</h3>
        <p>Your completed rides will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {history.map((ride) => (
        <div key={ride.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(ride.timestamp).toLocaleDateString()}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              ride.status === RideStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {ride.status.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-3">
            <div className="bg-gray-50 p-3 rounded-xl">
              {VEHICLE_CONFIG[ride.vehicleType].icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm font-semibold truncate">{ride.pickup.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <p className="text-sm font-semibold truncate">{ride.dropoff.address}</p>
              </div>
            </div>
            <div className="text-right flex flex-col justify-center">
              <p className="font-black text-lg">{ride.offeredPrice} DH</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
