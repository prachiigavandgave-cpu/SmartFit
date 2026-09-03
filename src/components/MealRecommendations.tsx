import React, { useState } from 'react';
import { BmiCategory, Goal, NutrientTargets } from '../types';
import { getRecommendedMeals } from '../utils/recommendations';
import { Utensils, RefreshCw, Sparkles, Flame, Dumbbell, Tag, Check } from 'lucide-react';

interface Props {
  bmiCategory: BmiCategory;
  goal: Goal;
  targets: NutrientTargets;
}

export const MealRecommendations: React.FC<Props> = ({
  bmiCategory,
  goal,
  targets,
}) => {
  const [swapSeeds, setSwapSeeds] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  });

  const [activeTab, setActiveTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');

  const recommendation = getRecommendedMeals(bmiCategory, goal, swapSeeds);

  const handleSwap = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSwapSeeds((prev) => ({
      ...prev,
      [mealType]: prev[mealType] + 1,
    }));
  };

  const meals = [
    { type: 'breakfast' as const, data: recommendation.breakfast, label: 'Breakfast' },
    { type: 'lunch' as const, data: recommendation.lunch, label: 'Lunch' },
    { type: 'dinner' as const, data: recommendation.dinner, label: 'Dinner' },
    { type: 'snack' as const, data: recommendation.snack, label: 'Daily Snack' },
  ];

  const filteredMeals = activeTab === 'all' ? meals : meals.filter((m) => m.type === activeTab);

  return (
    <div id="food-recommendations-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#EA8600] flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Nutrition & Meal Guidance</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF7E0] text-[#B06000]">
                Google Fit Smart Match
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized meal plans matched to your {bmiCategory} BMI profile & {goal === 'lose' ? 'fat loss' : goal === 'gain' ? 'muscle gain' : 'maintenance'} goal
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
          {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1 rounded-full capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Coach Insight Banner */}
      <div className="mb-6 p-4 bg-[#FEF7E0]/70 rounded-2xl border border-[#FEEFC3] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#EA8600] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-800 leading-relaxed">
          <strong className="font-bold text-[#B06000]">Nutrition Engine Strategy: </strong>
          {recommendation.coachInsight} Total plan delivers{' '}
          <strong className="font-bold text-slate-900">{recommendation.totalCalories} kcal</strong> and{' '}
          <strong className="font-bold text-slate-900">{recommendation.totalProtein}g protein</strong> (Target:{' '}
          {targets.dailyCalories} kcal / {targets.protein.grams}g protein).
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeals.map(({ type, data, label }) => (
          <div
            key={type}
            className="p-5 rounded-2xl border border-slate-200/80 bg-[#F8FAFD] hover:bg-white hover:border-[#1A73E8]/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with badge and Swap button */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => handleSwap(type)}
                  className="text-[11px] font-semibold text-[#1A73E8] hover:text-[#174EA6] flex items-center gap-1 bg-[#E8F0FE] hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Swap
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{data.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{data.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutrition Bar */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-900 font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>{data.calories} kcal</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-[11px] font-mono">
                <span className="text-[#1A73E8] font-bold">{data.proteinGrams}g P</span>
                <span className="text-[#34A853] font-bold">{data.carbsGrams}g C</span>
                <span className="text-[#EA8600] font-bold">{data.fatGrams}g F</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
