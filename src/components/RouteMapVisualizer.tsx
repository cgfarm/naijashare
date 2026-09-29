import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Car, 
  Zap, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Ride } from '../types';

interface RouteMapVisualizerProps {
  ride: Ride;
  selectedPickup?: string;
  onSelectPickup?: (pickup: string) => void;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({
  ride,
  selectedPickup,
  onSelectPickup
}) => {
  const [activeSegment, setActiveSegment] = useState<'all' | 'traffic' | 'waypoints'>('all');
  const [selectedPin, setSelectedPin] = useState<string>(selectedPickup || ride.origin);

  // Common Lagos/Abuja key landmarks for pickup selection
  const waypoints = [
    { name: ride.origin, type: 'Origin', eta: '0 min', landmark: 'Main Gate / Boarding Point' },
    { name: 'Toll Expressway / Transit Link', type: 'Waypoint', eta: '+15 mins', landmark: 'Fast Pass Lane' },
    { name: '3rd Mainland Bridge Corridor', type: 'Corridor', eta: '+25 mins', landmark: 'Traffic Flow: 65 km/h' },
    { name: ride.destination, type: 'Destination', eta: ride.estimatedDuration || '+45 mins', landmark: 'Terminal Gate Drop-off' }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl space-y-4 p-5">
      
      {/* Top Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <h4 className="font-semibold text-sm text-white">Live Route & Corridor Visualizer</h4>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              GPS Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {ride.origin} ➔ {ride.destination}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Distance</span>
            <span className="text-emerald-400 font-bold">{ride.distanceKm || 28.4} km</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Travel Time</span>
            <span className="text-white font-bold">{ride.estimatedDuration || '45 mins'}</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Map Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 sm:h-72 flex items-center justify-center">
        
        {/* Subtle Map Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Highway Vector Graphic */}
        <svg className="w-full h-full p-4" viewBox="0 0 500 240" fill="none">
          {/* Waterway / Lagoon Area */}
          <path
            d="M 0,160 Q 150,130 280,180 T 500,150 L 500,240 L 0,240 Z"
            fill="#064e3b"
            opacity="0.25"
          />

          {/* Tertiary City Roads */}
          <path d="M 50,20 L 120,80 L 80,180" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 220,30 L 260,110 L 340,190" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 380,40 L 420,100 L 460,180" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

          {/* Main Expressway Track (Glow + Solid) */}
          <path
            d="M 60,190 C 130,190 140,80 230,80 S 340,140 430,60"
            stroke="#10b981"
            strokeWidth="10"
            strokeOpacity="0.2"
          />
          <path
            d="M 60,190 C 130,190 140,80 230,80 S 340,140 430,60"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Animated Commuter Vehicle Marker */}
          <g className="animate-pulse">
            <circle cx="230" cy="80" r="10" fill="#10b981" fillOpacity="0.4" />
            <circle cx="230" cy="80" r="5" fill="#34d399" />
          </g>

          {/* Origin Marker */}
          <g transform="translate(60, 190)">
            <circle r="8" fill="#10b981" />
            <circle r="4" fill="#ffffff" />
            <text x="12" y="4" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              Pickup (Admiralty Way)
            </text>
          </g>

          {/* Bridge / Toll Waypoint */}
          <g transform="translate(230, 80)">
            <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#f59e0b" />
            <text x="-35" y="-12" fill="#fbbf24" fontSize="10" fontFamily="sans-serif">
              3rd Mainland Bridge Link
            </text>
          </g>

          {/* Destination Marker */}
          <g transform="translate(430, 60)">
            <circle r="8" fill="#f43f5e" />
            <circle r="4" fill="#ffffff" />
            <text x="-120" y="4" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              Drop-off (MMA2 Airport)
            </text>
          </g>
        </svg>

        {/* Floating Status Card */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Car className="w-3.5 h-3.5" />
            <span>Driver Vehicle: {ride.vehicleModel}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">Plate: {ride.vehiclePlate} · AC Running</p>
        </div>

        {/* Live Traffic Badge */}
        <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Traffic: Fast Flow (65 km/h)</span>
        </div>
      </div>

      {/* Select Exact Pickup Landmark */}
      <div>
        <span className="text-xs font-semibold text-slate-300 block mb-2">Select Your Boarding Spot / Landmark:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {waypoints.map((wp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelectedPin(wp.name);
                if (onSelectPickup) onSelectPickup(wp.name);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPin === wp.name
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-xs'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-emerald-400 text-[11px]">{wp.type}</span>
                <span className="font-mono text-[10px] text-slate-500">{wp.eta}</span>
              </div>
              <p className="text-xs font-medium text-slate-200 truncate">{wp.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{wp.landmark}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
