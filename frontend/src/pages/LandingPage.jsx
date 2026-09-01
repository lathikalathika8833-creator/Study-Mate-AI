import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquareText, 
  BookOpenCheck, 
  HelpCircle, 
  Layers, 
  CalendarCheck, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  Zap, 
  ShieldCheck, 
  GraduationCap, 
  Flame, 
  Clock, 
  Brain,
  ChevronRight,
  Play
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const features = [
    {
      id: 'chat',
      title: 'AI Study Chat',
      icon: MessageSquareText,
      tag: 'Personal 24/7 Tutor',
      description: 'Stuck on a tricky concept? Your AI Tutor breaks down complex calculus, code, or science step-by-step with real-world analogies.',
      points: ['Socratic step-by-step guidance', 'Instant code & formula explanations', 'Exam cheat-sheet generation']
    },
    {
      id: 'notes',
      title: 'Smart Notes & Summarizer',
      icon: BookOpenCheck,
      tag: 'High-Yield Retention',
      description: 'Paste your lecture slides or messy class notes. Get condensed executive summaries, key terms, and high-probability exam points.',
      points: ['Instant bullet point takeaways', 'Automated key definitions glossary', '1-click convert to Flashcards']
    },
    {
      id: 'quiz',
      title: 'AI Quiz Generator',
      icon: HelpCircle,
      tag: 'Active Recall',
      description: 'Generate customized practice exams by topic and difficulty in seconds. Test yourself with instant scoring and thorough explanations.',
      points: ['Custom difficulty (Easy to Hard)', 'One-at-a-time focus mode', 'Comprehensive answer explanations']
    },
    {
      id: 'flashcards',
      title: 'Active Recall Flashcards',
      icon: Layers,
      tag: 'Spaced Repetition',
      description: 'Master terminology and mechanisms with interactive 3D flip cards. Track mastered concepts vs items that need review.',
      points: ['3D flip card animations', 'Deck categorization by subject', 'Shuffle & Mastery tracking']
    },
    {
      id: 'planner',
      title: 'AI Study Planner',
      icon: CalendarCheck,
      tag: 'Exam Timetable',
      description: 'Enter your exam date and daily available hours. The AI builds a realistic schedule with balanced study blocks, revisions, and breaks.',
      points: ['Adaptive weekly timetable', 'Integrated rest breaks & review sessions', 'Interactive daily progress checklists']
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      icon: TrendingUp,
      tag: 'Mastery Analytics',
      description: 'Visualize your quiz performance trends, study streaks, and pinpoint weak topics before exam day arrives.',
      points: ['Visual quiz score trajectories', 'Weekly study hours distribution', 'Weak topic identification & remedy']
    }
  ];

  const stats = [
    { label: 'Grade Improvement', value: '+1.4 GPA', sub: 'Average student boost' },
    { label: 'Hours Saved Weekly', value: '8.5 hrs', sub: 'On note summarization' },
    { label: 'Quizzes Generated', value: '250,000+', sub: 'Across 40+ subjects' },
    { label: 'Active Study Streaks', value: '94%', sub: 'Exam readiness score' },
  ];

  const testimonials = [
    {
      quote: "StudyMate AI turned my 60-page Operating Systems textbook into concise flashcards and practice quizzes in under 2 minutes. Scored an A on my midterm!",
      author: "Maya Lin",
      college: "UC Berkeley",
      major: "Computer Science",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "The AI Tutor explaining Calculus Lagrange multipliers with 3D analogies helped me finally understand what my professor couldn't explain in 3 weeks.",
      author: "David Chen",
      college: "Georgia Tech",
      major: "Mechanical Engineering",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "The personalized study planner took away all my pre-finals panic. Having a structured daily schedule with built-in revision blocks is a superpower.",
      author: "Sarah Jenkins",
      college: "University of Michigan",
      major: "Pre-Med & Biology",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-radial-glow">
        
        {/* Subtle Decorative Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold animate-fade-in shadow-inner">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>Next-Gen College AI Study Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-ping" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
              Your Personal <br />
              <span className="text-gradient">AI Study Companion</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Understand difficult college topics, summarize messy lecture notes, generate instant AI quizzes, flip smart flashcards, and ace your exams with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-base shadow-xl shadow-brand-600/35 hover:shadow-brand-600/55 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Start Studying Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-200 hover:text-white font-semibold text-base border-white/10 hover:border-brand-500/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Student Login</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Powered by Gemini AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant 1-Click Demo Available</span>
              </div>
            </div>

          </div>

          {/* Interactive Live App Preview Banner */}
          <div className="mt-14 sm:mt-20 max-w-5xl mx-auto rounded-3xl p-2 sm:p-4 glass-panel-glow border border-brand-500/30 shadow-2xl relative">
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative">
              
              {/* Fake Window Controls */}
              <div className="px-4 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">app.studymate.ai/dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-300">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> 7-Day Streak</span>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="hidden sm:inline text-slate-300">Alex Rivera (Stanford)</span>
                </div>
              </div>

              {/* Preview Dashboard Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Left Card: AI Tutor Quick Chat */}
                <div className="md:col-span-2 rounded-2xl bg-slate-950/60 p-5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-600/30 text-brand-400 flex items-center justify-center">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">AI Study Buddy (Socratic Mode)</div>
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online & Ready
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">Java OOP & OS</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/70 text-slate-200 max-w-[85%]">
                      "Why does Java prevent multiple inheritance with classes but allows it with interfaces?"
                    </div>
                    <div className="p-3 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-100 max-w-[95%] ml-auto space-y-2">
                      <div className="font-semibold text-brand-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent-400" /> StudyMate AI Tutor:
                      </div>
                      <p>
                        To eliminate the <strong>Diamond Problem</strong>! When two parent classes define the same method body, a child class wouldn't know which implementation to execute. Interfaces provide method contracts without conflicting instance states.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Card: Quick Quiz & Active Recall */}
                <div className="rounded-2xl bg-slate-950/60 p-5 border border-white/5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Today's Quick Quiz</div>
                    <h4 className="text-sm font-bold text-white mb-3">Operating Systems: Deadlock Conditions</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                        <span>A) No Preemption</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 text-slate-400">
                        <span>B) Unbounded Buffer</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 text-slate-400">
                        <span>C) Starvation Avoidance</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold text-center transition-colors shadow-lg shadow-brand-600/30"
                  >
                    Open Full StudyMate App →
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl glass-panel space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  <span className="text-gradient">{st.value}</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">{st.label}</div>
                <div className="text-xs text-slate-400">{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="text-xs uppercase font-bold tracking-widest text-brand-400">
            Engineered For Higher Grades
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Everything You Need To <span className="text-gradient">Dominate Finals</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Replace 6 scattered apps with one intelligent AI platform built specifically for college course workloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-3xl p-6 sm:p-8 glass-panel hover:glass-panel-glow hover:-translate-y-1 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600/30 to-accent-600/30 border border-brand-500/30 flex items-center justify-center text-brand-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-300">
                  {feat.points.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Interactive Tabs */}
      <section id="how-it-works" className="py-20 bg-slate-900/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              How <span className="text-gradient">StudyMate AI</span> Accelerates Learning
            </h2>
            <p className="text-slate-400 text-sm">
              From confusing lecture slides to exam mastery in 3 automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 font-bold font-display text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Input Notes or Topic</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste lecture transcripts, textbook chapters, or just type in any subject (e.g. "Java OOP Polymorphism").
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/20 text-accent-400 font-bold font-display text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI Extracts & Generates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini AI condenses key principles, creates active recall flashcards, and builds custom exam quizzes with explanations.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold font-display text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Practice & Master</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take quizzes, track weak points, follow your structured timetable, and hit your target GPA with less stress.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="text-xs uppercase font-bold tracking-widest text-accent-400">
            Loved By College Students
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Real Results From <span className="text-gradient">Real Students</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">{t.author}</div>
                  <div className="text-xs text-slate-400">{t.major} • {t.college}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-brand-900/90 via-indigo-900/80 to-accent-950/90 border border-brand-500/40 text-center space-y-6 shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto shadow-inner">
              <GraduationCap className="w-8 h-8 text-brand-300" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight max-w-xl mx-auto">
              Ready to Upgrade Your Study Game?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
              Join thousands of students who study smarter, retain more, and crush exams with StudyMate AI.
            </p>

            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Get Started in 30 Seconds</span>
                <ArrowRight className="w-5 h-5 text-brand-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">StudyMate AI</span>
            <span>— The College Student AI Assistant</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">App Dashboard</Link>
          </div>

          <div>
            © {new Date().getFullYear()} StudyMate AI. Built for students worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
};
