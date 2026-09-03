import React, { useState } from 'react';
import { UserProfile, BmiResult, TdeeResult, NutrientTargets, WearableData } from '../types';
import { Printer, Copy, Check, X, FileText, HeartPulse } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  bmiResult: BmiResult;
  tdeeResult: TdeeResult;
  targets: NutrientTargets;
  wearable: WearableData;
}

export const ReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  bmiResult,
  tdeeResult,
  targets,
  wearable,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = `=========================================
SMART HEALTH & NUTRITION CLINICAL REPORT
Generated on: ${new Date().toLocaleDateString()}
=========================================

1. BIOMETRIC PROFILE & BMI
- Age / Gender: ${profile.age} years | ${profile.gender.toUpperCase()}
- Height: ${profile.heightCm} cm (${(profile.heightCm / 2.54 / 12).toFixed(0)}ft ${(profile.heightCm / 2.54 % 12).toFixed(0)}in)
- Weight: ${profile.weightKg} kg (${(profile.weightKg * 2.20462).toFixed(1)} lb)
- BMI Score: ${bmiResult.bmi} (${bmiResult.categoryLabel})
- Healthy Weight Range: ${bmiResult.healthyWeightRange.min} - ${bmiResult.healthyWeightRange.max} kg

2. ENERGY EXPENDITURE (TDEE)
- Basal Metabolic Rate (Mifflin-St Jeor): ${tdeeResult.bmr} kcal/day
- Activity Multiplier: ${tdeeResult.activityFactor}x (${tdeeResult.activityLabel})
- Maintenance TDEE: ${tdeeResult.maintainCalories} kcal/day
- Fat Loss Target (-500 kcal): ${tdeeResult.loseCalories} kcal/day
- Muscle Surplus Target (+500 kcal): ${tdeeResult.gainCalories} kcal/day
- Selected Goal Target: ${targets.dailyCalories} kcal/day (${profile.goal.toUpperCase()})

3. MACRONUTRIENT & WATER TARGETS
- Protein: ${targets.protein.grams}g (${targets.protein.calories} kcal, ${targets.protein.percentage}%)
- Carbohydrates: ${targets.carbs.grams}g (${targets.carbs.calories} kcal, ${targets.carbs.percentage}%)
- Healthy Fats: ${targets.fats.grams}g (${targets.fats.calories} kcal, ${targets.fats.percentage}%)
- Daily Hydration: ${(targets.waterMl / 1000).toFixed(1)} Liters (${targets.waterGlasses} glasses)

4. WEARABLE & STEP BIOMETRICS
- Daily Steps: ${wearable.steps.toLocaleString()} / ${wearable.targetSteps.toLocaleString()} (${Math.round((wearable.steps / wearable.targetSteps) * 100)}%)
- Step Calorie Burn: ~${wearable.caloriesBurnedFromSteps} kcal
- Distance: ${wearable.distanceKm} km
- Heart Rate: ${wearable.heartRate} BPM (Resting: ${wearable.restingHeartRate} BPM)
- Active Minutes: ${wearable.activeMinutes} min
- Last Sleep: ${wearable.sleepHours} hrs (${wearable.sleepQuality})
- Whoop Recovery: ${wearable.whoopRecoveryScore || 'N/A'}% | Strain: ${wearable.whoopStrain || 'N/A'}

5. RESISTANCE & GYM GUIDANCE
- Target Goal Focus: ${profile.goal.toUpperCase()} (${profile.fitnessLevel.toUpperCase()})
- Recommended Split: Push / Pull / Legs or Upper / Lower Protocol
- Target Intensity: ${profile.goal === 'gain' ? 'Hypertrophy (8-12 reps @ 75% 1RM, 90-120s rest)' : profile.goal === 'lose' ? 'Metabolic Retention (10-15 reps @ 65-70% 1RM, 60-90s rest)' : 'Strength & Joint Longevity (6-10 reps, 90s rest)'}
- Biomechanical Form Verification: Live Camera Biomechanical Plumb Line & Sagittal Angle Analysis Enabled
- Warm-Up Protocol: 3-Phase Dynamic Ladder (Aerobic Flush + Joint Activation + Barbell Ramp)

DISCLAIMER: For informational and educational purposes only. Not medical advice. Consult a healthcare professional before altering diet or exercise regimens.
=========================================`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Google Fit Health & Biometrics Report</h3>
              <p className="text-xs text-slate-500">Comprehensive summary ready for download or clinical export</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-800 bg-[#F8FAFD] rounded-2xl mx-6 my-4 border border-slate-200 whitespace-pre-wrap leading-relaxed select-all">
          {reportText}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <span className="text-[11px] text-slate-500 italic">
            Ready for clipboard or consultation review
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#34A853]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy Text'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#1A73E8] text-white hover:bg-[#174EA6] transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
