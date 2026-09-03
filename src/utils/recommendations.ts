import {
  BmiCategory,
  Goal,
  FitnessLevel,
  MealItem,
  ExerciseItem,
  WearableData,
} from '../types';

/**
 * Meal database categorized by goals and dietary focus
 */
export const MEAL_DATABASE: MealItem[] = [
  // Breakfasts
  {
    id: 'b-1',
    name: 'Greek Yogurt Protein Bowl with Berries & Chia',
    description: 'Non-fat Greek yogurt layered with wild blueberries, chia seeds, sliced almonds, and a drizzle of raw honey.',
    mealType: 'breakfast',
    calories: 340,
    proteinGrams: 32,
    carbsGrams: 34,
    fatGrams: 8,
    tags: ['High Protein', 'Probiotic', 'Antioxidant', 'Fast Prep'],
  },
  {
    id: 'b-2',
    name: 'Spinach & Egg White Scramble with Sourdough',
    description: 'Fluffy whole egg and egg-white scramble with baby spinach, tomatoes, and 1 slice of toasted artisanal sourdough.',
    mealType: 'breakfast',
    calories: 310,
    proteinGrams: 28,
    carbsGrams: 26,
    fatGrams: 9,
    tags: ['Low Fat', 'High Satiety', 'Clean Carbs'],
  },
  {
    id: 'b-3',
    name: 'Power Rolled Oats with Whey, Peanut Butter & Banana',
    description: 'Warm steel-cut oats stirred with whey isolate protein, 1 tbsp organic peanut butter, and sliced banana.',
    mealType: 'breakfast',
    calories: 520,
    proteinGrams: 42,
    carbsGrams: 62,
    fatGrams: 14,
    tags: ['Muscle Fuel', 'Complex Carbs', 'Bulking'],
  },
  {
    id: 'b-4',
    name: 'Avocado & Smoked Salmon Toast with Poached Egg',
    description: 'Whole grain toast with mashed avocado, Atlantic smoked salmon, microgreens, and a soft poached egg.',
    mealType: 'breakfast',
    calories: 410,
    proteinGrams: 26,
    carbsGrams: 28,
    fatGrams: 22,
    tags: ['Omega-3 Rich', 'Healthy Fats', 'Heart Healthy'],
  },

  // Lunches
  {
    id: 'l-1',
    name: 'Mediterranean Grilled Chicken & Quinoa Salad',
    description: 'Herb-marinated chicken breast, warm fluffy quinoa, cucumber, cherry tomatoes, Kalamata olives, and light lemon oregano vinaigrette.',
    mealType: 'lunch',
    calories: 480,
    proteinGrams: 44,
    carbsGrams: 42,
    fatGrams: 14,
    tags: ['Balanced Macro', 'Fiber Dense', 'Meal Prep Ready'],
  },
  {
    id: 'l-2',
    name: 'Tuna & White Bean Zesty Crunch Wrap',
    description: 'Pole-caught tuna flakes, cannellini beans, mixed greens, diced red onion, and avocado spread wrapped in a high-fiber tortilla.',
    mealType: 'lunch',
    calories: 420,
    proteinGrams: 38,
    carbsGrams: 40,
    fatGrams: 10,
    tags: ['Lean Protein', 'High Fiber', 'Portable'],
  },
  {
    id: 'l-3',
    name: 'Double Bison / Lean Beef Bowl with Sweet Potato & Asparagus',
    description: '93% lean ground grass-fed beef or bison served over roasted rosemary sweet potato cubes and grilled asparagus spears.',
    mealType: 'lunch',
    calories: 640,
    proteinGrams: 52,
    carbsGrams: 64,
    fatGrams: 18,
    tags: ['Muscle Growth', 'Micronutrient Dense', 'Iron Rich'],
  },
  {
    id: 'l-4',
    name: 'Tofu Rainbow Power Bowl with Peanut Lime Dressing',
    description: 'Crispy baked organic tofu cubes, steamed edamame, purple cabbage, brown jasmine rice, and creamy sesame ginger drizzle.',
    mealType: 'lunch',
    calories: 450,
    proteinGrams: 29,
    carbsGrams: 48,
    fatGrams: 15,
    tags: ['Plant-Based', 'High Fiber', 'Colorful Phyto'],
  },

  // Dinners
  {
    id: 'd-1',
    name: 'Wild Atlantic Salmon with Charred Broccoli & Brown Rice',
    description: 'Pan-seared wild salmon fillet seasoned with lemon garlic pepper, roasted broccoli florets, and steamed brown rice.',
    mealType: 'dinner',
    calories: 540,
    proteinGrams: 45,
    carbsGrams: 38,
    fatGrams: 22,
    tags: ['High Omega-3', 'Anti-Inflammatory', 'High Protein'],
  },
  {
    id: 'd-2',
    name: 'Herb-Roasted Turkey Breast with Cauliflower Mash & Green Beans',
    description: 'Tender roasted turkey breast slices paired with garlic cauliflower purée and steamed French green beans with toasted slivered almonds.',
    mealType: 'dinner',
    calories: 380,
    proteinGrams: 46,
    carbsGrams: 18,
    fatGrams: 12,
    tags: ['Low Carb', 'Lean Cutting', 'Comfort Food'],
  },
  {
    id: 'd-3',
    name: 'Sirloin Steak with Baked Potato & Roasted Brussels Sprouts',
    description: 'Grass-fed sirloin medallion paired with a moderate baked russet potato (topped with Greek yogurt chives) and balsamic glazed sprouts.',
    mealType: 'dinner',
    calories: 680,
    proteinGrams: 55,
    carbsGrams: 54,
    fatGrams: 24,
    tags: ['Hypertrophy Split', 'Zinc & Iron', 'High Calorie'],
  },
  {
    id: 'd-4',
    name: 'Lentil & Vegetable Coconut Curry with Basmati',
    description: 'Spiced red lentils simmered in light coconut milk, turmeric, ginger, spinach, and cauliflower, served over fragrant basmati rice.',
    mealType: 'dinner',
    calories: 460,
    proteinGrams: 24,
    carbsGrams: 66,
    fatGrams: 11,
    tags: ['Vegetarian', 'Gut Friendly', 'High Fiber'],
  },

  // Snacks
  {
    id: 's-1',
    name: 'Apple Slices with Natural Peanut Butter',
    description: 'Crisp honeycrisp apple wedges paired with 1.5 tablespoons of unrefined peanut butter.',
    mealType: 'snack',
    calories: 190,
    proteinGrams: 6,
    carbsGrams: 22,
    fatGrams: 10,
    tags: ['Quick Energy', 'Natural Sugar', 'Satiating'],
  },
  {
    id: 's-2',
    name: 'Cottage Cheese with Pineapple & Walnuts',
    description: 'Low-fat curd cottage cheese topped with juicy fresh pineapple chunks and crushed walnuts.',
    mealType: 'snack',
    calories: 220,
    proteinGrams: 22,
    carbsGrams: 18,
    fatGrams: 7,
    tags: ['Slow Digesting Casein', 'High Protein', 'Bedtime Snack'],
  },
  {
    id: 's-3',
    name: 'Roasted Edamame & Mixed Raw Almonds',
    description: 'Lightly sea-salted dry roasted edamame beans mixed with raw California almonds.',
    mealType: 'snack',
    calories: 170,
    proteinGrams: 14,
    carbsGrams: 10,
    fatGrams: 9,
    tags: ['Crunchy', 'High Fiber', 'Portable'],
  },
  {
    id: 's-4',
    name: 'Protein Whey Shake with Unsweetened Almond Milk',
    description: 'One scoop of premium whey or plant protein shaken with ice-cold vanilla almond milk.',
    mealType: 'snack',
    calories: 140,
    proteinGrams: 25,
    carbsGrams: 3,
    fatGrams: 2,
    tags: ['Post-Workout', 'Low Calorie', 'Rapid Absorption'],
  },
];

