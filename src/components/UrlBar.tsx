import React, { useRef, useState } from 'react';
import { Link2, X, Clipboard, Zap, CheckCircle2, Globe } from 'lucide-react';
import { getDomain, isValidUrl, sanitizeUrl } from '../utils/urlHelper';

interface UrlBarProps {
  url: string;
  onChangeUrl: (newUrl: string) => void;
  onLaunch: (urlToLaunch?: string) => void;
  autoOpenOnPaste: boolean;
  onToggleAutoOpen: (enabled: boolean) => void;
}

export const UrlBar: React.FC<UrlBarProps> = ({
  url,
  onChangeUrl,
  onLaunch,
  autoOpenOnPaste,
  onToggleAutoOpen,
}) => {
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedUrl = sanitizeUrl(url);
  const isUrlValid = isValidUrl(url);
  const domain = getDomain(url);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim()) {
      const clean = pastedText.trim();
      onChangeUrl(clean);

      if (autoOpenOnPaste) {
        setPasteNotice('Pasted link detected! Launching tabs...');
        setTimeout(() => {
          setPasteNotice(null);
          onLaunch(clean);
        }, 150);
      } else {
        setPasteNotice('Link pasted! Press "Open Tabs" or set your limit below.');
        setTimeout(() => setPasteNotice(null), 3000);
      }
    }
  };

  const handleClipboardClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const clean = text.trim();
          onChangeUrl(clean);
          if (autoOpenOnPaste) {
            setPasteNotice('Clipboard pasted! Launching tabs...');
            setTimeout(() => {
              setPasteNotice(null);
              onLaunch(clean);
            }, 200);
          } else {
            setPasteNotice('Pasted from clipboard!');
            setTimeout(() => setPasteNotice(null), 2500);
          }
        }
      } else {
        inputRef.current?.focus();
        setPasteNotice('Please press Ctrl+V / Cmd+V to paste into the input.');
        setTimeout(() => setPasteNotice(null), 3000);
      }
    } catch {
      inputRef.current?.focus();
      setPasteNotice('Clipboard access restricted. Use Ctrl+V or Cmd+V directly.');
      setTimeout(() => setPasteNotice(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onLaunch();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="target-url-input"
          className="text-sm font-semibold text-slate-800 flex items-center gap-2"
        >
          <Link2 className="w-4 h-4 text-indigo-600" />
          <span>Paste URL Link</span>
        </label>

        {/* Auto-Open On Paste toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900 transition-colors">
          <input
            id="toggle-auto-open-on-paste"
            type="checkbox"
            checked={autoOpenOnPaste}
            onChange={(e) => onToggleAutoOpen(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0"
          />
          <span className="flex items-center gap-1">
            <Zap className={`w-3.5 h-3.5 ${autoOpenOnPaste ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span className="font-medium">Auto-open immediately on paste</span>
          </span>
        </label>
      </div>

      {/* Main Input Wrapper */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Globe className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          id="target-url-input"
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder="e.g. google.com or https://example.com"
          className="w-full pl-11 pr-28 py-3.5 text-base text-slate-900 placeholder:text-slate-400 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
          {url && (
            <button
              id="clear-url-btn"
              type="button"
              onClick={() => onChangeUrl('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            id="paste-clipboard-btn"
            type="button"
            onClick={handleClipboardClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors"
            title="Paste link from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-600" />
            <span>Paste</span>
          </button>
        </div>
      </div>

      {/* Toast Notice / Helper feedback */}
      {pasteNotice && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>{pasteNotice}</span>
        </div>
      )}

      {/* Live validation & sanitized URL preview */}
      {url && (
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 px-1 gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            {isUrlValid ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to open:</span>
              </span>
            ) : (
              <span className="text-amber-600 font-medium">Auto-prepending protocol:</span>
            )}
            <code className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded max-w-[280px] sm:max-w-md truncate">
              {formattedUrl}
            </code>
          </div>

          {domain && (
            <span className="text-slate-500 font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
              Host: {domain}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
