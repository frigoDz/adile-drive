
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  title?: string;
  showBack?: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, title, showBack, onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-950 shadow-2xl flex flex-col relative overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
        onLogout={onLogout}
      />

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-3 flex items-center justify-between z-[1500] shrink-0">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-900 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-200" />
            </button>
          ) : (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-900 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-200" />
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-black tracking-tight text-white uppercase italic">
              {title}
            </h1>
          ) : (
             <div className="scale-[0.8] origin-left">
                <Logo size="sm" showIcon={false} />
             </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/20">
            {user?.name?.[0]}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950 flex flex-col text-slate-200">
        {children}
      </main>
    </div>
  );
};

export default Layout;
