import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, Monitor, ExternalLink } from 'lucide-react';

interface PopupTroubleshooterProps {
  isOpen: boolean;
  onClose: () => void;
}

type BrowserTab = 'chrome' | 'edge' | 'safari' | 'firefox';

export const PopupTroubleshooter: React.FC<PopupTroubleshooterProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<BrowserTab>('chrome');
  const [diagnosticResult, setDiagnosticResult] = useState<'idle' | 'allowed' | 'blocked'>('idle');

  if (!isOpen) return null;

  const runDiagnosticTest = () => {
    try {
      const win1 = window.open('about:blank', '_blank1');
      const win2 = window.open('about:blank', '_blank2');

      if (!win1 || win1.closed || typeof win1.closed === 'undefined' || !win2 || win2.closed) {
        setDiagnosticResult('blocked');
      } else {
        setDiagnosticResult('allowed');
        setTimeout(() => {
          try {
            win1.close();
            win2.close();
          } catch {
            // ignore
          }
        }, 800);
      }
    } catch {
      setDiagnosticResult('blocked');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Browser Popup Permission Guide
              </h2>
              <p className="text-xs text-slate-500">
                How to allow multiple tabs in your browser in 2 quick clicks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why this happens info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Why did my browser block the other tabs?
          </p>
          <p className="text-amber-800 leading-relaxed">
            By default, all modern web browsers block automated popup windows to protect you from advertising spam. To allow this website to open multiple tabs for you, you simply grant one-time permission.
          </p>
        </div>

        {/* Browser Selector Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          {(
            [
              { id: 'chrome', label: 'Chrome / Brave' },
              { id: 'edge', label: 'Microsoft Edge' },
              { id: 'safari', label: 'Apple Safari' },
              { id: 'firefox', label: 'Mozilla Firefox' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browser-specific steps */}
        <div className="space-y-3 text-xs text-slate-700">
          {activeTab === 'chrome' && (
            <ol className="space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                Look at the right end of your browser's address/URL bar for a small <strong>"Pop-ups blocked" icon</strong> (an address window with a red cross).
              </li>
              <li className="leading-relaxed">
                Click on the icon. A small dialog will appear.
              </li>
              <li className="leading-relaxed">
                Choose <strong>"Always allow pop-ups and redirects from this site"</strong>.
              </li>
              <li className="leading-relaxed">
                Click <strong>Done</strong>, then press the <strong>"Open Tabs"</strong> button again.
              </li>
            </ol>
          )}

          {activeTab === 'edge' && (
            <ol className="space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                Look at the right side of the Microsoft Edge address bar for the <strong>Pop-up blocked icon</strong>.
              </li>
              <li className="leading-relaxed">
                Click the icon and select <strong>"Always allow pop-ups from..."</strong>.
              </li>
              <li className="leading-relaxed">
                Click <strong>Done</strong> and re-trigger the Open Tabs button.
              </li>
            </ol>
          )}

          {activeTab === 'safari' && (
            <ol className="space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                In Safari menu bar, open <strong>Safari &gt; Settings / Preferences</strong> (or press Cmd+,).
              </li>
              <li className="leading-relaxed">
                Navigate to the <strong>Websites</strong> tab.
              </li>
              <li className="leading-relaxed">
                Click <strong>Pop-up Windows</strong> in the left sidebar.
              </li>
              <li className="leading-relaxed">
                Find this website in currently open websites, and change the dropdown from <em>Block</em> to <strong>Allow</strong>.
              </li>
            </ol>
          )}

          {activeTab === 'firefox' && (
            <ol className="space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                Firefox shows an alert bar right under the address bar saying <em>"Firefox prevented this site from opening a pop-up window"</em>.
              </li>
              <li className="leading-relaxed">
                Click the <strong>Options / Preferences</strong> button on that yellow bar.
              </li>
              <li className="leading-relaxed">
                Select <strong>"Allow pop-ups for this website"</strong>.
              </li>
            </ol>
          )}
        </div>

        {/* Live Permission Diagnostic */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="run-diagnostic-test-btn"
              type="button"
              onClick={runDiagnosticTest}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test Browser Permission</span>
            </button>

            {diagnosticResult === 'allowed' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Popups are Allowed!
              </span>
            )}
            {diagnosticResult === 'blocked' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                <AlertTriangle className="w-4 h-4" />
                Popups are currently blocked
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
