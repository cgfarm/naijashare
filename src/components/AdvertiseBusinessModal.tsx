import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Percent,
  Upload,
  MessageSquare,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbService } from '../services/db';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface AdvertiseBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated?: () => void;
}

export const AdvertiseBusinessModal: React.FC<AdvertiseBusinessModalProps> = ({
  isOpen,
  onClose,
  onAdCreated,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Solar & Renewable Energy');
  const [description, setDescription] = useState('');
  const [promoOffer, setPromoOffer] = useState('10% off for Naijashare commuters with code COMMUNITY10');
  const [address, setAddress] = useState(OFFICIAL_PLATFORM_DETAILS.address);
  const [city, setCity] = useState('Ota');
  const [phone, setPhone] = useState(OFFICIAL_PLATFORM_DETAILS.clientPhone);
  const [email, setEmail] = useState(OFFICIAL_PLATFORM_DETAILS.clientEmail);
  const [whatsapp, setWhatsapp] = useState(`https://wa.me/234${OFFICIAL_PLATFORM_DETAILS.clientPhone.replace(/\D/g, '').slice(-10)}`);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'spotlight' | 'premier'>('spotlight');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Solar & Renewable Energy',
    'Auto Care & Roadside Diagnostics',
    'Food, Groceries & Catering',
    'Gadget & Tech Repair',
    'Electrical & Home Appliances',
    'Fashion & Tailoring',
    'Building, Tiling & Carpentry',
    'Cleaning & Fumigation',
    'Beauty, Spa & Grooming',
    'Logistics & Courier Delivery'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    dbService.submitSmallBusinessAd({
      businessName: businessName.trim(),
      tagline: tagline.trim() || 'Trusted local community merchant on Naijashare Q-Fix.',
      category,
      description: description.trim() || 'Quality verified services for homes, businesses, and commuters.',
      promoOffer: promoOffer.trim(),
      address: address.trim(),
      city,
      phone: phone.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      badge: selectedPlan === 'premier' ? 'Super-App Premier' : selectedPlan === 'spotlight' ? 'Community Spotlight' : 'Verified Merchant'
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    if (onAdCreated) onAdCreated();

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Advertise Your Small Business</h3>
              <p className="text-xs text-slate-400">Reach 50,000+ daily carpool commuters, residents, and shortlet guests</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corporate Address Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Community Hub Address: <strong>{OFFICIAL_PLATFORM_DETAILS.address}</strong></span>
          </div>
          <span className="font-mono text-emerald-700 hidden sm:inline">Tel: {OFFICIAL_PLATFORM_DETAILS.clientPhone}</span>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Your Business Advertisement is Live!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Congratulations! <strong>{businessName}</strong> has been listed on the Naijashare Q-Fix Small Business Community Spotlight. Commuters and local residents can now view your promos and contact you directly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Promotion Tier Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Promotion Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <div
                    onClick={() => setSelectedPlan('free')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'free' 
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Starter Listing</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">FREE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Community directory listing & contact info display.</p>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('spotlight')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'spotlight' 
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Community Spotlight</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">₦5,000 / mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Homepage feature card + WhatsApp direct button.</p>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('premier')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'premier' 
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Super-App Premier</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">₦12,500 / mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Top search placement + Verified Artisan Gold Seal.</p>
                  </div>

                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business / Artisan Enterprise Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ile-Ileri Precision Solar & Inverters"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry / Artisan Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline / One-Liner Value Proposition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Expert inverter setups, tubular batteries, and 24/7 backup power for Ota & Lagos"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Description & Core Offerings
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your products, warranty guarantees, working hours, and service specialties..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Physical Business Address *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAddress('Ile-Ileri community, Asore Busstop, Ota');
                        setCity('Ota');
                      }}
                      className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Fill Ota Community Address
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ile-Ileri community, Asore Busstop, Ota"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Local Government Area
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ota, Ogun State"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08086857474"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cstadning@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Promotional Discount / Voucher for Commuters
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={promoOffer}
                      onChange={(e) => setPromoOffer(e.target.value)}
                      placeholder="e.g. 15% off with code OTA15"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-800"
                    />
                    <Tag className="w-4 h-4 text-emerald-600 absolute left-2.5 top-2.5" />
                  </div>
                </div>

              </div>

              {/* Live Preview Card */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Live Preview: How Your Ad Appears on Naijashare Q-Fix
                </span>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                        {category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {businessName || 'Your Business Name Here'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tagline || 'Your catchy business tagline and services.'}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-2 py-1 rounded font-semibold whitespace-nowrap">
                      {selectedPlan === 'premier' ? '⭐ Super-App Premier' : selectedPlan === 'spotlight' ? '✨ Spotlight' : 'Verified'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{promoOffer || 'Special community discount available!'}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium">{address || 'Ile-Ileri community, Asore Busstop, Ota'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px]">{phone || '08086857474'}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                        WhatsApp Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Publish Small Business Advertisement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
