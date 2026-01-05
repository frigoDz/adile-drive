
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';

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
    <div className="max-w-md mx-auto h-screen bg-white shadow-2xl flex flex-col relative overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
        onLogout={onLogout}
      />

      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-50 rounded-full"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-blue-600">
            {title || 'Adile Drive'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 font-bold">
            {user?.name?.[0]}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
