
import React, { useState } from 'react';
import { mockAuth } from '../services/mockFirebase';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await mockAuth.login(email);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-8 bg-slate-950 overflow-y-auto">
      <div className="mt-16 mb-20 flex flex-col items-center">
        {/* showIcon={false} ensures only 'ADILE DRIVE' text appears */}
        <Logo size="xl" showIcon={false} className="mb-2" />
        <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-6 shadow-lg shadow-blue-600/20"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              className="w-full bg-slate-900 px-12 py-5 rounded-2xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              required
              className="w-full bg-slate-900 px-12 py-5 rounded-2xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <p className="text-red-400 text-xs font-bold text-center uppercase tracking-wider">{error}</p>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-900/30 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>SIGN IN <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <div className="mt-auto py-8 text-center">
        <p className="text-slate-500 font-bold text-sm">
          Don't have an account?{' '}
          <button 
            onClick={onNavigateToSignup}
            className="text-white font-black hover:underline underline-offset-4"
          >
            SIGN UP
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
