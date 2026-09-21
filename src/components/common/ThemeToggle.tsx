import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'compact';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill',
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group p-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 ease-out flex items-center justify-center hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/80 via-slate-900/85 to-slate-800/80 text-amber-300 shadow-[0_10px_24px_rgba(8,47,73,0.28)] hover:shadow-[0_14px_26px_rgba(8,47,73,0.35)]'
            : 'bg-gradient-to-br from-white/80 via-amber-50/80 to-teal-50/70 text-teal-700 shadow-[0_10px_24px_rgba(13,148,136,0.12)] hover:shadow-[0_14px_26px_rgba(13,148,136,0.18)]'
        } ${className}`}
        aria-label={isDark ? 'Switch to White / Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to White / Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          {isDark ? (
            <Sun className="w-4 h-4 animate-in spin-in-180 duration-300" />
          ) : (
            <Moon className="w-4 h-4 animate-in spin-in-180 duration-300" />
          )}
        </span>
      </button>
    );
  }

  // Luxury clinic pill toggle with refined medical-brand palette and subtle glass finish
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 ${
        isDark
          ? 'bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 text-amber-100 border-teal-500/20 shadow-[0_10px_24px_rgba(15,23,42,0.3)] hover:shadow-[0_14px_28px_rgba(15,23,42,0.38)]'
          : 'bg-gradient-to-r from-white/80 via-amber-50/90 to-teal-50/80 text-slate-800 border-amber-200/80 shadow-[0_10px_24px_rgba(13,148,136,0.08)] hover:shadow-[0_14px_28px_rgba(13,148,136,0.14)]'
      } ${className}`}
      aria-label={isDark ? 'Switch to White / Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to White / Light Mode' : 'Switch to Dark Mode'}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ease-out ring-2 ring-white/70 shadow-[0_4px_10px_rgba(15,23,42,0.18)] ${
          isDark ? 'bg-gradient-to-br from-amber-300 to-yellow-400 text-slate-900' : 'bg-gradient-to-br from-teal-700 to-cyan-600 text-white'
        }`}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5" />
        ) : (
          <Moon className="w-3.5 h-3.5" />
        )}
      </div>
      <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase select-none">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
