import React, { useState } from 'react';
import { UserProfile, WearableData } from '../types';
import {
  Download,
  Share2,
  Check,
  Zap,
  Sparkles,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  wearable: WearableData;
  activeFilterTab?: string;
  onSelectFilterTab?: (tab: string) => void;
  onSelectPreset: (preset: 'alex' | 'sarah' | 'marcus' | 'demo_deficit') => void;
  onExportReport: () => void;
}

export const Header: React.FC<Props> = ({
  profile,
  wearable,
  activeFilterTab = 'all',
  onSelectFilterTab,
  onSelectPreset,
  onExportReport,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Google Fit Brand & Title */}
          <div className="flex items-center gap-3">
            {/* Iconic Google Fit 4-Color Folded Heart SVG */}
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 p-1.5 hover:shadow-sm transition-shadow">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                {/* Top Left: Google Blue */}
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09"
                  stroke="#4285F4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Top Right: Google Red */}
                <path
                  d="M12 5.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5"
                  stroke="#EA4335"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Bottom Right: Google Yellow */}
                <path
                  d="M22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35"
                  stroke="#FBBC04"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Center / Pulse: Google Green */}
                <path
                  d="M8.5 12l2.5 3 4.5-5"
                  stroke="#34A853"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  <span className="text-slate-800">Google</span>{' '}
                  <span className="text-[#1A73E8] font-black">Fit</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                  • Health & Nutrition
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#00897B] border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00897B] animate-pulse"></span>
                  Health Connect
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Concentric Rings, Mifflin-St Jeor TDEE, Dynamic Nutrition & Vitals
              </p>
            </div>
          </div>

          {/* Quick Presets & Google Account Profile Area */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Google Fit Material Filter Chips for Presets */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
              <span className="px-2.5 text-slate-400 text-[11px] hidden lg:inline">
                Preset:
              </span>
              <button
                type="button"
                onClick={() => onSelectPreset('alex')}
                className="px-3 py-1 rounded-full text-slate-700 hover:text-slate-900 hover:bg-white transition-all hover:shadow-xs"
                title="28y Male, 82kg, Fat Loss Goal"
              >
                Alex (Cut)
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset('sarah')}
                className="px-3 py-1 rounded-full text-slate-700 hover:text-slate-900 hover:bg-white transition-all hover:shadow-xs"
                title="25y Female, 56kg, Muscle Gain Goal"
              >
                Sarah (Gain)
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset('marcus')}
                className="px-3 py-1 rounded-full text-slate-700 hover:text-slate-900 hover:bg-white transition-all hover:shadow-xs"
                title="34y Male, 75kg, Maintain Goal"
              >
                Marcus (Run)
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset('demo_deficit')}
                className="px-3 py-1 rounded-full text-amber-900 bg-amber-200/70 hover:bg-amber-200 font-bold transition-all shadow-2xs"
                title="Stage Demo: Overweight + Low Steps + Whoop Low Recovery Trigger"
              >
                ⚡ Demo Stage
              </button>
            </div>

            {/* Export Report Pill */}
            <button
              type="button"
              onClick={onExportReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all hover:shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Report</span>
            </button>

            {/* Google Account Avatar Circle */}
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] text-white flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer select-none ring-2 ring-white hover:opacity-90"
              title={`Google Account: ${profile.gender === 'female' ? 'Sarah' : 'Alex'} • ${profile.weightKg} kg`}
            >
              {profile.gender === 'female' ? 'S' : 'A'}
            </div>
          </div>
        </div>

        {/* Google Fit Material 3 Navigation Filter Tabs */}
        {onSelectFilterTab && (
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => onSelectFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'all'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Overview
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('biometrics')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'biometrics'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Body & BMI
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('tdee')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'tdee'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              TDEE & Energy
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('nutrition')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'nutrition'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Nutrition & Water
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('wearable')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'wearable'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Vitals & Wearables
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('workouts')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'workouts'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Workouts & Coaching
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('gym')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'gym'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Gym & Strength
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('camera')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'camera'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>📷 Posture Camera</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectFilterTab('trends')}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeFilterTab === 'trends'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              7-Day Trends
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

