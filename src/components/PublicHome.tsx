import React, { useState } from 'react';
import { 
  Car, 
  Wrench, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  CheckCircle, 
  Lock, 
  Download, 
  ChevronRight,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Store,
  Phone,
  Mail,
  Percent,
  Tag,
  ExternalLink,
  Star
} from 'lucide-react';
import { dbService } from '../services/db';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface PublicHomeProps {
  onNavigate: (tab: 'rides' | 'services' | 'apartments' | 'dashboard') => void;
  onOpenCodeExplorer: () => void;
  onOpenAuth: () => void;
  onOpenAdvertise?: () => void;
  onOpenTerms?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onNavigate,
  onOpenCodeExplorer,
  onOpenAuth,
  onOpenAdvertise,
  onOpenTerms,
}) => {
  const [activeSearchTab, setActiveSearchTab] = useState<'rides' | 'services' | 'apartments'>('rides');
  const [originQuery, setOriginQuery] = useState('Lekki Phase 1');
  const [destinationQuery, setDestinationQuery] = useState('Ikeja Airport MMA2');
  const [serviceQuery, setServiceQuery] = useState('Electrical & Solar');
  const [cityFilter, setCityFilter] = useState('Lagos');

  const stats = dbService.getPlatformStats();
  const sampleRides = dbService.getRides().slice(0, 3);
  const sampleServices = dbService.getServices().slice(0, 3);
  const sampleApartments = dbService.getApartments().slice(0, 2);
  const smallBusinesses = dbService.getSmallBusinesses();

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 border-b border-slate-900">
        
        {/* Background Image Scrim */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/hero_naijashare_mobility_1790674037901.jpg"
            alt="Naijashare mobility landscape in Lagos"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nigeria’s Premier Super-App for Rides, Verified Artisans & Serviced Stays</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Move smarter. Fix faster. <br className="hidden sm:inline" />
                <span className="text-emerald-400">Live comfortably.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Connect with NIN-verified commuter carpools across Lagos & Abuja, dispatch COREN-certified electricians and HVAC technicians, or reserve premium serviced shortlets with guaranteed 24/7 solar power.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('rides')}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Book a Commuter Ride</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  <span>Request Q-Fix Artisan</span>
                </button>

                <button
                  onClick={onOpenCodeExplorer}
                  className="px-4 py-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-mono text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Starter Code (.zip)</span>
                </button>

                {onOpenAdvertise && (
                  <button
                    onClick={onOpenAdvertise}
                    className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>Advertise Small Business</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FRSC & NIN Verified Drivers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Paystack Escrow Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>24/7 Verified Solar & Gen Stays</span>
                </div>
              </div>
            </div>

            {/* Interactive Search Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 text-slate-900">
                
                {/* Search Mode Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveSearchTab('rides')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeSearchTab === 'rides' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Rideshare</span>
                  </button>

                  <button
                    onClick={() => setActiveSearchTab('services')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeSearchTab === 'services' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Q-Fix Handyman</span>
                  </button>

                  <button
                    onClick={() => setActiveSearchTab('apartments')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeSearchTab === 'apartments' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Apartments</span>
                  </button>
                </div>

                {/* Tab 1: Rideshare search form */}
                {activeSearchTab === 'rides' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={originQuery}
                          onChange={(e) => setOriginQuery(e.target.value)}
                          placeholder="e.g. Admiralty Way, Lekki"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={destinationQuery}
                          onChange={(e) => setDestinationQuery(e.target.value)}
                          placeholder="e.g. Ikeja Airport MMA2"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">City</label>
                        <select
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Lagos">Lagos</option>
                          <option value="Abuja">Abuja</option>
                          <option value="Ibadan">Ibadan</option>
                          <option value="Port Harcourt">Port Harcourt</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Time</label>
                        <div className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Today / Express</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('rides')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Available Carpools</span>
                    </button>
                  </div>
                )}

                {/* Tab 2: Q-Fix Handyman search form */}
                {activeSearchTab === 'services' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Artisan Specialization</label>
                      <select
                        value={serviceQuery}
                        onChange={(e) => setServiceQuery(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Electrical & Solar">Electrical & Solar Systems</option>
                        <option value="AC & Refrigeration">AC & Refrigeration (HVAC)</option>
                        <option value="Plumbing & Drainage">Plumbing & Concealed Pipe Leaks</option>
                        <option value="Generator Repair">Diesel & Petrol Generator Servicing</option>
                        <option value="Carpentry & Roofing">Modular Carpentry & Roof Leaks</option>
                        <option value="Painting & Renovation">Dulux Wall Finishing & POP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Neighborhood</label>
                      <input
                        type="text"
                        defaultValue="Victoria Island / Lekki / Ikoyi"
                        placeholder="e.g. Lekki Phase 1, Garki Abuja"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 space-y-1">
                      <p className="font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Escrow Guarantee</span>
                      </p>
                      <p className="text-slate-600">Technicians only receive payout after you test and approve the repair.</p>
                    </div>

                    <button
                      onClick={() => onNavigate('services')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Find Verified Artisans</span>
                    </button>
                  </div>
                )}

                {/* Tab 3: Apartments search form */}
                {activeSearchTab === 'apartments' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">City / Region</label>
                      <select
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        <option>Lagos (Lekki, Victoria Island, Ikoyi)</option>
                        <option>Abuja (Maitama, Wuse 2, Asokoro)</option>
                        <option>Ibadan (Bodija Estate, Ring Road)</option>
                        <option>Port Harcourt (Old GRA, Trans Amadi)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Layout</label>
                        <select className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white">
                          <option>2-Bedroom Serviced</option>
                          <option>1-Bedroom Loft</option>
                          <option>Penthouse Suite</option>
                          <option>Studio Apartment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Power Guarantee</label>
                        <div className="px-3 py-2 text-xs border border-emerald-200 bg-emerald-50/50 rounded-xl text-emerald-800 font-medium truncate">
                          24/7 Solar & Gen
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('apartments')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs"
                    >
                      <Building className="w-4 h-4" />
                      <span>Explore Shortlets</span>
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Live Platform Stats Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active Commutes</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {stats.activeRidesCount} Daily Routes
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">Verified Technicians</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {stats.verifiedProviders} Artisans
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">Escrow Protected Volume</span>
            <span className="text-2xl font-bold text-emerald-600 tabular-nums">
              ₦{stats.grossMerchandiseValue.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">ID & License Verification</span>
            <span className="text-2xl font-bold text-slate-900">
              100% NIMC/FRSC
            </span>
          </div>
        </div>
      </section>

      {/* Featured Rideshare Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Express Daily Carpools</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Commuter Routes</h2>
            <p className="text-xs text-slate-500 mt-1">Travel comfortably with verified vehicle owners along major commercial corridors.</p>
          </div>
          <button
            onClick={() => onNavigate('rides')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Active Rides</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleRides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{ride.city}</span>
                  <span className="text-emerald-700 font-medium">{ride.availableSeats} seats left</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Pickup</p>
                      <p className="text-xs font-semibold text-slate-900">{ride.origin}</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-dashed border-slate-200 ml-1 h-3" />
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Drop-off</p>
                      <p className="text-xs font-semibold text-slate-900">{ride.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between mb-4">
                  <span>{ride.vehicleModel}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{ride.vehiclePlate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Price per seat</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">₦{ride.pricePerSeat.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => onNavigate('rides')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Book Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Q-Fix Handyman Marketplace */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Q-Fix Verified Artisans</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
                Professional repair technicians. Zero guesswork.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Finding a trustworthy solar installer, diesel generator technician, or AC specialist shouldn't depend on unvetted word-of-mouth. Q-Fix screen artisan credentials, validates identity via NIMC, and safeguards your money in escrow until the job is certified.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">COREN & Trade Certified Electricians</h4>
                    <p className="text-xs text-slate-500">Expert diagnosis for inverters, lithium storage banks, and ATS changeovers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Protected Escrow Settlement</h4>
                    <p className="text-xs text-slate-500">Payment is locked until technician completes diagnostics and you sign off.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('services')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore All Handyman Categories</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Handyman Image & Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                <img
                  src="/src/assets/images/service_handyman_pro_1790674051645.jpg"
                  alt="Verified Q-Fix technician diagnosing electrical systems"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 object-cover object-center"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-emerald-700">Top Rated Technician</span>
                    <span className="flex items-center gap-1 font-mono">⭐ 4.95 (88 Jobs)</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Engr. Emeka Nwosu</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Apex Solar & Electric Works · Victoria Island & Lekki</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Base Diagnostic Fee</span>
                      <span className="text-sm font-bold text-slate-900">₦15,000</span>
                    </div>
                    <button
                      onClick={() => onNavigate('services')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Request Diagnostic
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Serviced Apartments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">NaijaStay Shortlets</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verified Stays with 24/7 Power</h2>
            <p className="text-xs text-slate-500 mt-1">High-speed Starlink Wi-Fi, armed security gates, and guaranteed soundproof generators.</p>
          </div>
          <button
            onClick={() => onNavigate('apartments')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Apartments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleApartments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row">
              <div className="sm:w-1/2 h-56 sm:h-auto relative bg-slate-100">
                <img
                  src="/src/assets/images/apartment_lekki_living_1790674062025.jpg"
                  alt={apt.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {apt.city}
                </div>
              </div>

              <div className="sm:w-1/2 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mb-1">
                    <span>⭐ {apt.rating}</span>
                    <span className="text-slate-400 font-normal">({apt.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{apt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{apt.location}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {apt.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Nightly rate</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">₦{apt.pricePerNight.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('apartments')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Reserve Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advertise Your Small Business - Community Enterprise Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold mb-2">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Community Enterprise Directory & Ads</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Advertise Your Small Business
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Showcase your enterprise, solar installations, auto garage, fresh market supply, or tech repairs directly to commuters and residents across <strong className="text-slate-900">Ile-Ileri community, Asore Busstop, Ota</strong>, Lagos, and surrounding metropolitan hubs.
            </p>
          </div>

          {onOpenAdvertise && (
            <button
              onClick={onOpenAdvertise}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Store className="w-4 h-4" />
              <span>Advertise Your Small Business</span>
            </button>
          )}
        </div>

        {/* Small Business Ads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {smallBusinesses.map((biz) => (
            <div 
              key={biz.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full line-clamp-1">
                    {biz.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {biz.badge || 'Verified'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {biz.businessName}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{biz.rating}</span>
                    <span className="text-slate-400 font-normal">({biz.reviewsCount} reviews)</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {biz.description}
                  </p>
                </div>

                {biz.promoOffer && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5 font-medium">
                    <Percent className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{biz.promoOffer}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 font-medium">{biz.address}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] font-mono text-slate-700">
                    {biz.phone}
                  </div>
                  <a
                    href={biz.whatsapp || `https://wa.me/234${biz.phone.replace(/\D/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Center & Settlement Information Banner */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="font-bold text-white text-sm">
                Community Hub Address: {OFFICIAL_PLATFORM_DETAILS.address}, Ogun State, Nigeria
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Direct Contact: <span className="font-mono text-slate-200">{OFFICIAL_PLATFORM_DETAILS.clientPhone}</span> · <span className="text-slate-200">{OFFICIAL_PLATFORM_DETAILS.clientEmail}</span> · Settlement Account: <span className="font-mono text-emerald-400">{OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}</span> ({OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}, {OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Android App</span>
            </a>
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                Terms of Service
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Codebase & Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Download className="w-3.5 h-3.5" />
              <span>Full-Stack Starter Project Codebase</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to deploy with Next.js, PostgreSQL & Prisma
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Inspect the comprehensive Prisma ORM schema, seeded mock database, JWT authentication handlers, Paystack escrow architecture, and export a clean .zip bundle ready to run locally or ship to cloud hosting.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenCodeExplorer}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Inspect Code & Schema</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCodeExplorer}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Complete .ZIP</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
