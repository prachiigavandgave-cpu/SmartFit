import React, { useState } from 'react';
import { WearableData, UserProfile } from '../types';
import {
  Heart,
  Footprints,
  Flame,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Plus,
} from 'lucide-react';

interface Props {
  wearable: WearableData;
  profile: UserProfile;
  onUpdateWearable: (updates: Partial<WearableData>) => void;
  onQuickLogStep: (amount: number) => void;
}

export const GoogleFitRings: React.FC<Props> = ({
  wearable,
  profile,
  onUpdateWearable,
  onQuickLogStep,
}) => {
  const [activeRingView, setActiveRingView] = useState<'steps' | 'heartPoints'>('steps');

  // Heart Points calculation (Google Fit formula: 1 Heart Point per minute of moderate activity, 2 for vigorous)
  // Daily target typically 30 - 50 Heart Points
  const targetHeartPoints = 50;
  const heartPoints = Math.round(wearable.activeMinutes * 0.95);

  const stepTarget = profile.stepTarget || 10000;
  const stepProgress = Math.min(1.0, wearable.steps / stepTarget);
  const heartPointsProgress = Math.min(1.0, heartPoints / targetHeartPoints);

  // SVG Concentric Ring Dimensions
  // Center is (130, 130), viewBox 0 0 260 260
  const size = 260;
  const strokeWidth = 14;

  // Outer Ring: Heart Points (Google Fit Emerald / Teal: #00897b / #009688)
  const outerRadius = 105;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerStrokeDashoffset = outerCircumference * (1 - heartPointsProgress);

  // Inner Ring: Move Minutes / Steps (Google Fit Blue: #1a73e8 / #4285f4)
  const innerRadius = 82;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerStrokeDashoffset = innerCircumference * (1 - stepProgress);

  const stepsRemaining = Math.max(0, stepTarget - wearable.steps);
  const isGoalReached = wearable.steps >= stepTarget;

  return (
    <div
      id="google-fit-rings-hero"
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
    >
      {/* Subtle Google Fit color bar at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#4285F4]"></div>
        <div className="flex-1 bg-[#EA4335]"></div>
        <div className="flex-1 bg-[#FBBC04]"></div>
        <div className="flex-1 bg-[#34A853]"></div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left / Center: Google Fit Concentric Dual Rings */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-[260px] h-[260px] flex items-center justify-center select-none">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 260 260"
            >
              {/* Outer Ring Background (Heart Points Track) */}
              <circle
                cx="130"
                cy="130"
                r={outerRadius}
                fill="transparent"
                stroke="#E0F2F1"
                strokeWidth={strokeWidth}
              />
              {/* Outer Ring Progress (Heart Points - Google Teal #00897B / #009688) */}
              <circle
                cx="130"
                cy="130"
                r={outerRadius}
                fill="transparent"
                stroke="#00897B"
                strokeWidth={strokeWidth}
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerStrokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Inner Ring Background (Steps / Move Track) */}
              <circle
                cx="130"
                cy="130"
                r={innerRadius}
                fill="transparent"
                stroke="#E8F0FE"
                strokeWidth={strokeWidth}
              />
              {/* Inner Ring Progress (Steps - Google Blue #1A73E8) */}
              <circle
                cx="130"
                cy="130"
                r={innerRadius}
                fill="transparent"
                stroke="#1A73E8"
                strokeWidth={strokeWidth}
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerStrokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Ring Center Text & Metrics */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer group"
              onClick={() =>
                setActiveRingView((v) => (v === 'steps' ? 'heartPoints' : 'steps'))
              }
              title="Click to toggle between Steps and Heart Points"
            >
              {activeRingView === 'steps' ? (
                <>
                  <div className="flex items-center gap-1 text-[#1A73E8] mb-0.5">
                    <Footprints className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Steps
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                    {wearable.steps.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    of {stepTarget.toLocaleString()} goal
                  </span>
                  <span className="text-[10px] text-[#1A73E8] bg-blue-50 font-bold px-2 py-0.5 rounded-full mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {Math.round((wearable.steps / stepTarget) * 100)}% Complete
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-[#00897B] mb-0.5">
                    <Heart className="w-4 h-4 fill-[#00897B]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Heart Pts
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                    {heartPoints}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    of {targetHeartPoints} target
                  </span>
                  <span className="text-[10px] text-[#00897B] bg-teal-50 font-bold px-2 py-0.5 rounded-full mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {Math.round((heartPoints / targetHeartPoints) * 100)}% Complete
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Ring Legend & View Switcher */}
          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => setActiveRingView('heartPoints')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                activeRingView === 'heartPoints'
                  ? 'bg-teal-50 text-[#00897B] border border-teal-200 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00897B]"></span>
              <span>Heart Points: <strong>{heartPoints}</strong></span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRingView('steps')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                activeRingView === 'steps'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]"></span>
              <span>Steps: <strong>{wearable.steps.toLocaleString()}</strong></span>
            </button>
          </div>
        </div>

        {/* Right: Google Fit Metrics Trio & Daily Summary Card */}
        <div className="flex-1 w-full flex flex-col justify-between space-y-5">
          {/* Header & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A73E8] bg-blue-50 px-2.5 py-1 rounded-md">
                  Google Fit Today
                </span>
                {isGoalReached ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Goal Completed!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">
                    {stepsRemaining.toLocaleString()} steps remaining
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Daily Activity Goals
              </h2>
            </div>

            {/* Quick Add Step Buttons (Google Fit style) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onQuickLogStep(500)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Log a short walk (+500 steps)"
              >
                <Plus className="w-3 h-3 text-[#1A73E8]" />
                <span>+500</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickLogStep(1500)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Log 15-min walk (+1,500 steps)"
              >
                <Plus className="w-3 h-3 text-[#1A73E8]" />
                <span>+1.5k</span>
              </button>
            </div>
          </div>

          {/* Google Fit Iconic 3-Metric Trio (Calories, Distance, Move Min) */}
          <div className="grid grid-cols-3 gap-3">
            {/* Calories Burned */}
            <div className="bg-[#FEF7E0]/60 border border-[#FEEFC3] rounded-2xl p-3.5 sm:p-4 text-center hover:bg-[#FEF7E0] transition-colors">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#FBBC04]/20 text-[#EA8600] flex items-center justify-center mb-1.5">
                <Flame className="w-4 h-4 fill-[#FBBC04]" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {wearable.caloriesBurnedFromSteps}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Cal Burned
              </div>
            </div>

            {/* Distance */}
            <div className="bg-[#FCE8E6]/60 border border-[#FAD2CF] rounded-2xl p-3.5 sm:p-4 text-center hover:bg-[#FCE8E6] transition-colors">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#EA4335]/20 text-[#D93025] flex items-center justify-center mb-1.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {wearable.distanceKm}
                <span className="text-xs font-normal text-slate-500 ml-0.5">km</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Distance
              </div>
            </div>

            {/* Move Minutes */}
            <div className="bg-[#E8F0FE]/60 border border-[#D2E3FC] rounded-2xl p-3.5 sm:p-4 text-center hover:bg-[#E8F0FE] transition-colors">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#4285F4]/20 text-[#1A73E8] flex items-center justify-center mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {wearable.activeMinutes}
                <span className="text-xs font-normal text-slate-500 ml-0.5">m</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Move Min
              </div>
            </div>
          </div>

          {/* Daily Progress & WHO Recommendation Note */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#00897B]/10 text-[#00897B] flex items-center justify-center shrink-0 font-bold">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold">
                  World Health Organization & AHA Target
                </p>
                <p className="text-slate-500 text-[11px]">
                  Aim for 150 Heart Points per week (around 30-50 daily) to improve cardiovascular health.
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right shrink-0">
              <span className="text-[11px] font-mono font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                🔥 5-Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
