import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UrlBar } from './components/UrlBar';
import { LimitSettings } from './components/LimitSettings';
import { LaunchController } from './components/LaunchController';
import { LaunchStatusCard } from './components/LaunchStatusCard';
import { PopupTroubleshooter } from './components/PopupTroubleshooter';
import { RecentHistory } from './components/RecentHistory';
import { HistoryEntry, LaunchResult } from './types';
import { sanitizeUrl, isValidUrl } from './utils/urlHelper';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'multitab_settings_v1';
const STORAGE_KEY_HISTORY = 'multitab_history_v1';

export default function App() {
  const [url, setUrl] = useState<string>('https://example.com');
  const [limit, setLimit] = useState<number>(5);
  const [autoOpenOnPaste, setAutoOpenOnPaste] = useState<boolean>(false);
  const [staggerDelayMs, setStaggerDelayMs] = useState<number>(100);

  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [latestResult, setLatestResult] = useState<LaunchResult | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showTroubleshooter, setShowTroubleshooter] = useState<boolean>(false);
  const cancelRequestedRef = useRef<boolean>(false);

  // Load saved preferences and history
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.limit === 'number') setLimit(parsed.limit);
        if (typeof parsed.autoOpenOnPaste === 'boolean') setAutoOpenOnPaste(parsed.autoOpenOnPaste);
        if (typeof parsed.staggerDelayMs === 'number') setStaggerDelayMs(parsed.staggerDelayMs);
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
  }, []);

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ limit, autoOpenOnPaste, staggerDelayMs })
      );
    } catch {
      // Ignore
    }
  }, [limit, autoOpenOnPaste, staggerDelayMs]);

  const saveHistoryEntry = (targetUrl: string, tabLimit: number) => {
    try {
      const newEntry: HistoryEntry = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url: targetUrl,
        tabLimit,
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...history.filter((h) => h.url !== targetUrl)].slice(0, 8);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleLaunch = async (overrideUrl?: string) => {
    const targetRaw = overrideUrl || url;
    if (!targetRaw || !targetRaw.trim()) {
      alert('Please enter or paste a URL link first!');
      return;
    }

    const finalUrl = sanitizeUrl(targetRaw);
    if (!isValidUrl(finalUrl)) {
      alert('Please enter a valid website link (e.g. example.com or https://example.com)');
      return;
    }

    // Save to history
    saveHistoryEntry(finalUrl, limit);

    cancelRequestedRef.current = false;
    setIsLaunching(true);
    setCurrentProgress(0);

    let opened = 0;
    let blocked = 0;
    const totalToOpen = limit;

    if (staggerDelayMs === 0) {
      // Instant launch loop
      for (let i = 0; i < totalToOpen; i++) {
        if (cancelRequestedRef.current) break;
        try {
          const uniqueTarget = `_blank_tab_${Date.now()}_${i}`;
          const newWin = window.open(finalUrl, uniqueTarget);
          if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            blocked++;
          } else {
            opened++;
          }
        } catch {
          blocked++;
        }
      }

      setCurrentProgress(totalToOpen);
      setIsLaunching(false);
      setLatestResult({
        id: Date.now().toString(),
        url: finalUrl,
        requestedCount: totalToOpen,
        openedCount: opened,
        blockedCount: blocked,
        timestamp: Date.now(),
        status: blocked > 0 ? 'blocked' : 'completed',
      });
      return;
    }

    // Staggered launch loop with progress indicator
    for (let i = 0; i < totalToOpen; i++) {
      if (cancelRequestedRef.current) break;

      try {
        const uniqueTarget = `_blank_tab_${Date.now()}_${i}`;
        const newWin = window.open(finalUrl, uniqueTarget);
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          blocked++;
        } else {
          opened++;
        }
      } catch {
        blocked++;
      }

      setCurrentProgress(i + 1);

      if (i < totalToOpen - 1 && staggerDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, staggerDelayMs));
      }
    }

    setIsLaunching(false);
    setLatestResult({
      id: Date.now().toString(),
      url: finalUrl,
      requestedCount: totalToOpen,
      openedCount: opened,
      blockedCount: blocked,
      timestamp: Date.now(),
      status: blocked > 0 ? 'blocked' : 'completed',
    });
  };

  const handleCancel = () => {
    cancelRequestedRef.current = true;
    setIsLaunching(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // Ignore
    }
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setUrl(entry.url);
    setLimit(entry.tabLimit);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Application Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <Header onOpenTroubleshooter={() => setShowTroubleshooter(true)} />

          {/* Step 1: URL Input Bar */}
          <div className="space-y-4">
            <UrlBar
              url={url}
              onChangeUrl={setUrl}
              onLaunch={handleLaunch}
              autoOpenOnPaste={autoOpenOnPaste}
              onToggleAutoOpen={setAutoOpenOnPaste}
            />

            {/* Step 2: Limit setting point "downside the url bar" as requested */}
            <LimitSettings
              limit={limit}
              onChangeLimit={setLimit}
              staggerDelayMs={staggerDelayMs}
              onChangeStaggerDelay={setStaggerDelayMs}
            />

            {/* Step 3: Launch Controllers */}
            <LaunchController
              url={url}
              limit={limit}
              isLaunching={isLaunching}
              currentProgress={currentProgress}
              onLaunch={() => handleLaunch()}
              onCancel={handleCancel}
              onSelectSampleUrl={(sample) => setUrl(sample)}
            />
          </div>

          {/* Feedback & Result Card */}
          {latestResult && (
            <LaunchStatusCard
              result={latestResult}
              onRelaunch={() => handleLaunch(latestResult.url)}
              onOpenTroubleshooter={() => setShowTroubleshooter(true)}
            />
          )}

          {/* Quick Notice Tip */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">
                How browser multi-tab launching works:
              </p>
              <p className="text-slate-500 leading-relaxed">
                If your browser opens only 1 tab instead of {limit}, look for the <strong>"Pop-up blocked"</strong> notification in your address bar and select <strong>"Always allow popups"</strong> for this site.
              </p>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <RecentHistory
          history={history}
          onSelectEntry={handleSelectHistoryEntry}
          onClearHistory={handleClearHistory}
        />

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-400 py-2">
          Multi-Tab Opener • Client-Side Safe • Fast & Simultaneous
        </footer>
      </div>

      {/* Troubleshooter Modal */}
      <PopupTroubleshooter
        isOpen={showTroubleshooter}
        onClose={() => setShowTroubleshooter(false)}
      />
    </div>
  );
}
