import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Video,
  Package,
  Boxes,
  Image as ImageIcon,
  GraduationCap,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  Activity,
  LayoutDashboard,
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  Phone,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { api } from '../../lib/api';
import {
  AdminUser,
  OverviewStats,
  PublicContentResponse,
} from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';
import { CustomerManagement } from './CustomerManagement';
import { VideoManagement } from './VideoManagement';
import { ProductManagement } from './ProductManagement';
import { GalleryManagement } from './GalleryManagement';
import { EducationExperienceManagement } from './EducationExperienceManagement';
import { SocialAndSettingsManagement } from './SocialAndSettingsManagement';
import { MessagesManagement } from './MessagesManagement';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onClose: () => void;
  publicContent: PublicContentResponse;
  onRefreshContent: () => void;
}

type TabType =
  | 'overview'
  | 'customers'
  | 'videos'
  | 'products'
  | 'gallery'
  | 'education'
  | 'settings'
  | 'messages';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
  publicContent,
  onRefreshContent,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await api.getOverviewStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch overview stats', e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  // Click outside and escape key handling for mobile admin navigation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const navItems: { id: TabType; label: string; icon: any; badge?: number; caption: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, caption: 'Metrics & Quick Actions' },
    {
      id: 'customers',
      label: 'Customers & Registry',
      icon: Users,
      badge: stats?.totalCustomers,
      caption: 'Patient Profiles & Follow-ups',
    },
    { id: 'videos', label: 'Videos', icon: Video, badge: stats?.totalVideos, caption: 'Therapy & Guidance' },
    {
      id: 'products',
      label: 'Inventory & Services',
      icon: Boxes,
      badge: stats?.totalProducts,
      caption: 'Physical Tools & Treatments',
    },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, badge: stats?.totalGallery, caption: 'Clinical Equipment & Cases' },
    { id: 'education', label: 'Education & Career', icon: GraduationCap, caption: 'DPT, Honors & Experience' },
    {
      id: 'messages',
      label: 'Patient Inquiries',
      icon: Mail,
      badge: stats?.unreadMessages,
      caption: 'Appointments & Contact Form',
    },
    { id: 'settings', label: 'Website & Settings', icon: Settings, caption: 'Clinic Hours, Address & Social' },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col antialiased text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar with Responsive Hamburger Controls */}
      <header ref={headerRef} id="admin-management-navbar" className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white truncate">
                  Dr. Kifayat Khan
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                  Management Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Logged in as <strong className="text-slate-200">{user.username}</strong> ({user.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="bg-slate-900 border-slate-700 text-amber-100 hover:text-white min-h-9.5" />

            <button
              id="admin-topbar-view-website-btn"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer min-h-9.5"
              title="Return to Public Clinic Website"
            >
              <span className="hidden md:inline">View Public Website</span>
              <span className="md:hidden">Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              id="admin-topbar-logout-btn"
              onClick={onLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer min-h-9.5"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Hamburger Toggle Button for Mobile and Tablet (< 1024px / lg:hidden) */}
            <button
              id="admin-mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
              }`}
              aria-label={mobileMenuOpen ? 'Close Management Navigation' : 'Open Management Navigation'}
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-mobile-nav-drawer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="admin-close-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="admin-menu-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Collapsible Drawer (< 1024px) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="admin-mobile-nav-drawer"
              role="dialog"
              aria-label="Management Panel Navigation Menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden bg-slate-900 border-t border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Management Modules
                  </span>
                  <span className="text-slate-400">
                    Active: <strong className="text-teal-400">{currentNav.label}</strong>
                  </span>
                </div>

                {/* Grid of Navigation Items: 1 col on mobile, 2 cols on tablet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`admin-drawer-tab-${item.id}`}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-12 cursor-pointer ${
                          isActive
                            ? 'bg-teal-700/30 border-teal-500 text-white font-semibold shadow-xs'
                            : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-800 text-teal-400 border border-slate-700'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                              <span>{item.label}</span>
                              {item.badge !== undefined && item.badge > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-500/30 text-teal-300 border border-teal-500/40">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.caption}
                            </div>
                          </div>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive ? 'text-teal-400 translate-x-0.5' : 'text-slate-500'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Footer in Drawer with Logout Option for Mobile */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Staff role: <span className="text-teal-400 capitalize">{user.role}</span>
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/60 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Navigation Tabs Bar for Desktop (hidden on smaller tablet/mobile to eliminate cramped horizontal overflow) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-2.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-desktop-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-800 dark:bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-teal-900 text-teal-200'
                          : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab Notice Bar on Mobile & Tablet (when drawer is collapsed) */}
      <div className="lg:hidden bg-slate-200/70 dark:bg-slate-900/90 border-b border-slate-300 dark:border-slate-800 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Module:
          </span>
          <span className="font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
            {React.createElement(currentNav.icon, { className: 'w-3.5 h-3.5' })}
            {currentNav.label}
          </span>
          {currentNav.badge !== undefined && currentNav.badge > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {currentNav.badge}
            </span>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Switch Tab</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                onClick={() => setActiveTab('customers')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Customers
                  </span>
                  <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalCustomers ?? '—'}
                </div>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1 block">
                  Search & manage →
                </span>
              </div>

              <div
                onClick={() => setActiveTab('messages')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Inquiries
                  </span>
                  <Mail className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalMessages ?? '—'}
                </div>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1 block">
                  {stats?.unreadMessages ? `${stats.unreadMessages} Unread` : 'All Read'}
                </span>
              </div>

              <div
                onClick={() => setActiveTab('videos')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Videos
                  </span>
                  <Video className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalVideos ?? '—'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  Clinical guides
                </span>
              </div>

              <div
                onClick={() => setActiveTab('products')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Inventory
                  </span>
                  <Boxes className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalProducts ?? '—'}
                </div>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1 block">
                  {stats?.totalPhysicalProducts !== undefined ? `${stats.totalPhysicalProducts} Rehab tools` : 'Rehab & Services'} →
                </span>
              </div>

              <div
                onClick={() => setActiveTab('gallery')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Gallery
                  </span>
                  <ImageIcon className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalGallery ?? '—'}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  Clinic photos
                </span>
              </div>

              <div
                onClick={() => setActiveTab('settings')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Location
                  </span>
                  <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Mall of Islamabad
                </div>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-1 block">
                  Room #607
                </span>
              </div>
            </div>

            {/* Quick Actions & Clinic Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Customers */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>Recent Customer Registrations</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {(!stats?.recentCustomers || stats.recentCustomers.length === 0) ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                    No customers registered yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stats.recentCustomers.map((c) => (
                      <div
                        key={c.id}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-sm">
                            {c.fullName}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {c.phoneNumber} · {c.date}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinic System Status & Quick Actions */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>Quick Admin Tasks</span>
                  </h3>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('customers')}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Search className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Search Customer by Name / Phone
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('messages')}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Review Patient Inquiries
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('videos')}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload / Publish Exercise Video
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Update Clinic Address & Phone
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>System Version 2.0</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Database Online</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMERS */}
        {activeTab === 'customers' && <CustomerManagement />}

        {/* TAB 3: VIDEOS */}
        {activeTab === 'videos' && <VideoManagement />}

        {/* TAB 4: PRODUCTS & SERVICES */}
        {activeTab === 'products' && <ProductManagement />}

        {/* TAB 5: GALLERY */}
        {activeTab === 'gallery' && <GalleryManagement />}

        {/* TAB 6: EDUCATION & CAREER */}
        {activeTab === 'education' && (
          <EducationExperienceManagement
            initialEducation={publicContent.education}
            initialExperience={publicContent.experience}
            onRefresh={onRefreshContent}
          />
        )}

        {/* TAB 7: PATIENT INQUIRIES */}
        {activeTab === 'messages' && <MessagesManagement />}

        {/* TAB 8: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <SocialAndSettingsManagement
            initialSettings={publicContent.settings}
            initialSocial={publicContent.socialLinks}
            onRefresh={onRefreshContent}
          />
        )}
      </main>
    </div>
  );
};
