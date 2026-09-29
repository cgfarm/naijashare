import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Fingerprint, 
  Camera, 
  FileUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { dbService } from '../services/db';
import { ninApiService } from '../services/ninService';
import { User, NINValidationResult } from '../types';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  currentUser: User;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  currentUser,
}) => {
  const [activeStep, setActiveStep] = useState<'phone' | 'email' | 'nin' | 'liveness' | 'documents'>('phone');
  
  // Phone OTP State
  const [phone, setPhone] = useState(currentUser.phone || OFFICIAL_PLATFORM_DETAILS.clientPhone);
  const [otpCode, setOtpCode] = useState('789456');
  const [timer, setTimer] = useState(45);
  const [phoneStatus, setPhoneStatus] = useState<string>('');

  // Email State
  const [email, setEmail] = useState(currentUser.email || OFFICIAL_PLATFORM_DETAILS.clientEmail);
  const [emailStatus, setEmailStatus] = useState<string>('');

  // NIN State
  const [ninInput, setNinInput] = useState(currentUser.ninNumber || '52225495180');
  const [ninStatus, setNinStatus] = useState<string>('');
  const [ninError, setNinError] = useState<string>('');
  const [ninLookupData, setNinLookupData] = useState<any>(null);
  const [isNinLoading, setIsNinLoading] = useState(false);
  const [ninApiResponseMeta, setNinApiResponseMeta] = useState<{ statusCode: number; provider: string; trackingId?: string; timestamp?: string } | null>(null);

  // Liveness Face State
  const [livenessStage, setLivenessStage] = useState<'idle' | 'scanning' | 'passed'>('idle');
  const [livenessInstruction, setLivenessInstruction] = useState('Position your face within the frame and blink twice.');
  const [livenessScore, setLivenessScore] = useState<number | null>(null);

  // Document Upload State
  const [docType, setDocType] = useState<'DRIVER_LICENSE' | 'CAC_CERTIFICATE' | 'UTILITY_BILL'>('DRIVER_LICENSE');
  const [docNumber, setDocNumber] = useState(currentUser.driverLicenseNo || 'LAG-3849204-B');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [docStatus, setDocStatus] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  // Handlers
  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const res = dbService.verifyPhoneOTP(otpCode);
    if (res.success) {
      setPhoneStatus(res.message);
      setTimeout(() => setActiveStep('email'), 1200);
    } else {
      setPhoneStatus(res.message);
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const res = dbService.verifyEmail(email);
    if (res.success) {
      setEmailStatus(res.message);
      setTimeout(() => setActiveStep('nin'), 1200);
    }
  };

  const handleVerifyNIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNinLoading(true);
    setNinStatus('');
    setNinError('');

    try {
      // Direct call to mock third-party NIMC provider endpoint service
      const res = await ninApiService.validateNINWithProvider(ninInput);
      setIsNinLoading(false);

      setNinApiResponseMeta({
        statusCode: res.statusCode,
        provider: res.provider,
        trackingId: res.trackingId,
        timestamp: res.timestamp
      });

      if (res.success && res.data) {
        setNinLookupData(res.data);
        setNinStatus(res.message);
        // Persist verification to dbService
        dbService.verifyNINWithThirdParty(ninInput);
        setTimeout(() => setActiveStep('liveness'), 1800);
      } else {
        setNinError(res.message || 'National Identity Number verification failed with provider.');
      }
    } catch (err: any) {
      setIsNinLoading(false);
      setNinError('Network error communicating with NIMC National Identity Gateway.');
    }
  };

  const handleStartLivenessScan = () => {
    setLivenessStage('scanning');
    setLivenessInstruction('Please turn head slightly to the right...');
    setTimeout(() => {
      setLivenessInstruction('Now blink your eyes naturally...');
      setTimeout(() => {
        setLivenessInstruction('Analyzing facial depth structure against NIMC identity...');
        setTimeout(() => {
          const res = dbService.verifyLivenessFace();
          setLivenessStage('passed');
          setLivenessScore(res.matchScore);
          setTimeout(() => setActiveStep('documents'), 1500);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.verifyVehicleAndDriver({
      licenseNo: docNumber,
      vehicleModel: currentUser.vehicleModel || 'Toyota Corolla 2021',
      vehiclePlate: currentUser.vehiclePlate || 'KJA-482-DE',
      roadworthinessNo: 'FRSC-RW-902184'
    });
    setDocStatus('Document verified and validated with FRSC records.');
    onVerified();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Tier-3 Identity Verification Engine</h3>
              <p className="text-xs text-slate-400">NIMC NIN, Phone OTP, Email, and 3D Liveness Certification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveStep('phone')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeStep === 'phone' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Phone OTP</span>
          </button>

          <button
            onClick={() => setActiveStep('email')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeStep === 'email' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>2. Email OTP</span>
          </button>

          <button
            onClick={() => setActiveStep('nin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeStep === 'nin' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>3. NIMC NIN</span>
          </button>

          <button
            onClick={() => setActiveStep('liveness')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeStep === 'liveness' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>4. Face Liveness</span>
          </button>

          <button
            onClick={() => setActiveStep('documents')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeStep === 'documents' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>5. Docs</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* STEP 1: PHONE OTP */}
          {activeStep === 'phone' && (
            <form onSubmit={handleVerifyPhone} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase block">Step 1 of 5</span>
                <h4 className="text-lg font-bold text-slate-900">Verify Nigerian Phone Number via SMS OTP</h4>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit security code to your registered mobile number for two-factor authentication.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Phone Number</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 whitespace-nowrap">
                    MTN / Airtel
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Enter 6-Digit SMS Code</label>
                  <span className="text-xs text-slate-400">
                    {timer > 0 ? `Resend code in ${timer}s` : (
                      <button
                        type="button"
                        onClick={() => setTimer(45)}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="789456"
                  className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {phoneStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{phoneStatus}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>Verify Phone & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: EMAIL VERIFICATION */}
          {activeStep === 'email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase block">Step 2 of 5</span>
                <h4 className="text-lg font-bold text-slate-900">Verify Email Address</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Required for automated Paystack booking receipts, ride updates, and cancellation refund alerts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Official linked email: {OFFICIAL_PLATFORM_DETAILS.clientEmail}</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Instant Magic Link Dispatched</span>
                </p>
                <p>Click the confirmation link or enter the confirmation passkey to mark email as verified.</p>
              </div>

              {emailStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{emailStatus}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>Confirm Email Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: NIN 3RD-PARTY MOCK PROVIDER VERIFICATION */}
          {activeStep === 'nin' && (
            <form onSubmit={handleVerifyNIN} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase block">Step 3 of 5</span>
                <h4 className="text-lg font-bold text-slate-900">National Identity Number (NIN) Verification</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Direct live validation against the National Identity Management Commission (NIMC) register via third-party provider endpoint.
                </p>
              </div>

              {/* Mock Provider Endpoint Technical Status Bar */}
              <div className="p-3 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ENDPOINT: POST https://api.nimc.gov.ng/v2/citizen/verify</span>
                  </span>
                  <span className="text-slate-400">LATENCY: ~600ms</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>PROVIDER: NIMC Central Gateway (Prembly Identity Verified)</span>
                  <span className="text-emerald-300">STATUS: 200 READY</span>
                </div>
              </div>

              {/* NIN Form Field with Character Counter & Formatting */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-900">
                    11-Digit National Identity Number (NIN) *
                  </label>
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    ninInput.replace(/\D/g, '').length === 11 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ninInput.replace(/\D/g, '').length} / 11 digits
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={11}
                    value={ninInput}
                    onChange={(e) => setNinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 52225495180 or 92837482910"
                    className="w-full pl-10 pr-4 py-2.5 text-base font-mono tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                  <Fingerprint className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Dial <strong>*346#</strong> on any registered Nigerian SIM to retrieve your 11-digit NIN.
                </span>
              </div>

              {/* Quick Fill Demo Test Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Quick-Fill Test NIN Numbers:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNinInput('52225495180')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    🏛️ 52225495180 (Foundation - Ile-Ileri, Ota)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNinInput('92837482910')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    👤 92837482910 (Chidi Stadning - Lekki)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNinInput('48392019482')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    🚗 48392019482 (Babatunde - Driver)
                  </button>
                </div>
              </div>

              {/* Verified Identity Result Card */}
              {ninLookupData && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-emerald-950">NIMC Biometric Verification Record</span>
                    </div>
                    <span className="font-mono bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      STATUS: 200 VALIDATED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Full Legal Name:</span>
                      <strong className="text-slate-950 text-xs">{ninLookupData.fullName || `${ninLookupData.firstName} ${ninLookupData.lastName}`}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date of Birth & Gender:</span>
                      <span className="font-mono">{ninLookupData.dateOfBirth} ({ninLookupData.gender === 'M' ? 'Male' : 'Female'})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">State of Origin / LGA:</span>
                      <span>{ninLookupData.stateOfOrigin} · {ninLookupData.lga}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Verified Residence Address:</span>
                      <strong className="text-slate-900">{ninLookupData.residenceAddress}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Biometric Facial Match:</span>
                      <strong className="text-emerald-700 font-mono">{ninLookupData.faceMatchScore}% Match Confidence</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Audit Tracking ID:</span>
                      <span className="font-mono text-slate-700">{ninApiResponseMeta?.trackingId || ninLookupData.trackingId}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-emerald-800 flex items-center justify-between">
                    <span>Central Gateway: {ninApiResponseMeta?.provider || 'NIMC National Registry'}</span>
                    <span className="font-semibold text-emerald-900">National Biometric Slip Active</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {ninError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{ninError}</span>
                </div>
              )}

              {/* Success Status */}
              {ninStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{ninStatus}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isNinLoading || ninInput.replace(/\D/g, '').length !== 11}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isNinLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Querying NIMC National Register Endpoint...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>Validate NIN with NIMC Gateway</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: LIVENESS & FACE VERIFICATION */}
          {activeStep === 'liveness' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase block">Step 4 of 5</span>
                <h4 className="text-lg font-bold text-slate-900">3D Face Liveness & Anti-Spoofing Check</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ensures account holder is a living person matching the photographic record on file.
                </p>
              </div>

              {/* Camera Simulator Box */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex flex-col items-center justify-center text-white border-2 border-slate-800 shadow-inner">
                {livenessStage === 'idle' && (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Biometric Camera Ready</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">
                        Ensure good lighting. Avoid hats, dark sunglasses, or face masks.
                      </p>
                    </div>
                    <button
                      onClick={handleStartLivenessScan}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Start Liveness Detection
                    </button>
                  </div>
                )}

                {livenessStage === 'scanning' && (
                  <div className="text-center p-6 space-y-4">
                    <div className="relative w-28 h-28 rounded-full border-4 border-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                      <div className="w-24 h-24 rounded-full border-2 border-white/40 flex items-center justify-center">
                        <Eye className="w-10 h-10 text-emerald-400 animate-bounce" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-emerald-400 uppercase tracking-wider">Liveness Test In Progress</p>
                      <p className="text-sm font-semibold text-white">{livenessInstruction}</p>
                    </div>
                  </div>
                )}

                {livenessStage === 'passed' && (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-white">Liveness Verification Passed!</p>
                      <p className="text-xs text-emerald-400 font-mono">Biometric Match Score: {livenessScore}%</p>
                    </div>
                  </div>
                )}
              </div>

              {livenessStage === 'passed' && (
                <button
                  onClick={() => setActiveStep('documents')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Proceed to Final Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* STEP 5: DOCUMENT UPLOAD */}
          {activeStep === 'documents' && (
            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase block">Step 5 of 5</span>
                <h4 className="text-lg font-bold text-slate-900">Upload Driver, Artisan or Utility Documents</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Upload relevant supporting credentials for instant admin approval.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDocType('DRIVER_LICENSE')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    docType === 'DRIVER_LICENSE' ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold' : 'border-slate-200'
                  }`}
                >
                  FRSC Driver License
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('CAC_CERTIFICATE')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    docType === 'CAC_CERTIFICATE' ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold' : 'border-slate-200'
                  }`}
                >
                  CAC Business Reg
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('UTILITY_BILL')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    docType === 'UTILITY_BILL' ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold' : 'border-slate-200'
                  }`}
                >
                  Utility / PHCN Bill
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Identification Number</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. LAG-3849204-B"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* File upload zone simulation */}
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <FileUp className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs">
                  <label className="font-semibold text-emerald-700 cursor-pointer hover:underline">
                    <span>Click to attach document proof</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFileName(e.target.files[0].name);
                        } else {
                          setUploadedFileName('FRSC_Certified_License_Scan.pdf');
                        }
                      }}
                    />
                  </label>
                  <p className="text-slate-400 mt-0.5">PDF, PNG, or JPG (Max 10MB)</p>
                </div>
                {uploadedFileName && (
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded inline-block">
                    Attached: {uploadedFileName}
                  </span>
                )}
              </div>

              {docStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{docStatus}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Complete Identity Verification
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
