import React, { useState, useEffect } from 'react';
import { WearableData, WearableDevice } from '../types';
import {
  Watch,
  Heart,
  Footprints,
  Clock,
  Moon,
  Zap,
  Sliders,
  RefreshCw,
  CheckCircle,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  wearable: WearableData;
  onUpdateWearable: (updates: Partial<WearableData>) => void;
  weightKg: number;
}

export const WearableWidget: React.FC<Props> = ({
  wearable,
  onUpdateWearable,
  weightKg,
}) => {
  const [showSimControls, setShowSimControls] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('health_connect');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Live heart rate pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 850);
    return () => clearInterval(interval);
  }, []);

  // Live step increment simulation when live simulation is toggled on
  useEffect(() => {
    if (!wearable.isSimulated) return;

    const interval = setInterval(() => {
      // randomly add 1-4 steps every 6 seconds to simulate live motion
      const stepIncrement = Math.floor(Math.random() * 3) + 1;
      const nextSteps = wearable.steps + stepIncrement;
      const kcal = Math.round(nextSteps * 0.045 * (weightKg / 70));
      onUpdateWearable({
        steps: nextSteps,
        caloriesBurnedFromSteps: kcal,
        distanceKm: Number((nextSteps * 0.000762).toFixed(2)),
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [wearable.isSimulated, wearable.steps, weightKg, onUpdateWearable]);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  const handlePresetChange = (preset: 'low' | 'moderate' | 'high' | 'whoop_low_recovery') => {
    if (preset === 'low') {
      const steps = 3420;
      onUpdateWearable({
        steps,
        heartRate: 68,
        activeMinutes: 18,
        sleepHours: 6.2,
        sleepQuality: 'Fair',
        whoopRecoveryScore: 54,
        whoopStrain: 6.2,
        caloriesBurnedFromSteps: Math.round(steps * 0.045 * (weightKg / 70)),
        distanceKm: Number((steps * 0.000762).toFixed(2)),
      });
    } else if (preset === 'moderate') {
      const steps = 8450;
      onUpdateWearable({
        steps,
        heartRate: 74,
        activeMinutes: 48,
        sleepHours: 7.5,
        sleepQuality: 'Good',
        whoopRecoveryScore: 78,
        whoopStrain: 11.4,
        caloriesBurnedFromSteps: Math.round(steps * 0.045 * (weightKg / 70)),
        distanceKm: Number((steps * 0.000762).toFixed(2)),
      });
    } else if (preset === 'high') {
      const steps = 14200;
      onUpdateWearable({
        steps,
        heartRate: 82,
        activeMinutes: 85,
        sleepHours: 8.1,
        sleepQuality: 'Optimal',
        whoopRecoveryScore: 89,
        whoopStrain: 16.8,
        caloriesBurnedFromSteps: Math.round(steps * 0.045 * (weightKg / 70)),
        distanceKm: Number((steps * 0.000762).toFixed(2)),
      });
    } else if (preset === 'whoop_low_recovery') {
      const steps = 4100;
      onUpdateWearable({
        steps,
        heartRate: 86,
        activeMinutes: 20,
        sleepHours: 4.8,
        sleepQuality: 'Poor',
        whoopRecoveryScore: 28, // Low recovery trigger!
        whoopStrain: 17.2,
        caloriesBurnedFromSteps: Math.round(steps * 0.045 * (weightKg / 70)),
        distanceKm: Number((steps * 0.000762).toFixed(2)),
      });
    }
  };

  const getRecoveryColor = (score?: number) => {
    if (!score) return '#94a3b8';
    if (score >= 67) return '#10b981'; // Green
    if (score >= 34) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div id="wearable-integration-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold relative">
            <Watch className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34A853]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Connected Devices & Telemetry</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#34A853] animate-pulse" /> Health Connect Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated from Google Pixel Watch, Fitbit Sense, Galaxy Watch & Whoop API
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Quick sync button */}
          <button
            type="button"
            id="wearable-sync-btn"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 bg-[#F8FAFD] hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1A73E8]' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>

          {/* Connect modal button */}
          <button
            type="button"
            id="wearable-source-btn"
            onClick={() => setShowConnectModal(true)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#E8F0FE] hover:bg-blue-100 text-[#1A73E8] border border-blue-200 transition-colors"
          >
            Sources & APIs
          </button>

          {/* Toggle simulator panel */}
          <button
            type="button"
            id="toggle-simulator-btn"
            onClick={() => setShowSimControls(!showSimControls)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1 border transition-colors ${
              showSimControls
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulator</span>
            {showSimControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Simulator Controls Accordion (Essential for Stage Demo) */}
      {showSimControls && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Hackathon Demo Stage Controls
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Live Auto-Step Generator:</span>
              <button
                type="button"
                onClick={() => onUpdateWearable({ isSimulated: !wearable.isSimulated })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  wearable.isSimulated ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                    wearable.isSimulated ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Quick Scenarios (test auto-TDEE, alerts, and workout engine):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePresetChange('low')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg text-center"
              >
                💤 Sedentary (3.4k steps)
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('moderate')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold rounded-lg text-center"
              >
                🚶 Moderate (8.4k steps)
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('high')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg text-center"
              >
                🔥 Active (14.2k steps)
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('whoop_low_recovery')}
                className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-rose-200 text-xs font-semibold rounded-lg text-center border border-red-800/60"
              >
                ⚠️ Whoop Low Recovery (28%)
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Steps Synced:</span>
                <span className="font-mono font-bold text-white">{wearable.steps.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="22000"
                step="250"
                value={wearable.steps}
                onChange={(e) => {
                  const s = parseInt(e.target.value);
                  onUpdateWearable({
                    steps: s,
                    caloriesBurnedFromSteps: Math.round(s * 0.045 * (weightKg / 70)),
                    distanceKm: Number((s * 0.000762).toFixed(2)),
                  });
                }}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Heart Rate:</span>
                <span className="font-mono font-bold text-rose-400">{wearable.heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="50"
                max="175"
                step="1"
                value={wearable.heartRate}
                onChange={(e) => onUpdateWearable({ heartRate: parseInt(e.target.value) })}
                className="w-full accent-rose-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Whoop Recovery:</span>
                <span className="font-mono font-bold" style={{ color: getRecoveryColor(wearable.whoopRecoveryScore) }}>
                  {wearable.whoopRecoveryScore}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={wearable.whoopRecoveryScore || 75}
                onChange={(e) => onUpdateWearable({ whoopRecoveryScore: parseInt(e.target.value) })}
                className="w-full accent-indigo-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Wearable Telemetry Grid - Google Fit Material Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Step Count */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Daily Steps</span>
            <Footprints className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {wearable.steps.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Goal: {wearable.targetSteps.toLocaleString()} ({Math.round((wearable.steps / wearable.targetSteps) * 100)}%)
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1A73E8] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((wearable.steps / wearable.targetSteps) * 100))}%` }}
            />
          </div>
        </div>

        {/* Heart Rate with Live Pulse */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Heart Rate</span>
            <Heart
              className={`w-4 h-4 text-[#EA4335] transition-transform duration-200 ${
                pulse ? 'scale-125 fill-[#EA4335]' : 'scale-100'
              }`}
            />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{wearable.heartRate}</span>
              <span className="text-xs font-bold text-[#EA4335]">BPM</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Resting: {wearable.restingHeartRate} BPM
            </div>
          </div>
          <div className="text-[10px] text-[#34A853] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-ping" /> Normal Sinus Rhythm
          </div>
        </div>

        {/* Active Minutes / Heart Points */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Heart Points</span>
            <Clock className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{wearable.activeMinutes}</span>
              <span className="text-xs font-bold text-[#34A853]">pts</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">AHA Target: 30 pts/day</div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Zone 2 & Cardio Intensity</div>
        </div>

        {/* Sleep Duration */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Sleep</span>
            <Moon className="w-4 h-4 text-[#4285F4]" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{wearable.sleepHours}</span>
              <span className="text-xs font-semibold text-slate-500">hrs</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Stage: <strong className="text-[#1A73E8]">{wearable.sleepQuality}</strong>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Deep / REM Cycles Logged</div>
        </div>

        {/* Whoop Recovery & Strain */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Recovery</span>
            <Zap className="w-4 h-4 text-[#FBBC04]" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-black font-mono"
                style={{ color: getRecoveryColor(wearable.whoopRecoveryScore) }}
              >
                {wearable.whoopRecoveryScore || 78}%
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Strain: <strong className="text-slate-800 font-mono">{wearable.whoopStrain || 11.4} / 21</strong>
            </div>
          </div>
          <div
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-center"
            style={{
              backgroundColor: `${getRecoveryColor(wearable.whoopRecoveryScore)}18`,
              color: getRecoveryColor(wearable.whoopRecoveryScore),
            }}
          >
            {(wearable.whoopRecoveryScore || 78) >= 67
              ? 'Primed for High Strain'
              : (wearable.whoopRecoveryScore || 78) >= 34
              ? 'Moderate Readiness'
              : 'Recovery Needed'}
          </div>
        </div>
      </div>

      {/* Health API Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Watch className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Wearable Health Integration Hub</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your physical device through platform health APIs or simulate data for demos.
              </p>

              {/* Provider 1: Android Health Connect */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-800">Android Health Connect API</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aggregates from Google Fit, Samsung Health, Fitbit & Mi Band.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProvider('health_connect');
                    setShowConnectModal(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                >
                  Connected
                </button>
              </div>

              {/* Provider 2: Apple HealthKit */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="text-sm font-bold text-slate-800">Apple HealthKit (iOS)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live steps, active energy, heart rate from Apple Watch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProvider('apple_health');
                    setShowConnectModal(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Connect
                </button>
              </div>

              {/* Provider 3: Whoop Developer OAuth2 API */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-sm font-bold text-slate-800">Whoop 4.0 Developer API (OAuth2)</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                      REST v1
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pulls Recovery Score (%), Day Strain (0-21), Resting HR, and Sleep cycles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProvider('whoop');
                    setShowConnectModal(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                >
                  OAuth Synced
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
