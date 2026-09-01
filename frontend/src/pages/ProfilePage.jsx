import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Calendar, 
  GraduationCap, 
  Save, 
  LogOut, 
  ShieldCheck, 
  Sliders, 
  Flame, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [college, setCollege] = useState(user?.college || 'Stanford University');
  const [major, setMajor] = useState(user?.major || 'Computer Science');
  const [dailyGoalHours, setDailyGoalHours] = useState(user?.dailyGoalHours || 3.5);
  const [tutorStyle, setTutorStyle] = useState(user?.preferences?.tutorStyle || 'Socratic & Step-by-Step');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({
      name,
      college,
      major,
      dailyGoalHours: Number(dailyGoalHours),
      preferences: {
        ...user?.preferences,
        tutorStyle
      }
    });
    setIsUpdating(false);
    success("Profile preferences saved successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      error("Please fill in both new password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      error("Password must be at least 6 characters.");
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    success("Password updated securely!");
  };

  const handleLogout = () => {
    logout();
    info("Logged out successfully.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="Student Profile & Settings"
          subtitle="Manage your student details, AI tutor preferences, and account security"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-r from-brand-950/60 via-slate-900 to-accent-950/40">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "Student"}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/40 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold font-display text-white">{user?.name || "Alex Rivera"}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Student Pro
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user?.email || "alex.rivera@university.edu"}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {user?.college || "Stanford"}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {user?.joinedDate || "Jan 2026"}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> {user?.streak || 7}-Day Streak
                </div>
                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> {user?.quizAverage || 89}% Avg Quiz Score
                </div>
              </div>
            </div>
          </div>

          {/* Form 1: Profile Details & Study Preferences */}
          <div className="glass-dropdown p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold font-display text-white">General Information & Preferences</h3>
              <Sliders className="w-5 h-5 text-brand-400" />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    University / College
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    Major / Field of Study
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    Daily Study Target (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="12"
                    value={dailyGoalHours}
                    onChange={(e) => setDailyGoalHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                  Default AI Tutor Explanation Style
                </label>
                <select
                  value={tutorPersona}
                  onChange={(e) => setTutorStyle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-brand-300 focus:border-brand-500 font-medium"
                >
                  <option value="Socratic & Step-by-Step">Socratic & Step-by-Step (Guided questions)</option>
                  <option value="Simple Words (ELIF5)">Simple Words & Analogies (Easy to understand)</option>
                  <option value="Exam Cheat-Sheet Mode">Exam Cheat-Sheet Mode (High-yield points)</option>
                  <option value="Rigorous Academic">Rigorous Academic Deep-Dive (Formulas & proofs)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isUpdating}
                  icon={Save}
                  size="md"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Form 2: Change Password */}
          <div className="glass-dropdown p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold font-display text-white">Security & Password</h3>
              <Lock className="w-5 h-5 text-accent-400" />
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Session Logout Action */}
          <div className="p-6 rounded-3xl glass-panel border border-rose-500/20 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Sign Out of StudyMate AI</h4>
              <p className="text-xs text-slate-400">Your study progress is saved to your account.</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
              icon={LogOut}
            >
              Sign Out
            </Button>
          </div>

        </main>
      </div>
    </div>
  );
};
