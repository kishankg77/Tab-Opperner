import React from 'react';
import { Play, Square, ExternalLink, Sparkles } from 'lucide-react';

interface LaunchControllerProps {
  url: string;
  limit: number;
  isLaunching: boolean;
  currentProgress: number;
  onLaunch: () => void;
  onCancel: () => void;
  onSelectSampleUrl: (sampleUrl: string) => void;
}

const SAMPLE_URLS = [
  { label: 'Google Search', url: 'https://www.google.com' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com' },
  { label: 'GitHub', url: 'https://github.com' },
];

export const LaunchController: React.FC<LaunchControllerProps> = ({
  url,
  limit,
  isLaunching,
  currentProgress,
  onLaunch,
  onCancel,
  onSelectSampleUrl,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isLaunching ? (
          <button
            id="cancel-launch-btn"
            type="button"
            onClick={onCancel}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-base bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop Opening ({currentProgress}/{limit})</span>
          </button>
        ) : (
          <button
            id="open-tabs-primary-btn"
            type="button"
            onClick={onLaunch}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-200 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Open {limit} {limit === 1 ? 'Tab' : 'Tabs'} Now</span>
            <span className="bg-indigo-500/80 px-2 py-0.5 rounded-full text-xs font-semibold ml-1">
              {url ? 'Ready' : 'Paste URL first'}
            </span>
          </button>
        )}
      </div>

      {/* Progress Bar during execution */}
      {isLaunching && (
        <div className="w-full space-y-1.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <div className="flex justify-between text-xs font-semibold text-indigo-900">
            <span>Opening tabs sequentially...</span>
            <span>
              {currentProgress} of {limit} tabs
            </span>
          </div>
          <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-200"
              style={{ width: `${Math.round((currentProgress / limit) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Test / Sample Links */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Try:</span>
        </span>
        {SAMPLE_URLS.map((sample) => (
          <button
            key={sample.url}
            id={`sample-link-${sample.label.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => onSelectSampleUrl(sample.url)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-medium transition-colors inline-flex items-center gap-1"
          >
            <span>{sample.label}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
};
