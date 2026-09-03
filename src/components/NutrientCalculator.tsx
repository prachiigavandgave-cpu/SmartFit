import React, { useState } from 'react';
import { NutrientTargets, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, Droplets, Plus, RotateCcw, Bell, Check } from 'lucide-react';

interface Props {
  targets: NutrientTargets;
  profile: UserProfile;
}

export const NutrientCalculator: React.FC<Props> = ({ targets, profile }) => {
  const [glassesLogged, setGlassesLogged] = useState(4);
  const [reminderActive, setReminderActive] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const chartData = [
    {
      name: 'Protein',
      value: targets.protein.grams,
      calories: targets.protein.calories,
      percentage: targets.protein.percentage,
      color: '#4285F4', // Google Blue
    },
    {
      name: 'Carbohydrates',
      value: targets.carbs.grams,
      calories: targets.carbs.calories,
      percentage: targets.carbs.percentage,
      color: '#34A853', // Google Green
    },
    {
      name: 'Healthy Fats',
      value: targets.fats.grams,
      calories: targets.fats.calories,
      percentage: targets.fats.percentage,
      color: '#FBBC04', // Google Yellow
    },
  ];

  const handleAddGlass = () => {
    setGlassesLogged((prev) => prev + 1);
  };

  const handleResetGlasses = () => {
    setGlassesLogged(0);
  };

  const handleToggleReminder = () => {
    const next = !reminderActive;
    setReminderActive(next);
    if (next) {
      setNotificationMsg('Hourly hydration alert set! Keep a water bottle within reach.');
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  const currentWaterMl = glassesLogged * 250;
  const waterProgress = Math.min(100, Math.round((currentWaterMl / targets.waterMl) * 100));

  return (
    <div id="nutrient-calculator-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Macronutrients & Hydration</h2>
            <p className="text-xs text-slate-500">
              Calibrated for {profile.goal === 'lose' ? 'Fat Loss' : profile.goal === 'gain' ? 'Hypertrophy' : 'Weight Maintenance'} ({targets.dailyCalories.toLocaleString()} kcal)
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1 bg-[#F8FAFD] border border-slate-200 text-slate-700 rounded-full">
          Target: {targets.dailyCalories.toLocaleString()} kcal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Donut Pie Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}g (${item.payload.calories} kcal, ${item.payload.percentage}%)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {targets.dailyCalories.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">kcal target</span>
            </div>
          </div>

          {/* Google Fit quick legend */}
          <div className="flex items-center justify-center gap-3.5 text-xs font-semibold mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="text-slate-600">Protein ({targets.protein.percentage}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
              <span className="text-slate-600">Carbs ({targets.carbs.percentage}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
              <span className="text-slate-600">Fats ({targets.fats.percentage}%)</span>
            </div>
          </div>
        </div>

        {/* Right: Numeric Cards Breakdown */}
        <div className="lg:col-span-7 space-y-3">
          {/* Protein Target */}
          <div className="p-3.5 bg-[#F8FAFD] rounded-2xl border border-[#E8F0FE] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                <span className="text-xs font-bold text-slate-900">Protein Intake</span>
                <span className="text-[10px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
                  {profile.goal === 'gain' ? '2.0 g/kg (Muscle Surplus)' : profile.goal === 'lose' ? '1.8 g/kg (Deficit Shield)' : '1.2 g/kg'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Essential for muscle repair, nitrogen balance & satiety</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900 font-mono">{targets.protein.grams}g</span>
              <div className="text-[10px] font-semibold text-slate-400">{targets.protein.calories} kcal</div>
            </div>
          </div>

          {/* Carbs Target */}
          <div className="p-3.5 bg-[#F8FAFD] rounded-2xl border border-[#E6F4EA] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                <span className="text-xs font-bold text-slate-900">Carbohydrates</span>
                <span className="text-[10px] font-bold text-[#34A853] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                  {targets.carbs.percentage}% of calories (45–65% standard)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Glycogen resynthesis for brain, training output & recovery</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900 font-mono">{targets.carbs.grams}g</span>
              <div className="text-[10px] font-semibold text-slate-400">{targets.carbs.calories} kcal</div>
            </div>
          </div>

          {/* Healthy Fats Target */}
          <div className="p-3.5 bg-[#F8FAFD] rounded-2xl border border-[#FEF7E0] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
                <span className="text-xs font-bold text-slate-900">Healthy Fats</span>
                <span className="text-[10px] font-bold text-[#EA8600] bg-[#FEF7E0] px-2 py-0.5 rounded-full">
                  25% of calories (20–35% standard)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Endocrine hormone synthesis and cellular membrane integrity</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900 font-mono">{targets.fats.grams}g</span>
              <div className="text-[10px] font-semibold text-slate-400">{targets.fats.calories} kcal</div>
            </div>
          </div>

          {/* Hydration / Water Intake */}
          <div className="p-3.5 bg-[#F0F7FF] rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#1A73E8]" />
                <span className="text-xs font-bold text-slate-900">Hydration Goal</span>
                <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-100/70 px-2 py-0.5 rounded-full">
                  33 ml/kg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="water-reminder-btn"
                  onClick={handleToggleReminder}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                    reminderActive
                      ? 'bg-[#1A73E8] text-white shadow-2xs'
                      : 'bg-white text-[#1A73E8] border border-blue-200 hover:bg-blue-50'
                  }`}
                  title="Hourly hydration reminder"
                >
                  <Bell className="w-3 h-3" />
                  {reminderActive ? 'Reminder On' : 'Set Reminder'}
                </button>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 font-mono">
                    {(targets.waterMl / 1000).toFixed(1)} L
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">({targets.waterGlasses} glasses)</span>
                </div>
              </div>
            </div>

            {/* Interactive water logging bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span>
                  Logged today: <strong className="text-[#1A73E8]">{currentWaterMl} ml</strong> ({glassesLogged}/{targets.waterGlasses} glasses)
                </span>
                <span className="font-bold text-slate-700">{waterProgress}%</span>
              </div>
              <div className="w-full bg-blue-100/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#1A73E8] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${waterProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="log-water-glass-btn"
                  onClick={handleAddGlass}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#1A73E8] hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> +1 Glass (250 ml)
                </button>
                {glassesLogged > 0 && (
                  <button
                    type="button"
                    onClick={handleResetGlasses}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
            </div>

            {notificationMsg && (
              <div className="mt-2 text-xs font-semibold text-emerald-800 bg-[#E6F4EA] px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#34A853]" />
                {notificationMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
