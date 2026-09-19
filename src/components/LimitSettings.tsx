import React from 'react';
import { Sliders, Minus, Plus, AlertCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface LimitSettingsProps {
  limit: number;
  onChangeLimit: (val: number) => void;
  staggerDelayMs: number;
  onChangeStaggerDelay: (delay: number) => void;
}

const PRESET_LIMITS = [2, 3, 5, 10, 15, 20, 30, 50];

export const LimitSettings: React.FC<LimitSettingsProps> = ({
  limit,
  onChangeLimit,
  staggerDelayMs,
  onChangeStaggerDelay,
}) => {
  const handleDecrement = () => {
    if (limit > 1) {
      onChangeLimit(limit - 1);
    }
  };

  const handleIncrement = () => {
    if (limit < 100) {
      onChangeLimit(limit + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeLimit(Number(e.target.value));
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onChangeLimit(1);
    } else {
      onChangeLimit(Math.max(1, Math.min(100, val)));
    }
  };

  const getLoadBadge = () => {
    if (limit <= 5) {
      return { text: 'Light Load', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (limit <= 15) {
      return { text: 'Moderate Load', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (limit <= 30) {
      return { text: 'Heavy Load', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { text: 'Extreme Load (RAM Intensive)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const loadBadge = getLoadBadge();

  return (
    <div
      id="limit-setting-point"
      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4"
    >
      {/* Top row: Label and Current Limit value control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
              <Sliders className="w-4 h-4" />
            </span>
            <label
              htmlFor="tab-limit-stepper"
              className="text-sm font-semibold text-slate-800"
            >
              Maximum Tab Limit Setting
            </label>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${loadBadge.color}`}
            >
              {loadBadge.text}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Set the maximum number of new tabs the website will open for your pasted URL.
          </p>
        </div>

        {/* Stepper + Direct input */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white border border-slate-300 rounded-xl p-1 shadow-xs">
          <button
            id="decrement-limit-btn"
            type="button"
            onClick={handleDecrement}
            disabled={limit <= 1}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Decrease limit by 1"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="relative flex items-center">
            <input
              id="tab-limit-stepper"
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={handleManualInput}
              className="w-14 text-center font-bold text-base text-slate-900 focus:outline-none focus:bg-slate-50 rounded-md py-0.5"
            />
            <span className="text-[11px] text-slate-400 font-medium pr-1 select-none">tabs</span>
          </div>

          <button
            id="increment-limit-btn"
            type="button"
            onClick={handleIncrement}
            disabled={limit >= 100}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Increase limit by 1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>1 tab</span>
          <span className="text-indigo-600 font-bold">{limit} tabs selected</span>
          <span>50 tabs</span>
        </div>

        <input
          id="tab-limit-range-slider"
          type="range"
          min={1}
          max={50}
          value={Math.min(limit, 50)}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>Quick Presets:</span>
          {limit > 25 && (
            <span className="flex items-center gap-1 text-amber-600 text-[11px]">
              <AlertCircle className="w-3 h-3" />
              High tab count may slow down browser
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESET_LIMITS.map((preset) => {
            const isSelected = limit === preset;
            return (
              <button
                key={preset}
                id={`preset-limit-${preset}`}
                type="button"
                onClick={() => onChangeLimit(preset)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {preset} tabs
              </button>
            );
          })}
        </div>
      </div>

      {/* Stagger Delay & Options sub-bar */}
      <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-medium">Opening Interval:</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
            {[
              { label: 'Instant (0ms)', value: 0 },
              { label: '100ms', value: 100 },
              { label: '250ms (Recommended)', value: 250 },
              { label: '500ms', value: 500 },
            ].map((option) => (
              <button
                key={option.value}
                id={`stagger-delay-${option.value}`}
                type="button"
                onClick={() => onChangeStaggerDelay(option.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  staggerDelayMs === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Intervals help bypass aggressive browser popup rate limits</span>
        </div>
      </div>
    </div>
  );
};
