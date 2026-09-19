import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink, RotateCcw, HelpCircle } from 'lucide-react';
import { LaunchResult } from '../types';

interface LaunchStatusCardProps {
  result: LaunchResult;
  onRelaunch: () => void;
  onOpenTroubleshooter: () => void;
}

export const LaunchStatusCard: React.FC<LaunchStatusCardProps> = ({
  result,
  onRelaunch,
  onOpenTroubleshooter,
}) => {
  const isBlocked = result.blockedCount > 0;
  const isSuccess = result.status === 'completed' && !isBlocked;

  return (
    <div
      id="launch-status-card"
      className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${
        isBlocked
          ? 'bg-amber-50/70 border-amber-200'
          : isSuccess
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl mt-0.5 shrink-0 ${
              isBlocked
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isBlocked ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {isBlocked
                ? `Browser Blocked ${result.blockedCount} of ${result.requestedCount} Tabs`
                : `Successfully Dispatched ${result.openedCount} Tabs!`}
            </h3>
            <p className="text-xs text-slate-600">
              Target:{' '}
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-600 hover:underline inline-flex items-center gap-0.5"
              >
                <span>{result.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {isBlocked && (
            <button
              type="button"
              onClick={onOpenTroubleshooter}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Unblock</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRelaunch}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Launch Again</span>
          </button>
        </div>
      </div>

      {/* If blocked, give direct manual fallback links */}
      {isBlocked && (
        <div className="mt-3 pt-3 border-t border-amber-200/80 text-xs text-amber-900 space-y-2">
          <p className="font-medium">
            Quick fallback: Click any of the individual tabs below to open them manually:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {Array.from({ length: result.requestedCount }).map((_, idx) => (
              <a
                key={idx}
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
              >
                <span>Tab #{idx + 1}</span>
                <ExternalLink className="w-3 h-3 text-amber-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
