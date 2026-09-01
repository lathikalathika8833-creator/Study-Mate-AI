import React, { useState } from 'react';
import { Menu, Search, Sparkles, Bell, Flame, Target, BookOpen, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onOpenMobileMenu, title, subtitle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title && (
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Search Bar + Quick Actions + User */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Search Notes & Topics */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, subjects, flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 lg:w-80 pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </form>

        {/* Daily Study Progress Mini-Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/10 text-xs">
          <Target className="w-4 h-4 text-brand-400" />
          <span className="text-slate-300">Goal:</span>
          <span className="font-semibold text-white">2.75 / 3.5h</span>
          <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1">
            <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* AI Quick Chat CTA Button */}
        <Link
          to="/chat"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600/20 to-accent-600/20 hover:from-brand-600/30 hover:to-accent-600/30 border border-brand-500/40 text-brand-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Ask AI Tutor</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Study Notifications</span>
                <span className="text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex gap-2.5 items-start">
                  <Flame className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">7-Day Streak Achieved!</p>
                    <p className="text-[11px] text-slate-400">You earned +50 XP for consistent daily revision.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex gap-2.5 items-start">
                  <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">Operating Systems Exam in 15 days</p>
                    <p className="text-[11px] text-slate-400">Review your customized Study Schedule today.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Link */}
        <Link to="/profile" className="flex items-center gap-2 pl-2">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "Student"}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/50 hover:ring-brand-400 transition-all"
          />
        </Link>

      </div>
    </header>
  );
};
