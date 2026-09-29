import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Car, Wrench, Shield, Check } from 'lucide-react';
import { dbService } from '../services/db';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Registration state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos');
  const [ninNumber, setNinNumber] = useState('');
  const [driverLicenseNo, setDriverLicenseNo] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Electrical & Solar');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = dbService.login(email);
    if (res.success) {
      onLoginSuccess();
      onClose();
    } else {
      setError(res.message || 'Login failed. Check your email or use a 1-click demo persona.');
    }
  };

  const handleDemoLogin = (demoRole: UserRole) => {
    dbService.switchUserByRole(demoRole);
    onLoginSuccess();
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone) {
      setError('Please provide your full name, email, and phone number');
      return;
    }

    dbService.register({
      name,
      email,
      phone,
      role,
      city,
      state,
      ninNumber,
      driverLicenseNo,
      vehicleModel,
      vehiclePlate,
      serviceCategory: role === 'PROVIDER' ? serviceCategory : undefined,
    });

    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">Naijashare Q-Fix</span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                Verified Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure authentication with role permissions & NIN verification
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Existing Client / Partner Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <div className="space-y-5">
              {/* Quick Demo Personas */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Instant Demo Sign-In (1-Click Switch):</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('CLIENT')}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-emerald-700">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Chidi (Client)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Book rides, request fixes, rent stays</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('DRIVER')}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-emerald-700">
                      <Car className="w-4 h-4 text-emerald-600" />
                      <span>Babatunde (Driver)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Toyota Corolla 2021 · Verified FRSC</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('PROVIDER')}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-emerald-700">
                      <Wrench className="w-4 h-4 text-emerald-600" />
                      <span>Emeka (Q-Fix Master)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Solar & Inverter Technician · COREN</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ADMIN')}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 group-hover:text-emerald-700">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Amina (Admin 🔒)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">NIN: 14303779142 required for operations</p>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <hr className="w-full border-slate-200" />
                <span className="absolute bg-white px-2 text-[11px] text-slate-400 font-medium">or login with credentials</span>
              </div>

              {/* Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@naijashare.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Sign In to Naijashare Q-Fix
                </button>
              </form>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Select Account Role:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CLIENT', 'DRIVER', 'PROVIDER'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        role === r
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {r === 'CLIENT' && 'Client'}
                      {r === 'DRIVER' && 'Driver (Carpool)'}
                      {r === 'PROVIDER' && 'Q-Fix Artisan'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Damilola Adeyemi"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone (+234 format)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.ng"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City / Region</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Lekki, Lagos">Lekki, Lagos</option>
                    <option value="Victoria Island, Lagos">Victoria Island, Lagos</option>
                    <option value="Ikeja, Lagos">Ikeja, Lagos</option>
                    <option value="Maitama, Abuja">Maitama, Abuja</option>
                    <option value="Wuse 2, Abuja">Wuse 2, Abuja</option>
                    <option value="Bodija, Ibadan">Bodija, Ibadan</option>
                    <option value="Port Harcourt">Port Harcourt, Rivers</option>
                  </select>
                </div>
              </div>

              {/* Conditional role fields */}
              {role === 'DRIVER' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <p className="font-semibold text-amber-900">Driver License & Vehicle Details:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Vehicle (e.g. Toyota Corolla 2022)"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-amber-200 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Plate Number (e.g. LAG-902-XP)"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-amber-200 rounded-md font-mono"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="FRSC Driver License Number"
                    value={driverLicenseNo}
                    onChange={(e) => setDriverLicenseNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-md font-mono"
                  />
                </div>
              )}

              {role === 'PROVIDER' && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
                  <p className="font-semibold text-emerald-900">Artisan Category & Trade Verification:</p>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md text-xs"
                  >
                    <option value="Electrical & Solar">Electrical & Solar</option>
                    <option value="AC & Refrigeration">AC & Refrigeration</option>
                    <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                    <option value="Carpentry & Roofing">Carpentry & Roofing</option>
                    <option value="Painting & Renovation">Painting & Renovation</option>
                    <option value="Generator Repair">Generator Repair</option>
                  </select>
                  <input
                    type="text"
                    placeholder="11-Digit National Identity Number (NIN)"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    maxLength={11}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md font-mono"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All partner applications are screened against NIMC & FRSC official registers.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Register & Initialize Account
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
