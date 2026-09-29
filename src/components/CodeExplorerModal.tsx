import React, { useState } from 'react';
import { X, Download, FileCode, Check, Copy, Folder, Database, Terminal, ArrowRight } from 'lucide-react';
import { EXPORTED_FILES, generateProjectZip, downloadBlob, CodeFile } from '../services/zipExporter';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(EXPORTED_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateProjectZip();
      downloadBlob(zipBlob, 'naijashare-qfix-starter.zip');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden text-slate-100">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Naijashare Q-Fix Full-Stack Codebase</h3>
                <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">Next.js + Prisma + PostgreSQL</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Explore database schema, API route handlers, and export full starter package</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isZipping ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Archiving Project...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Complete Starter (.zip)</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: Sidebar + Code Editor View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* File Tree Sidebar */}
          <div className="w-72 border-r border-slate-800 bg-slate-950/40 p-3 overflow-y-auto space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 mb-2 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>Project Structure</span>
              </div>
              <div className="space-y-1">
                {EXPORTED_FILES.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                      selectedFile.path === file.path
                        ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Run Terminal Hint */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Quick Setup Command:</span>
              </div>
              <div className="bg-slate-950 p-2 rounded text-slate-300 overflow-x-auto text-[11px]">
                <code>npm i && npx prisma db push && npm run dev</code>
              </div>
            </div>
          </div>

          {/* Main Code View */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* File Path & Copy Bar */}
            <div className="px-5 py-2.5 bg-slate-950/30 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <span className="text-slate-500">naijashare-qfix /</span>
                <span className="text-emerald-400 font-medium">{selectedFile.path}</span>
                <span className="text-slate-400 font-sans text-[11px]">· {selectedFile.category}</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/70 select-text">
              <pre className="whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Authentication: JWT + bcryptjs</span>
            <span>·</span>
            <span>Database: PostgreSQL (Prisma ORM)</span>
            <span>·</span>
            <span>Payments: Paystack / Escrow NGN</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ready to deploy on Vercel, Railway, or VPS</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

      </div>
    </div>
  );
};
