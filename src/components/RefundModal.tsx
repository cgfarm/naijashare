import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { dbService } from '../services/db';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingType: 'RIDE' | 'SERVICE' | 'APARTMENT';
  bookingTitle: string;
  amount: number;
  paymentRef: string;
  onSuccess: () => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  bookingType,
  bookingTitle,
  amount,
  paymentRef,
  onSuccess,
}) => {
  const [reason, setReason] = useState('My schedule changed');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = dbService.requestCancellationAndRefund({
        bookingId,
        bookingType,
        reason: `${reason} - ${notes}`,
      });
      if (res.success) {
        setSuccessMsg(res.message);
        onSuccess();
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Cancel Booking & Request Refund</h3>
              <p className="text-[11px] text-slate-400 font-mono">Ref: {paymentRef}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Refund Request Submitted</h4>
            <p className="text-xs text-slate-500">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Summary card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Item to cancel:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{bookingTitle}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Refundable Amount:</span>
                <span className="font-bold text-emerald-700 tabular-nums">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Escrow Status:</span>
                <span className="text-emerald-700 font-medium">Held securely in Escrow</span>
              </div>
            </div>

            {/* Policy notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Naijashare Guaranteed Refund Policy</span>
              </p>
              <p className="text-[11px] text-slate-600">
                100% full refund is guaranteed if cancelled before departure or if driver/artisan is delayed by more than 20 minutes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Select Cancellation Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Driver delayed by more than 20 minutes">Driver delayed by more than 20 minutes</option>
                <option value="Artisan did not arrive or failed to contact">Artisan did not arrive or failed to contact</option>
                <option value="My schedule or travel plans changed">My schedule or travel plans changed</option>
                <option value="Emergency circumstances">Emergency circumstances</option>
                <option value="Booked wrong date/seats by accident">Booked wrong date/seats by accident</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Additional Explanation (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Give us context to expedite refund authorization..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
