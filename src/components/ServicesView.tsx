import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  X, 
  Zap, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { ServiceItem, HandymanCategory, User } from '../types';
import { dbService } from '../services/db';
import { PaymentModal } from './PaymentModal';

interface ServicesViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onViewReceipt: (receipt: any) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ currentUser, onOpenAuth, onViewReceipt }) => {
  const [services, setServices] = useState<ServiceItem[]>(dbService.getServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Booking state
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [scheduledDate, setScheduledDate] = useState('Tomorrow');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [clientAddress, setClientAddress] = useState('Victoria Island, Lagos');
  const [issueDescription, setIssueDescription] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Provider Post Service state
  const [isPostingService, setIsPostingService] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HandymanCategory>('Electrical & Solar');
  const [newDesc, setNewDesc] = useState('');
  const [newBasePrice, setNewBasePrice] = useState(15000);
  const [newArea, setNewArea] = useState('Lekki / Victoria Island');
  const [newCity, setNewCity] = useState('Lagos');

  const categories: string[] = [
    'All',
    'Electrical & Solar',
    'AC & Refrigeration',
    'Plumbing & Drainage',
    'Generator Repair',
    'Carpentry & Roofing',
    'Painting & Renovation'
  ];

  const refreshServices = () => {
    setServices([...dbService.getServices()]);
  };

  const filteredServices = services.filter((s) => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

  const handleStartBooking = (service: ServiceItem) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setBookingService(service);
    setIssueDescription(`Diagnostic request for ${service.title}`);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentRef: string, gateway: any, receipt?: any) => {
    if (!bookingService) return;
    const res = dbService.bookService({
      serviceId: bookingService.id,
      scheduledDate,
      scheduledTime,
      issueDescription,
      clientAddress,
      gateway
    });
    if (res.success) {
      if (res.receipt) setLastReceipt(res.receipt);
      setBookingSuccessMsg(`Artisan booked! Escrow Payment Reference: ${paymentRef}. Provider will contact you.`);
      refreshServices();
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createService({
      category: newCategory,
      title: newTitle,
      description: newDesc,
      basePrice: Number(newBasePrice),
      hourlyRate: 5000,
      city: newCity,
      area: newArea,
      isAvailableToday: true,
    });
    setIsPostingService(false);
    refreshServices();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Q-Fix Verified Artisan Marketplace
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-0.5 rounded">
              Escrow Guaranteed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified Nigerian solar engineers, HVAC technicians, plumbers, and generator specialists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === 'PROVIDER' || currentUser?.role === 'ADMIN' ? (
            <button
              onClick={() => setIsPostingService(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>List Artisan Service</span>
            </button>
          ) : (
            <button
              onClick={() => {
                dbService.switchUserByRole('PROVIDER');
                refreshServices();
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Switch to Artisan Provider Mode</span>
            </button>
          )}
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between gap-2.5 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          {lastReceipt && (
            <button
              onClick={() => onViewReceipt(lastReceipt)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shrink-0"
            >
              View Receipt
            </button>
          )}
        </div>
      )}

      {/* Escrow Guarantee Highlight Bar */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-900/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">100% Escrow Protection Protocol</h4>
            <p className="text-[11px] text-slate-300">
              Your money is never sent directly to the technician. Funds remain secured in escrow until you inspect the repair and tap "Confirm Completion".
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 shrink-0">
          Anti-Scam Verified
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {srv.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {srv.city}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{srv.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{srv.description}</p>

              {/* Provider details */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Master Artisan:</span>
                  <span className="font-semibold text-slate-800">{srv.providerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Track Record:</span>
                  <span className="font-medium text-emerald-700">⭐ {srv.providerRating} ({srv.jobsCompleted} Completed Jobs)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Service Coverage:</span>
                  <span className="text-slate-700 truncate max-w-[170px]">{srv.area}</span>
                </div>
              </div>
            </div>

            {/* Pricing & Booking */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Base Diagnostic Fee</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">₦{srv.basePrice.toLocaleString()}</span>
                {srv.hourlyRate && (
                  <span className="text-[11px] text-slate-500 block">+ ₦{srv.hourlyRate.toLocaleString()}/hr labour</span>
                )}
              </div>

              <button
                onClick={() => handleStartBooking(srv)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Request Fix
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Post Service Modal */}
      {isPostingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">Offer Artisan Repair Service</h3>
                <p className="text-xs text-slate-400">List your professional skillset on Q-Fix Handyman</p>
              </div>
              <button onClick={() => setIsPostingService(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inverter Battery Diagnostics & Replacement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as HandymanCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Electrical & Solar">Electrical & Solar</option>
                    <option value="AC & Refrigeration">AC & Refrigeration</option>
                    <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                    <option value="Generator Repair">Generator Repair</option>
                    <option value="Carpentry & Roofing">Carpentry & Roofing</option>
                    <option value="Painting & Renovation">Painting & Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Ibadan">Ibadan</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Neighborhood Coverage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Island, Lekki Phase 1, Ikoyi"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Base Diagnostic Fee (₦)</label>
                <input
                  type="number"
                  step={500}
                  required
                  value={newBasePrice}
                  onChange={(e) => setNewBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description of Scope & Tools</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown of equipment, warranty, and experience..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Publish Service Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {bookingService && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          onViewReceipt={onViewReceipt}
          amount={bookingService.basePrice}
          itemTitle={bookingService.title}
          category="Q-Fix Service"
          description={`Diagnostic visit by ${bookingService.providerName} (Held in Escrow)`}
          clientName={currentUser?.name}
          clientEmail={currentUser?.email}
          clientPhone={currentUser?.phone}
        />
      )}

    </div>
  );
};
