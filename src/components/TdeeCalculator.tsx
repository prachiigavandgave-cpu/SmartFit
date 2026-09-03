import React from 'react';
import { UserProfile, TdeeResult, WearableData, Goal } from '../types';
import { Flame, Watch, Check, Sparkles, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface Props {
  profile: UserProfile;
  tdeeResult: TdeeResult;
  wearable: WearableData;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const TdeeCalculator: React.FC<Props> = ({
  profile,
  tdeeResult,
  wearable,
  onUpdateProfile,
}) => {
  const isAuto = profile.useWearableActivityFactor;

  const activityOptions = [
    { value: 1.2, label: 'Sedentary (desk job, minimal motion)' },
    { value: 1.375, label: 'Light (light workouts 1–3 days/wk)' },
    { value: 1.55, label: 'Moderate (exercise 3–5 days/wk)' },
    { value: 1.725, label: 'Active (intense exercise 6–7 days/wk)' },
    { value: 1.9, label: 'Very Active (athletic training / physical job)' },
  ];

  return (
    <div id="tdee-calculator-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#EA8600] flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 fill-[#FBBC04]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Daily Calorie Burn (TDEE)</h2>
            <p className="text-xs text-slate-500">Mifflin-St Jeor Clinical BMR & Dynamic Activity Multiplier</p>
          </div>
        </div>

        {/* Wearable Auto-Adjust Toggle */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full">
          <Watch className={`w-4 h-4 ${isAuto ? 'text-[#1A73E8]' : 'text-slate-400'}`} />
          <span className="text-xs font-semibold text-slate-700">Health Connect Sync</span>
          <button
            type="button"
            id="toggle-wearable-tdee-sync"
            onClick={() => onUpdateProfile({ useWearableActivityFactor: !isAuto })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAuto ? 'bg-[#1A73E8]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isAuto ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* BMR + Activity Info in Google Fit light cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Basal Metabolic Rate (BMR)</span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Mifflin-St Jeor</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{tdeeResult.bmr.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-600">kcal/day at complete rest</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            {profile.gender === 'male'
              ? 'Formula: 10×wt + 6.25×ht - 5×age + 5'
              : 'Formula: 10×wt + 6.25×ht - 5×age - 161'}
          </p>
        </div>

        <div className="p-4 bg-[#FEF7E0]/60 rounded-2xl border border-[#FEEFC3]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Expenditure (TDEE)</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#FEEFC3] text-[#EA8600]">
              Factor: {tdeeResult.activityFactor}x
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#EA8600] font-mono">{tdeeResult.tdee.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-600">kcal/day total burn</span>
          </div>

          {isAuto ? (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#1A73E8] bg-white px-2.5 py-1 rounded-full border border-blue-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#1A73E8]" />
              <span>Auto-adjusted: {tdeeResult.activityLabel}</span>
            </div>
          ) : (
            <div className="mt-2">
              <select
                id="manual-activity-select"
                aria-label="Activity Level"
                value={profile.manualActivityFactor}
                onChange={(e) => onUpdateProfile({ manualActivityFactor: parseFloat(e.target.value) })}
                className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#EA8600]"
              >
                {activityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}x – {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Calories targets for Maintain / Lose / Gain */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Target Caloric Goals (Select to sync entire dashboard)
          </span>
          <span className="text-xs font-medium text-slate-600">Click a card to apply</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Lose Weight (-500 kcal) */}
          <button
            type="button"
            id="goal-lose-btn"
            onClick={() => onUpdateProfile({ goal: 'lose' })}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              profile.goal === 'lose'
                ? 'bg-[#E8F0FE] border-[#1A73E8] shadow-xs ring-2 ring-[#1A73E8]/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {profile.goal === 'lose' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A73E8] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Fat Loss (-500 kcal)</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {tdeeResult.loseCalories.toLocaleString()}
              <span className="text-xs font-normal text-slate-600 ml-1">kcal</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Paces ~0.5 kg (1 lb) fat loss/wk while sparing lean mass.
            </p>
          </button>

          {/* Maintain Weight (TDEE) */}
          <button
            type="button"
            id="goal-maintain-btn"
            onClick={() => onUpdateProfile({ goal: 'maintain' })}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              profile.goal === 'maintain'
                ? 'bg-[#E6F4EA] border-[#34A853] shadow-xs ring-2 ring-[#34A853]/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {profile.goal === 'maintain' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#34A853] mb-1">
              <Minus className="w-3.5 h-3.5" />
              <span>Maintain Weight</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {tdeeResult.maintainCalories.toLocaleString()}
              <span className="text-xs font-normal text-slate-600 ml-1">kcal</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Exact energy equilibrium for weight stability & vitality.
            </p>
          </button>

          {/* Gain Weight (+500 kcal) */}
          <button
            type="button"
            id="goal-gain-btn"
            onClick={() => onUpdateProfile({ goal: 'gain' })}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              profile.goal === 'gain'
                ? 'bg-[#FEF7E0] border-[#FBBC04] shadow-xs ring-2 ring-[#FBBC04]/30'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {profile.goal === 'gain' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#EA8600] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#EA8600] mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Muscle Surplus (+500)</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {tdeeResult.gainCalories.toLocaleString()}
              <span className="text-xs font-normal text-slate-600 ml-1">kcal</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Optimal anabolic caloric surplus for hypertrophy training.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
