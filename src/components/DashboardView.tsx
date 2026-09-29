import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  RideBooking, 
  ServiceBooking, 
  ApartmentBooking, 
  VerificationRequest, 
  Complaint,
  RefundRequest,
  ReceiptData,
  Ride,
  RatingReview
} from '../types';
import { dbService } from '../services/db';
import { OFFICIAL_PLATFORM_DETAILS, ADMIN_AUTHORIZED_NIN } from '../data/mockData';
import { 
  Car, 
  Wrench, 
  Building, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Download, 
  ArrowUpRight, 
  Plus, 
  UserCheck, 
  MapPin, 
  Phone,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  Star,
  QrCode,
  Store,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Zap,
  Activity
} from 'lucide-react';
import { RefundModal } from './RefundModal';
import { RatingModal } from './RatingModal';
import { BookingStatusIndicator } from './BookingStatusIndicator';

interface DashboardViewProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onOpenCodeExplorer: () => void;
  onOpenVerification: () => void;
  onViewReceipt: (receipt: ReceiptData) => void;
  onOpenAdvertise?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onRoleSwitch,
  onOpenCodeExplorer,
  onOpenVerification,
  onViewReceipt,
  onOpenAdvertise,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'services' | 'apartments' | 'refunds' | 'verifications' | 'complaints'>('overview');
  const [statusMessage, setStatusMessage] = useState('');

  // Cancellation & Refund Modal state
  const [refundBooking, setRefundBooking] = useState<{
    id: string;
    type: 'RIDE' | 'SERVICE' | 'APARTMENT';
    title: string;
    amount: number;
    ref: string;
  } | null>(null);

  // Rating Modal state
  const [ratingTarget, setRatingTarget] = useState<{
    id: string;
    name: string;
    role: 'DRIVER' | 'PASSENGER' | 'PROVIDER';
    context: string;
  } | null>(null);

  // Local reactive state synchronized with dbService
  const [rideBookings, setRideBookings] = useState<RideBooking[]>(() => dbService.getRideBookings());
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(() => dbService.getServiceBookings());
  const [apartmentBookings, setApartmentBookings] = useState<ApartmentBooking[]>(() => dbService.getApartmentBookings());
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() => dbService.getRefundRequests());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(() => dbService.getVerifications());
  const [complaints, setComplaints] = useState<Complaint[]>(() => dbService.getComplaints());
  const [reviews, setReviews] = useState<RatingReview[]>(() => dbService.getReviews());
  const [rides, setRides] = useState<Ride[]>(() => dbService.getRides());
  const [stats, setStats] = useState(() => dbService.getPlatformStats());

  // Admin NIN Gate State: Hide admin information with admin NIN: 14303779142
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('naijashare_admin_unlocked') === 'true';
  });
  const [adminNinInput, setAdminNinInput] = useState('');
  const [adminNinError, setAdminNinError] = useState('');

  // Sync state when database updates
  useEffect(() => {
    const handleDbUpdate = () => {
      setRideBookings([...dbService.getRideBookings()]);
      setServiceBookings([...dbService.getServiceBookings()]);
      setApartmentBookings([...dbService.getApartmentBookings()]);
      setRefundRequests([...dbService.getRefundRequests()]);
      setVerifications([...dbService.getVerifications()]);
      setComplaints([...dbService.getComplaints()]);
      setReviews([...dbService.getReviews()]);
      setRides([...dbService.getRides()]);
      setStats(dbService.getPlatformStats());
    };
    window.addEventListener('naijashare_db_updated', handleDbUpdate);
    return () => window.removeEventListener('naijashare_db_updated', handleDbUpdate);
  }, []);

  const triggerNotify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 5000);
  };

  // Real-time booking status updater for Services (Q-Fix)
  const handleUpdateServiceStatus = (bookingId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    dbService.updateServiceBookingStatus(bookingId, newStatus);
    setServiceBookings([...dbService.getServiceBookings()]);
    setStats(dbService.getPlatformStats());
    triggerNotify(`Real-time update: Booking status changed to ${newStatus}. Client & Provider dashboards synchronized.`);
  };

  // Real-time booking status updater for Rides
  const handleUpdateRideStatus = (bookingId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    dbService.updateRideBookingStatus(bookingId, newStatus);
    setRideBookings([...dbService.getRideBookings()]);
    setStats(dbService.getPlatformStats());
    triggerNotify(`Real-time update: Ride booking status changed to ${newStatus}. Driver & Passenger manifests synchronized.`);
  };

  // Admin NIN verification handler
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminNinError('');
    const clean = adminNinInput.trim().replace(/\D/g, '');
    if (clean === ADMIN_AUTHORIZED_NIN) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('naijashare_admin_unlocked', 'true');
      triggerNotify('✅ Admin NIN verified: 14303779142. Platform administrator information unlocked.');
    } else {
      setAdminNinError(`Access Denied: Invalid Admin NIN. Platform administrator records are protected and restricted to NIN: ${ADMIN_AUTHORIZED_NIN}`);
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('naijashare_admin_unlocked');
    setAdminNinInput('');
    setAdminNinError('');
    triggerNotify('🔒 Admin information locked and hidden. Admin NIN required to re-authenticate.');
  };

  const handleApproveVerification = (id: string) => {
    dbService.updateVerificationStatus(id, 'VERIFIED', 'Approved by Operations Lead via automated biometric check.');
    triggerNotify('Identity document verified and activated.');
  };

  const handleRejectVerification = (id: string) => {
    dbService.updateVerificationStatus(id, 'REJECTED', 'Document blurred or mismatch with NIMC records.');
    triggerNotify('Verification request marked as rejected.');
  };

  const handleApproveRefund = (refundId: string) => {
    dbService.processRefund(refundId, true, 'Approved by Administrator. Escrow funds returned to client.');
    triggerNotify('Refund processed successfully. Wallet / Account credited.');
  };

  const handleRejectRefund = (refundId: string) => {
    dbService.processRefund(refundId, false, 'Rejected. Booking was fulfilled according to service terms.');
    triggerNotify('Refund request rejected.');
  };

  const handleResolveComplaint = (id: string) => {
    dbService.resolveComplaint(id);
    triggerNotify('Complaint marked as resolved.');
  };

  const handleServiceComplete = (bookingId: string) => {
    dbService.updateServiceBookingStatus(bookingId, 'COMPLETED');
    triggerNotify('Job marked as completed. Escrow payout released to technician!');
  };

  const handleTopUpWallet = () => {
    currentUser.walletBalance += 20000;
    triggerNotify('Wallet credited with ₦20,000 via Paystack Bank Transfer.');
  };

  const generateReceiptFromBooking = (b: any, category: string, title: string) => {
    const subtotal = b.totalAmount || b.quotedAmount;
    const rec: ReceiptData = {
      receiptNo: `REC-${b.paymentRef.slice(-6)}`,
      date: new Date(b.createdAt).toLocaleDateString('en-NG', { dateStyle: 'long' }),
      clientName: b.clientName,
      clientEmail: b.clientEmail || OFFICIAL_PLATFORM_DETAILS.clientEmail,
      clientPhone: b.clientPhone || OFFICIAL_PLATFORM_DETAILS.clientPhone,
      category,
      itemTitle: title,
      paymentGateway: (b.paymentGateway === 'FLUTTERWAVE' ? 'Flutterwave' : b.paymentGateway === 'MONIEPOINT_DIRECT' ? 'Moniepoint Direct' : 'Paystack') as any,
      paymentRef: b.paymentRef,
      subtotal,
      escrowFee: Math.round(subtotal * 0.05),
      vat: Math.round(subtotal * 0.025),
      total: Math.round(subtotal * 1.075),
      status: b.paymentStatus,
      beneficiaryAccount: OFFICIAL_PLATFORM_DETAILS.bankDetails
    };
    onViewReceipt(rec);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile & Identity Verification Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xl flex items-center justify-center border-2 border-emerald-400">
              {currentUser.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{currentUser.name}</h1>
                <span className="text-[11px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
                {currentUser.role === 'ADMIN' ? (
                  isAdminUnlocked ? (
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 px-2 py-0.5 rounded font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin NIN: {ADMIN_AUTHORIZED_NIN} Verified</span>
                    </span>
                  ) : (
                    <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 px-2 py-0.5 rounded font-mono">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Admin Protected (Enter NIN: {ADMIN_AUTHORIZED_NIN})</span>
                    </span>
                  )
                ) : currentUser.verificationStatus === 'VERIFIED' ? (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NIN & Biometric Certified</span>
                  </span>
                ) : (
                  <button
                    onClick={onOpenVerification}
                    className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded hover:bg-amber-500/30 cursor-pointer"
                  >
                    Action Required: Verify Identity
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="text-slate-300 font-semibold">{currentUser.email}</span>
                <span>·</span>
                <span className="text-slate-300 font-semibold">{currentUser.phone}</span>
                <span>·</span>
                <span>{currentUser.city}</span>
                {currentUser.role === 'ADMIN' && (
                  <>
                    <span>·</span>
                    <span className={isAdminUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-medium"}>
                      {isAdminUnlocked ? `NIN: ${ADMIN_AUTHORIZED_NIN}` : 'NIN: ••••••••••• (Hidden)'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Role Switcher Buttons */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold px-2">
              Instant Persona Switcher:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['CLIENT', 'DRIVER', 'PROVIDER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleSwitch(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    currentUser.role === r
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r === 'CLIENT' && 'Client View'}
                  {r === 'DRIVER' && 'Driver View'}
                  {r === 'PROVIDER' && 'Provider View'}
                  {r === 'ADMIN' && (
                    <>
                      {isAdminUnlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                      <span>Admin Operations</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Client Official Contact, Bank Account & App Store Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          
          {/* Wallet */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Naijashare Wallet Balance</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-emerald-400 tabular-nums">
                ₦{currentUser.walletBalance.toLocaleString()}
              </span>
              <button
                onClick={handleTopUpWallet}
                className="text-[10px] text-emerald-300 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded hover:bg-emerald-900 cursor-pointer"
              >
                + Top Up
              </button>
            </div>
          </div>

          {/* Official Bank Account */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Settlement Account</span>
            <p className="font-mono font-bold text-white text-xs mt-0.5">
              {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName} · {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}
            </p>
          </div>

          {/* Community Hub Address */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Official Community Hub</span>
            </span>
            <p className="text-slate-200 text-[11px] font-medium mt-0.5 line-clamp-2">
              {OFFICIAL_PLATFORM_DETAILS.address}, Ogun State
            </p>
          </div>

          {/* Client Contact Info */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Support & Contact</span>
            <p className="font-mono font-bold text-slate-200 text-xs mt-0.5">{OFFICIAL_PLATFORM_DETAILS.clientPhone}</p>
            <p className="text-[10px] text-slate-400 truncate">{OFFICIAL_PLATFORM_DETAILS.clientEmail}</p>
          </div>

          {/* Google Play App Link & Advertise Action */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-1.5">
            <a
              href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>Android App (Google Play)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onOpenAdvertise && (
              <button
                onClick={onOpenAdvertise}
                className="w-full py-1 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Store className="w-3 h-3" />
                <span>Advertise Business</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. ADMIN OPERATIONS DASHBOARD */}
      {/* ============================================================== */}
      {currentUser.role === 'ADMIN' && (
        <div className="space-y-8">
          
          {!isAdminUnlocked ? (
            /* Admin Information Locked Screen (Admin Info Hidden) */
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden animate-in fade-in duration-200">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 border-b border-slate-800">
                <div className="max-w-2xl mx-auto text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>NIMC Identity Security Gate</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Administrator Operations Restricted
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Platform gross merchandise escrow volumes, citizen National Identity (NIN) biometric queues, driver background checks, and refund authorizations are confidential administrative information.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10 max-w-lg mx-auto space-y-6">
                <form onSubmit={handleUnlockAdmin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Enter Authorized Admin NIN (11 Digits):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={11}
                        value={adminNinInput}
                        onChange={(e) => {
                          setAdminNinInput(e.target.value.replace(/\D/g, ''));
                          setAdminNinError('');
                        }}
                        placeholder="14303779142"
                        className="w-full pl-10 pr-4 py-3 text-base sm:text-lg font-mono tracking-widest font-bold border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-900"
                      />
                      <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      National Identity Number must match platform administrator registry ({ADMIN_AUTHORIZED_NIN}).
                    </p>
                  </div>

                  {adminNinError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{adminNinError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Verify NIN & Reveal Admin Console</span>
                  </button>
                </form>

                {/* Quick Demo Helper */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                  <p className="text-xs font-semibold text-slate-700">Administrator Clearance Credential:</p>
                  <p className="text-[11px] text-slate-500">
                    Authorized Admin NIN: <code className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">{ADMIN_AUTHORIZED_NIN}</code>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminNinInput(ADMIN_AUTHORIZED_NIN);
                      setAdminNinError('');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Autofill Admin NIN ({ADMIN_AUTHORIZED_NIN})</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Admin Unlocked Active Banner */}
              <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">Administrator Terminal Active</h3>
                      <span className="text-[10px] bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
                        NIN: {ADMIN_AUTHORIZED_NIN} VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300">Administrative information and platform operations are currently unlocked.</p>
                  </div>
                </div>
                <button
                  onClick={handleLockAdmin}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hide Admin Info (Lock Session)</span>
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Total GMV (Paystack & Flutterwave)</span>
              <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                ₦{stats.grossMerchandiseValue.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Escrow held safely in Moniepoint</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Pending Identity Verifications</span>
              <span className="text-2xl font-bold text-amber-600 tabular-nums">
                {stats.pendingVerifications} Pending
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">NIN, License & 3D Liveness</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Pending Refund Requests</span>
              <span className="text-2xl font-bold text-rose-600 tabular-nums">
                {stats.pendingRefunds} Requests
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">100% Policy Auto-Evaluated</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Dispute SLA Resolution</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                98.8%
              </span>
              <span className="text-[11px] text-emerald-600 block mt-1">Complaints Mediated</span>
            </div>
          </div>

          {/* Refund Requests Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Cancellations & Refund Requests Processing</span>
                </h3>
                <p className="text-xs text-slate-500">Authorize or reject escrow refunds back to client accounts.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {refundRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900">{r.userName}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{r.bookingType}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">₦{r.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 font-sans text-slate-600 max-w-xs truncate">{r.reason}</td>
                      <td className="py-3 px-3 font-sans">
                        {r.status === 'PROCESSED' && <span className="text-emerald-700 font-semibold">Refunded</span>}
                        {r.status === 'PENDING' && <span className="text-amber-600 font-semibold">Pending Admin</span>}
                        {r.status === 'REJECTED' && <span className="text-rose-600 font-semibold">Rejected</span>}
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        {r.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveRefund(r.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded transition-colors cursor-pointer"
                            >
                              Approve Refund
                            </button>
                            <button
                              onClick={() => handleRejectRefund(r.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] rounded transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">{r.adminNote || 'Processed'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Identity & Driver Verification Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Identity Verification & Driver Licensing Queue</span>
                </h3>
                <p className="text-xs text-slate-500">Cross-reference applicants with NIMC biometric records and FRSC driving registries.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Applicant</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Document</th>
                    <th className="py-2.5 px-3">ID / License No</th>
                    <th className="py-2.5 px-3">Face Liveness</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900">{v.userName}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{v.userRole}</span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-700">{v.documentType}</td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{v.documentNumber}</td>
                      <td className="py-3 px-3 font-sans text-emerald-700 font-medium">
                        {v.faceMatchScore ? `${v.faceMatchScore}% Match` : 'Passed'}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        {v.status === 'VERIFIED' && <span className="text-emerald-700 font-semibold">Verified</span>}
                        {v.status === 'PENDING' && <span className="text-amber-600 font-semibold">Pending</span>}
                        {v.status === 'REJECTED' && <span className="text-rose-600 font-semibold">Rejected</span>}
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        {v.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveVerification(v.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectVerification(v.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] rounded transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )}

      {/* ============================================================== */}
      {/* 2. DRIVER DASHBOARD */}
      {/* ============================================================== */}
      {currentUser.role === 'DRIVER' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Commute Earnings (This Month)</span>
              <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                ₦{currentUser.walletBalance.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Automatic payouts to your Nigerian bank</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Vehicle & Inspection</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {currentUser.vehicleModel || 'Toyota Corolla 2021'}
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                {currentUser.vehiclePlate || 'KJA-482-DE'} (FRSC Roadworthiness Valid)
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Two-Way Peer Rating</span>
              <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
                ⭐ {currentUser.rating || 4.92}
              </span>
              <span className="text-[11px] text-emerald-700 block">{currentUser.reviewsCount || 142} 5-Star Trips</span>
            </div>
          </div>

          {/* Passenger Bookings Manifest */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Passenger Bookings Manifest & Live Commute Tracker</h3>
                <p className="text-xs text-slate-500">Live seat bookings and trip transit progress.</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Live Trip Sync
              </span>
            </div>

            <div className="space-y-4">
              {rideBookings.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{b.clientName} ({b.clientPhone})</p>
                      <p className="text-slate-600">Pickup: {b.pickupLocation} ➔ Drop-off: {b.dropoffLocation}</p>
                      <p className="font-mono text-[11px] text-slate-400">Ref: {b.paymentRef} · Seat: {b.selectedSeats?.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 text-sm">₦{b.totalAmount.toLocaleString()}</span>
                        <span className="text-[11px] text-slate-500 block">{b.seatsBooked} Seat(s) Booked</span>
                      </div>

                      <button
                        onClick={() => {
                          setRatingTarget({ id: b.clientId, name: b.clientName, role: 'PASSENGER', context: `Trip on ${b.pickupLocation}` });
                        }}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rate Passenger</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-Time Booking Status Indicator for Driver */}
                  <div className="pt-2 border-t border-slate-200">
                    <BookingStatusIndicator
                      status={b.bookingStatus}
                      type="RIDE"
                      id={b.id}
                      isProvider={true}
                      onStatusChange={(newStatus) => handleUpdateRideStatus(b.id, newStatus)}
                      etaText={`Trip Date: ${new Date(b.rideDate).toLocaleDateString()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PROVIDER / ARTISAN DASHBOARD */}
      {/* ============================================================== */}
      {currentUser.role === 'PROVIDER' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Escrow & Payout Balance</span>
              <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                ₦{currentUser.walletBalance.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Escrow funds released on job completion</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Registered Business</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {currentUser.businessName || 'Apex Solar & Electric Works'}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">{currentUser.serviceCategory || 'Electrical & Solar'}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Job Completion Rating</span>
              <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
                ⭐ {currentUser.rating || 4.95}
              </span>
              <span className="text-[11px] text-emerald-700 block">{currentUser.reviewsCount || 88} Certified Jobs</span>
            </div>
          </div>

          {/* Real-Time Provider Job Dispatch & Status Engine Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold text-sm text-white">Live Artisan Dispatch & Work Order State Monitor</h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  React State Reactive
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Advance work order progression in real-time below ('Pending' ➔ 'In Progress' ➔ 'Completed'). Status transitions immediately propagate across the client dashboard and trigger escrow payouts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                {serviceBookings.filter(b => b.bookingStatus === 'IN_PROGRESS').length} In Progress · {serviceBookings.filter(b => b.bookingStatus === 'PENDING' || b.bookingStatus === 'ACCEPTED').length} Pending
              </span>
            </div>
          </div>

          {/* Incoming Job Orders Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Work Orders & Diagnostics Queue</h3>
              <p className="text-xs text-slate-500">Service requests with escrow funds reserved. Use the real-time status indicator below to update the client.</p>
            </div>

            <div className="space-y-4">
              {serviceBookings.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">{b.category}</span>
                        <span>·</span>
                        <span className="text-slate-500">Scheduled: {b.scheduledDate} ({b.scheduledTime})</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{b.serviceTitle}</p>
                      <p className="text-slate-600"><strong className="text-slate-700">Client:</strong> {b.clientName} ({b.clientPhone})</p>
                      <p className="text-slate-500"><strong className="text-slate-700">Address:</strong> {b.clientAddress}</p>
                      <p className="text-slate-500 italic">"{b.issueDescription}"</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-base font-bold text-emerald-700 tabular-nums">₦{b.quotedAmount.toLocaleString()}</span>
                      
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Payment Status: {b.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Booking Status Indicator with Provider Controls */}
                  <div className="pt-2 border-t border-slate-200">
                    <BookingStatusIndicator
                      status={b.bookingStatus}
                      type="SERVICE"
                      id={b.id}
                      isProvider={true}
                      onStatusChange={(newStatus) => handleUpdateServiceStatus(b.id, newStatus)}
                      etaText={`Appointment: ${b.scheduledDate} at ${b.scheduledTime}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CLIENT DASHBOARD */}
      {/* ============================================================== */}
      {currentUser.role === 'CLIENT' && (
        <div className="space-y-8">
          
          {/* Real-Time Active Booking Status Tracker Card for Client */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Live Active Booking Status Tracker</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                      Real-Time Reactive
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">Instant state reflection for your scheduled rides and Q-Fix repairs.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                  {serviceBookings.filter(b => b.bookingStatus !== 'CANCELLED').length + rideBookings.filter(b => b.bookingStatus !== 'CANCELLED').length} Total Active Booking(s)
                </span>
              </div>
            </div>

            {/* Featured Active Order */}
            {serviceBookings[0] ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{serviceBookings[0].serviceTitle}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-700 font-semibold">{serviceBookings[0].providerName}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Ref: {serviceBookings[0].paymentRef}
                  </span>
                </div>

                <BookingStatusIndicator
                  status={serviceBookings[0].bookingStatus}
                  type="SERVICE"
                  id={serviceBookings[0].id}
                  isProvider={false}
                  showControls={false}
                  etaText={`Scheduled: ${serviceBookings[0].scheduledDate} at ${serviceBookings[0].scheduledTime}`}
                />
              </div>
            ) : rideBookings[0] ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rideBookings[0].pickupLocation} ➔ {rideBookings[0].dropoffLocation}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Ref: {rideBookings[0].paymentRef}
                  </span>
                </div>

                <BookingStatusIndicator
                  status={rideBookings[0].bookingStatus}
                  type="RIDE"
                  id={rideBookings[0].id}
                  isProvider={false}
                  showControls={false}
                  etaText={`Departure: ${new Date(rideBookings[0].rideDate).toLocaleDateString()}`}
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No bookings placed yet. Book a ride or request a Q-Fix repair to track real-time progress.</p>
            )}
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              All Bookings & History
            </button>
            <button
              onClick={() => setActiveTab('rides')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'rides' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              My Rides ({rideBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'services' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              My Q-Fix Repairs ({serviceBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('apartments')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'apartments' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              My Stays ({apartmentBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'refunds' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              Refund Requests ({refundRequests.length})
            </button>
          </div>

          {/* Rides History */}
          {(activeTab === 'overview' || activeTab === 'rides') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">My Commuter Rides</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Paystack / Flutterwave Escrow</span>
              </div>

              <div className="space-y-4">
                {rideBookings.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BookingStatusIndicator status={b.bookingStatus} compact={true} />
                          <span className="font-mono text-slate-500">{b.paymentRef}</span>
                          <span className="text-slate-400">· {b.seatsBooked} Seat(s)</span>
                        </div>
                        <p className="font-semibold text-slate-900">Pickup: {b.pickupLocation}</p>
                        <p className="text-slate-600">Drop-off: {b.dropoffLocation}</p>
                        {b.selectedSeats && (
                          <p className="text-emerald-700 text-[11px] font-mono mt-0.5">Reserved Seat: {b.selectedSeats.join(', ')}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900 tabular-nums">₦{b.totalAmount.toLocaleString()}</span>
                          <span className="text-[11px] text-emerald-600 block">{b.paymentStatus}</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => generateReceiptFromBooking(b, 'Rideshare', `${b.pickupLocation} ➔ ${b.dropoffLocation}`)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          {b.bookingStatus !== 'CANCELLED' && (
                            <button
                              onClick={() => setRefundBooking({
                                id: b.id,
                                type: 'RIDE',
                                title: `${b.pickupLocation} ➔ ${b.dropoffLocation}`,
                                amount: b.totalAmount,
                                ref: b.paymentRef
                              })}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Cancel / Refund</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline stepper */}
                    <div className="pt-2 border-t border-slate-200">
                      <BookingStatusIndicator
                        status={b.bookingStatus}
                        type="RIDE"
                        id={b.id}
                        isProvider={false}
                        showControls={false}
                        etaText={`Transit: ${b.pickupLocation} ➔ ${b.dropoffLocation}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Handyman Orders */}
          {(activeTab === 'overview' || activeTab === 'services') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">My Q-Fix Artisan Repairs</h3>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Held in Escrow
                </span>
              </div>

              <div className="space-y-4">
                {serviceBookings.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BookingStatusIndicator status={b.bookingStatus} compact={true} />
                          <span className="font-semibold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                            {b.category}
                          </span>
                          <span className="font-mono text-slate-500">{b.paymentRef}</span>
                        </div>
                        <p className="font-semibold text-slate-900">{b.serviceTitle}</p>
                        <p className="text-slate-600">Technician: {b.providerName}</p>
                        <p className="text-slate-400 text-[11px]">Appointment: {b.scheduledDate} at {b.scheduledTime}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900 tabular-nums">₦{b.quotedAmount.toLocaleString()}</span>
                          <div className="text-[11px] font-semibold text-emerald-700">
                            {b.bookingStatus === 'COMPLETED' ? 'Completed & Paid' : 'Escrow Secured'}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => generateReceiptFromBooking(b, `Q-Fix (${b.category})`, b.serviceTitle)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>

                          {b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'COMPLETED' && (
                            <button
                              onClick={() => setRefundBooking({
                                id: b.id,
                                type: 'SERVICE',
                                title: b.serviceTitle,
                                amount: b.quotedAmount,
                                ref: b.paymentRef
                              })}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Cancel / Refund</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Real-time Indicator Stepper for client */}
                    <div className="pt-2 border-t border-slate-200">
                      <BookingStatusIndicator
                        status={b.bookingStatus}
                        type="SERVICE"
                        id={b.id}
                        isProvider={false}
                        showControls={false}
                        etaText={`Technician: ${b.providerName} (${b.scheduledDate})`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apartment Stays */}
          {(activeTab === 'overview' || activeTab === 'apartments') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">My Serviced Shortlets</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">24/7 Power Guaranteed</span>
              </div>

              <div className="space-y-3">
                {apartmentBookings.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                          {b.bookingStatus}
                        </span>
                        <span className="font-mono text-slate-500">{b.paymentRef}</span>
                      </div>
                      <p className="font-semibold text-slate-900">{b.apartmentTitle}</p>
                      <p className="text-slate-600">{b.apartmentLocation}</p>
                      <p className="text-slate-400 text-[11px]">Stay: {b.checkInDate} to {b.checkOutDate} ({b.nights} nights)</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-bold text-slate-900 tabular-nums">₦{b.totalAmount.toLocaleString()}</span>
                        <span className="text-[11px] text-slate-500 block">Lockbox PIN: 7892#</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => generateReceiptFromBooking(b, 'Shortlet Living', b.apartmentTitle)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>

                        {b.bookingStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => setRefundBooking({
                              id: b.id,
                              type: 'APARTMENT',
                              title: b.apartmentTitle,
                              amount: b.totalAmount,
                              ref: b.paymentRef
                            })}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Cancel / Refund</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Requests List */}
          {activeTab === 'refunds' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">My Cancellation & Refund Requests</h3>
              <div className="space-y-3">
                {refundRequests.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {r.status}
                        </span>
                        <span className="font-mono text-slate-500">{r.paymentRef}</span>
                      </div>
                      <p className="text-slate-700">{r.reason}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.adminNote || 'Under automatic review'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-base tabular-nums">₦{r.amount.toLocaleString()}</span>
                      <span className="text-[11px] text-emerald-600 block">Escrow Protected</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Refund Request Modal */}
      {refundBooking && (
        <RefundModal
          isOpen={true}
          onClose={() => setRefundBooking(null)}
          bookingId={refundBooking.id}
          bookingType={refundBooking.type}
          bookingTitle={refundBooking.title}
          amount={refundBooking.amount}
          paymentRef={refundBooking.ref}
          onSuccess={() => {
            triggerNotify('Cancellation and refund request recorded.');
          }}
        />
      )}

      {/* Rating Review Modal */}
      {ratingTarget && (
        <RatingModal
          isOpen={true}
          onClose={() => setRatingTarget(null)}
          currentUser={currentUser}
          targetUserId={ratingTarget.id}
          targetUserName={ratingTarget.name}
          targetRole={ratingTarget.role}
          contextTitle={ratingTarget.context}
          onSuccess={() => {
            triggerNotify('Thank you for rating your peer!');
          }}
        />
      )}

    </div>
  );
};
