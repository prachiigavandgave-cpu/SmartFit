import React, { useState } from 'react';
import { BmiCategory, Goal, FitnessLevel, WearableData } from '../types';
import { getExerciseRecommendations } from '../utils/recommendations';
import {
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  HeartPulse,
  Flame,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  bmiCategory: BmiCategory;
  goal: Goal;
  fitnessLevel: FitnessLevel;
  wearable: WearableData;
  onUpdateFitnessLevel: (level: FitnessLevel) => void;
}

export const WorkoutRecommendations: React.FC<Props> = ({
  bmiCategory,
  goal,
  fitnessLevel,
  wearable,
  onUpdateFitnessLevel,
}) => {
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  const workout = getExerciseRecommendations(
    bmiCategory,
    goal,
    fitnessLevel,
    wearable
  );

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = workout.exercises.filter((ex) => completedExercises[ex.id]).length;
  const isAllComplete = completedCount === workout.exercises.length && workout.exercises.length > 0;

  return (
    <div id="workout-recommendations-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-green-50 text-[#34A853] flex items-center justify-center font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Activity & Workout Guidance</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333]">
                {workout.intensity} Intensity
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized for {fitnessLevel} • {goal.toUpperCase()} • {workout.focusArea}
            </p>
          </div>
        </div>

        {/* Fitness level selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Level:</span>
          <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
            {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onUpdateFitnessLevel(level)}
                className={`px-3 py-1 rounded-full capitalize transition-all ${
                  fitnessLevel === level
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Alerts (Whoop low recovery or Step deficit) */}
      <div className="space-y-3 mb-6">
        {/* Recovery Override Notice */}
        {workout.recoveryStatus === 'fatigued' && (
          <div className="p-4 bg-[#FCE8E6] border border-[#FAD2CF] rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#C5221F] shrink-0 mt-0.5" />
            <div className="text-xs text-[#C5221F] leading-relaxed">
              <strong className="font-bold">Recovery Mode Active: </strong>
              {workout.coachNote}
            </div>
          </div>
        )}

        {/* Step Deficit Notice */}
        {workout.stepDeficitAlert && (
          <div className="p-4 bg-[#FEF7E0] border border-[#FEEFC3] rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#EA8600] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 leading-relaxed">
              <strong className="font-bold text-[#B06000]">Heart Points Target Alert: </strong>
              {workout.stepDeficitAlert}
            </div>
          </div>
        )}

        {/* Standard Coach Note if not fatigued */}
        {workout.recoveryStatus !== 'fatigued' && (
          <div className="p-4 bg-[#E8F0FE]/70 border border-[#D2E3FC] rounded-2xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 leading-relaxed">
              <strong className="font-bold text-[#1A73E8]">Today&apos;s Protocol ({workout.routineName}): </strong>
              {workout.coachNote}
            </div>
          </div>
        )}
      </div>

      {/* Progress tracker for today's session */}
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-slate-400" />
          <span>Completed: <strong className="text-slate-900">{completedCount} of {workout.exercises.length}</strong> movements</span>
        </div>
        {isAllComplete && (
          <span className="text-[#137333] font-bold flex items-center gap-1 bg-[#E6F4EA] px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" /> Routine Complete!
          </span>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {workout.exercises.map((ex, idx) => {
          const isDone = !!completedExercises[ex.id];
          return (
            <div
              key={ex.id}
              onClick={() => toggleExercise(ex.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-[#E6F4EA]/30 border-[#34A853]/40'
                  : 'bg-[#F8FAFD] border-slate-200/80 hover:bg-white hover:border-[#1A73E8]/40 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-[#34A853] text-white'
                      : 'border-2 border-slate-300 text-slate-400 bg-white'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {ex.name}
                    </h4>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      {ex.muscleGroup}
                    </span>
                    <span className="text-[10px] font-semibold bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded-full">
                      {ex.equipment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ex.tips}</p>
                </div>
              </div>

              {/* Sets / Reps Tag */}
              <div className="shrink-0 sm:text-right pl-9 sm:pl-0">
                <div className="text-xs font-black text-slate-800 font-mono">
                  {ex.sets} sets × {ex.repsOrDuration}
                </div>
                <div className="text-[10px] font-medium text-slate-400 capitalize">
                  {ex.category} • {ex.intensity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
