import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageSquare,
  Shield,
  Menu,
  X,
  MapPin,
  Clock,
  Activity,
  Award,
  Home,
  User,
  GraduationCap,
  Briefcase,
  Video,
  Image as ImageIcon,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { WebsiteSettingsRecord } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  settings: WebsiteSettingsRecord;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const navRef = useRef<HTMLElement>(null);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home', icon: Home, caption: 'Clinic Overview' },
    { label: 'About', href: '#about', id: 'about', icon: User, caption: 'Credentials & Profile' },
    { label: 'Education', href: '#education', id: 'education', icon: GraduationCap, caption: 'DPT & Certifications' },
    { label: 'Experience', href: '#experience', id: 'experience', icon: Briefcase, caption: 'Clinical History' },
    { label: 'Services', href: '#services', id: 'services', icon: Activity, caption: 'Rehab Tools & Care' },
    { label: 'Videos', href: '#videos', id: 'videos', icon: Video, caption: 'Therapy Exercises' },
    { label: 'Gallery', href: '#gallery', id: 'gallery', icon: ImageIcon, caption: 'Clinic & Patients' },
    { label: 'Location', href: '#location', id: 'location', icon: MapPin, caption: 'Mall of Islamabad' },
    { label: 'Contact', href: '#contact', id: 'contact', icon: Phone, caption: 'Book Consultation' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(navLinks[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside and Escape key to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      // Auto-collapse when resized to desktop (xl: >= 1280px)
      if (window.innerWidth >= 1280) {
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    setMobileMenuOpen(false);

    // Scroll to section with offset for sticky header
    const scrollToTarget = () => {
      if (sectionId === 'home' || href === '#home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }

      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        const navOffset = 75;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = Math.max(0, elementPosition - navOffset);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        // Fallback standard hash navigation if element not found by ID
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Execute immediately and defer by a tick for smooth drawer closing transition
    scrollToTarget();
    setTimeout(scrollToTarget, 60);
  };

  return (
    <header
      ref={navRef}
      id="main-clinic-navbar"
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-xs"
    >
      {/* Top Clinical Announcement Bar */}
      <div id="top-announcement-bar" className="bg-slate-900 dark:bg-slate-950 text-slate-200 py-1.5 px-4 text-xs font-medium border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Mall of Islamabad, Room #607, 6th Floor</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Mon - Sat: In-Clinic Consultations</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              id="top-bar-phone-link"
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1 text-slate-200 hover:text-teal-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold">{settings.phone}</span>
            </a>
            <button
              id="top-bar-admin-portal-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
              title="Secure Staff & Owner Management Portal"
            >
              <Shield className="w-3 h-3 text-teal-400" />
              <span>{isAdminLoggedIn ? 'Staff Dashboard' : 'Staff Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Doctor Title */}
          <a
            id="navbar-brand-link"
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home', 'home')}
            className="flex items-center gap-3.5 group min-w-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-linear-to-tr from-teal-700 to-cyan-600 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-500/20 group-hover:ring-teal-500/40 transition-all shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {settings.doctorName}
                </span>
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
                  DPT
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide truncate">
                {settings.primaryTitle} · Islamabad
              </p>
            </div>
          </a>

          {/* Desktop Nav (Only visible on wide screens >= 1280px / xl) */}
          <nav id="desktop-navigation-links" className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  id={`desktop-nav-${link.id}`}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-slate-800/90 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-teal-50/60 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Direct CTA Buttons & Dark Mode Toggle (xl:flex) */}
          <div id="desktop-cta-actions" className="hidden xl:flex items-center gap-2.5">
            <ThemeToggle variant="pill" />

            <a
              id="desktop-whatsapp-cta-btn"
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                'Hello Dr. Kifayat Khan, I would like to inquire about a physiotherapy appointment.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              id="desktop-call-cta-btn"
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-xs transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Tablet & Mobile Right Controls (< 1280px / xl:hidden) */}
          <div id="tablet-mobile-controls" className="flex xl:hidden items-center gap-2">
            {/* Quick Call on Tablet & Mobile */}
            <a
              id="tablet-mobile-quick-call-btn"
              href={`tel:${settings.phone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors min-h-11"
              aria-label={`Call Dr. Kifayat Khan at ${settings.phone}`}
            >
              <Phone className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Call</span>
            </a>

            {/* Compact Call Icon on small mobile phones */}
            <a
              id="mobile-phone-icon-btn"
              href={`tel:${settings.phone}`}
              className="sm:hidden w-11 h-11 flex items-center justify-center text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl transition-colors"
              aria-label="Call Clinic Directly"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Display Theme Toggle */}
            <ThemeToggle variant="icon" className="w-11 h-11" />

            {/* Responsive Hamburger Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-teal-800 dark:bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <span className="sr-only">Toggle navigation menu</span>
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
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
      </div>

      {/* Expandable Responsive Mobile & Tablet Drawer with Smooth Slide-In and Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Scrim */}
            <motion.div
              id="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="xl:hidden fixed inset-0 top-28.25 sm:top-28.25 bg-slate-950/60 backdrop-blur-xs z-30"
              aria-hidden="true"
            />

            {/* Slide-In Menu Container */}
            <motion.div
              id="mobile-navigation-drawer"
              role="dialog"
              aria-label="Mobile and Tablet Navigation Menu"
              initial={{ opacity: 0, y: -16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden overflow-hidden bg-white/98 dark:bg-slate-900/98 border-b border-slate-200 dark:border-slate-800 shadow-2xl relative z-40 backdrop-blur-md"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 max-h-[calc(100vh-130px)] overflow-y-auto">
                {/* Header Bar inside expanded menu: Section Title + Theme Switch */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Navigation Menu
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">Theme:</span>
                    <ThemeToggle variant="pill" />
                  </div>
                </div>

                {/* Navigation Links Grid: 1 col on small phones, 2 col on sm, 3 col on tablet (md/lg) */}
                <nav id="mobile-nav-links-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {navLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const isActive = activeSection === link.id;

                    return (
                      <motion.a
                        key={link.label}
                        id={`mobile-nav-link-${link.id}`}
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href, link.id)}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.02 }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 min-h-11 group cursor-pointer ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700/80 text-teal-900 dark:text-teal-200 shadow-2xs font-semibold'
                            : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-teal-50/50 dark:hover:bg-slate-800 hover:border-teal-200 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-teal-800 text-white dark:bg-teal-600'
                                : 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700 group-hover:border-teal-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="text-sm font-semibold tracking-tight truncate">
                              {link.label}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                              {link.caption}
                            </div>
                          </div>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive
                              ? 'text-teal-700 dark:text-teal-400 translate-x-0.5'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-teal-600 group-hover:translate-x-0.5'
                          }`}
                        />
                      </motion.a>
                    );
                  })}
                </nav>

                {/* Action Buttons: Call Clinic, WhatsApp Doctor, Staff Portal */}
                <div id="mobile-nav-action-buttons" className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      id="mobile-drawer-call-btn"
                      href={`tel:${settings.phone}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white font-bold text-xs shadow-xs min-h-11 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Direct: {settings.phone}</span>
                    </a>

                    <a
                      id="mobile-drawer-whatsapp-btn"
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                        'Hello Dr. Kifayat Khan, I would like to inquire about a physiotherapy appointment.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs min-h-11 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 py-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">Mall of Islamabad, Room #607, 6th Floor</span>
                    </div>

                    <button
                      id="mobile-drawer-staff-portal-btn"
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 min-h-11 transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{isAdminLoggedIn ? 'Open Staff Dashboard' : 'Staff & Owner Portal'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
