import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Play, 
  Layers, 
  ChevronRight, 
  Plus, 
  Award,
  Zap,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { notesService } from '../services/notesService';
import { quizService } from '../services/quizService';
import { flashcardsService } from '../services/flashcardsService';
import { plannerService } from '../services/plannerService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [fetchedNotes, fetchedQuizzes, fetchedPlans] = await Promise.all([
        notesService.getNotes(),
        quizService.getQuizzes(),
        plannerService.getStudyPlans()
      ]);
      setNotes(fetchedNotes || []);
      setQuizzes(fetchedQuizzes || []);
      if (fetchedPlans && fetchedPlans.length > 0) {
        setStudyPlan(fetchedPlans[0]);
      }
    };
    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Study Streak",
      value: `${user?.streak || 7} Days`,
      sub: "Personal best: 14 days",
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      badge: "+1 Day Today"
    },
    {
      title: "Topics Completed",
      value: `${user?.topicsCompleted || 24}`,
      sub: "8 topics in progress",
      icon: BookOpen,
      color: "from-brand-500/20 to-indigo-500/20 text-brand-400 border-brand-500/30",
      badge: "Level 4 Scholar"
    },
    {
      title: "Quiz Average",
      value: `${user?.quizAverage || 89}%`,
      sub: "Based on last 12 quizzes",
      icon: HelpCircle,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      badge: "Top 5% Student"
    },
    {
      title: "Study Hours",
      value: `${user?.studyHoursThisWeek || 16.5} hrs`,
      sub: "This week's active time",
      icon: Clock,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
      badge: "On Target"
    },
    {
      title: "Today's Goal",
      value: `${user?.todayStudiedHours || 2.75} / ${user?.dailyGoalHours || 3.5} hrs`,
      sub: "78% completed today",
      icon: Target,
      color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
      progress: 78
    }
  ];

  const continueItems = [
    {
      subject: "Computer Science",
      topic: "Java OOP: Polymorphism & Method Dispatch",
      progress: 70,
      type: "Note & Practice",
      link: "/notes",
      color: "bg-indigo-500"
    },
    {
      subject: "Operating Systems",
      topic: "Coffman Conditions & Deadlock Avoidance",
      progress: 45,
      type: "Quiz Ready",
      link: "/quiz",
      color: "bg-emerald-500"
    },
    {
      subject: "Data Structures",
      topic: "Red-Black Tree Self-Balancing Rotations",
      progress: 85,
      type: "Flashcard Deck",
      link: "/flashcards",
      color: "bg-amber-500"
    }
  ];

  const recommendedTopics = [
    {
      topic: "Banker's Algorithm Matrix Calculation",
      subject: "Operating Systems",
      reason: "Midterm exam is in 15 days",
      difficulty: "Hard",
      action: "Take Quiz",
      link: "/quiz"
    },
    {
      topic: "Lagrange Multipliers Constrained Extremas",
      subject: "Calculus III",
      reason: "Identified as a weak topic (58% accuracy)",
      difficulty: "Medium",
      action: "Review Note",
      link: "/notes"
    },
    {
      topic: "Graph Shortest Path (Dijkstra vs A*)",
      subject: "Algorithms",
      reason: "Popular exam question topic",
      difficulty: "Medium",
      action: "Flashcards",
      link: "/flashcards"
    }
  ];

  const recentActivities = [
    {
      title: "Scored 92% on Java OOP Quiz",
      time: "2 hours ago",
      icon: HelpCircle,
      color: "text-emerald-400 bg-emerald-500/10"
    },
    {
      title: "Summarized note: Operating Systems Deadlocks",
      time: "5 hours ago",
      icon: BookOpen,
      color: "text-brand-400 bg-brand-500/10"
    },
    {
      title: "Completed 20 Flashcards: Data Structures",
      time: "Yesterday at 9:30 PM",
      icon: Layers,
      color: "text-purple-400 bg-purple-500/10"
    },
    {
      title: "Generated New AI Study Timetable for Finals",
      time: "2 days ago",
      icon: Calendar,
      color: "text-amber-400 bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="Student Dashboard"
          subtitle="Your personal daily learning overview and active tasks"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-950/80 via-slate-900 to-accent-950/70 border border-brand-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Daily Motivation</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Scholar'}! 🚀
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                You're on a <strong className="text-amber-300">{user?.streak || 7}-day streak</strong>! Complete your Operating Systems review today to hit your 100% daily milestone.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 z-10 w-full sm:w-auto">
              <Link
                to="/chat"
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </Link>
              <Link
                to="/quiz"
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Quick Quiz</span>
              </Link>
            </div>

            {/* Ambient Glow */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* 5 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{st.title}</span>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${st.color} border flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold font-display text-white tracking-tight">
                      {st.value}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{st.sub}</div>
                  </div>

                  {st.progress !== undefined ? (
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${st.progress}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded-md self-start">
                      {st.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Grid: Continue Studying + Upcoming Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Continue Studying (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Continue Studying</h3>
                  <p className="text-xs text-slate-400">Pick up right where you left off</p>
                </div>
                <Link to="/notes" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  <span>View All Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {continueItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-brand-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {item.subject}
                        </span>
                        <span className="text-xs text-slate-400">• {item.type}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                        {item.topic}
                      </h4>
                      <div className="w-full max-w-xs bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={item.link}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 self-end sm:self-center shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Recommended Topics */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-400" />
                      <span>AI Recommended Topics</span>
                    </h3>
                    <p className="text-xs text-slate-400">Targeted review based on your performance data</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedTopics.map((rec, i) => (
                    <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-accent-300 bg-accent-500/10 px-2 py-0.5 rounded-md">
                          {rec.subject}
                        </span>
                        <h5 className="text-xs font-bold text-white line-clamp-2 pt-1">{rec.topic}</h5>
                        <p className="text-[11px] text-slate-400">{rec.reason}</p>
                      </div>

                      <Link
                        to={rec.link}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-xs font-semibold text-center text-slate-200 hover:text-white transition-colors"
                      >
                        {rec.action} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Upcoming Schedule & Recent Activity */}
            <div className="space-y-6">
              
              {/* Upcoming Study Plan */}
              <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-bold text-white">Today's Study Schedule</h3>
                  </div>
                  <Link to="/planner" className="text-xs text-brand-400 hover:text-brand-300">
                    Full Timetable →
                  </Link>
                </div>

                <div className="space-y-3 text-xs">
                  {studyPlan && studyPlan.days && studyPlan.days[0] ? (
                    studyPlan.days[0].blocks.map((b, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-2 ${
                          b.completed
                            ? 'bg-slate-900/40 border-white/5 opacity-70'
                            : 'bg-slate-800/70 border-brand-500/30'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">{b.time}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">
                              {b.type}
                            </span>
                          </div>
                          <div className={`font-semibold ${b.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {b.topic}
                          </div>
                        </div>
                        {b.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      No schedule for today. <Link to="/planner" className="text-brand-400 underline">Generate one</Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/planner"
                  className="block w-full text-center py-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 text-xs font-bold transition-all"
                >
                  Manage Study Timetable
                </Link>
              </div>

              {/* Recent Activity Timeline */}
              <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Recent Activity</h3>
                  <Link to="/progress" className="text-xs text-slate-400 hover:text-white">
                    Analytics →
                  </Link>
                </div>

                <div className="space-y-3 text-xs">
                  {recentActivities.map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${act.color} flex-shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200">{act.title}</p>
                          <span className="text-[10px] text-slate-400">{act.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
