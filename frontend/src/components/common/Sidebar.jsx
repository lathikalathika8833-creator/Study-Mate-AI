import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  BookOpenCheck, 
  HelpCircle, 
  Layers, 
  CalendarCheck, 
  TrendingUp, 
  UserCircle, 
  LogOut, 
  Sparkles, 
  Flame, 
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Study Chat', path: '/chat', icon: MessageSquareText, badge: 'AI' },
    { name: 'Notes', path: '/notes', icon: BookOpenCheck },
    { name: 'AI Quiz', path: '/quiz', icon: HelpCircle, badge: 'Smart' },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Study Planner', path: '/planner', icon: CalendarCheck },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    info('You have been logged out.');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 text-slate-300">
      
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1">
              StudyMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">AI</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">College Study Companion</div>
          </div>
        </NavLink>

        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Streak Mini Widget */}
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-200">{user?.streak || 7}-Day Streak! 🔥</div>
            <div className="text-[10px] text-slate-400">Keep it going today</div>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          +50 XP
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Study Tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/30 to-accent-600/20 text-white border border-brand-500/40 shadow-sm shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-white/10 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <NavLink to="/profile" className="flex items-center gap-3 group flex-1 mr-2 overflow-hidden">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-brand-500/40 flex-shrink-0">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "Student"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                {user?.name || "Alex Rivera"}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.major || "Computer Science"}
              </div>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full animate-slide-up z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
