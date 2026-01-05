
import React, { useState } from 'react';
import { UserRole, VehicleType } from '../types';
import { mockAuth } from '../services/mockFirebase';
import { Loader2, User, Lock, Phone, Mail, AlertCircle, Car, Bike, Truck, Info, CheckCircle2 } from 'lucide-react';
import { validateEmail, validateMoroccanPhone, validatePasswordStrength } from '../utils/validation';

const SteeringWheel = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12V3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l6 6M12 12l-6 6" />
  </svg>
);

interface SignupProps {
  onSignupSuccess: (user: any) => void;
  onNavigateToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.CAR);
  const [vehicleModel, setVehicleModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateMoroccanPhone(phone)) {
      setError('Invalid Moroccan phone number format.');
      return;
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.isValid) {
      setError(passCheck.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === UserRole.DRIVER) {
      if (!vehicleModel.trim()) {
        setError('Please enter your vehicle brand and model.');
        return;
      }
      if (!licensePlate.trim()) {
        setError('Please enter your license plate number.');
        return;
      }
    }

    setLoading(true);
    try {
      const user = await mockAuth.signup({
        email,
        name,
        role,
        phone,
        password,
        vehicleType: role === UserRole.DRIVER ? vehicleType : undefined,
        vehicleModel: role === UserRole.DRIVER ? vehicleModel : undefined,
        licensePlate: role === UserRole.DRIVER ? licensePlate : undefined
      });
      onSignupSuccess(user);
    } catch (err: any) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-slate-950 max-w-md mx-auto shadow-xl overflow-y-auto">
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-black text-white">Create Account</h1>
        <p className="text-slate-400 mt-2 font-medium">Join the Adile Drive community today.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setRole(UserRole.PASSENGER)}
          className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
            role === UserRole.PASSENGER 
            ? 'border-blue-600 bg-blue-600/10 text-white' 
            : 'border-slate-800 bg-slate-900 text-slate-500'
          }`}
        >
          <User className="w-6 h-6 mb-2" />
          <span className="font-black text-xs uppercase">Passenger</span>
        </button>
        <button
          onClick={() => setRole(UserRole.DRIVER)}
          className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
            role === UserRole.DRIVER 
            ? 'border-blue-600 bg-blue-600/10 text-white' 
            : 'border-slate-800 bg-slate-900 text-slate-500'
          }`}
        >
          <SteeringWheel className="w-6 h-6 mb-2" />
          <span className="font-black text-xs uppercase">Driver</span>
        </button>
      </div>

      <form onSubmit={handleSignup} className="space-y-5 pb-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              required
              className="w-full bg-slate-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              className="w-full bg-slate-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="tel"
              required
              className="w-full bg-slate-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone (e.g. 0612345678)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                className="w-full bg-slate-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                className="w-full bg-slate-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {role === UserRole.DRIVER && (
          <div className="mt-8 space-y-5 p-6 bg-slate-900/50 rounded-3xl border border-slate-800 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Vehicle Details</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: VehicleType.CAR, icon: Car, label: 'Car' },
                { type: VehicleType.MOTORCYCLE, icon: Bike, label: 'Bike' },
                { type: VehicleType.VAN, icon: Truck, label: 'Van' },
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type)}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                    vehicleType === v.type 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  <v.icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-black uppercase">{v.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                required={role === UserRole.DRIVER}
                className="w-full bg-slate-950 px-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brand & Model (e.g. Dacia Logan)"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
              <input
                type="text"
                required={role === UserRole.DRIVER}
                className="w-full bg-slate-950 px-4 py-4 rounded-2xl border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono tracking-widest"
                placeholder="License Plate #"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin text-white" /> : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="mt-auto text-center pb-8 border-t border-slate-900 pt-6">
        <button onClick={onNavigateToLogin} className="text-slate-500 font-medium">
          Already a member? <span className="text-white font-black">LOG IN</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