/**
 * Filter and recommend daily meals based on BMI category and fitness goal
 */
export function getRecommendedMeals(
  bmiCategory: BmiCategory,
  goal: Goal,
  swapSeeds: { breakfast: number; lunch: number; dinner: number; snack: number }
): {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack: MealItem;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  coachInsight: string;
} {
  const breakfasts = MEAL_DATABASE.filter((m) => m.mealType === 'breakfast');
  const lunches = MEAL_DATABASE.filter((m) => m.mealType === 'lunch');
  const dinners = MEAL_DATABASE.filter((m) => m.mealType === 'dinner');
  const snacks = MEAL_DATABASE.filter((m) => m.mealType === 'snack');

  // Intelligent index selection based on goal
  let bIdx = swapSeeds.breakfast % breakfasts.length;
  let lIdx = swapSeeds.lunch % lunches.length;
  let dIdx = swapSeeds.dinner % dinners.length;
  let sIdx = swapSeeds.snack % snacks.length;

  if (goal === 'lose' || bmiCategory === 'overweight' || bmiCategory === 'obese') {
    // Lean, high-protein & high-fiber options
    bIdx = (swapSeeds.breakfast + 1) % breakfasts.length;
    dIdx = (swapSeeds.dinner + 1) % dinners.length;
  } else if (goal === 'gain') {
    // Calorie-dense, higher carb & protein
    bIdx = (swapSeeds.breakfast + 2) % breakfasts.length;
    lIdx = (swapSeeds.lunch + 2) % lunches.length;
  }

  const breakfast = breakfasts[bIdx] || breakfasts[0];
  const lunch = lunches[lIdx] || lunches[0];
  const dinner = dinners[dIdx] || dinners[0];
  const snack = snacks[sIdx] || snacks[0];

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories + snack.calories;
  const totalProtein = breakfast.proteinGrams + lunch.proteinGrams + dinner.proteinGrams + snack.proteinGrams;
  const totalCarbs = breakfast.carbsGrams + lunch.carbsGrams + dinner.carbsGrams + snack.carbsGrams;
  const totalFat = breakfast.fatGrams + lunch.fatGrams + dinner.fatGrams + snack.fatGrams;

  let coachInsight = 'Balanced macro distribution supporting everyday sustained energy and glycemic control.';
  if (goal === 'lose') {
    coachInsight = `High-satiety meal plan providing ${totalProtein}g protein to preserve lean muscle while keeping a calibrated calorie deficit.`;
  } else if (goal === 'gain') {
    coachInsight = `Nutrient-dense muscle-building plan delivering ${totalProtein}g protein with complex slow-release carbohydrates for glycogen replenishment.`;
  }

  return {
    breakfast,
    lunch,
    dinner,
    snack,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    coachInsight,
  };
}

