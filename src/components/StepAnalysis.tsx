import React, { useState } from 'react';
import { WearableData, UserProfile } from '../types';
import { Footprints, Flame, Target, MapPin, Compass, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface Props {
  wearable: WearableData;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const StepAnalysis: React.FC<Props> = ({
  wearable,
  profile,
  onUpdateProfile,
}) => {
  const [strideLengthCm, setStrideLengthCm] = useState(76); // average adult stride ~76cm
  const [speedKmh, setSpeedKmh] = useState(4.8); // standard brisk walking speed

  const steps = wearable.steps;
  const target = profile.stepTarget || 10000;
  const progressPercent = Math.min(100, Math.round((steps / target) * 100));

  // Calories from steps with user's weight:
  // Formula: ~0.04–0.05 kcal per step per kg body weight
  // Standard: steps * 0.045 * (profile.weightKg / 70) * speedFactor
  const speedFactor = speedKmh >= 5.5 ? 1.15 : speedKmh <= 4.0 ? 0.9 : 1.0;
  const estimatedCaloriesBurned = Math.round(
    steps * 0.045 * (profile.weightKg / 70) * speedFactor
  );

  // Distance: (steps * strideLengthCm) / 100,000 = km
  const distanceKm = Number(((steps * strideLengthCm) / 100000).toFixed(2));
  const distanceMiles = Number((distanceKm * 0.621371).toFixed(2));

  // Progress ring dimensions
  const strokeWidth = 10;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const isBehindTarget = steps < target * 0.6;
  const stepsRemaining = Math.max(0, target - steps);
  const briskWalkMinutesRemaining = Math.ceil(stepsRemaining / 110); // 110 steps/min brisk pace

  return (
    <div id="step-analysis-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Step & Movement Analysis</h2>
            <p className="text-xs text-slate-500">Live Cadence, Stride Calibration & Distance Tracking</p>
          </div>
        </div>

        {/* Target Selector */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100/90 p-1 rounded-full">
          <span className="font-semibold text-slate-500 pl-2">Goal:</span>
          {[8000, 10000, 12000].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdateProfile({ stepTarget: t })}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                target === t
                  ? 'bg-white text-[#1A73E8] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {(t / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Progress Ring */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              {/* Background Circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-[#1A73E8] stroke-current transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {steps.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                / {target.toLocaleString()} steps
              </span>
              <span className="mt-1 text-xs font-bold text-[#1A73E8] px-2.5 py-0.5 rounded-full bg-[#E8F0FE]">
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            {progressPercent >= 100 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#137333] bg-[#E6F4EA] px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> Daily Goal Achieved!
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500">
                {stepsRemaining.toLocaleString()} steps remaining today
              </span>
            )}
          </div>
        </div>

        {/* Right: Metrics & Calorie Formula */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Calorie Burn Card */}
            <div className="p-4 bg-[#FEF7E0]/60 rounded-2xl border border-[#FEEFC3]">
              <div className="flex items-center justify-between text-[#EA8600] mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Step Calorie Burn</span>
                <Flame className="w-4 h-4 fill-[#FBBC04]" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {estimatedCaloriesBurned.toLocaleString()}
                <span className="text-xs font-semibold text-slate-500 ml-1">kcal</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Formula: ~0.045 kcal/step × ({profile.weightKg}kg / 70kg)
              </p>
            </div>

            {/* Distance Card */}
            <div className="p-4 bg-[#E8F0FE]/60 rounded-2xl border border-[#D2E3FC]">
              <div className="flex items-center justify-between text-[#1A73E8] mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Distance Covered</span>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {distanceKm}
                <span className="text-xs font-semibold text-slate-500 ml-1">km</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Approx {distanceMiles} mi ({strideLengthCm} cm avg stride)
              </p>
            </div>
          </div>

          {/* Stride and Walking Speed Calibration Controls */}
          <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                Biometric Calibration:
              </span>
              <span className="text-[11px] text-slate-500">Fine-tune accelerometer</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Stride Length:</span>
                  <span className="font-bold text-[#1A73E8] font-mono">{strideLengthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={strideLengthCm}
                  onChange={(e) => setStrideLengthCm(parseInt(e.target.value))}
                  className="w-full accent-[#1A73E8] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Pace / Speed:</span>
                  <span className="font-bold text-[#1A73E8] font-mono">{speedKmh} km/h</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="7.0"
                  step="0.2"
                  value={speedKmh}
                  onChange={(e) => setSpeedKmh(parseFloat(e.target.value))}
                  className="w-full accent-[#1A73E8] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Step Deficit Action Recommendation */}
          {isBehindTarget && (
            <div className="p-3.5 bg-[#FEF7E0] rounded-2xl border border-[#FEEFC3] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#EA8600] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="font-bold text-slate-900 block">Movement Opportunity</strong>
                <p className="text-slate-700 mt-0.5">
                  You need <strong>{stepsRemaining.toLocaleString()} steps</strong> to reach today&apos;s goal. A{' '}
                  <strong>{briskWalkMinutesRemaining}-minute brisk walk</strong> will close this gap and earn Heart Points!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
