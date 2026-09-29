import React from 'react';
import { User, UserRole } from '../types';
import { Download, ChevronDown, Check, User as UserIcon, ShieldCheck, ExternalLink, Store } from 'lucide-react';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'home' | 'rides' | 'services' | 'apartments' | 'dashboard';
  setActiveTab: (tab: 'home' | 'rides' | 'services' | 'apartments' | 'dashboard') => void;
  onOpenAuth: () => void;
  onOpenCodeExplorer: () => void;
  onOpenVerification: () => void;
  onOpenAdvertise?: () => void;
  onRoleSwitch: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenCodeExplorer,
  onOpenVerification,
  onOpenAdvertise,
  onRoleSwitch,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'CLIENT', label: 'Client (Passenger / User)', desc: 'Book rides, apartments & repairs' },
    { role: 'DRIVER', label: 'Driver (Carpool Partner)', desc: 'Post routes, pickup commuters' },
    { role: 'PROVIDER', label: 'Q-Fix Artisan / Provider', desc: 'Solar, HVAC & electrical jobs' },
    { role: 'ADMIN', label: 'Platform Administrator (Locked)', desc: 'Protected by Admin NIN: 14303779142' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>Naijashare</span>
            <span className="text-emerald-600 font-extrabold">Q-Fix</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mb-1" />
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'home' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('rides')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'rides' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Rideshare
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'services' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Q-Fix Handyman
          </button>

          <button
            onClick={() => setActiveTab('apartments')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              activeTab === 'apartments' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Apartments
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            <span>Dashboard</span>
            {currentUser && (
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                {currentUser.role}
              </span>
            )}
          </button>

          <button
            onClick={onOpenVerification}
            className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ID & NIN Verify</span>
          </button>

          {onOpenAdvertise && (
            <button
              onClick={onOpenAdvertise}
              className="text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Advertise</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Role Switcher Popover */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span className="text-slate-500 hidden sm:inline">Role:</span>
              <span className="font-semibold text-slate-900">{currentUser?.role || 'CLIENT'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role Persona
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onRoleSwitch(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start justify-between transition-colors cursor-pointer ${
                      currentUser?.role === r.role ? 'bg-emerald-50/60 text-emerald-900 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.label}</p>
                      <p className="text-[11px] text-slate-500">{r.desc}</p>
                    </div>
                    {currentUser?.role === r.role && (
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download App / Google Play Link */}
          <a
            href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Download on Google Play Store"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download App</span>
          </a>

          {/* Codebase download */}
          <button
            onClick={onOpenCodeExplorer}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden lg:block"
            title="Inspect Next.js Prisma Codebase"
          >
            <span className="font-mono text-xs">Code</span>
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="max-w-[85px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
          )}

        </div>

      </div>

      {/* Mobile Nav strip */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-600">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`px-2 py-1 ${activeTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('rides')} 
          className={`px-2 py-1 ${activeTab === 'rides' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Rides
        </button>
        <button 
          onClick={() => setActiveTab('services')} 
          className={`px-2 py-1 ${activeTab === 'services' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Q-Fix
        </button>
        <button 
          onClick={() => setActiveTab('apartments')} 
          className={`px-2 py-1 ${activeTab === 'apartments' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Stays
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`px-2 py-1 ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button 
          onClick={onOpenVerification} 
          className="px-2 py-1 text-emerald-800 font-semibold"
        >
          Verify
        </button>
        {onOpenAdvertise && (
          <button 
            onClick={onOpenAdvertise} 
            className="px-2 py-1 text-amber-800 font-semibold"
          >
            Ads
          </button>
        )}
      </div>
    </header>
  );
};
