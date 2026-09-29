import React from 'react';
import { X, ShieldCheck, Building, Phone, Mail, Download, CheckCircle2, Lock, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Naijashare Q-Fix Terms of Service</h3>
              <p className="text-xs text-slate-400">Platform Governance, Escrow Protocols & Operating Rules</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corporate Legal Strip */}
        <div className="bg-emerald-950/90 text-emerald-200 px-6 py-3 border-b border-emerald-900/60 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Naijashare Q-Fix Technologies Ltd · RC-1928401</span>
          </div>
          <div className="text-[11px] text-emerald-300">
            Address: <span className="text-white font-sans">{OFFICIAL_PLATFORM_DETAILS.address}, Ogun State</span>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">

          {/* Institutional Contact & Settlement Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Corporate Registry & Contact Coordinates</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Registered Physical Address:</span>
                <strong className="text-slate-900 font-semibold">{OFFICIAL_PLATFORM_DETAILS.fullAddress}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Contact Channels:</span>
                <span className="text-slate-900 font-mono">Tel: {OFFICIAL_PLATFORM_DETAILS.clientPhone}</span>
                <span className="block text-slate-900">{OFFICIAL_PLATFORM_DETAILS.clientEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Official Settlement Account:</span>
                <span className="text-slate-900 font-mono font-semibold">{OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}</span> ({OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName})
                <p className="text-[11px] text-slate-500">{OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Official Android Mobile Application:</span>
                <a
                  href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Google Play App (Package ID: tnypsw)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              1. Preamble & Scope of Naijashare Q-Fix Services
            </h5>
            <p>
              These Terms of Service govern your access to and utilization of the Naijashare Q-Fix multi-sided marketplace platform, comprising scheduled commuter ridesharing, verified Q-Fix artisan and handyman dispatches, serviced shortlet apartments, and small business community advertising directory. By creating an account or initiating any booking, you explicitly consent to these provisions.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              2. Tier-3 Identity & NIMC NIN Verification Mandate
            </h5>
            <p>
              To safeguard Nigerian commuters, homeowners, artisans, and drivers against fraud and misconduct, Naijashare Q-Fix maintains a stringent 5-step identity verification framework:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>SMS Phone OTP:</strong> Verification of authentic Nigerian mobile network SIM (MTN, Airtel, Glo, 9mobile).</li>
              <li><strong>Email Authentication:</strong> Secure token dispatch for receipts, booking confirmation, and legal documentation.</li>
              <li><strong>NIMC NIN Gateway Validation:</strong> Algorithmic validation of the 11-digit National Identity Number directly through central federal identity records.</li>
              <li><strong>3D Face Liveness Biometrics:</strong> ISO/IEC 30107-3 compliant facial depth analysis to prevent photographic spoofing.</li>
              <li><strong>Document Credentialing:</strong> FRSC driver licenses, CAC business registrations, and PHCN utility bills.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              3. Payment Processing & Escrow Protection Protocol
            </h5>
            <p>
              All financial settlements across the platform are facilitated via licensed Central Bank of Nigeria (CBN) payment gateways including Paystack, Flutterwave, and Moniepoint:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Client funds for Q-Fix repairs and driver bookings are held securely in a quarantined Escrow Trust ledger.</li>
              <li>Funds are released to service providers or carpool drivers only after satisfactory completion of the ride or service task confirmed by the client.</li>
              <li>In the event of service failure or cancellation within eligible windows, escrow funds are automatically restored to the client wallet or refunded to source.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              4. Cancellations, Refunds & Dispute Arbitration
            </h5>
            <p>
              Clients may request cancellation of rides, artisan bookings, or apartment reservations via their dashboard. Rides canceled at least 2 hours prior to departure receive an automated 100% refund. For artisan and shortlet bookings, disputes undergo expedited resolution within 24 hours by platform administrators.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              5. Small Business Advertising Terms & Local Commerce Directory
            </h5>
            <p>
              Small businesses, artisans, and commercial establishments—including community partners located in <strong>Ile-Ileri community, Asore Busstop, Ota</strong>, Lagos, and surrounding metropolitan hubs—may list promotional advertisements, service menus, discount vouchers, and contact coordinates. All advertised merchants must possess verified physical addresses and legitimate operational capacity. Naijashare Q-Fix reserves the right to review and remove inaccurate or deceptive advertisements.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h5 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              6. Data Protection & Nigerian NDPR Compliance
            </h5>
            <p>
              In accordance with the Nigeria Data Protection Regulation (NDPR), all personal data, national identity numbers, biometric facial scans, and financial transaction records are encrypted end-to-end using AES-256 and stored exclusively on secure cloud infrastructure.
            </p>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Last Updated: September 2026 · Naijashare Q-Fix Terms of Service
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            I Acknowledge & Understand
          </button>
        </div>

      </div>
    </div>
  );
};
