import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  UserCheck, 
  Plus, 
  CheckCircle, 
  Search, 
  ChevronRight, 
  ArrowUpDown,
  ShieldCheck,
  X,
  FileText,
  Star,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { Ride, User, ReceiptData, RideSeat } from '../types';
import { dbService } from '../services/db';
import { PaymentModal } from './PaymentModal';
import { RouteMapVisualizer } from './RouteMapVisualizer';
import { RatingModal } from './RatingModal';
import { RefundModal } from './RefundModal';

interface RidesViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onViewReceipt: (receipt: ReceiptData) => void;
  onOpenVerification: () => void;
}

export const RidesView: React.FC<RidesViewProps> = ({ 
  currentUser, 
  onOpenAuth,
  onViewReceipt,
  onOpenVerification,
}) => {
  const [rides, setRides] = useState<Ride[]>(dbService.getRides());
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Ride for Map & Details
  const [activeMapRide, setActiveMapRide] = useState<Ride>(rides[0]);
  const [selectedPickupSpot, setSelectedPickupSpot] = useState<string>(rides[0]?.origin || '');

  // Booking & Seat Selection State
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [lastReceipt, setLastReceipt] = useState<ReceiptData | null>(null);

  // Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ id: string; name: string; context: string } | null>(null);

  // Post ride modal state (For Drivers)
  const [isPostingRide, setIsPostingRide] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newCity, setNewCity] = useState('Lagos');
  const [newDeparture, setNewDeparture] = useState('Today, 05:30 PM');
  const [newSeats, setNewSeats] = useState(3);
  const [newPrice, setNewPrice] = useState(3500);
  const [newAmenities, setNewAmenities] = useState('Air Condition, Phone Charging, Boot Space');

  const refreshRides = () => {
    setRides([...dbService.getRides()]);
  };

  const filteredRides = rides.filter((r) => {
    const matchesCity = selectedCity === 'All' || r.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = 
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleOpenSeatSelection = (ride: Ride) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedRide(ride);
    setActiveMapRide(ride);
    setSelectedPickupSpot(ride.origin);
    // Default select first available seat
    const firstOpen = ride.seatsMap?.find(s => !s.isBooked)?.code;
    setSelectedSeats(firstOpen ? [firstOpen] : ['F1']);
    setShowPaymentModal(true);
  };

  const handleSeatToggle = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      if (selectedSeats.length > 1) {
        setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
      }
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handlePaymentSuccess = (
    paymentRef: string, 
    gateway: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT',
    receipt?: ReceiptData
  ) => {
    if (!selectedRide) return;
    const res = dbService.bookRide(
      selectedRide.id, 
      selectedSeats.length || 1, 
      selectedPickupSpot || selectedRide.origin, 
      selectedRide.destination,
      selectedSeats,
      gateway
    );
    if (res.success && res.receipt) {
      setLastReceipt(res.receipt);
      setBookingSuccessMsg(`Seats successfully confirmed! Paid via ${gateway}. Reference: ${paymentRef}`);
      refreshRides();
    }
  };

  const handleCreateRide = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createRide({
      origin: newOrigin,
      destination: newDestination,
      city: newCity,
      departureTime: newDeparture,
      availableSeats: Number(newSeats),
      totalSeats: Number(newSeats),
      pricePerSeat: Number(newPrice),
      amenities: newAmenities.split(',').map((a) => a.trim()),
      status: 'ACTIVE',
      vehicleModel: currentUser?.vehicleModel || 'Toyota Corolla 2021',
      vehiclePlate: currentUser?.vehiclePlate || 'KJA-482-DE',
      description: 'Commuter carpool route. Verified safety guidelines enforced.'
    });
    setIsPostingRide(false);
    refreshRides();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Verification Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Professional Rideshare & Carpools
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-0.5 rounded">
              FRSC & NIN Screened
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pickups, real-time map route visualizations, seat reservation maps, and verified driver ratings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenVerification}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Identity & Driver Verification</span>
          </button>

          {currentUser?.role === 'DRIVER' || currentUser?.role === 'ADMIN' ? (
            <button
              onClick={() => setIsPostingRide(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Commute Route</span>
            </button>
          ) : (
            <button
              onClick={() => {
                dbService.switchUserByRole('DRIVER');
                refreshRides();
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Switch to Driver</span>
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
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Receipt</span>
            </button>
          )}
        </div>
      )}

      {/* Interactive Map Visualizer Section */}
      {activeMapRide && (
        <RouteMapVisualizer
          ride={activeMapRide}
          selectedPickup={selectedPickupSpot}
          onSelectPickup={(spot) => setSelectedPickupSpot(spot)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* City Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto text-xs font-medium">
          {['All', 'Lagos', 'Abuja', 'Ibadan'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCity === c
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route (e.g. Lekki, Airport, Wuse)"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Rides Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
              activeMapRide?.id === ride.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Driver info & Verification Badges */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="/src/assets/images/rideshare_driver_portrait_1790674074147.jpg"
                      alt={ride.driverName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{ride.driverName}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-semibold text-amber-600">⭐ {ride.driverRating}</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-700">FRSC Verified</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {ride.city}
                  </span>
                  <button
                    onClick={() => {
                      setActiveMapRide(ride);
                      setSelectedPickupSpot(ride.origin);
                    }}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>

              {/* Route details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Pickup Spot</span>
                    <p className="text-xs font-semibold text-slate-800">{ride.origin}</p>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-200 ml-1 h-3" />

                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Drop-off Terminal</span>
                    <p className="text-xs font-semibold text-slate-800">{ride.destination}</p>
                  </div>
                </div>
              </div>

              {/* Departure, Duration, Vehicle & Roadworthiness */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departure:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{ride.departureTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    <span>Vehicle:</span>
                  </span>
                  <span className="font-medium text-slate-700">{ride.vehicleModel} ({ride.vehiclePlate})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Roadworthiness:</span>
                  <span className="text-emerald-700 font-mono font-medium">LASDRA & FRSC Passed</span>
                </div>
              </div>

              {/* Seat Availability Visual Map */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">Interactive Seat Availability:</span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
                  {(ride.seatsMap || [
                    { seatId: 's1', code: 'F1', label: 'Front Window', isBooked: false },
                    { seatId: 's2', code: 'B1', label: 'Rear Left', isBooked: false },
                    { seatId: 's3', code: 'B2', label: 'Rear Center', isBooked: false },
                    { seatId: 's4', code: 'B3', label: 'Rear Right', isBooked: false },
                  ]).map((seat) => (
                    <div
                      key={seat.seatId}
                      className={`p-1.5 rounded-lg border text-[11px] ${
                        seat.isBooked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      }`}
                      title={seat.isBooked ? `Booked by ${seat.passengerName || 'Passenger'}` : seat.label}
                    >
                      {seat.code}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {ride.amenities.map((item, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Book Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Fare per seat</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">₦{ride.pricePerSeat.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-700 block">{ride.availableSeats} of {ride.totalSeats} seats open</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setRatingTarget({ id: ride.driverId, name: ride.driverName, context: `${ride.origin} ➔ ${ride.destination}` });
                    setShowRatingModal(true);
                  }}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs transition-colors cursor-pointer"
                  title="Rate Driver"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                </button>

                <button
                  onClick={() => handleOpenSeatSelection(ride)}
                  disabled={ride.availableSeats === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  {ride.availableSeats === 0 ? 'Fully Booked' : 'Select Seat & Pay'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Post Ride Modal */}
      {isPostingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">Publish Commuter Ride</h3>
                <p className="text-xs text-slate-400">Offer empty seats to verified professionals on your daily route</p>
              </div>
              <button onClick={() => setIsPostingRide(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRide} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pickup Origin</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1 Gate"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marina / CMS, Lagos"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={newDeparture}
                    onChange={(e) => setNewDeparture(e.target.value)}
                    placeholder="Today, 05:30 PM"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Available Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price per Seat (₦)</label>
                  <input
                    type="number"
                    step={100}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Publish Commute Route
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal with Gateway Choice & Official Bank */}
      {selectedRide && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          onViewReceipt={onViewReceipt}
          amount={selectedRide.pricePerSeat * (selectedSeats.length || 1)}
          itemTitle={`${selectedRide.origin} ➔ ${selectedRide.destination}`}
          category="Rideshare"
          description={`Seats: ${selectedSeats.join(', ')} · Driver: ${selectedRide.driverName}`}
          clientName={currentUser?.name}
          clientEmail={currentUser?.email}
          clientPhone={currentUser?.phone}
        />
      )}

      {/* Rating Modal */}
      {ratingTarget && currentUser && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          currentUser={currentUser}
          targetUserId={ratingTarget.id}
          targetUserName={ratingTarget.name}
          targetRole="DRIVER"
          contextTitle={ratingTarget.context}
          onSuccess={() => {
            refreshRides();
          }}
        />
      )}

    </div>
  );
};
