export type Gender = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';
export type Goal = 'lose' | 'maintain' | 'gain';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  unitSystem: UnitSystem;
  goal: Goal;
  fitnessLevel: FitnessLevel;
  manualActivityFactor: number; // 1.2, 1.375, 1.55, 1.725, 1.9
  useWearableActivityFactor: boolean;
  stepTarget: number;
  dietPreference?: 'all' | 'high-protein' | 'vegetarian' | 'low-carb';
}

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  categoryLabel: string;
  color: string;
  healthyWeightRange: { min: number; max: number };
}

export interface TdeeResult {
  bmr: number;
  activityFactor: number;
  activityLabel: string;
  isAutoAdjusted: boolean;
  tdee: number;
  maintainCalories: number;
  loseCalories: number; // TDEE - 500
  gainCalories: number; // TDEE + 500
}

export interface MacroTarget {
  name: string;
  grams: number;
  calories: number;
  percentage: number;
  color: string;
}

export interface NutrientTargets {
  dailyCalories: number;
  protein: MacroTarget;
  carbs: MacroTarget;
  fats: MacroTarget;
  waterMl: number;
  waterGlasses: number; // 250ml glasses
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'health_connect' | 'apple_health' | 'whoop' | 'fitbit' | 'simulator';
  connected: boolean;
  batteryPercent: number;
  lastSynced: string;
}

export interface WearableData {
  steps: number;
  targetSteps: number;
  heartRate: number;
  restingHeartRate: number;
  activeMinutes: number;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Optimal';
  whoopRecoveryScore?: number; // 0 - 100%
  whoopStrain?: number; // 0 - 21.0
  caloriesBurnedFromSteps: number;
  distanceKm: number;
  isSimulated: boolean;
}

export interface MealItem {
  id: string;
  name: string;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  tags: string[];
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  repsOrDuration: string;
  intensity: 'Low' | 'Moderate' | 'High';
  equipment: string;
  tips: string;
  category: 'strength' | 'cardio' | 'mobility' | 'recovery';
}

export interface DailyTrendPoint {
  day: string;
  steps: number;
  target: number;
  caloriesBurned: number;
  weightKg: number;
  activeMins: number;
}
