import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, QrCode, Building } from 'lucide-react';
import { ReceiptData } from '../types';
import { OFFICIAL_PLATFORM_DETAILS } from '../data/mockData';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 print:p-0 print:bg-white">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
        
        {/* Actions bar (hidden in print) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Official Payment Receipt & Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Printable Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-4">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Naijashare</span>
                <span className="text-xl font-extrabold text-emerald-600">Q-Fix</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Naijashare Q-Fix Technologies Ltd · RC-1928401</p>
              <p className="text-[11px] text-slate-400">Address: {OFFICIAL_PLATFORM_DETAILS.address}, Ogun State, Nigeria</p>
              <p className="text-[11px] text-slate-400">Support: {OFFICIAL_PLATFORM_DETAILS.clientPhone} · {OFFICIAL_PLATFORM_DETAILS.clientEmail}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded inline-block mb-1">
                {receipt.status === 'PAID' ? 'PAID & CONFIRMED' : 'HELD IN ESCROW'}
              </span>
              <p className="text-xs font-mono text-slate-500">{receipt.receiptNo}</p>
              <p className="text-[11px] text-slate-400">{receipt.date}</p>
            </div>
          </div>

          {/* Client & Payment Gateway Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Billed To (Client):</span>
              <p className="font-bold text-slate-900">{receipt.clientName}</p>
              <p className="text-slate-600 font-mono">{receipt.clientPhone}</p>
              <p className="text-slate-600">{receipt.clientEmail}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Transaction Meta:</span>
              <p className="text-slate-700">Gateway: <strong className="text-slate-900">{receipt.paymentGateway}</strong></p>
              <p className="font-mono text-slate-600 text-[11px] truncate">Ref: {receipt.paymentRef}</p>
              <p className="text-emerald-700 font-medium">Secured with 100% Escrow Protection</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Category</th>
                  <th className="py-2 text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-medium text-slate-900">
                    {receipt.itemTitle}
                  </td>
                  <td className="py-3 text-right text-slate-500 font-mono">
                    {receipt.category}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900 tabular-nums">
                    ₦{receipt.subtotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown & Totals */}
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal:</span>
              <span className="font-mono tabular-nums">₦{receipt.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Escrow Safety & Regulatory Fee:</span>
              <span className="font-mono tabular-nums">₦{receipt.escrowFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>FIRS Value Added Tax (VAT 2.5%):</span>
              <span className="font-mono tabular-nums">₦{receipt.vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-base text-emerald-700 font-mono tabular-nums">
                ₦{receipt.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Official Bank Account Reference */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Official Institutional Bank Account Details</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1 text-slate-800">
              <div>
                <span className="text-slate-400 block font-sans">Bank:</span>
                <strong>{OFFICIAL_PLATFORM_DETAILS.bankDetails.bankName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Account No:</span>
                <strong className="text-emerald-800">{OFFICIAL_PLATFORM_DETAILS.bankDetails.accountNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Beneficiary:</span>
                <strong className="truncate block" title={OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}>
                  {OFFICIAL_PLATFORM_DETAILS.bankDetails.accountName}
                </strong>
              </div>
            </div>
          </div>

          {/* Security stamp & QR */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-slate-500">DIGITALLY VERIFIED SIGNATURE</p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Central Bank of Nigeria & NDPR Compliant</span>
                </p>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="text-slate-500 block">Download Mobile App:</span>
              <a 
                href={OFFICIAL_PLATFORM_DETAILS.playStoreUrl}
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-700 font-semibold hover:underline"
              >
                Google Play Store
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
