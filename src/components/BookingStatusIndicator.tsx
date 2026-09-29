import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Car, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type BookingStatusValue = 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface BookingStatusIndicatorProps {
  status: BookingStatusValue | string;
  type?: 'SERVICE' | 'RIDE' | 'APARTMENT';
  id?: string;
  onStatusChange?: (newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => void;
  isProvider?: boolean;
  compact?: boolean;
  showTimeline?: boolean;
  showControls?: boolean;
  etaText?: string;
  title?: string;
}

export const BookingStatusIndicator: React.FC<BookingStatusIndicatorProps> = ({
  status: initialStatus,
  type = 'SERVICE',
  id,
  onStatusChange,
  isProvider = false,
  compact = false,
  showTimeline = true,
  showControls = true,
  etaText,
  title
}) => {
  // Map raw status into primary 3-stage paradigm: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' (or 'CANCELLED')
  const normalizeStatus = (s: string): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' => {
    if (s === 'COMPLETED') return 'COMPLETED';
    if (s === 'CANCELLED') return 'CANCELLED';
    if (s === 'IN_PROGRESS') return 'IN_PROGRESS';
    // 'PENDING', 'ACCEPTED', 'CONFIRMED' are all stage 1
    return 'PENDING';
  };

  const [currentStatus, setCurrentStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>(
    normalizeStatus(initialStatus)
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCountdown, setSimulationCountdown] = useState<number | null>(null);

  // Sync with prop updates
  useEffect(() => {
    setCurrentStatus(normalizeStatus(initialStatus));
  }, [initialStatus]);

  // Real-time live simulation runner
  useEffect(() => {
    if (!isSimulating) {
      setSimulationCountdown(null);
      return;
    }

    let timerId: any = null;
    let countdownVal = 3;
    setSimulationCountdown(countdownVal);

    const intervalId = setInterval(() => {
      countdownVal -= 1;
      setSimulationCountdown(countdownVal);

      if (countdownVal <= 0) {
        clearInterval(intervalId);
        // Advance stage
        if (currentStatus === 'PENDING') {
          handleStatusChange('IN_PROGRESS');
          // continue to completed after next 3 seconds
        } else if (currentStatus === 'IN_PROGRESS') {
          handleStatusChange('COMPLETED');
          setIsSimulating(false);
          setSimulationCountdown(null);
        } else {
          setIsSimulating(false);
          setSimulationCountdown(null);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      if (timerId) clearTimeout(timerId);
    };
  }, [isSimulating, currentStatus]);

  const handleStatusChange = (newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setCurrentStatus(newStatus);
    if (newStatus === 'COMPLETED') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const getStageStep = (): number => {
    switch (currentStatus) {
      case 'PENDING':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'COMPLETED':
        return 3;
      case 'CANCELLED':
        return 0;
      default:
        return 1;
    }
  };

  const stageStep = getStageStep();

  // If compact badge mode only
  if (compact) {
    if (currentStatus === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Cancelled</span>
        </span>
      );
    }

    if (currentStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Pending</span>
        </span>
      );
    }

    if (currentStatus === 'IN_PROGRESS') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span>In Progress</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Completed</span>
      </span>
    );
  }

  return (
    <div className="bg-white/95 rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3 transition-all">
      
      {/* Header Row: Live Status Pill & Quick Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Main Status Badge */}
          {currentStatus === 'PENDING' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>Pending Acceptance</span>
            </div>
          )}

          {currentStatus === 'IN_PROGRESS' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>In Progress (Active)</span>
            </div>
          )}

          {currentStatus === 'COMPLETED' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Completed & Settled</span>
            </div>
          )}

          {currentStatus === 'CANCELLED' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Cancelled</span>
            </div>
          )}

          {/* Real-time Indicator pulse label */}
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Live State Sync</span>
          </span>
        </div>

        {/* Optional Simulator Toggle for Demonstration */}
        {isProvider && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                if (isSimulating) {
                  setIsSimulating(false);
                } else {
                  if (currentStatus === 'COMPLETED') {
                    handleStatusChange('PENDING');
                  }
                  setIsSimulating(true);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSimulating 
                  ? 'bg-amber-500 text-white animate-pulse' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Automatically simulate real-time status transitions every 3 seconds"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>{isSimulating ? `Simulating (${simulationCountdown}s)` : 'Simulate Live Cycle'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual 3-Stage Progress Timeline */}
      {showTimeline && currentStatus !== 'CANCELLED' && (
        <div className="pt-2 pb-1">
          {/* Progress Bar Track */}
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 rounded-full transition-all duration-500 ease-out"
              style={{
                width: stageStep === 1 ? '10%' : stageStep === 2 ? '50%' : '100%'
              }}
            ></div>

            {/* Stage 1: Pending */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => isProvider && handleStatusChange('PENDING')}
                disabled={!isProvider}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  stageStep >= 1
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                } ${isProvider ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                1
              </button>
              <span className={`text-[10px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                stageStep === 1 ? 'text-amber-800 font-bold' : 'text-slate-500'
              }`}>
                Pending
              </span>
            </div>

            {/* Stage 2: In Progress */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => isProvider && handleStatusChange('IN_PROGRESS')}
                disabled={!isProvider}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  stageStep >= 2
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                } ${isProvider ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                2
              </button>
              <span className={`text-[10px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                stageStep === 2 ? 'text-blue-800 font-bold' : 'text-slate-500'
              }`}>
                In Progress
              </span>
            </div>

            {/* Stage 3: Completed */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => isProvider && handleStatusChange('COMPLETED')}
                disabled={!isProvider}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  stageStep === 3
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                } ${isProvider ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                {stageStep === 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
              </button>
              <span className={`text-[10px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                stageStep === 3 ? 'text-emerald-800 font-bold' : 'text-slate-500'
              }`}>
                Completed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Descriptive Status Banner & Dynamic Micro-copy */}
      <div className="p-2.5 rounded-lg text-xs flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80">
        <div className="flex items-center gap-2">
          {currentStatus === 'PENDING' && (
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          {currentStatus === 'IN_PROGRESS' && (
            <Wrench className="w-4 h-4 text-blue-600 shrink-0 animate-spin-slow" />
          )}
          {currentStatus === 'COMPLETED' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          {currentStatus === 'CANCELLED' && (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}

          <p className="text-slate-700 font-medium">
            {currentStatus === 'PENDING' && (
              <span>Order queued in dispatch. Awaiting provider arrival & check-in.</span>
            )}
            {currentStatus === 'IN_PROGRESS' && (
              <span>Technician is active on-site. Escrow funds secured in Moniepoint.</span>
            )}
            {currentStatus === 'COMPLETED' && (
              <span>Service successfully fulfilled! Escrow released to technician wallet.</span>
            )}
            {currentStatus === 'CANCELLED' && (
              <span>Booking was cancelled. Escrow refund request queued.</span>
            )}
          </p>
        </div>

        {etaText && (
          <span className="text-[11px] font-mono text-slate-500 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
            {etaText}
          </span>
        )}
      </div>

      {/* Provider Interactive State Controls (When isProvider is true) */}
      {isProvider && showControls && currentStatus !== 'CANCELLED' && (
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Provider Live Actions:
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusChange('PENDING')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                currentStatus === 'PENDING'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Set Pending
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentStatus === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Job (In Progress)</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('COMPLETED')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentStatus === 'COMPLETED'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Mark Completed & Payout</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
