import React from 'react';
import { ShieldCheck, MessageSquare, Phone, MapPin, Mail, ExternalLink, Building, Download, Store } from 'lucide-react';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenAdvertise?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenAdvertise }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs mt-20">
      
      {/* Institutional Settlement Notice Strip */}
      <div className="bg-emerald-950/70 border-b border-emerald-900/60 py-3 text-emerald-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Official Settlement Account: <strong className="text-white font-mono">{OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}</strong> ({OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName} · {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-300">Tel: {OFFICIAL_PLATFORM_DETAILS.clientPhone}</span>
            <span>·</span>
            <span className="text-slate-300">{OFFICIAL_PLATFORM_DETAILS.clientEmail}</span>
            <a
              href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-white hover:text-emerald-400 bg-emerald-900/80 border border-emerald-700/60 px-2.5 py-1 rounded"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Android App</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Nigerian Trust Mission */}
          <div className="space-y-4">
            <div className="text-white font-bold text-base flex items-center gap-1.5">
              <span>Naijashare</span>
              <span className="text-emerald-500 font-extrabold">Q-Fix</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mb-1" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nigeria's unified ecosystem for punctual ridesharing, certified artisan home repairs, serviced shortlet apartments, and small business community promotion.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NIN, FRSC License & 3D Liveness Certified</span>
            </div>
            
            {onOpenAdvertise && (
              <div className="pt-1">
                <button
                  onClick={onOpenAdvertise}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Advertise Your Small Business</span>
                </button>
              </div>
            )}
          </div>

          {/* Col 2: Services & Marketplaces */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Marketplaces & Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#rides" className="hover:text-emerald-400 transition-colors">Daily Carpools & Airport Express</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Solar & Inverter Technicians</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">AC & Generator Maintenance</a></li>
              <li><a href="#apartments" className="hover:text-emerald-400 transition-colors">Lekki & VI Serviced Shortlets</a></li>
              {onOpenAdvertise && (
                <li>
                  <button 
                    onClick={onOpenAdvertise} 
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left font-medium text-emerald-400"
                  >
                    📢 Advertise Your Small Business
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Nigerian Offices & Client Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Contact & Regional Hub</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Address:</span>
                  <span>{OFFICIAL_PLATFORM_DETAILS.address}, Ogun State, Nigeria</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono">{OFFICIAL_PLATFORM_DETAILS.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{OFFICIAL_PLATFORM_DETAILS.clientEmail}</span>
              </div>
              <div className="pt-1">
                <a
                  href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Play Mobile App</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Escrow & Assistance */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Payment & Settlement Account</h4>
            <p className="text-xs text-slate-400">
              Payments secured with Paystack, Flutterwave, and Moniepoint. Direct settlement to Open House Fellowship Mission Foundation (Acct: {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}).
            </p>
            <a
              href={`https://wa.me/234${OFFICIAL_PLATFORM_DETAILS.clientPhone.replace(/\D/g, '').slice(-10)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct: {OFFICIAL_PLATFORM_DETAILS.clientPhone}</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Naijashare Q-Fix Technologies Ltd · {OFFICIAL_PLATFORM_DETAILS.address}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">NDPR Privacy Compliance</span>
            <button
              onClick={onOpenTerms}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline decoration-emerald-500/50"
            >
              Naijashare Q-Fix terms of service
            </button>
            <span className="text-slate-400">FRSC Safety Protocol</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
