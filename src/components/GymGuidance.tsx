import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, FitnessLevel, Goal } from '../types';
import {
  Dumbbell,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  ShieldAlert,
  Flame,
  Scale,
  Award,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  ArrowRight,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

interface Props {
  profile: UserProfile;
}

export type GymSplit = 'ppl' | 'upper_lower' | 'full_body' | 'dumbbell_cable';

interface GymExerciseDetail {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  targetMuscle: string;
  synergists: string;
  equipment: string;
  defaultSets: number;
  repRange: string;
  tempo: string;
  restSeconds: number;
  setupInstructions: string[];
  formCues: string[];
  commonMistakes: string[];
  beginnerAlternative: string;
}

interface SplitDay {
  id: string;
  name: string;
  focus: string;
  muscleGroups: string[];
  recommendedExercises: string[]; // exercise IDs
  cardioFinisher: string;
}

const SPLIT_DAYS: Record<GymSplit, SplitDay[]> = {
  ppl: [
    {
      id: 'ppl_push',
      name: 'Push Day',
      focus: 'Chest, Anterior Delts & Triceps',
      muscleGroups: ['Pectorals', 'Front Delts', 'Triceps Brachii'],
      recommendedExercises: ['bench_press', 'incline_db_press', 'cable_fly', 'overhead_press', 'triceps_rope_pushdown'],
      cardioFinisher: '10 min Incline Treadmill Walk (12% incline, 4.8 km/h)',
    },
    {
      id: 'ppl_pull',
      name: 'Pull Day',
      focus: 'Latissimus Dorsi, Rhomboids, Traps & Biceps',
      muscleGroups: ['Lats', 'Mid/Upper Back', 'Rear Delts', 'Biceps'],
      recommendedExercises: ['barbell_row', 'lat_pulldown', 'seated_cable_row', 'face_pulls', 'incline_bicep_curl'],
      cardioFinisher: '8 min High-Intensity Rowing Machine Intervals',
    },
    {
      id: 'ppl_legs',
      name: 'Legs & Calves',
      focus: 'Quadriceps, Hamstrings, Glutes & Calves',
      muscleGroups: ['Quads', 'Hamstrings', 'Gluteus Maximus', 'Calves'],
      recommendedExercises: ['barbell_squat', 'romanian_deadlift', 'leg_press', 'leg_curl', 'standing_calf_raise'],
      cardioFinisher: '5 min Assault Bike Cool-down (Easy cadence)',
    },
  ],
  upper_lower: [
    {
      id: 'ul_upper',
      name: 'Upper Body Power & Hypertrophy',
      focus: 'All Upper Body Push & Pull Antagonists',
      muscleGroups: ['Chest', 'Lats', 'Shoulders', 'Arms'],
      recommendedExercises: ['bench_press', 'barbell_row', 'incline_db_press', 'lat_pulldown', 'face_pulls'],
      cardioFinisher: '10 min SkiErg or Elliptical flush',
    },
    {
      id: 'ul_lower',
      name: 'Lower Body & Core Stability',
      focus: 'Quad Dominance, Posterior Chain & Anti-Extension Core',
      muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Abs'],
      recommendedExercises: ['barbell_squat', 'romanian_deadlift', 'leg_press', 'hanging_leg_raise', 'standing_calf_raise'],
      cardioFinisher: '8 min Stairmaster steady climbing',
    },
  ],
  full_body: [
    {
      id: 'fb_day1',
      name: 'Full Body Compound A',
      focus: 'Squat + Horizontal Push & Pull',
      muscleGroups: ['Quads', 'Chest', 'Mid-Back', 'Core'],
      recommendedExercises: ['barbell_squat', 'bench_press', 'barbell_row', 'standing_calf_raise', 'hanging_leg_raise'],
      cardioFinisher: '10 min Rowing Machine steady pace',
    },
    {
      id: 'fb_day2',
      name: 'Full Body Compound B',
      focus: 'Hinge + Vertical Push & Pull',
      muscleGroups: ['Hamstrings', 'Glutes', 'Lats', 'Shoulders'],
      recommendedExercises: ['romanian_deadlift', 'overhead_press', 'lat_pulldown', 'leg_curl', 'triceps_rope_pushdown'],
      cardioFinisher: '10 min Air Bike metabolic burn',
    },
  ],
  dumbbell_cable: [
    {
      id: 'dc_upper',
      name: 'Dumbbell & Cable Upper',
      focus: 'Crowded Gym / Hotel Gym Isolation & Hypertrophy',
      muscleGroups: ['Pectorals', 'Lats', 'Deltoids', 'Arms'],
      recommendedExercises: ['incline_db_press', 'lat_pulldown', 'seated_cable_row', 'cable_fly', 'incline_bicep_curl'],
      cardioFinisher: '12 min Treadmill interval sprints',
    },
    {
      id: 'dc_lower',
      name: 'Dumbbell & Cable Lower',
      focus: 'Single-Leg Balance & Hamstring / Glute Hypertrophy',
      muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
      recommendedExercises: ['leg_press', 'romanian_deadlift', 'leg_curl', 'hanging_leg_raise'],
      cardioFinisher: '10 min Incline walking',
    },
  ],
};

const GYM_EXERCISE_DATABASE: GymExerciseDetail[] = [
  {
    id: 'bench_press',
    name: 'Barbell Flat Bench Press',
    category: 'chest',
    targetMuscle: 'Pectoralis Major (Sternal Head)',
    synergists: 'Anterior Deltoids, Triceps Brachii',
    equipment: 'Olympic Barbell & Flat Bench with J-Hooks',
    defaultSets: 4,
    repRange: '6 - 10 reps',
    tempo: '3-0-1-0 (3s controlled descent)',
    restSeconds: 120,
    setupInstructions: [
      'Lie with eyes directly beneath the racked barbell.',
      'Grip the bar slightly wider than shoulder-width with thumbs wrapped securely.',
      'Squeeze shoulder blades together and pin them firmly into the bench surface.',
      'Plant feet flat on the gym floor, driving heel pressure to create full-body tension.',
      'Unrack smoothly with straight arms directly above your lower chest.',
    ],
    formCues: [
      'Tuck elbows at approximately 45-60 degrees relative to your torso (avoid 90-degree flare).',
      'Inhale deeply and brace core before initiating the descent.',
      'Touch the barbell gently to the lower sternum / nipple line without bouncing.',
      'Drive powerfully up through midfoot and palms, exhaling near the top lockout.',
    ],
    commonMistakes: [
      'Bouncing the heavy bar off the sternum or ribcage.',
      'Lifting glutes off the bench to cheat leverage (lumbar hyperextension).',
      'Flaring elbows out to 90 degrees, straining anterior shoulder capsules.',
    ],
    beginnerAlternative: 'Flat Dumbbell Bench Press or Chest Press Machine',
  },
  {
    id: 'incline_db_press',
    name: 'Incline Dumbbell Chest Press',
    category: 'chest',
    targetMuscle: 'Pectoralis Major (Clavicular / Upper Head)',
    synergists: 'Anterior Deltoid, Triceps',
    equipment: 'Adjustable Incline Bench (set to 30°) & Dumbbells',
    defaultSets: 3,
    repRange: '8 - 12 reps',
    tempo: '2-1-1-0 (1s stretch at bottom)',
    restSeconds: 90,
    setupInstructions: [
      'Set bench angle to 30 degrees (higher angles shift excessive load into front delts).',
      'Rest dumbbells vertically on knees while seated.',
      'Kick dumbbells back one by one as you recline onto the bench.',
      'Retract scapula and keep a slight natural arch in lower back.',
    ],
    formCues: [
      'Lower weights until dumbbells align with upper chest level.',
      'Feel a deep, controlled stretch across the upper pectorals.',
      'Press up along an inward arc without clanking dumbbells at the peak.',
    ],
    commonMistakes: [
      'Setting bench angle too steep (45°-60° turns it into a shoulder press).',
      'Allowing elbows to drop below comfortable shoulder range of motion.',
    ],
    beginnerAlternative: 'Incline Machine Chest Press',
  },
  {
    id: 'cable_fly',
    name: 'Standing Cable Crossover / Chest Fly',
    category: 'chest',
    targetMuscle: 'Pectoralis Major (Sternal & Costal Heads)',
    synergists: 'Anterior Deltoid, Biceps Short Head',
    equipment: 'Dual Adjustable Cable Pulley Station',
    defaultSets: 3,
    repRange: '12 - 15 reps',
    tempo: '2-0-1-1 (1s peak squeeze)',
    restSeconds: 60,
    setupInstructions: [
      'Set pulleys at chest or slightly higher shoulder height with D-handles attached.',
      'Take handles, take one step forward into a staggered lunge stance for stability.',
      'Maintain a slight forward torso lean (15 degrees) with a soft bend in elbows.',
    ],
    formCues: [
      'Sweep arms forward in a wide hugging motion, leading with inner elbows.',
      'Contract pectorals hard at peak convergence for a 1-second squeeze.',
      'Control the return under constant cable resistance; do not let weights slam.',
    ],
    commonMistakes: [
      'Turning the movement into a pressing motion instead of an arc fly.',
      'Using excessive weight and swinging torso forward and back.',
    ],
    beginnerAlternative: 'Seated Pec Deck / Machine Fly',
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown (Neutral or Wide Grip)',
    category: 'back',
    targetMuscle: 'Latissimus Dorsi',
    synergists: 'Biceps, Teres Major, Rhomboids, Brachialis',
    equipment: 'Lat Pulldown Cable Machine with Thigh Pads',
    defaultSets: 4,
    repRange: '8 - 12 reps',
    tempo: '2-0-1-1 (1s contraction hold)',
    restSeconds: 90,
    setupInstructions: [
      'Adjust thigh pads snugly so your thighs are anchored firmly against the pads.',
      'Grip the bar slightly wider than shoulder width (or use MAG / neutral grip handle).',
      'Sit down with chest up, leaning torso back slightly (approx 10-15 degrees).',
    ],
    formCues: [
      'Depress shoulder blades down first before bending elbows.',
      'Drive elbows down and back toward your hip pockets.',
      'Pull the bar smoothly to your clavicle / upper chest level.',
      'Resist on the way up, allowing lats to fully stretch at the top extension.',
    ],
    commonMistakes: [
      'Rocking back and forth violently using torso momentum.',
      'Pulling the bar behind the neck (dangerous for cervical spine and rotator cuffs).',
      'Shrugging shoulders into ears during the pull.',
    ],
    beginnerAlternative: 'Assisted Pull-Up Machine or Resistance Band Pull-down',
  },
  {
    id: 'barbell_row',
    name: 'Bent-Over Barbell Row',
    category: 'back',
    targetMuscle: 'Latissimus Dorsi, Rhomboids, Middle Trapezius',
    synergists: 'Posterior Deltoids, Erector Spinae, Biceps',
    equipment: 'Olympic Barbell & Weight Plates',
    defaultSets: 4,
    repRange: '6 - 10 reps',
    tempo: '2-0-1-1 (1s hold at belly button)',
    restSeconds: 120,
    setupInstructions: [
      'Stand hip-width apart with barbell over midfoot.',
      'Hinge at hips to a 45-degree angle with a flat, braced neutral spine.',
      'Grip barbell overhand (pronated) just outside knees.',
    ],
    formCues: [
      'Pull the barbell toward your lower abdomen / belly button.',
      'Focus on retracting shoulder blades and driving elbows straight back.',
      'Keep core braced like taking a punch; do not let lower back round.',
    ],
    commonMistakes: [
      'Standing too upright (turns exercise into a trap shrug).',
      'Rounding the lower back under load.',
      'Yanking with hips to bounce the weight up.',
    ],
    beginnerAlternative: 'Chest-Supported Incline Dumbbell Row or Seated Cable Row',
  },
  {
    id: 'seated_cable_row',
    name: 'Seated Low Cable Row (V-Bar)',
    category: 'back',
    targetMuscle: 'Rhomboids, Middle Trapezius, Lats',
    synergists: 'Biceps, Forearms, Erector Spinae',
    equipment: 'Low Row Cable Machine with Close-Grip V-Bar',
    defaultSets: 3,
    repRange: '10 - 12 reps',
    tempo: '2-0-1-1',
    restSeconds: 75,
    setupInstructions: [
      'Sit on bench and place feet firmly against footrests with knees softly bent.',
      'Reach forward with neutral spine to grab V-handle and push back into starting position.',
      'Torso should remain vertical with chest proud and shoulders back.',
    ],
    formCues: [
      'Initiate pull by squeezing scapulae together.',
      'Pull handle toward navel while keeping elbows close to ribs.',
      'Pause for 1 second, then control eccentric stretch forward with flat spine.',
    ],
    commonMistakes: [
      'Swinging torso forward and backward like a pendulum.',
      'Hyperextending lower back at end of contraction.',
    ],
    beginnerAlternative: 'Resistance Band Seated Row',
  },
  {
    id: 'barbell_squat',
    name: 'Barbell Back Squat (High or Low Bar)',
    category: 'legs',
    targetMuscle: 'Quadriceps, Gluteus Maximus',
    synergists: 'Hamstrings, Adductors, Core Stabilizers, Calves',
    equipment: 'Power Rack with Safety Pins & Olympic Barbell',
    defaultSets: 4,
    repRange: '6 - 8 reps',
    tempo: '3-1-1-0 (1s pause at bottom parallel)',
    restSeconds: 150,
    setupInstructions: [
      'Set safety catch bars just below your lowest squat depth.',
      'Step under bar, resting it across upper trapezius (high bar) or rear delts (low bar).',
      'Unrack with both feet under bar, take 2 deliberate steps back.',
      'Stance shoulder-width apart, toes angled out 15-30 degrees.',
    ],
    formCues: [
      'Take a deep 360-degree diaphragmatic breath, brace core against lifting belt.',
      'Break simultaneously at hips and knees, tracking knees in line with second toe.',
      'Descend until hip crease is at or slightly below top of knee (parallel depth).',
      'Drive up by pushing floor away through midfoot, keeping chest proud.',
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse) on ascent.',
      'Heels lifting off floor due to tight ankles or improper balance.',
      'Rounding lumbar spine ("butt wink") under heavy loads.',
    ],
    beginnerAlternative: 'Goblet Squat with Kettlebell or Leg Press Machine',
  },
  {
    id: 'romanian_deadlift',
    name: 'Barbell / Dumbbell Romanian Deadlift (RDL)',
    category: 'legs',
    targetMuscle: 'Hamstrings, Gluteus Maximus',
    synergists: 'Erector Spinae, Latissimus Dorsi, Trapezius, Forearms',
    equipment: 'Barbell or Heavy Dumbbells',
    defaultSets: 3,
    repRange: '8 - 12 reps',
    tempo: '3-1-1-0 (3s slow stretch)',
    restSeconds: 120,
    setupInstructions: [
      'Stand tall holding bar in front of thighs with shoulder-width double overhand grip.',
      'Feet hip-width apart, toes pointing straight ahead.',
      'Unlock knees slightly (15-20 degree fixed bend; do not squat down).',
    ],
    formCues: [
      'Push your hips straight backward as if aiming your tailbone at a wall behind you.',
      'Keep the bar shaving down close to your shins.',
      'Stop descending once hamstrings reach maximum stretch (usually mid-shin).',
      'Drive hips forward and contract glutes forcefully to stand tall.',
    ],
    commonMistakes: [
      'Bending knees into a conventional squat instead of hinging hips back.',
      'Letting the barbell drift far away from body, putting torque on lumbar spine.',
      'Rounding the spine at the bottom of the movement.',
    ],
    beginnerAlternative: 'Dumbbell Romanian Deadlift or Cable Pull-Through',
  },
  {
    id: 'leg_press',
    name: '45-Degree Incline Leg Press',
    category: 'legs',
    targetMuscle: 'Quadriceps (Vastus Lateralis, Medialis, Rectus Femoris)',
    synergists: 'Glutes, Adductors, Hamstrings',
    equipment: 'Plate-Loaded 45° Incline Leg Press Machine',
    defaultSets: 3,
    repRange: '10 - 15 reps',
    tempo: '3-0-1-0',
    restSeconds: 90,
    setupInstructions: [
      'Sit firmly with lower back and hips pressed against the machine backrest.',
      'Position feet shoulder-width apart in center of sled platform.',
      'Release safety release handles with hands grasping side handles firmly.',
    ],
    formCues: [
      'Lower sled under control until knees reach 90-degree flexion.',
      'Do NOT allow lower back or sacrum to round off the seat pad.',
      'Press through full foot back to starting position without locking knees.',
    ],
    commonMistakes: [
      'Locking out knees aggressively (hyperextension under heavy load).',
      'Letting glutes lift off the seat pad, rounding the lumbar spine.',
    ],
    beginnerAlternative: 'Seated Leg Extension Machine',
  },
  {
    id: 'leg_curl',
    name: 'Seated or Lying Hamstring Leg Curl',
    category: 'legs',
    targetMuscle: 'Hamstrings (Biceps Femoris, Semitendinosus)',
    synergists: 'Gastrocnemius, Popliteus',
    equipment: 'Pin-Loaded Leg Curl Machine',
    defaultSets: 3,
    repRange: '10 - 15 reps',
    tempo: '2-0-1-1 (1s peak squeeze)',
    restSeconds: 60,
    setupInstructions: [
      'Align knee joint directly with the machine’s rotating red axis point.',
      'Adjust ankle roller pad to sit just below calf muscles on Achilles tendon.',
      'Secure thigh lap pad tightly to keep hips glued to the seat.',
    ],
    formCues: [
      'Curl heels back under smoothly toward glutes.',
      'Squeeze hamstrings intensely at peak contraction for 1 count.',
      'Resist weight on eccentric return (2-3 seconds).',
    ],
    commonMistakes: [
      'Kicking weight aggressively using hip flexors.',
      'Allowing hips to lift off the machine seat.',
    ],
    beginnerAlternative: 'Swiss Ball Hamstring Roll-in or Resistance Band Curl',
  },
  {
    id: 'overhead_press',
    name: 'Standing Overhead Barbell Press (OHP)',
    category: 'shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    synergists: 'Triceps, Upper Chest, Core, Serratus Anterior',
    equipment: 'Barbell in Squat Rack set at clavicle height',
    defaultSets: 4,
    repRange: '6 - 8 reps',
    tempo: '2-0-1-0',
    restSeconds: 120,
    setupInstructions: [
      'Set bar at mid-chest height. Grip bar just outside shoulders with vertical forearms.',
      'Step under bar, unrack onto clavicles and front delts, step back 2 paces.',
      'Squeeze glutes tight and brace abs to prevent backward leaning.',
    ],
    formCues: [
      'Pull chin back slightly as bar passes your nose.',
      'Press straight up, then push head forward into the "window" under the bar once cleared.',
      'Lock out with bar centered directly over shoulders, hips, and midfoot.',
    ],
    commonMistakes: [
      'Excessive backward arch in lumbar spine (compensating for tight shoulders).',
      'Pressing the bar forward around the head in a curved path.',
    ],
    beginnerAlternative: 'Seated Dumbbell Shoulder Press or Machine Shoulder Press',
  },
  {
    id: 'face_pulls',
    name: 'Cable Face Pulls with Rope',
    category: 'shoulders',
    targetMuscle: 'Rear Deltoids, Rotator Cuff (Infraspinatus, Teres Minor)',
    synergists: 'Rhomboids, Trapezius',
    equipment: 'Cable Machine with Dual-Rope Attachment at Eye Level',
    defaultSets: 3,
    repRange: '12 - 15 reps',
    tempo: '2-0-1-2 (2s contraction hold)',
    restSeconds: 60,
    setupInstructions: [
      'Set cable pulley at upper chest / eye height.',
      'Attach rope and grip thumbs facing backward toward yourself (neutral/external grip).',
      'Step back 2 feet into a stable staggered stance.',
    ],
    formCues: [
      'Pull the center of the rope directly toward your bridge of nose / forehead.',
      'Simultaneously pull handles apart and externally rotate forearms up into a "double bicep" pose.',
      'Hold the contraction for 2 seconds to reinforce posture and shoulder health.',
    ],
    commonMistakes: [
      'Loading too much weight and jerking torso backward.',
      'Pulling down toward throat instead of eye level with external rotation.',
    ],
    beginnerAlternative: 'Band Pull-Aparts',
  },
  {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    category: 'arms',
    targetMuscle: 'Triceps Brachii (Lateral & Medial Heads)',
    synergists: 'Anconeus',
    equipment: 'High Cable Pulley with Triceps Rope Attachment',
    defaultSets: 3,
    repRange: '10 - 15 reps',
    tempo: '2-0-1-1',
    restSeconds: 60,
    setupInstructions: [
      'Set pulley to top position. Grip rope near bottom plastic stoppers.',
      'Step back slightly with soft knees, hinge torso forward ~10 degrees.',
      'Pin elbows firmly against side of ribs.',
    ],
    formCues: [
      'Extend forearms straight down, flaring rope ends outward at bottom.',
      'Squeeze triceps for 1 full second at peak extension.',
      'Allow forearms to rise to 90 degrees while keeping elbows motionless.',
    ],
    commonMistakes: [
      'Allowing elbows to swing forward and backward like a pendulum.',
      'Using shoulder weight to push down rather than triceps isolation.',
    ],
    beginnerAlternative: 'Bench Dips or Dumbbell Overhead Extension',
  },
  {
    id: 'incline_bicep_curl',
    name: 'Incline Dumbbell Biceps Curl',
    category: 'arms',
    targetMuscle: 'Biceps Brachii (Long Head Stretch)',
    synergists: 'Brachialis, Forearm Flexors',
    equipment: 'Adjustable Incline Bench (45° angle) & Dumbbells',
    defaultSets: 3,
    repRange: '10 - 12 reps',
    tempo: '3-0-1-1 (3s slow eccentric descent)',
    restSeconds: 60,
    setupInstructions: [
      'Set bench to 45-55 degree incline.',
      'Sit back with dumbbells hanging straight down, palms facing forward.',
    ],
    formCues: [
      'Keep upper arms perpendicular to floor throughout the curl.',
      'Curl dumbbells up smoothly while supinating wrists (turn pinky up).',
      'Lower weights with a controlled 3-second eccentric stretch.',
    ],
    commonMistakes: [
      'Swinging shoulders forward to gain momentum.',
      'Dropping weights quickly without controlling the eccentric stretch.',
    ],
    beginnerAlternative: 'Standing Cable Bicep Curl or EZ-Bar Curl',
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg / Knee Raise',
    category: 'core',
    targetMuscle: 'Rectus Abdominis & Transverse Abdominis',
    synergists: 'Hip Flexors (Iliopsoas), Forearm Grip',
    equipment: 'Pull-Up Bar or Captain’s Chair Station',
    defaultSets: 3,
    repRange: '10 - 15 reps',
    tempo: '2-0-1-1',
    restSeconds: 60,
    setupInstructions: [
      'Hang from pull-up bar with overhand grip or rest forearms in captain’s chair.',
      'Engage lats to stabilize shoulders and prevent swinging.',
    ],
    formCues: [
      'Posteriorly tilt pelvis and curl knees up toward ribs.',
      'Focus on rolling tailbone forward to recruit abdominal wall rather than hip flexors.',
      'Lower legs slowly with zero swing or pendulum momentum.',
    ],
    commonMistakes: [
      'Swinging legs violently using momentum.',
      'Arching lower back at bottom.',
    ],
    beginnerAlternative: 'Lying Floor Deadbug or Reverse Crunch',
  },
  {
    id: 'standing_calf_raise',
    name: 'Standing Machine Calf Raise',
    category: 'legs',
    targetMuscle: 'Gastrocnemius & Soleus',
    synergists: 'Plantaris',
    equipment: 'Standing Calf Raise Machine or Smith Machine with Step Block',
    defaultSets: 4,
    repRange: '12 - 15 reps',
    tempo: '2-1-1-2 (2s deep stretch at bottom, 1s peak contraction)',
    restSeconds: 60,
    setupInstructions: [
      'Place balls of feet on edge of platform with heels hanging off.',
      'Position padded shoulder levers securely on shoulders with upright spine.',
    ],
    formCues: [
      'Lower heels as deep as comfortable for a full 2-second calf stretch.',
      'Drive up high onto balls of big toes, holding peak contraction for 1 second.',
      'Keep knees straight with tiny soft micro-bend (do not bounce).',
    ],
    commonMistakes: [
      'Rapid bouncing like a pogo stick with zero deep stretch.',
      'Bending and straightening knees to cheat the load.',
    ],
    beginnerAlternative: 'Single-Leg Bodyweight Calf Raise on Stair Step',
  },
];

