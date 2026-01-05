
import React from 'react';
import { Bell, Info, CheckCircle, AlertCircle } from 'lucide-react';

const Notifications: React.FC = () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'Welcome to Adile Drive!',
      message: 'Get 20% off your first ride in Casablanca.',
      type: 'info',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'Profile Verified',
      message: 'Your account is now fully verified. Happy driving!',
      type: 'success',
      time: '1 day ago'
    },
    {
      id: '3',
      title: 'Service Update',
      message: 'We expanded our service area to Mohammedia!',
      type: 'info',
      time: '2 days ago'
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-500" />;
      case 'warning': return <AlertCircle className="text-orange-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-gray-500 uppercase text-xs tracking-widest">Recent</h2>
        <button className="text-blue-600 text-xs font-bold">Mark all read</button>
      </div>
      
      {mockNotifications.map((notif) => (
        <div key={notif.id} className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100 shadow-sm items-start">
          <div className="bg-gray-50 p-2 rounded-xl">
            {getIcon(notif.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">{notif.title}</h4>
            <p className="text-sm text-gray-500 mb-1">{notif.message}</p>
            <span className="text-[10px] font-bold text-gray-300 uppercase">{notif.time}</span>
          </div>
        </div>
      ))}

      {mockNotifications.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
           <Bell className="w-16 h-16 mb-4" />
           <p className="font-bold">No new notifications</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
