import React from 'react';
import { UserProfile, BmiResult } from '../types';
import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg } from '../utils/healthCalculations';
import { Activity, Scale, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  profile: UserProfile;
  bmiResult: BmiResult;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const BmiCalculator: React.FC<Props> = ({
  profile,
  bmiResult,
  onUpdateProfile,
}) => {
  const isImperial = profile.unitSystem === 'imperial';
  const { feet, inches } = cmToFeetInches(profile.heightCm);
  const weightLb = kgToLb(profile.weightKg);

  // SVG Gauge Calculations
  // Gauge range: 12 to 40 BMI -> mapped to 180 degrees (-90 to +90)
  const minBmi = 14;
  const maxBmi = 38;
  const clampedBmi = Math.min(Math.max(bmiResult.bmi || 22, minBmi), maxBmi);
  const progressPercent = (clampedBmi - minBmi) / (maxBmi - minBmi);
  // Angle from -90deg (left) to +90deg (right)
  const needleAngle = -90 + progressPercent * 180;

  const handleUnitToggle = (unit: 'metric' | 'imperial') => {
    onUpdateProfile({ unitSystem: unit });
  };

  const handleWeightChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    if (isImperial) {
      onUpdateProfile({ weightKg: lbToKg(val) });
    } else {
      onUpdateProfile({ weightKg: val });
    }
  };

  const handleCmChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    onUpdateProfile({ heightCm: val });
  };

  const handleFtInChange = (newFeet: number, newInches: number) => {
    const cm = feetInchesToCm(newFeet, newInches);
    onUpdateProfile({ heightCm: cm });
  };

  return (
    <div id="bmi-calculator-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Body Measurements & BMI</h2>
            <p className="text-xs text-slate-500">Google Fit Anthropometric & Clinical Biometrics</p>
          </div>
        </div>

        {/* Unit Toggle - Material 3 Segmented Pill */}
        <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
          <button
            type="button"
            id="unit-metric-toggle"
            onClick={() => handleUnitToggle('metric')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              !isImperial
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            type="button"
            id="unit-imperial-toggle"
            onClick={() => handleUnitToggle('imperial')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              isImperial
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imperial (ft / lb)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Biological Sex</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100/90 p-1 rounded-xl">
                <button
                  type="button"
                  id="gender-male-btn"
                  onClick={() => onUpdateProfile({ gender: 'male' })}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    profile.gender === 'male'
                      ? 'bg-white text-[#1A73E8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  id="gender-female-btn"
                  onClick={() => onUpdateProfile({ gender: 'female' })}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    profile.gender === 'female'
                      ? 'bg-white text-[#1A73E8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="age-input" className="block text-xs font-semibold text-slate-600 mb-1.5">Age (years)</label>
              <input
                id="age-input"
                type="number"
                min="12"
                max="105"
                value={profile.age}
                onChange={(e) => onUpdateProfile({ age: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white"
              />
            </div>
          </div>

          {/* Height Input & Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">
                Height {isImperial ? '(Feet & Inches)' : '(Centimeters)'}
              </label>
              <span className="text-xs font-bold text-[#1A73E8] font-mono">
                {profile.heightCm} cm
              </span>
            </div>
            {!isImperial ? (
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    id="height-cm-input"
                    type="number"
                    min="80"
                    max="240"
                    value={profile.heightCm}
                    onChange={(e) => handleCmChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-600">cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={profile.heightCm}
                  onChange={(e) => handleCmChange(e.target.value)}
                  className="w-full accent-[#1A73E8] cursor-pointer"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    id="height-ft-input"
                    type="number"
                    min="3"
                    max="7"
                    value={feet}
                    onChange={(e) => handleFtInChange(parseInt(e.target.value) || 0, inches)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-600">ft</span>
                </div>
                <div className="relative">
                  <input
                    id="height-in-input"
                    type="number"
                    min="0"
                    max="11"
                    value={inches}
                    onChange={(e) => handleFtInChange(feet, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-600">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Weight Input & Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="weight-input" className="text-xs font-semibold text-slate-600">
                Weight {isImperial ? '(Pounds)' : '(Kilograms)'}
              </label>
              <span className="text-xs font-bold text-[#1A73E8] font-mono">
                {profile.weightKg} kg ({weightLb} lb)
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  id="weight-input"
                  type="number"
                  step="0.5"
                  min="30"
                  max="250"
                  value={isImperial ? weightLb : profile.weightKg}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-600">
                  {isImperial ? 'lb' : 'kg'}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                step="0.5"
                value={profile.weightKg}
                onChange={(e) => handleWeightChange(e.target.value)}
                className="w-full accent-[#1A73E8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Color-Coded Radial Gauge & Category Output */}
        <div className="lg:col-span-6 flex flex-col items-center bg-[#F8FAFD] rounded-3xl p-5 border border-slate-100 text-center">
          {/* SVG Semi-Circle Arc Gauge */}
          <div className="relative w-56 h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="googleFitBmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4285F4" />    {/* Underweight: Google Blue */}
                  <stop offset="28%" stopColor="#34A853" />   {/* Normal: Google Green */}
                  <stop offset="65%" stopColor="#FBBC04" />   {/* Overweight: Google Yellow */}
                  <stop offset="100%" stopColor="#EA4335" />  {/* Obese: Google Red */}
                </linearGradient>
              </defs>

              {/* Background Arc Track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Colored Segment Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#googleFitBmiGradient)"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Needle Indicator */}
              <g transform={`translate(100, 100) rotate(${needleAngle})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-72"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="6" fill="#1E293B" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Zone labels */}
              <text x="18" y="112" fontSize="9" fill="#4285F4" fontWeight="700" textAnchor="start">&lt;18.5</text>
              <text x="75" y="22" fontSize="9" fill="#34A853" fontWeight="700" textAnchor="middle">18.5–24.9</text>
              <text x="140" y="34" fontSize="9" fill="#EA8600" fontWeight="700" textAnchor="middle">25–29.9</text>
              <text x="185" y="112" fontSize="9" fill="#EA4335" fontWeight="700" textAnchor="end">30+</text>
            </svg>
          </div>

          {/* BMI Value Display */}
          <div className="mt-1">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
                {bmiResult.bmi}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">BMI Score</span>
            </div>

            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs"
              style={{
                backgroundColor: `${bmiResult.color}18`,
                color: bmiResult.color,
                border: `1px solid ${bmiResult.color}40`,
              }}
            >
              {bmiResult.category === 'normal' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              {bmiResult.categoryLabel}
            </div>
          </div>

          {/* Google Fit Spectrum Bar */}
          <div className="w-full mt-3 px-2">
            <div className="h-2 w-full rounded-full flex overflow-hidden">
              <div className="w-[18.5%] bg-[#4285F4]" title="Underweight (<18.5)"></div>
              <div className="w-[28%] bg-[#34A853]" title="Normal (18.5-24.9)"></div>
              <div className="w-[25%] bg-[#FBBC04]" title="Overweight (25-29.9)"></div>
              <div className="flex-1 bg-[#EA4335]" title="Obese (30+)"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-semibold">
              <span>Underweight</span>
              <span className="text-[#34A853]">Normal</span>
              <span className="text-[#EA8600]">Overweight</span>
              <span className="text-[#EA4335]">Obese</span>
            </div>
          </div>

          {/* Healthy Weight Range Reference */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 w-full text-xs text-slate-600 flex flex-col gap-1">
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Ideal range for {profile.heightCm} cm:</span>
              <span className="font-bold text-[#34A853]">
                {isImperial
                  ? `${kgToLb(bmiResult.healthyWeightRange.min)}–${kgToLb(bmiResult.healthyWeightRange.max)} lb`
                  : `${bmiResult.healthyWeightRange.min}–${bmiResult.healthyWeightRange.max} kg`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 text-left leading-relaxed">
              WHO Formula: weight / height² = {profile.weightKg} kg / {(profile.heightCm / 100).toFixed(2)}m²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
