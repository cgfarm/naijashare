import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  X, 
  Lock, 
  FileText,
  Copy,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';
import { ReceiptData } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentRef: string, gateway: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT', receipt?: ReceiptData) => void;
  onViewReceipt?: (receipt: ReceiptData) => void;
  amount: number;
  itemTitle: string;
  category: 'Rideshare' | 'Q-Fix Service' | 'Apartment Booking';
  description?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onViewReceipt,
  amount,
  itemTitle,
  category,
  description,
  clientName = 'Chidi Stadning',
  clientEmail = OFFICIAL_PLATFORM_DETAILS.clientEmail,
  clientPhone = OFFICIAL_PLATFORM_DETAILS.clientPhone,
}) => {
  const [gateway, setGateway] = useState<'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT'>('PAYSTACK');
  const [method, setMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 8820 4912');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('834');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [copiedAcct, setCopiedAcct] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<ReceiptData | null>(null);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber);
    setCopiedAcct(true);
    setTimeout(() => setCopiedAcct(false), 2000);
  };

  const handlePay = () => {
    setIsProcessing(true);
    const prefix = gateway === 'PAYSTACK' ? 'NSQ-PSTK' : gateway === 'FLUTTERWAVE' ? 'NSQ-FLW' : 'NSQ-MNP';
    const ref = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRef(ref);

    // Simulate secure payment gateway transaction + webhook verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);

      const subtotal = amount;
      const escrowFee = Math.round(amount * 0.05);
      const vat = Math.round(amount * 0.025);
      const total = subtotal + escrowFee + vat;

      const rec: ReceiptData = {
        receiptNo: `REC-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString('en-NG', { dateStyle: 'long' }),
        clientName,
        clientEmail,
        clientPhone,
        category,
        itemTitle,
        paymentGateway: gateway === 'PAYSTACK' ? 'Paystack' : gateway === 'FLUTTERWAVE' ? 'Flutterwave' : 'Moniepoint Direct',
        paymentRef: ref,
        subtotal,
        escrowFee,
        vat,
        total,
        status: 'PAID',
        beneficiaryAccount: OFFICIAL_PLATFORM_DETAILS.bankDetails
      };

      setGeneratedReceipt(rec);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1500);
  };

  const handleFinalize = () => {
    if (generatedReceipt) {
      onSuccess(generatedRef, gateway, generatedReceipt);
    } else {
      onSuccess(generatedRef, gateway);
    }
    setIsDone(false);
    onClose();
  };

  const handleViewReceiptDirectly = () => {
    if (generatedReceipt && onViewReceipt) {
      onViewReceipt(generatedReceipt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ₦
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Verified Payment Escrow Gateway</p>
              <h3 className="text-base font-semibold text-white">Complete Booking Payment</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Payment Verified Successfully</h4>
              <p className="text-xs text-slate-500 mt-1">
                Webhook signature validated. Funds are secured safely in Escrow.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-left text-xs space-y-2 border border-slate-200 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Reference:</span>
                <span className="font-semibold text-slate-800">{generatedRef}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Gateway Processor:</span>
                <span className="font-semibold text-emerald-700">{gateway}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Authorized:</span>
                <span className="font-semibold text-emerald-600">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Client Email:</span>
                <span className="font-medium text-slate-700">{clientEmail}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Protection:</span>
                <span className="text-emerald-700">100% Escrow Protected</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleViewReceiptDirectly}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-700" />
                <span>View Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleFinalize}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            
            {/* Amount Summary */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-medium">{category}</span>
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[220px]">{itemTitle}</p>
                {description && <p className="text-xs text-slate-500 truncate max-w-[220px]">{description}</p>}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Payable</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Gateway Provider Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Payment Processing Gateway:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setGateway('PAYSTACK')}
                  className={`p-2.5 rounded-xl border font-medium text-center transition-all cursor-pointer ${
                    gateway === 'PAYSTACK'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Paystack
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('FLUTTERWAVE')}
                  className={`p-2.5 rounded-xl border font-medium text-center transition-all cursor-pointer ${
                    gateway === 'FLUTTERWAVE'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Flutterwave
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGateway('MONIEPOINT_DIRECT');
                    setMethod('transfer');
                  }}
                  className={`p-2.5 rounded-xl border font-medium text-center transition-all cursor-pointer ${
                    gateway === 'MONIEPOINT_DIRECT'
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Moniepoint Direct
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            {gateway !== 'MONIEPOINT_DIRECT' && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    method === 'card'
                      ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1 text-slate-700" />
                  <span>Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('transfer')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    method === 'transfer'
                      ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-1 text-slate-700" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('ussd')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    method === 'ussd'
                      ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-1 text-slate-700" />
                  <span>USSD</span>
                </button>
              </div>
            )}

            {/* Moniepoint Direct Institutional Transfer Card */}
            {(gateway === 'MONIEPOINT_DIRECT' || method === 'transfer') && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold text-slate-900">Designated Institutional Account:</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Instant Reconciliation
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Bank:</span>
                    <strong className="text-slate-900">{OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Account Number:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-base font-bold text-emerald-700">
                        {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        title="Copy account number"
                      >
                        {copiedAcct ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Beneficiary Name:</span>
                    <strong className="text-slate-800 text-[11px] truncate max-w-[200px]" title={OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}>
                      {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Transfers are auto-verified via Moniepoint webhook. Include your phone ({clientPhone}) in transaction memo.
                </p>
              </div>
            )}

            {/* Debit Card Form */}
            {gateway !== 'MONIEPOINT_DIRECT' && method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Debit Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="5399 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* USSD Form */}
            {gateway !== 'MONIEPOINT_DIRECT' && method === 'ussd' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <p className="text-slate-600 font-medium">Dial on your registered SIM:</p>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                    <span>GTBank:</span>
                    <code className="text-emerald-700 font-bold">*737*2*{amount}*5222549518#</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                    <span>Zenith:</span>
                    <code className="text-emerald-700 font-bold">*966*60*{amount}#</code>
                  </div>
                </div>
              </div>
            )}

            {/* Escrow Guarantee */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CBN regulated escrow. Funds held securely until booking fulfillment.</span>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing with {gateway}...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize ₦{amount.toLocaleString()} with {gateway === 'MONIEPOINT_DIRECT' ? 'Moniepoint' : gateway}</span>
                </>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
