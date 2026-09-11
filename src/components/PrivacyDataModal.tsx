import React from 'react';
import { clearAllLocalData, exportAllDataJSON } from '../lib/storage';
import { X, Lock, Download, Trash2, Mail, ShieldCheck } from 'lucide-react';

interface PrivacyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const json = exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelliwealth_privacy_export_${Date.now()}.json`;
    a.click();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete all stored profile and mission data from this device?')) {
      clearAllLocalData();
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 text-xs text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold text-slate-900">
              PRIVACY & DATA CONTROL
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 font-bold block">Privacy Policy & Principles</strong>
            <p className="text-slate-600">
              We collect only what is needed for the active mission. Reusable profile facts are separated from mission-specific information. External system secrets are never stored in profile or mission records.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <strong className="text-slate-900 font-bold block">Contact Project Support</strong>
            <p className="text-slate-600">
              Use the customer workspace or email support for scope revisions, cancellation, or formal data requests.
            </p>
            <a
              href="mailto:kagan@aikagan.com"
              className="inline-flex items-center space-x-1.5 text-amber-700 font-bold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Project Contact: kagan@aikagan.com</span>
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export All Profile Data</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Stored Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
