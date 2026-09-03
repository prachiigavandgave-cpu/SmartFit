import React, { useState } from 'react';
import { DailyTrendPoint } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  currentSteps: number;
  stepTarget: number;
  weightKg: number;
}

export const ActivityTrendChart: React.FC<Props> = ({
  currentSteps,
  stepTarget,
  weightKg,
}) => {
  const [metricView, setMetricView] = useState<'steps_vs_target' | 'calories_weight'>('steps_vs_target');

  // 7-day rolling data with currentSteps on Today
  const trendData: DailyTrendPoint[] = [
    { day: 'Mon', steps: 9240, target: stepTarget, caloriesBurned: Math.round(9240 * 0.045 * (weightKg / 70)), weightKg: weightKg + 0.4, activeMins: 42 },
    { day: 'Tue', steps: 11200, target: stepTarget, caloriesBurned: Math.round(11200 * 0.045 * (weightKg / 70)), weightKg: weightKg + 0.3, activeMins: 55 },
    { day: 'Wed', steps: 7850, target: stepTarget, caloriesBurned: Math.round(7850 * 0.045 * (weightKg / 70)), weightKg: weightKg + 0.2, activeMins: 35 },
    { day: 'Thu', steps: 10450, target: stepTarget, caloriesBurned: Math.round(10450 * 0.045 * (weightKg / 70)), weightKg: weightKg + 0.1, activeMins: 50 },
    { day: 'Fri', steps: 12100, target: stepTarget, caloriesBurned: Math.round(12100 * 0.045 * (weightKg / 70)), weightKg: weightKg, activeMins: 62 },
    { day: 'Sat', steps: 8900, target: stepTarget, caloriesBurned: Math.round(8900 * 0.045 * (weightKg / 70)), weightKg: weightKg - 0.1, activeMins: 44 },
    { day: 'Today', steps: currentSteps, target: stepTarget, caloriesBurned: Math.round(currentSteps * 0.045 * (weightKg / 70)), weightKg: weightKg, activeMins: 45 },
  ];

  const totalStepsThisWeek = trendData.reduce((acc, cur) => acc + cur.steps, 0);
  const avgSteps = Math.round(totalStepsThisWeek / trendData.length);
  const daysTargetHit = trendData.filter((d) => d.steps >= d.target).length;

  return (
    <div id="activity-trend-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1A73E8] flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Weekly Activity & Biometrics Trends</h2>
            <p className="text-xs text-slate-500">7-Day Rolling Steps, Active Burn & Weight Trajectory</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMetricView('steps_vs_target')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              metricView === 'steps_vs_target'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Steps vs Goal
          </button>
          <button
            type="button"
            onClick={() => setMetricView('calories_weight')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              metricView === 'calories_weight'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calories & Weight
          </button>
        </div>
      </div>

      {/* Quick stats pills */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">7-Day Average</span>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
            {avgSteps.toLocaleString()}
            <span className="text-xs font-medium text-slate-500 ml-1">steps/day</span>
          </div>
        </div>
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Days Goal Met</span>
          <div className="text-xl font-black text-[#137333] font-mono mt-0.5">
            {daysTargetHit} / 7
            <span className="text-xs font-medium text-slate-500 ml-1">days</span>
          </div>
        </div>
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Distance</span>
          <div className="text-xl font-black text-[#1A73E8] font-mono mt-0.5">
            {((totalStepsThisWeek * 0.000762)).toFixed(1)}
            <span className="text-xs font-medium text-slate-500 ml-1">km</span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'steps_vs_target' ? (
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#202124',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toLocaleString()} ${name === 'steps' ? 'steps' : ''}`,
                  name === 'steps' ? 'Daily Steps' : name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(val) => (val === 'steps' ? 'Daily Steps' : 'Step Goal')}
              />
              <ReferenceLine y={stepTarget} stroke="#FBBC04" strokeDasharray="3 3" strokeWidth={2} label={{ value: `Goal (${stepTarget.toLocaleString()})`, fill: '#B06000', fontSize: 10, position: 'insideTopRight' }} />
              <Bar dataKey="steps" fill="#1A73E8" radius={[8, 8, 0, 0]} barSize={28} />
            </ComposedChart>
          ) : (
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="cal" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="wt" orientation="right" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#202124',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="cal" dataKey="caloriesBurned" name="Step Burn (kcal)" fill="#EA4335" radius={[8, 8, 0, 0]} barSize={26} />
              <Line yAxisId="wt" type="monotone" dataKey="weightKg" name="Body Weight (kg)" stroke="#34A853" strokeWidth={3} dot={{ r: 4, fill: '#34A853' }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
