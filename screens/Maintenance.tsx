
import React from 'react';
import { ShieldAlert, Lock, Terminal } from 'lucide-react';

interface MaintenanceProps {
  message: string;
}

const Maintenance: React.FC<MaintenanceProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-slate-950 z-[9999] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <ShieldAlert className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
        System Authorized Access Only
      </h1>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 w-full max-w-sm">
        <p className="text-slate-400 text-sm leading-relaxed font-mono">
          {message}
        </p>
      </div>

      <div className="flex items-center gap-2 text-slate-600 font-mono text-xs uppercase tracking-widest">
        <Terminal className="w-4 h-4" />
        <span>Error Code: AD_REMOTE_TERMINATION_V1</span>
      </div>

      <div className="absolute bottom-12 opacity-20">
        <Lock className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default Maintenance;
