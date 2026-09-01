import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  Target,
  BarChart3,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { progressService } from '../services/progressService';

export const ProgressPage = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      const res = await progressService.getProgress();
      setData(res);
    };
    loadProgress();
  }, []);

  if (!data) return null;

  const maxHours = Math.max(...data.weeklyStudyHours.map(d => d.hours), 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="Progress Tracking & Analytics"
          subtitle="Visualize retention rates, study streaks, and pinpoint weak topics before exams"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Quiz Average</span>
                <HelpCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold font-display text-emerald-400">
                {data.quizAverage}%
              </div>
              <p className="text-[11px] text-slate-400">+4% higher than last week</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Quizzes Taken</span>
                <Award className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-bold font-display text-white">
                {data.totalQuizzes}
              </div>
              <p className="text-[11px] text-slate-400">Across 6 different courses</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Completed Topics</span>
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold font-display text-white">
                {data.completedTopics}
              </div>
              <p className="text-[11px] text-slate-400">8 currently in progress</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Study Hours</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-bold font-display text-white">
                {data.studyHours}h
              </div>
              <p className="text-[11px] text-slate-400">Target: 20 hrs / week</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-2 bg-amber-500/5">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span className="font-semibold uppercase tracking-wider">Current Streak</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold font-display text-amber-400">
                {data.streak} Days 🔥
              </div>
              <p className="text-[11px] text-amber-200/80">Keep it going today!</p>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Weekly Study Hours Bar Graph */}
            <div className="glass-dropdown p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Weekly Study Hours</h3>
                  <p className="text-xs text-slate-400">Target: 3.5 hrs daily</p>
                </div>
                <span className="text-xs font-bold text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-full">
                  Total: 24.6 hrs
                </span>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
                {data.weeklyStudyHours.map((d, i) => {
                  const heightPercent = Math.round((d.hours / maxHours) * 100);
                  const isExceeded = d.hours >= d.target;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded shadow">
                        {d.hours}h
                      </div>
                      <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl h-36 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isExceeded
                              ? 'bg-gradient-to-t from-brand-600 to-accent-500 group-hover:from-brand-500 group-hover:to-accent-400'
                              : 'bg-slate-700'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-white">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500" /> Met or Exceeded Daily Target</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600" /> Below Goal</span>
              </div>
            </div>

            {/* Chart 2: Quiz Score Trajectory */}
            <div className="glass-dropdown p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Quiz Score Trend</h3>
                  <p className="text-xs text-slate-400">Performance across recent test attempts</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Avg: {data.quizAverage}%
                </span>
              </div>

              {/* Visual Trajectory Representation */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
                {data.quizHistory.map((q, i) => {
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded shadow">
                        {q.score}%
                      </div>
                      <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl h-36 flex items-end overflow-hidden">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-500"
                          style={{ height: `${q.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-white">
                        {q.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Lowest: 72% (Calculus)</span>
                <span>Highest: 95% (Algorithms)</span>
              </div>
            </div>

          </div>

          {/* Topic Mastery & Weak Topics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Topic Mastery Distribution */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold font-display text-white">Subject Mastery Levels</h3>
              
              <div className="space-y-4 pt-2">
                {data.topicMastery.map((tm, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{tm.topic}</span>
                      <span className="font-bold" style={{ color: tm.color }}>{tm.level} ({tm.score}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${tm.score}%`, backgroundColor: tm.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topics & AI Action Recommendations */}
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-4 bg-rose-950/10">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Weak Topics Requiring Attention</span>
              </div>

              <div className="space-y-3">
                {data.weakTopics.map((wt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          {wt.accuracy} Accuracy
                        </span>
                        <span className="text-xs text-slate-400">{wt.subject}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{wt.topic}</h4>
                      <p className="text-[11px] text-slate-400">{wt.recommendation}</p>
                    </div>

                    <Link
                      to="/quiz"
                      state={{ fromNote: { subject: wt.subject, topic: wt.topic } }}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 self-end sm:self-center flex-shrink-0"
                    >
                      <span>Practice Now</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Achievement Badges Section */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-white">Study Badges & Achievements</h3>
                <p className="text-xs text-slate-400">Unlock awards by maintaining streaks and scoring high</p>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full">
                4 of 6 Unlocked 🏆
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {data.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border text-center space-y-2 flex flex-col justify-between ${
                    b.earned
                      ? 'bg-slate-900 border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950/40 border-white/5 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl">{b.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">{b.desc}</p>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400 bg-white/5 py-0.5 rounded">
                    {b.earned ? b.date : b.progress}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
