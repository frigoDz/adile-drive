
import React, { useState } from 'react';
import { mockAuth } from '../services/mockFirebase';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';

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
    <div className="h-full flex flex-col p-6 bg-slate-950 max-w-md mx-auto shadow-xl">
      <div className="mt-16 mb-12">
        <h1 className="text-5xl font-black text-white italic tracking-tighter">
          ADILE<span className="text-blue-500">DRIVE</span>
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Safe. Fair. Local.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              className="w-full bg-slate-900 px-12 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-white uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              required
              className="w-full bg-slate-900 px-12 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            <p className="text-red-400 text-sm font-bold text-center">{error}</p>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-900/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>SIGN IN <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <div className="mt-auto pb-8 text-center">
        <p className="text-slate-500 font-medium">
          New to the platform?{' '}
          <button 
            onClick={onNavigateToSignup}
            className="text-white font-black hover:underline underline-offset-4"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