/**
 * Exercise Recommendation Engine
 */
export function getExerciseRecommendations(
  bmiCategory: BmiCategory,
  goal: Goal,
  fitnessLevel: FitnessLevel,
  wearable?: WearableData
): {
  routineName: string;
  focusArea: string;
  intensity: 'Low' | 'Moderate' | 'High';
  recoveryStatus: 'optimal' | 'moderate' | 'fatigued' | 'none';
  stepDeficitAlert?: string;
  coachNote: string;
  exercises: ExerciseItem[];
} {
  const steps = wearable?.steps ?? 7500;
  const targetSteps = wearable?.targetSteps ?? 10000;
  const whoopRecovery = wearable?.whoopRecoveryScore;
  const strain = wearable?.whoopStrain;

  // Step deficit check
  let stepDeficitAlert: string | undefined;
  if (steps < targetSteps * 0.75) {
    const gap = targetSteps - steps;
    const briskWalkMins = Math.round(gap / 110); // ~110 steps/min for brisk walk
    stepDeficitAlert = `Steps behind target by ${gap.toLocaleString()} steps. Add a ${briskWalkMins}-minute brisk outdoor walk or treadmill cooldown to close your daily activity gap!`;
  }

  // Recovery override: if Whoop recovery is under 35% or strain is very high (>16.5)
  if (whoopRecovery !== undefined && whoopRecovery < 35) {
    return {
      routineName: 'Active Recovery & Restorative Mobility',
      focusArea: 'Joint Decompression & Parasympathetic Recovery',
      intensity: 'Low',
      recoveryStatus: 'fatigued',
      stepDeficitAlert,
      coachNote: `Whoop recovery is low (${whoopRecovery}%). Your body is physiologically primed for recovery rather than high-strain training. Focus on light movement, hydration, and deep breathing.`,
      exercises: [
        {
          id: 'rec-1',
          name: 'Gentle Cat-Cow & Thoracic Spine Rotations',
          muscleGroup: 'Spine & Core',
          sets: 3,
          repsOrDuration: '10 slow cycles each',
          intensity: 'Low',
          equipment: 'Mat / Bodyweight',
          tips: 'Synchronize movement with slow nasal inhalation and prolonged exhalation.',
          category: 'mobility',
        },
        {
          id: 'rec-2',
          name: 'World’s Greatest Stretch & Hip Opener',
          muscleGroup: 'Hips, Hamstrings & T-Spine',
          sets: 3,
          repsOrDuration: '45 sec per side',
          intensity: 'Low',
          equipment: 'Bodyweight',
          tips: 'Drop your back knee gently and reach the arm high to mobilize your ribcage.',
          category: 'mobility',
        },
        {
          id: 'rec-3',
          name: 'Low-Heart-Rate Zone 1 Flush Walk',
          muscleGroup: 'Full Body Aerobic',
          sets: 1,
          repsOrDuration: '20-30 minutes',
          intensity: 'Low',
          equipment: 'Walking Shoes',
          tips: 'Keep heart rate below 115 BPM to assist lymphatic clearance without taxing CNS.',
          category: 'recovery',
        },
        {
          id: 'rec-4',
          name: 'Legs-Up-The-Wall Restorative Pose',
          muscleGroup: 'Lower Back & Nervous System',
          sets: 1,
          repsOrDuration: '8-10 minutes',
          intensity: 'Low',
          equipment: 'Wall & Mat',
          tips: 'Deep diaphragmatic breathing to stimulate vagal tone and accelerate recovery.',
          category: 'recovery',
        },
      ],
    };
  }

  // High joint protection if BMI is obese or overweight
  const isHighImpactSensitive = bmiCategory === 'obese' || bmiCategory === 'overweight';

  if (goal === 'lose') {
    return {
      routineName: isHighImpactSensitive
        ? 'Low-Impact Metabolic Fat-Burn & Joint Shield'
        : 'High-Energy Metabolic Conditioning & Core Circuit',
      focusArea: 'Cardio Endurance + Full Body Density',
      intensity: fitnessLevel === 'beginner' ? 'Moderate' : 'High',
      recoveryStatus: whoopRecovery && whoopRecovery > 66 ? 'optimal' : 'moderate',
      stepDeficitAlert,
      coachNote: isHighImpactSensitive
        ? 'Joint-sparing resistance and controlled tempo movements maximize calorie burn while protecting knees and lower back.'
        : 'High-density circuit keeping heart rate elevated to promote metabolic afterburn (EPOC).',
      exercises: [
        {
          id: 'fat-1',
          name: isHighImpactSensitive ? 'Goblet Box Squat (Knee Friendly)' : 'Dumbbell Thrusters (Squat to Overhead Press)',
          muscleGroup: 'Quadriceps, Glutes & Shoulders',
          sets: 4,
          repsOrDuration: '10-12 controlled reps',
          intensity: 'Moderate',
          equipment: 'Dumbbell or Kettlebell',
          tips: 'Maintain a proud chest, brace core, and drive through heels on ascent.',
          category: 'strength',
        },
        {
          id: 'fat-2',
          name: 'Incline Dumbbell Row or Resistance Band Row',
          muscleGroup: 'Upper Back & Lats',
          sets: 4,
          repsOrDuration: '12 reps (2s hold at top)',
          intensity: 'Moderate',
          equipment: 'Dumbbells / Bench',
          tips: 'Squeeze shoulder blades together without shrugging traps.',
          category: 'strength',
        },
        {
          id: 'fat-3',
          name: isHighImpactSensitive ? 'Incline Treadmill Brisk Walk or Elliptical Intervals' : 'Kettlebell Swings or Bodyweight Mountain Climbers',
          muscleGroup: 'Posterior Chain & Cardiovascular',
          sets: 4,
          repsOrDuration: isHighImpactSensitive ? '15 minutes at 6-8% incline' : '45 sec work / 15 sec rest x 5 rounds',
          intensity: 'High',
          equipment: isHighImpactSensitive ? 'Incline Treadmill / Elliptical' : 'Kettlebell',
          tips: 'Keep steady breathing rhythm and engage core stability throughout.',
          category: 'cardio',
        },
        {
          id: 'fat-4',
          name: 'Forearm Plank with Alternating Knee Taps',
          muscleGroup: 'Transverse Abdominis & Glutes',
          sets: 3,
          repsOrDuration: '45-60 seconds',
          intensity: 'Moderate',
          equipment: 'Mat',
          tips: 'Avoid sagging lower back; maintain a straight neutral spine.',
          category: 'strength',
        },
      ],
    };
  }

  if (goal === 'gain') {
    return {
      routineName: 'Hypertrophy Strength Split: Push & Pull Foundations',
      focusArea: 'Progressive Overload & Muscular Tension',
      intensity: 'High',
      recoveryStatus: whoopRecovery && whoopRecovery > 66 ? 'optimal' : 'moderate',
      stepDeficitAlert,
      coachNote: 'Focus on mechanical tension with 2-minute rests between heavy sets to maximize myofibrillar protein synthesis.',
      exercises: [
        {
          id: 'gain-1',
          name: 'Barbell or Dumbbell Romanian Deadlift (RDL)',
          muscleGroup: 'Hamstrings & Glutes',
          sets: 4,
          repsOrDuration: '8-10 reps (3s eccentric descent)',
          intensity: 'High',
          equipment: 'Barbell / Heavy Dumbbells',
          tips: 'Hinge back at the hips, keeping the weights pinned close to your shins.',
          category: 'strength',
        },
        {
          id: 'gain-2',
          name: 'Incline Dumbbell Chest Press',
          muscleGroup: 'Upper Pectorals & Triceps',
          sets: 4,
          repsOrDuration: '8-10 reps',
          intensity: 'High',
          equipment: 'Adjustable Bench & Dumbbells',
          tips: 'Flare elbows at a comfortable 45-degree angle, driving weights up smoothly.',
          category: 'strength',
        },
        {
          id: 'gain-3',
          name: 'Chest-Supported Neutral Grip Rows',
          muscleGroup: 'Rhomboids, Lats & Rear Delts',
          sets: 3,
          repsOrDuration: '10-12 reps with 1s isometric squeeze',
          intensity: 'Moderate',
          equipment: 'Incline Bench & Dumbbells',
          tips: 'Eliminates lower back strain, isolating upper back musculature.',
          category: 'strength',
        },
        {
          id: 'gain-4',
          name: 'Standing Bulgarian Split Squat',
          muscleGroup: 'Quadriceps, Glute Medius & Core',
          sets: 3,
          repsOrDuration: '10 reps each leg',
          intensity: 'High',
          equipment: 'Bench & Light Dumbbells',
          tips: 'Lower until rear knee is an inch off the mat, push through front foot midfoot.',
          category: 'strength',
        },
      ],
    };
  }

  // Goal === 'maintain'
  return {
    routineName: 'Functional Strength, Core & Aerobic Conditioning',
    focusArea: 'Mobility, Stability & Metabolic Health',
    intensity: 'Moderate',
    recoveryStatus: whoopRecovery && whoopRecovery > 66 ? 'optimal' : 'moderate',
    stepDeficitAlert,
    coachNote: 'A balanced protocol engineered to preserve lean tissue, elevate VO2 max, and enhance postural durability.',
    exercises: [
      {
        id: 'main-1',
        name: 'Kettlebell Goblet Squats',
        muscleGroup: 'Legs & Core',
        sets: 3,
        repsOrDuration: '12 controlled reps',
        intensity: 'Moderate',
        equipment: 'Kettlebell',
        tips: 'Keep elbows tucked inside knees at bottom for active hip opening.',
        category: 'strength',
      },
      {
        id: 'main-2',
        name: 'Push-Up to Downward Dog Flow',
        muscleGroup: 'Chest, Shoulders & Posterior Chain',
        sets: 3,
        repsOrDuration: '10 smooth fluid reps',
        intensity: 'Moderate',
        equipment: 'Mat',
        tips: 'Drive hips up high and press heels toward ground to stretch calves and hamstrings.',
        category: 'mobility',
      },
      {
        id: 'main-3',
        name: 'Farmer’s Loaded Carry Walk',
        muscleGroup: 'Grip Strength, Trapezius & Anti-Rotational Core',
        sets: 4,
        repsOrDuration: '40 meters (or 45 seconds)',
        intensity: 'Moderate',
        equipment: 'Dumbbells or Kettlebells',
        tips: 'Stand tall with ribs pulled down, walk with measured deliberate strides.',
        category: 'strength',
      },
      {
        id: 'main-4',
        name: 'Zone 2 Cardio Steady-State Interval',
        muscleGroup: 'Cardiovascular System',
        sets: 1,
        repsOrDuration: '20-25 minutes at 65-75% max HR',
        intensity: 'Moderate',
        equipment: 'Rowing Machine / Bike / Running',
        tips: 'Maintain conversational pace (nasal breathing if possible) to expand mitochondrial density.',
        category: 'cardio',
      },
    ],
  };
}
