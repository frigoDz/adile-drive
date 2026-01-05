
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  X,
  Star
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'My History', icon: History, path: '/history' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    onLogout();
    onClose();
    navigate('/login');
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">
                {user?.name?.[0] || 'A'}
              </div>
              <div>
                <h3 className="font-bold text-xl">{user?.name}</h3>
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-sm font-semibold">{user?.rating || '5.0'}</span>
                  <span className="text-gray-400 text-xs font-normal">• {user?.role}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all font-semibold"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 p-4 text-red-500 font-bold border-t pt-6"
          >
            <LogOut className="w-6 h-6" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
