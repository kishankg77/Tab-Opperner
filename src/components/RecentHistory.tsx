import React from 'react';
import { History, Play, Trash2, Globe, ExternalLink } from 'lucide-react';
import { HistoryEntry } from '../types';
import { getDomain } from '../utils/urlHelper';

interface RecentHistoryProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelectEntry,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div
      id="recent-history-section"
      className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Recent Launches</h3>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>

        <button
          id="clear-history-btn"
          type="button"
          onClick={onClearHistory}
          className="text-xs font-medium text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
        {history.map((entry) => {
          const domain = getDomain(entry.url);
          const formattedDate = new Date(entry.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={entry.id}
              className="py-2.5 flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {entry.url}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                    {entry.tabLimit} {entry.tabLimit === 1 ? 'tab' : 'tabs'}
                  </span>
                  <span>•</span>
                  <span>{domain || 'link'}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Open single tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onSelectEntry(entry)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Load and configure this URL"
                >
                  <Play className="w-3 h-3 fill-indigo-600" />
                  <span>Load</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
