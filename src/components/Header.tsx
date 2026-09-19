import React from 'react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';
import { isInIframe } from '../utils/urlHelper';

interface HeaderProps {
  onOpenTroubleshooter: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTroubleshooter }) => {
  const insideIframe = typeof window !== 'undefined' && isInIframe();

  const handleOpenNewWindow = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <header className="w-full pb-6 pt-2 border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 ring-4 ring-indigo-50">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-xl font-bold text-slate-900 tracking-tight">
                Multi-Tab Opener
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Link Multiplier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste any URL link to instantly launch multiple browser tabs simultaneously.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {insideIframe && (
            <button
              id="popout-standalone-btn"
              onClick={handleOpenNewWindow}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-lg transition-colors"
              title="Open this app in a dedicated tab for unrestricted popup handling"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Full Tab</span>
            </button>
          )}

          <button
            id="popup-guide-trigger"
            onClick={onOpenTroubleshooter}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popup Blocker Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
