import React, { useState, useMemo } from 'react';
import { UserProfile, WearableData, FitnessLevel } from './types';
import {
  calculateBmi,
  calculateTdee,
  calculateNutrientTargets,
  calculateStepCalories,
} from './utils/healthCalculations';
import { Header } from './components/Header';
import { GoogleFitRings } from './components/GoogleFitRings';
import { BmiCalculator } from './components/BmiCalculator';
import { TdeeCalculator } from './components/TdeeCalculator';
import { NutrientCalculator } from './components/NutrientCalculator';
import { WearableWidget } from './components/WearableWidget';
import { StepAnalysis } from './components/StepAnalysis';
import { MealRecommendations } from './components/MealRecommendations';
import { WorkoutRecommendations } from './components/WorkoutRecommendations';
import { GymGuidance } from './components/GymGuidance';
import { PostureCamera } from './components/PostureCamera';
import { ActivityTrendChart } from './components/ActivityTrendChart';
import { ReportModal } from './components/ReportModal';
import {
  Shield,
  Bell,
  HeartPulse,
  Flame,
  Footprints,
  Sparkles,
  Info,
  AlertCircle,
  X,
} from 'lucide-react';

export default function App() {
  // User Biometric & Goal State
  const [profile, setProfile] = useState<UserProfile>({
    age: 28,
    gender: 'male',
    heightCm: 178,
    weightKg: 78,
    unitSystem: 'metric',
    goal: 'lose',
    fitnessLevel: 'intermediate',
    manualActivityFactor: 1.55,
    useWearableActivityFactor: true,
    stepTarget: 10000,
    dietPreference: 'all',
  });

  // Wearable Real / Simulated Telemetry State
  const [wearable, setWearable] = useState<WearableData>({
    steps: 8420,
    targetSteps: 10000,
    heartRate: 72,
    restingHeartRate: 60,
    activeMinutes: 48,
    sleepHours: 7.6,
    sleepQuality: 'Good',
    whoopRecoveryScore: 76,
    whoopStrain: 12.3,
    caloriesBurnedFromSteps: Math.round(8420 * 0.045 * (78 / 70)),
    distanceKm: 6.42,
    isSimulated: true,
  });

  // Push notification banner state
  const [dismissNotification, setDismissNotification] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');

  // Profile update handler
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Wearable update handler
  const handleUpdateWearable = (updates: Partial<WearableData>) => {
    setWearable((prev) => ({ ...prev, ...updates }));
  };

  // Quick log step handler for Google Fit quick-action buttons
  const handleQuickLogStep = (amount: number) => {
    setWearable((prev) => {
      const nextSteps = Math.max(0, prev.steps + amount);
      const nextActiveMins = Math.max(0, prev.activeMinutes + Math.round(amount / 100));
      return {
        ...prev,
        steps: nextSteps,
        activeMinutes: nextActiveMins,
        caloriesBurnedFromSteps: Math.round(nextSteps * 0.045 * (profile.weightKg / 70)),
        distanceKm: Number((nextSteps * 0.000762).toFixed(2)),
      };
    });
  };

  // Preset switchers for rapid stage demo testing
  const handleSelectPreset = (preset: 'alex' | 'sarah' | 'marcus' | 'demo_deficit') => {
    if (preset === 'alex') {
      const wKg = 84;
      setProfile({
        age: 28,
        gender: 'male',
        heightCm: 178,
        weightKg: wKg,
        unitSystem: 'metric',
        goal: 'lose',
        fitnessLevel: 'intermediate',
        manualActivityFactor: 1.55,
        useWearableActivityFactor: true,
        stepTarget: 10000,
      });
      const s = 6800;
      setWearable({
        steps: s,
        targetSteps: 10000,
        heartRate: 74,
        restingHeartRate: 62,
        activeMinutes: 38,
        sleepHours: 7.2,
        sleepQuality: 'Good',
        whoopRecoveryScore: 68,
        whoopStrain: 10.5,
        caloriesBurnedFromSteps: Math.round(s * 0.045 * (wKg / 70)),
        distanceKm: 5.18,
        isSimulated: true,
      });
    } else if (preset === 'sarah') {
      const wKg = 54;
      setProfile({
        age: 25,
        gender: 'female',
        heightCm: 165,
        weightKg: wKg,
        unitSystem: 'metric',
        goal: 'gain',
        fitnessLevel: 'advanced',
        manualActivityFactor: 1.725,
        useWearableActivityFactor: true,
        stepTarget: 10000,
      });
      const s = 11200;
      setWearable({
        steps: s,
        targetSteps: 10000,
        heartRate: 68,
        restingHeartRate: 54,
        activeMinutes: 65,
        sleepHours: 8.0,
        sleepQuality: 'Optimal',
        whoopRecoveryScore: 88,
        whoopStrain: 14.8,
        caloriesBurnedFromSteps: Math.round(s * 0.045 * (wKg / 70)),
        distanceKm: 8.53,
        isSimulated: true,
      });
    } else if (preset === 'marcus') {
      const wKg = 76;
      setProfile({
        age: 34,
        gender: 'male',
        heightCm: 182,
        weightKg: wKg,
        unitSystem: 'metric',
        goal: 'maintain',
        fitnessLevel: 'intermediate',
        manualActivityFactor: 1.55,
        useWearableActivityFactor: true,
        stepTarget: 10000,
      });
      const s = 10400;
      setWearable({
        steps: s,
        targetSteps: 10000,
        heartRate: 64,
        restingHeartRate: 56,
        activeMinutes: 52,
        sleepHours: 7.8,
        sleepQuality: 'Good',
        whoopRecoveryScore: 82,
        whoopStrain: 12.0,
        caloriesBurnedFromSteps: Math.round(s * 0.045 * (wKg / 70)),
        distanceKm: 7.92,
        isSimulated: true,
      });
    } else if (preset === 'demo_deficit') {
      const wKg = 92;
      setProfile({
        age: 38,
        gender: 'male',
        heightCm: 172,
        weightKg: wKg,
        unitSystem: 'metric',
        goal: 'lose',
        fitnessLevel: 'beginner',
        manualActivityFactor: 1.2,
        useWearableActivityFactor: true,
        stepTarget: 10000,
      });
      const s = 3150;
      setWearable({
        steps: s,
        targetSteps: 10000,
        heartRate: 86,
        restingHeartRate: 72,
        activeMinutes: 15,
        sleepHours: 5.1,
        sleepQuality: 'Poor',
        whoopRecoveryScore: 28, // Low recovery trigger
        whoopStrain: 16.5,
        caloriesBurnedFromSteps: Math.round(s * 0.045 * (wKg / 70)),
        distanceKm: 2.4,
        isSimulated: true,
      });
      setDismissNotification(false);
    }
  };

  // Memoized Clinical Calculations
  const bmiResult = useMemo(() => {
    return calculateBmi(profile.weightKg, profile.heightCm);
  }, [profile.weightKg, profile.heightCm]);

  const tdeeResult = useMemo(() => {
    return calculateTdee(profile, wearable);
  }, [profile, wearable]);

  const targets = useMemo(() => {
    return calculateNutrientTargets(profile, tdeeResult);
  }, [profile, tdeeResult]);

  // Check if steps are currently behind target
  const stepsBehind = wearable.steps < (profile.stepTarget || 10000) * 0.75;
  const stepsDiff = (profile.stepTarget || 10000) - wearable.steps;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation & Profile Bar */}
      <Header
        profile={profile}
        wearable={wearable}
        activeFilterTab={activeFilterTab}
        onSelectFilterTab={setActiveFilterTab}
        onSelectPreset={handleSelectPreset}
        onExportReport={() => setShowReportModal(true)}
      />

      {/* Smart Push Notification Alert (Bonus Feature) */}
      {stepsBehind && !dismissNotification && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-semibold shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 shrink-0 animate-bounce" />
              <span>
                <strong>Smart Step Alert:</strong> You are currently{' '}
                <strong>{stepsDiff.toLocaleString()} steps</strong> behind today&apos;s target. Take a 20-minute brisk walk to stay on track for your caloric expenditure!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDismissNotification(true)}
              className="p-1 rounded-md hover:bg-amber-600/30 text-slate-950"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Mode Notice banner when a specific category is active */}
      {activeFilterTab !== 'all' && (
        <div className="bg-[#E8F0FE] border-b border-[#D2E3FC] px-4 py-2 text-xs">
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1A73E8] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Viewing category: <strong className="capitalize">{activeFilterTab === 'gym' ? 'Gym & Strength Guidance' : activeFilterTab === 'camera' ? 'Live Camera Posture Verification' : activeFilterTab}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilterTab('all')}
              className="text-xs font-bold text-[#1A73E8] hover:underline"
            >
              Show All Dashboard Overview →
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Google Fit Centerpiece: Heart Points & Steps Dual Concentric Rings */}
        {(activeFilterTab === 'all' || activeFilterTab === 'wearable') && (
          <section aria-label="Google Fit Activity Rings">
            <GoogleFitRings
              wearable={wearable}
              profile={profile}
              onUpdateWearable={handleUpdateWearable}
              onQuickLogStep={handleQuickLogStep}
            />
          </section>
        )}

        {/* Section 1: Biometrics & Expenditure (BMI + TDEE) */}
        {(activeFilterTab === 'all' || activeFilterTab === 'biometrics' || activeFilterTab === 'tdee') && (
          <section aria-label="Biometric & Caloric Calculators">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(activeFilterTab === 'all' || activeFilterTab === 'biometrics') && (
                <BmiCalculator
                  profile={profile}
                  bmiResult={bmiResult}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
              {(activeFilterTab === 'all' || activeFilterTab === 'tdee') && (
                <TdeeCalculator
                  profile={profile}
                  tdeeResult={tdeeResult}
                  wearable={wearable}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </div>
          </section>
        )}

        {/* Section 2: Wearable Integration & Step Biometrics */}
        {(activeFilterTab === 'all' || activeFilterTab === 'wearable') && (
          <section aria-label="Wearable & Step Analysis">
            <div className="space-y-6">
              <WearableWidget
                wearable={wearable}
                onUpdateWearable={handleUpdateWearable}
                weightKg={profile.weightKg}
              />
              <StepAnalysis
                wearable={wearable}
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          </section>
        )}

        {/* Section 3: Nutrition & Meal Recommendations */}
        {(activeFilterTab === 'all' || activeFilterTab === 'nutrition') && (
          <section aria-label="Nutrient Intake & Meals">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NutrientCalculator targets={targets} profile={profile} />
              <MealRecommendations
                bmiCategory={bmiResult.category}
                goal={profile.goal}
                targets={targets}
              />
            </div>
          </section>
        )}

        {/* Section 4: Live Camera Posture Verification */}
        {(activeFilterTab === 'all' || activeFilterTab === 'camera' || activeFilterTab === 'gym') && (
          <section aria-label="Gym Posture Verification Camera">
            <PostureCamera profile={profile} />
          </section>
        )}

        {/* Section 5: Gym Guidance & Resistance Training System */}
        {(activeFilterTab === 'all' || activeFilterTab === 'gym' || activeFilterTab === 'workouts') && (
          <section aria-label="Gym Guidance & Resistance Training">
            <GymGuidance profile={profile} />
          </section>
        )}

        {/* Section 5: Daily Workout & Protocol Recommendations */}
        {(activeFilterTab === 'all' || activeFilterTab === 'workouts') && (
          <section aria-label="Exercise Recommendation Engine">
            <WorkoutRecommendations
              bmiCategory={bmiResult.category}
              goal={profile.goal}
              fitnessLevel={profile.fitnessLevel}
              wearable={wearable}
              onUpdateFitnessLevel={(level) => handleUpdateProfile({ fitnessLevel: level })}
            />
          </section>
        )}

        {/* Section 6: Weekly Activity & Biometrics Trend Chart */}
        {(activeFilterTab === 'all' || activeFilterTab === 'trends') && (
          <section aria-label="7-Day Trends">
            <ActivityTrendChart
              currentSteps={wearable.steps}
              stepTarget={profile.stepTarget || 10000}
              weightKg={profile.weightKg}
            />
          </section>
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        profile={profile}
        bmiResult={bmiResult}
        tdeeResult={tdeeResult}
        targets={targets}
        wearable={wearable}
      />

      {/* Prominent Clinical Disclaimer Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">
              Medical & Clinical Disclaimer:
            </span>
            <span>
              For informational and educational purposes only, not medical advice.
            </span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-xl">
            Calculations utilize the Mifflin-St Jeor equation and WHO BMI criteria. Always consult a licensed healthcare practitioner or registered dietitian before beginning any new caloric deficit, intense training split, or lifestyle modification.
          </p>
        </div>
      </footer>
    </div>
  );
}
