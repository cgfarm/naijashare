import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Users, 
  Bed, 
  Bath, 
  Zap, 
  Wifi, 
  Calendar,
  X
} from 'lucide-react';
import { Apartment, User } from '../types';
import { dbService } from '../services/db';
import { PaymentModal } from './PaymentModal';

interface ApartmentsViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onViewReceipt: (receipt: any) => void;
}

export const ApartmentsView: React.FC<ApartmentsViewProps> = ({ currentUser, onOpenAuth, onViewReceipt }) => {
  const [apartments, setApartments] = useState<Apartment[]>(dbService.getApartments());
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Booking state
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [checkIn, setCheckIn] = useState('2026-10-05');
  const [checkOut, setCheckOut] = useState('2026-10-08');
  const [nights, setNights] = useState(3);
  const [guestsCount, setGuestsCount] = useState(2);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const refreshApartments = () => {
    setApartments([...dbService.getApartments()]);
  };

  const filteredApartments = apartments.filter((apt) => {
    const matchesCity = cityFilter === 'All' || apt.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesType = typeFilter === 'All' || apt.apartmentType === typeFilter;
    return matchesCity && matchesType;
  });

  const handleStartBooking = (apt: Apartment) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedApartment(apt);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentRef: string, gateway: any, receipt?: any) => {
    if (!selectedApartment) return;
    const res = dbService.bookApartment({
      apartmentId: selectedApartment.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      guestsCount,
      gateway
    });
    if (res.success) {
      if (res.receipt) setLastReceipt(res.receipt);
      setBookingSuccessMsg(`Apartment reserved successfully! Receipt: ${paymentRef}. Host will message lockbox PIN.`);
      refreshApartments();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Serviced Shortlets & Executive Stays
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-0.5 rounded">
              Guaranteed 24/7 Power
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated residences with soundproof generators, solar backup, high-speed Starlink Wi-Fi, and 24/7 security.
          </p>
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

      {/* Filter strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* City Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium overflow-x-auto">
          {['All', 'Lekki', 'Victoria Island', 'Maitama', 'Ibadan'].map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                cityFilter === c ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium overflow-x-auto">
          {['All', '1-Bedroom', '2-Bedroom', 'Penthouse'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === t ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Apartment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredApartments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="h-64 relative bg-slate-100">
                <img
                  src="/src/assets/images/apartment_lekki_living_1790674062025.jpg"
                  alt={apt.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                  {apt.city}, {apt.state}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                  <span>24/7 Power</span>
                </div>
              </div>

              {/* Apartment Content */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{apt.rating}</span>
                    <span className="text-slate-400 font-normal">({apt.reviewsCount} verified stays)</span>
                  </div>
                  <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {apt.apartmentType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">{apt.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{apt.location}</span>
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {apt.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-700 mb-4 border border-slate-100">
                  <div className="flex items-center justify-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max {apt.maxGuests} Guests</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5">
                  {apt.amenities.map((item, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Nightly Rate</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">₦{apt.pricePerNight.toLocaleString()}</span>
                {apt.pricePerMonth && (
                  <span className="text-[11px] text-slate-500 block">or ₦{apt.pricePerMonth.toLocaleString()} / month</span>
                )}
              </div>

              <button
                onClick={() => handleStartBooking(apt)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Reserve Shortlet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedApartment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          onViewReceipt={onViewReceipt}
          amount={selectedApartment.pricePerNight * nights}
          itemTitle={selectedApartment.title}
          category="Apartment Booking"
          description={`${nights} Nights reservation in ${selectedApartment.city} (${checkIn} to ${checkOut})`}
          clientName={currentUser?.name}
          clientEmail={currentUser?.email}
          clientPhone={currentUser?.phone}
        />
      )}

    </div>
  );
};
