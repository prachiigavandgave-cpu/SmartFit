import {
  UserProfile,
  BmiResult,
  BmiCategory,
  TdeeResult,
  NutrientTargets,
  WearableData,
} from '../types';

/**
 * Calculates BMI and classifies into standard clinical categories
 */
export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'normal',
      categoryLabel: 'Normal',
      color: '#10b981',
      healthyWeightRange: { min: 0, max: 0 },
    };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Number(rawBmi.toFixed(1));

  let category: BmiCategory = 'normal';
  let categoryLabel = 'Normal weight';
  let color = '#10b981'; // emerald

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = 'Underweight (<18.5)';
    color = '#3b82f6'; // blue
  } else if (bmi <= 24.9) {
    category = 'normal';
    categoryLabel = 'Normal weight (18.5–24.9)';
    color = '#10b981'; // emerald
  } else if (bmi <= 29.9) {
    category = 'overweight';
    categoryLabel = 'Overweight (25–29.9)';
    color = '#f59e0b'; // amber
  } else {
    category = 'obese';
    categoryLabel = 'Obese (30+)';
    color = '#ef4444'; // red
  }

  const healthyMin = Number((18.5 * (heightM * heightM)).toFixed(1));
  const healthyMax = Number((24.9 * (heightM * heightM)).toFixed(1));

  return {
    bmi,
    category,
    categoryLabel,
    color,
    healthyWeightRange: { min: healthyMin, max: healthyMax },
  };
}

/**
 * Mifflin-St Jeor Basal Metabolic Rate (BMR)
 * Men:   BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
 * Women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
 */
export function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (!weightKg || !heightCm || !age) return 1600;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.round(Math.max(800, bmr));
}

/**
 * Calculates activity factor from wearable live steps and active minutes
 */
export function deriveWearableActivityFactor(
  steps: number,
  activeMinutes: number
): { factor: number; label: string } {
  // Sedentary: < 5,000 steps & < 20 active mins
  if (steps < 5000 && activeMinutes < 25) {
    return { factor: 1.2, label: 'Sedentary (<5,000 steps synced)' };
  }
  // Light: 5,000 - 7,499 steps
  if (steps < 7500 && activeMinutes < 40) {
    return { factor: 1.375, label: 'Light (5k–7.5k steps synced)' };
  }
  // Moderate: 7,500 - 9,999 steps
  if (steps < 10000 && activeMinutes < 60) {
    return { factor: 1.55, label: 'Moderate (7.5k–10k steps synced)' };
  }
  // Active: 10,000 - 13,999 steps
  if (steps < 14000) {
    return { factor: 1.725, label: 'Active (10k–14k steps synced)' };
  }
  // Very active: 14,000+ steps
  return { factor: 1.9, label: 'Very Active (14k+ steps synced)' };
}

/**
 * Calculate TDEE and Deficit/Surplus calorie targets
 */
export function calculateTdee(
  profile: UserProfile,
  wearable?: WearableData
): TdeeResult {
  const bmr = calculateBmr(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.gender
  );

  let activityFactor = profile.manualActivityFactor;
  let activityLabel = 'Manual selection';
  let isAutoAdjusted = false;

  if (profile.useWearableActivityFactor && wearable) {
    const derived = deriveWearableActivityFactor(
      wearable.steps,
      wearable.activeMinutes
    );
    activityFactor = derived.factor;
    activityLabel = derived.label;
    isAutoAdjusted = true;
  } else {
    switch (activityFactor) {
      case 1.2:
        activityLabel = 'Sedentary (little to no exercise)';
        break;
      case 1.375:
        activityLabel = 'Light (exercise 1-3 days/week)';
        break;
      case 1.55:
        activityLabel = 'Moderate (exercise 3-5 days/week)';
        break;
      case 1.725:
        activityLabel = 'Active (hard exercise 6-7 days/week)';
        break;
      case 1.9:
        activityLabel = 'Very Active (athlete / physical job)';
        break;
      default:
        activityLabel = 'Custom activity factor';
    }
  }

  const tdee = Math.round(bmr * activityFactor);
  const maintainCalories = tdee;
  // Weight loss safety floor: at least BMR * 0.85 or 1200 kcal
  const loseCalories = Math.max(1200, tdee - 500);
  const gainCalories = tdee + 500;

  return {
    bmr,
    activityFactor,
    activityLabel,
    isAutoAdjusted,
    tdee,
    maintainCalories,
    loseCalories,
    gainCalories,
  };
}

/**
 * Step calories estimation using formula ~0.04-0.05 kcal per step scaled by body weight
 */
export function calculateStepCalories(steps: number, weightKg: number): number {
  // Base rate ~0.045 kcal per step for a 70kg individual
  const kcalPerStep = 0.045 * (weightKg / 70);
  return Math.round(steps * kcalPerStep);
}

/**
 * Daily Nutrient targets (Protein, Carbs, Fats, Water)
 */
export function calculateNutrientTargets(
  profile: UserProfile,
  tdeeResult: TdeeResult
): NutrientTargets {
  // Select daily calorie target based on active goal
  let dailyCalories = tdeeResult.maintainCalories;
  if (profile.goal === 'lose') {
    dailyCalories = tdeeResult.loseCalories;
  } else if (profile.goal === 'gain') {
    dailyCalories = tdeeResult.gainCalories;
  }

  // 1. Protein determination
  // Normal: 0.8-1.2 g/kg; Muscle Gain / Fat loss preservation: 1.6-2.2 g/kg
  let proteinRatio = 1.0;
  if (profile.goal === 'gain') {
    proteinRatio = 2.0; // High protein for hypertrophy
  } else if (profile.goal === 'lose') {
    proteinRatio = 1.8; // High protein to preserve muscle in deficit
  } else {
    proteinRatio = 1.2; // Healthy maintenance
  }

  const proteinGrams = Math.round(profile.weightKg * proteinRatio);
  const proteinCalories = proteinGrams * 4;

  // 2. Fat determination: 25% of daily calories (within 20-35% standard range)
  const fatCalories = Math.round(dailyCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);

  // 3. Carbohydrates: remaining calories (within 45-65% standard range)
  const remainingCalories = Math.max(0, dailyCalories - proteinCalories - fatCalories);
  const carbsGrams = Math.round(remainingCalories / 4);
  const carbsCalories = carbsGrams * 4;

  // Actual percentages
  const totalCalculatedCalories = proteinCalories + carbsCalories + fatCalories;
  const proteinPct = Math.round((proteinCalories / totalCalculatedCalories) * 100);
  const fatPct = Math.round((fatCalories / totalCalculatedCalories) * 100);
  const carbsPct = 100 - proteinPct - fatPct;

  // 4. Water intake: 30–35 ml/kg body weight (use 33 ml/kg)
  const waterMl = Math.round(profile.weightKg * 33);
  const waterGlasses = Math.ceil(waterMl / 250);

  return {
    dailyCalories,
    protein: {
      name: 'Protein',
      grams: proteinGrams,
      calories: proteinCalories,
      percentage: proteinPct,
      color: '#3b82f6', // blue
    },
    carbs: {
      name: 'Carbohydrates',
      grams: carbsGrams,
      calories: carbsCalories,
      percentage: carbsPct,
      color: '#10b981', // emerald
    },
    fats: {
      name: 'Healthy Fats',
      grams: fatGrams,
      calories: fatCalories,
      percentage: fatPct,
      color: '#f59e0b', // amber
    },
    waterMl,
    waterGlasses,
  };
}

/**
 * Unit conversions
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function kgToLb(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

export function lbToKg(lb: number): number {
  return Number((lb / 2.20462).toFixed(1));
}
