import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  Trash2, 
  BookOpen, 
  Coffee, 
  Award, 
  CheckSquare, 
  Square,
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { plannerService } from '../services/plannerService';
import { aiService } from '../services/aiService';

export const PlannerPage = () => {
  const { success, error, info } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Generator Modal State
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [examDate, setExamDate] = useState('2026-09-15');
  const [subjectsInput, setSubjectsInput] = useState('Java OOP, Operating Systems, Calculus III');
  const [dailyHours, setDailyHours] = useState(3.5);
  const [preferredDays, setPreferredDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      const data = await plannerService.getStudyPlans();
      setPlans(data || []);
      if (data && data.length > 0) {
        setActivePlanId(data[0].id);
      }
    };
    loadPlans();
  }, []);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
  const activeDay = activePlan?.days?.[selectedDayIndex] || activePlan?.days?.[0];

  const handleToggleBlock = async (blockId, currentCompleted) => {
    if (!activePlan) return;
    const updated = await plannerService.toggleBlockCompletion(
      activePlan.id,
      selectedDayIndex,
      blockId,
      !currentCompleted
    );
    setPlans(plans.map(p => p.id === activePlan.id ? updated : p));
    if (!currentCompleted) {
      success("Session completed! +25 XP earned 🔥");
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!subjectsInput.trim()) {
      error("Please list your subjects or topics.");
      return;
    }
    setGenerating(true);
    try {
      const subjectsArray = subjectsInput.split(',').map(s => s.trim()).filter(Boolean);
      const newPlan = await aiService.generateStudyPlan({
        examDate,
        subjects: subjectsArray,
        dailyHours: Number(dailyHours),
        preferredDays
      });
      await plannerService.saveStudyPlan(newPlan);
      setPlans([newPlan, ...plans]);
      setActivePlanId(newPlan.id);
      setSelectedDayIndex(0);
      setGenModalOpen(false);
      success("✨ AI Study Plan created successfully!");
    } catch (err) {
      error("Failed to generate plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this study plan?")) {
      await plannerService.deleteStudyPlan(id);
      const remaining = plans.filter(p => p.id !== id);
      setPlans(remaining);
      if (remaining.length > 0) {
        setActivePlanId(remaining[0].id);
      }
      info("Study plan deleted.");
    }
  };

  // Calculate completion percentage of current day
  const totalBlocks = activeDay?.blocks?.length || 0;
  const completedBlocks = activeDay?.blocks?.filter(b => b.completed).length || 0;
  const dayProgress = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="AI Intelligent Study Planner"
          subtitle="Realistic, automated revision schedules with balanced breaks & exam prep"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Top Bar: Plan Switcher & Generate CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Plan selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {plans.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePlanId(p.id);
                    setSelectedDayIndex(0);
                  }}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                    p.id === activePlan?.id
                      ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30'
                      : 'glass-panel border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{p.title}</span>
                  {plans.length > 1 && (
                    <button
                      onClick={(e) => handleDeletePlan(p.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-300 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => setGenModalOpen(true)}
              icon={Sparkles}
              size="sm"
              className="shadow-lg shadow-brand-600/30"
            >
              Generate AI Schedule
            </Button>

          </div>

          {/* Active Study Plan Overview */}
          {activePlan ? (
            <div className="space-y-6">
              
              {/* Plan Metadata Hero Card */}
              <div className="glass-panel p-6 rounded-3xl border border-brand-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-brand-950/60 via-slate-900 to-accent-950/40">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Target Exam: {activePlan.examDate}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {activePlan.dailyHours} hrs / day
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {activePlan.title}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activePlan.subjects?.map((sub, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Day Progress Ring / Bar */}
                <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-white/10 w-full sm:w-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Today's Schedule Progress</span>
                    <div className="text-lg font-bold text-white">
                      {completedBlocks} / {totalBlocks} Sessions ({dayProgress}%)
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center relative flex-shrink-0">
                    <span className="text-xs font-bold text-brand-400">{dayProgress}%</span>
                  </div>
                </div>
              </div>

              {/* Day Selection Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {activePlan.days?.map((day, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => setSelectedDayIndex(dIdx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedDayIndex === dIdx
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-500 shadow-md'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>{day.dayName}</div>
                    <div className="text-[10px] opacity-70 font-normal">{day.date}</div>
                  </button>
                ))}
              </div>

              {/* Day's Time Blocks & Sessions */}
              <div className="space-y-3">
                <h3 className="text-base font-bold font-display text-white">
                  Schedule for {activeDay?.dayName} ({activeDay?.date})
                </h3>

                <div className="space-y-3">
                  {activeDay?.blocks?.map((block) => {
                    const isBreak = block.type === 'Break';
                    const isQuiz = block.type?.includes('Quiz');
                    return (
                      <div
                        key={block.id}
                        onClick={() => handleToggleBlock(block.id, block.completed)}
                        className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 select-none ${
                          block.completed
                            ? 'bg-slate-900/30 border-white/5 opacity-60'
                            : isBreak
                            ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                            : isQuiz
                            ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50'
                            : 'glass-panel border-white/10 hover:border-brand-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox toggle */}
                          <div className="text-slate-400 group-hover:text-white">
                            {block.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {block.time} ({block.duration})
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                isBreak
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isQuiz
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-brand-500/20 text-brand-300'
                              }`}>
                                {block.type}
                              </span>
                            </div>

                            <h4 className={`text-sm font-semibold ${block.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {block.topic}
                            </h4>
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 font-semibold hidden sm:block">
                          {block.subject}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <CalendarCheck className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No active study plans</h3>
              <p className="text-xs text-slate-400">Generate your personalized weekly exam schedule with Gemini AI.</p>
              <Button onClick={() => setGenModalOpen(true)} icon={Sparkles}>Generate AI Study Plan</Button>
            </div>
          )}

        </main>
      </div>

      {/* AI Plan Generator Modal */}
      <Modal
        isOpen={genModalOpen}
        onClose={() => setGenModalOpen(false)}
        title="✨ Generate AI Exam Timetable with Gemini"
      >
        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Exam Date *</label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Subjects & Topics (comma separated) *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Java OOP, Operating Systems Deadlocks, Calculus Optimization"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Daily Available Study Hours</label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
            >
              <option value="2">2 Hours / Day</option>
              <option value="3.5">3.5 Hours / Day (Recommended)</option>
              <option value="5">5 Hours / Day (Intensive)</option>
            </select>
          </div>

          <Button
            type="submit"
            isLoading={generating}
            icon={Sparkles}
            className="w-full py-3 mt-2"
          >
            Create Optimized Schedule
          </Button>
        </form>
      </Modal>
    </div>
  );
};
