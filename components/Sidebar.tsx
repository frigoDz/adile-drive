
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
import Logo from './Logo';

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
        className={`fixed inset-0 bg-black/50 z-[2000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-slate-950 z-[2001] transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <div className="scale-90 origin-left">
              <Logo size="sm" showIcon={false} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          <div className="mb-10 flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <h3 className="font-black text-white">{user?.name}</h3>
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-wider">{user?.rating || '5.0'} Rating</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-blue-600 text-slate-400 hover:text-white transition-all font-black text-sm uppercase tracking-widest"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-5 p-4 text-red-500 font-black text-sm uppercase tracking-[0.2em] border-t border-slate-900 pt-8"
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