export const GymGuidance: React.FC<Props> = ({ profile }) => {
  // Navigation tabs inside Gym Guidance
  const [activeTab, setActiveTab] = useState<'splits' | 'exercises' | 'timer' | 'calculator' | 'warmup'>('splits');

  // Split selector state
  const [selectedSplit, setSelectedSplit] = useState<GymSplit>('ppl');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Exercise library state
  const [exerciseFilter, setExerciseFilter] = useState<'all' | 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'>('all');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>('bench_press');

  // Set-completion tracker for current workout session
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [initialSeconds, setInitialSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const timerIntervalRef = useRef<number | null>(null);

  // 1-Rep Max Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(profile.weightKg ? Math.round(profile.weightKg * 1.0) : 80);
  const [calcReps, setCalcReps] = useState<number>(5);
  const [barbellWeight, setBarbellWeight] = useState<number>(20); // standard Olympic bar

  // Sound generator for timer completion
  const playTimerBeep = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playTimerBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, audioEnabled]);

  const handleStartTimer = (presetSeconds?: number) => {
    const s = presetSeconds ?? timerSeconds;
    setInitialSeconds(s);
    setTimerSeconds(s);
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(initialSeconds);
  };

  const handleAddTimerSeconds = (extra: number) => {
    setTimerSeconds((prev) => Math.max(0, prev + extra));
    setInitialSeconds((prev) => Math.max(prev, timerSeconds + extra));
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toggle set completion in session tracker
  const toggleSet = (exerciseId: string, setIndex: number, totalSets: number) => {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] ? [...prev[exerciseId]] : new Array(totalSets).fill(false);
      current[setIndex] = !current[setIndex];
      return { ...prev, [exerciseId]: current };
    });
  };

  // 1RM Calculation formulas (Brzycki & Epley validated)
  const epley1RM = Math.round(calcWeight * (1 + calcReps / 30));
  const brzycki1RM = calcReps < 37 ? Math.round(calcWeight * (36 / (37 - calcReps))) : epley1RM;
  const estimated1RM = Math.round((epley1RM + brzycki1RM) / 2);

  // Training load targets
  const loadZones = [
    { pct: 95, label: 'Heavy Strength (1-2 reps)', weight: Math.round(estimated1RM * 0.95), reps: '1 - 2 reps' },
    { pct: 85, label: 'Strength Anchor (4-6 reps)', weight: Math.round(estimated1RM * 0.85), reps: '4 - 6 reps' },
    { pct: 75, label: 'Hypertrophy Gold Standard (8-10 reps)', weight: Math.round(estimated1RM * 0.75), reps: '8 - 10 reps' },
    { pct: 65, label: 'Muscular Endurance & Volume (12-15 reps)', weight: Math.round(estimated1RM * 0.65), reps: '12 - 15 reps' },
    { pct: 50, label: 'Dynamic Warmup & Deload', weight: Math.round(estimated1RM * 0.5), reps: '15+ reps' },
  ];

  // Plate Calculator for target weight
  const calculatePlatesPerSide = (totalTargetWeight: number) => {
    const netWeightPerSide = Math.max(0, (totalTargetWeight - barbellWeight) / 2);
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    let remaining = netWeightPerSide;
    const platesUsed: { plate: number; count: number }[] = [];

    for (const p of availablePlates) {
      const count = Math.floor(remaining / p);
      if (count > 0) {
        platesUsed.push({ plate: p, count });
        remaining = Number((remaining - count * p).toFixed(2));
      }
    }
    return { netWeightPerSide, platesUsed };
  };

  const currentSplitDays = SPLIT_DAYS[selectedSplit];
  const activeDay = currentSplitDays[selectedDayIndex] || currentSplitDays[0];

  // Exercises for active day
  const activeDayExercises = activeDay.recommendedExercises
    .map((id) => GYM_EXERCISE_DATABASE.find((ex) => ex.id === id))
    .filter(Boolean) as GymExerciseDetail[];

  // Filtered exercise library list
  const filteredLibrary = exerciseFilter === 'all'
    ? GYM_EXERCISE_DATABASE
    : GYM_EXERCISE_DATABASE.filter((ex) => ex.category === exerciseFilter);

  // Goal-based coach recommendation text
  const getGoalGuidance = (goal: Goal) => {
    switch (goal) {
      case 'gain':
        return {
          title: 'Hypertrophy & Progressive Overload Protocol',
          desc: 'Target 10-18 weekly sets per muscle group. Maintain 1-2 reps in reserve (RIR), resting 90-120s between sets. Prioritize mechanical tension with 2-3s controlled eccentrics.',
          badge: 'Muscle Hypertrophy Focus',
          badgeBg: 'bg-[#E8F0FE] text-[#1A73E8]',
        };
      case 'lose':
        return {
          title: 'Metabolic Resistance & Lean Retention Protocol',
          desc: 'Keep workout intensity high to signal muscle preservation while in a caloric deficit. Focus on compound lifts, keeping rest periods to 60-90s to sustain elevated metabolic burn.',
          badge: 'Fat Loss & Preservation Focus',
          badgeBg: 'bg-[#FEF7E0] text-[#B06000]',
        };
      default:
        return {
          title: 'Functional Strength & Joint Durability Protocol',
          desc: 'Balanced strength and endurance split. Prioritize full range of motion, rotator cuff and scapular stabilization, paired with steady cardiovascular health.',
          badge: 'Maintenance & Durability Focus',
          badgeBg: 'bg-[#E6F4EA] text-[#137333]',
        };
    }
  };

  const goalInfo = getGoalGuidance(profile.goal);

  return (
    <div id="gym-guidance-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      {/* Header with Google Fit Styling */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Gym & Resistance Training Guidance</h2>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${goalInfo.badgeBg}`}>
                {goalInfo.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Machine Calibration, Compound Lift Mechanics, Progressive Overload & Rest Protocols
            </p>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('splits')}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'splits'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workout Splits
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercises')}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'exercises'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exercise Cues
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timer')}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'timer'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-[#1A73E8]" />
            Rest Timer {isTimerRunning && <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] animate-ping" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#34A853]" />
            1RM & Plates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('warmup')}
            className={`px-3.5 py-1 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'warmup'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warmup & Etiquette
          </button>
        </div>
      </div>

      {/* Goal Strategy Banner with Camera Posture Check Callout */}
      <div className="mb-6 p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800 leading-relaxed">
            <strong className="font-bold text-slate-900">{goalInfo.title}: </strong>
            {goalInfo.desc}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('gym-posture-camera');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] border border-[#D2E3FC] rounded-xl text-xs font-bold transition-all shadow-2xs"
        >
          <span>📷 Check Posture on Camera</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TAB 1: WORKOUT SPLITS & DAILY ROUTINE */}
      {activeTab === 'splits' && (
        <div className="space-y-6">
          {/* Split Selection Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Split:</span>
              <div className="flex flex-wrap bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSplit('ppl');
                    setSelectedDayIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedSplit === 'ppl' ? 'bg-white text-[#1A73E8] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Push / Pull / Legs (PPL)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSplit('upper_lower');
                    setSelectedDayIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedSplit === 'upper_lower' ? 'bg-white text-[#1A73E8] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upper / Lower (4-Day)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSplit('full_body');
                    setSelectedDayIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedSplit === 'full_body' ? 'bg-white text-[#1A73E8] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Body 3x
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSplit('dumbbell_cable');
                    setSelectedDayIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedSplit === 'dumbbell_cable' ? 'bg-white text-[#1A73E8] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dumbbells & Cables Only
                </button>
              </div>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center gap-1.5 bg-[#E8F0FE] p-1 rounded-full">
              {currentSplitDays.map((day, idx) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedDayIndex === idx
                      ? 'bg-[#1A73E8] text-white shadow-xs'
                      : 'text-[#1A73E8] hover:bg-blue-100'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Overview Card */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{activeDay.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Target Focus: {activeDay.focus}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeDay.muscleGroups.map((muscle) => (
                  <span key={muscle} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Exercise List for Today */}
            <div className="space-y-3 mt-4">
              {activeDayExercises.map((ex, exIdx) => {
                const isExpanded = expandedExerciseId === ex.id;
                const sets = completedSets[ex.id] || new Array(ex.defaultSets).fill(false);
                const isCompleted = sets.every(Boolean) && sets.length > 0;

                return (
                  <div
                    key={ex.id}
                    className={`rounded-2xl border transition-all p-4 ${
                      isCompleted
                        ? 'bg-[#E6F4EA]/30 border-[#34A853]/40'
                        : 'bg-[#F8FAFD] border-slate-200/80 hover:bg-white hover:border-[#1A73E8]/40 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                            isCompleted ? 'bg-[#34A853] text-white' : 'border-2 border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          {isCompleted ? '✓' : exIdx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{ex.name}</h4>
                            <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                              {ex.equipment}
                            </span>
                            <span className="text-[10px] font-semibold bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded-full">
                              Tempo: {ex.tempo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Primary: <strong className="text-slate-700">{ex.targetMuscle}</strong> • Synergists: {ex.synergists}
                          </p>
                        </div>
                      </div>

                      {/* Sets, Reps & Set Completion Chips */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {ex.defaultSets} sets × {ex.repRange}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                            <Timer className="w-3 h-3 text-[#1A73E8]" /> Rest {ex.restSeconds}s
                          </div>
                        </div>

                        {/* Interactive Set Checkers */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: ex.defaultSets }).map((_, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => toggleSet(ex.id, sIdx, ex.defaultSets)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                sets[sIdx]
                                  ? 'bg-[#34A853] text-white shadow-2xs'
                                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                              }`}
                              title={`Check off Set ${sIdx + 1}`}
                            >
                              S{sIdx + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Toggle Form Cues & Setup Guide"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Form Cues & Machine Setup */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <strong className="font-bold text-slate-800 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-[#1A73E8]" /> Machine Setup & Positioning:
                          </strong>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {ex.setupInstructions.map((step, idx) => (
                              <li key={idx} className="leading-relaxed">{step}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1.5">
                          <strong className="font-bold text-[#EA4335] flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Common Mistakes to Avoid:
                          </strong>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {ex.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="leading-relaxed">{mistake}</li>
                            ))}
                          </ul>
                          <div className="pt-2 text-[11px] text-slate-500">
                            <strong>Beginner Alternative:</strong> {ex.beginnerAlternative}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cardio & Metabolic Finisher */}
            <div className="mt-4 p-3 bg-[#FEF7E0] rounded-2xl border border-[#FEEFC3] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#EA8600] fill-[#FBBC04]" />
                <span className="font-semibold text-slate-800">
                  <strong className="text-[#B06000]">Cardio Finisher:</strong> {activeDay.cardioFinisher}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Adds ~80-120 kcal burn</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISE FORM CUES & MACHINE SETUP DIRECTORY */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          {/* Muscle Group Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Muscle:</span>
            <div className="flex flex-wrap bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
              {(['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setExerciseFilter(cat)}
                  className={`px-3 py-1 rounded-full capitalize transition-all ${
                    exerciseFilter === cat
                      ? 'bg-white text-[#1A73E8] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLibrary.map((ex) => {
              const isExpanded = expandedExerciseId === ex.id;
              return (
                <div
                  key={ex.id}
                  className="bg-[#F8FAFD] border border-slate-200/80 rounded-2xl p-4 sm:p-5 hover:bg-white hover:border-[#1A73E8]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{ex.name}</h4>
                        <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider">
                          {ex.targetMuscle}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {ex.equipment}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                      <div><strong>Synergists:</strong> {ex.synergists}</div>
                      <div><strong>Tempo:</strong> {ex.tempo} • <strong>Rest:</strong> {ex.restSeconds}s</div>
                    </div>

                    {/* Step-by-step Setup */}
                    <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-[#1A73E8]" /> Machine Setup:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        {ex.setupInstructions.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Key Mind-Muscle Cues */}
                    <div className="mt-2 space-y-1 text-xs text-slate-700">
                      <div className="font-bold text-[#34A853] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#34A853]" /> Form Cues:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                        {ex.formCues.map((cue, idx) => (
                          <li key={idx}>{cue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Alternative: {ex.beginnerAlternative}</span>
                    <button
                      type="button"
                      onClick={() => handleStartTimer(ex.restSeconds)}
                      className="inline-flex items-center gap-1 text-[#1A73E8] font-bold hover:underline"
                    >
                      <Timer className="w-3.5 h-3.5" /> Time Rest ({ex.restSeconds}s)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GYM REST INTERVAL TIMER */}
      {activeTab === 'timer' && (
        <div className="p-6 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Set Interval Timer</span>
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-1.5 rounded-full border transition-colors ${
                  audioEnabled ? 'bg-blue-50 text-[#1A73E8] border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title={audioEnabled ? 'Audio Chime Enabled' : 'Audio Chime Muted'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="text-slate-200 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="text-[#1A73E8] stroke-current transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={314.159}
                  strokeDashoffset={
                    initialSeconds > 0
                      ? 314.159 * (1 - timerSeconds / initialSeconds)
                      : 0
                  }
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                  {formatTime(timerSeconds)}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {isTimerRunning ? 'Resting...' : timerSeconds === 0 ? 'Set Ready!' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={() => handleStartTimer()}
                  className="px-6 py-2.5 rounded-full bg-[#1A73E8] text-white hover:bg-[#174EA6] font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Rest
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="px-6 py-2.5 rounded-full bg-[#EA4335] text-white hover:bg-rose-700 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Pause className="w-4 h-4 fill-white" /> Pause
                </button>
              )}
              <button
                type="button"
                onClick={handleResetTimer}
                className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={() => handleAddTimerSeconds(15)}
                className="px-3.5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-colors"
              >
                +15s
              </button>
            </div>

            {/* Rest Interval Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-bold">Presets:</span>
              {[
                { label: '30s (Pump)', sec: 30 },
                { label: '60s (Accessory)', sec: 60 },
                { label: '90s (Hypertrophy)', sec: 90 },
                { label: '120s (Heavy Compounds)', sec: 120 },
                { label: '180s (Max Strength)', sec: 180 },
              ].map((preset) => (
                <button
                  key={preset.sec}
                  type="button"
                  onClick={() => handleStartTimer(preset.sec)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    initialSeconds === preset.sec && !isTimerRunning
                      ? 'bg-[#E8F0FE] text-[#1A73E8] border-blue-200 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 1-REP MAX (1RM) & BARBELL PLATE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form & 1RM Result Card */}
            <div className="p-5 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">1-Rep Max (1RM) Estimator</h3>
                <p className="text-xs text-slate-500">Calculated via Brzycki & Epley scientific strength formulas</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Lifted Weight: <strong className="text-[#1A73E8]">{calcWeight} kg</strong>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="220"
                    step="2.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                    className="w-full accent-[#1A73E8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                    <span>20 kg</span>
                    <span>220 kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Reps to Near-Failure: <strong className="text-[#1A73E8]">{calcReps} reps</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={calcReps}
                    onChange={(e) => setCalcReps(parseInt(e.target.value))}
                    className="w-full accent-[#1A73E8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                    <span>1 rep</span>
                    <span>15 reps</span>
                  </div>
                </div>
              </div>

              {/* Big Estimated 1RM Callout */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated 1RM</span>
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {estimated1RM} <span className="text-sm font-bold text-slate-500">kg</span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono">
                  <div>Epley: <strong>{epley1RM} kg</strong></div>
                  <div>Brzycki: <strong>{brzycki1RM} kg</strong></div>
                </div>
              </div>

              {/* Barbell Weight Selection */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-600">Barbell Type:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBarbellWeight(20)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      barbellWeight === 20 ? 'bg-[#1A73E8] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Olympic 20 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarbellWeight(15)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      barbellWeight === 15 ? 'bg-[#1A73E8] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Women&apos;s 15 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarbellWeight(10)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      barbellWeight === 10 ? 'bg-[#1A73E8] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    EZ-Bar 10 kg
                  </button>
                </div>
              </div>
            </div>

            {/* Target Percentage Zones & Plate Loading Breakdown */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Training Zones & Plate Breakdown</h3>
                <span className="text-[11px] text-slate-500">Per side loading</span>
              </div>

              <div className="space-y-2">
                {loadZones.map((zone) => {
                  const plates = calculatePlatesPerSide(zone.weight);
                  return (
                    <div
                      key={zone.pct}
                      className="p-3 bg-[#F8FAFD] rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-10 font-bold text-[#1A73E8] font-mono text-sm">{zone.pct}%</span>
                        <div>
                          <div className="font-bold text-slate-800">{zone.label}</div>
                          <div className="text-[11px] text-slate-500">{zone.reps}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right">
                        <div className="text-sm font-black text-slate-900 font-mono">
                          {zone.weight} <span className="text-[10px] text-slate-500 font-normal">kg</span>
                        </div>
                        <div className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md">
                          {plates.platesUsed.length > 0
                            ? plates.platesUsed.map((p) => `${p.count}×${p.plate}kg`).join(' + ')
                            : 'Bar only'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WARMUP & GYM ETIQUETTE PROTOCOL */}
      {activeTab === 'warmup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3-Phase Dynamic Warmup Ladder */}
          <div className="p-5 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-slate-900">3-Phase Progressive Gym Warmup</h3>
            </div>
            <p className="text-xs text-slate-500">
              Science-based warm-up protocol to elevate core body temperature, lubricate synovial joints, and potentiate the central nervous system (CNS).
            </p>

            <div className="space-y-3 text-xs mt-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs mb-1">
                  Phase 1: General Aerobic Flush (3-5 mins)
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Incline treadmill walking (8-10% incline at 4.5 km/h) or stationary air bike until a light perspiration is reached. Raises muscle tissue elasticity.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs mb-1">
                  Phase 2: Dynamic Mobility & Activation (5 mins)
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                  <li>Arm Circles & Band Dislocates (15 reps)</li>
                  <li>World’s Greatest Stretch & Hip 90/90 rotations (6 per side)</li>
                  <li>Bodyweight Cossack Squats or Deep Squat Holds (45 seconds)</li>
                  <li>Band Pull-Aparts for rotator cuff & rear delt activation (20 reps)</li>
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs mb-1">
                  Phase 3: Specific Lift Ramp-Up Ladder
                </strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Before heavy working sets on your first compound movement:
                </p>
                <div className="mt-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 space-y-0.5">
                  <div>• Set 1: Empty Barbell × 10 reps (dial in motor pattern)</div>
                  <div>• Set 2: 50% Working Weight × 5 reps (smooth speed)</div>
                  <div>• Set 3: 75% Working Weight × 3 reps</div>
                  <div>• Set 4: 90% Working Weight × 1 rep (CNS primer)</div>
                  <div>• Rest 2 minutes → Begin Official Working Sets</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gym Etiquette & Safety Golden Rules */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#34A853]" />
              <h3 className="text-sm font-bold text-slate-900">Commercial Gym Etiquette & Safety Codes</h3>
            </div>
            <p className="text-xs text-slate-500">
              Essential gym rules for community respect, hygiene, and injury prevention.
            </p>

            <div className="space-y-2.5 text-xs mt-3">
              <div className="p-3 bg-[#F8FAFD] rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Always Re-Rack Your Weights & Dumbbells</strong>
                  <p className="text-slate-600 mt-0.5">
                    Return dumbbells to their designated numeric slot. Strip all 20kg/10kg plates off leg presses and barbells after finishing your sets.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFD] rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Use Safety Clamps & Catch Pins</strong>
                  <p className="text-slate-600 mt-0.5">
                    Never bench or squat without spring collars or barbell locks. Always position safety pins in the power rack at chest/parallel height.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFD] rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FBBC04] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Allow Others to &quot;Work In&quot; Between Sets</strong>
                  <p className="text-slate-600 mt-0.5">
                    If resting 2-3 minutes on a cable machine or squat rack, graciously let fellow gym members share sets during your rest intervals.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFD] rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Wipe Down Equipment & Bench Pads</strong>
                  <p className="text-slate-600 mt-0.5">
                    Use disinfectant spray or gym wipes to sanitize sweat off bench vinyl, handles, and cardio console displays after each exercise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
