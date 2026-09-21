import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { AboutSection } from './components/home/AboutSection';
import { EducationSection } from './components/home/EducationSection';
import { ExperienceSection } from './components/home/ExperienceSection';
import { ServicesSection } from './components/home/ServicesSection';
import { VideoSection } from './components/home/VideoSection';
import { GallerySection } from './components/home/GallerySection';
import { SocialSection } from './components/home/SocialSection';
import { LocationSection } from './components/home/LocationSection';
import { ContactSection } from './components/home/ContactSection';
import { Footer } from './components/layout/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { api, authStorage } from './lib/api';
import { PublicContentResponse, AdminUser } from './types';
import {
  Phone,
  MessageSquare,
  Shield,
  Loader2,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const [content, setContent] = useState<PublicContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Inquiry prefill
  const [inquirySubject, setInquirySubject] = useState<string>('');

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchContent = async () => {
    try {
      const data = await api.getPublicContent();
      setContent(data);
    } catch (err: any) {
      console.error('Error loading public content', err);
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    try {
      const res = await api.getMe();
      setCurrentUser(res.user);
    } catch (e) {
      authStorage.clearToken();
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchContent();
    checkAuth();

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAdmin = () => {
    if (currentUser) {
      setShowAdminDashboard(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setShowAdminDashboard(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setShowAdminDashboard(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-teal-800 flex items-center justify-center text-white mb-4 shadow-md animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Dr. Kifayat Khan</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Clinical Physiotherapist · Islamabad</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center transition-colors">
        <div className="max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Issue</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{error || 'Unable to load clinical records.'}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchContent();
            }}
            className="px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // If Admin views Dashboard
  if (showAdminDashboard && currentUser) {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
        onClose={() => setShowAdminDashboard(false)}
        publicContent={content}
        onRefreshContent={fetchContent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-100 dark:selection:bg-teal-900 selection:text-teal-900 dark:selection:text-teal-100 transition-colors duration-200">
      {/* Header & Navigation */}
      <Navbar
        settings={content.settings}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!currentUser}
      />

      {/* Main Public Website Sections */}
      <main>
        {/* Section 4: Hero */}
        <Hero settings={content.settings} />

        {/* Section 5: About */}
        <AboutSection settings={content.settings} />

        {/* Section 6: Education Timeline */}
        <EducationSection education={content.education} />

        {/* Section 7: Experience & Professional Roles */}
        <ExperienceSection experience={content.experience} />

        {/* Section 8: Services & Products */}
        <ServicesSection
          products={content.products}
          settings={content.settings}
          onSelectServiceForInquiry={(title) => setInquirySubject(title)}
        />

        {/* Section 9: Video Gallery & Modal Player */}
        <VideoSection videos={content.videos} />

        {/* Section 10: Clinic Image Gallery & Lightbox */}
        <GallerySection gallery={content.gallery} />

        {/* Section 11: Official Social Media Profiles */}
        <SocialSection socialLinks={content.socialLinks} />

        {/* Section 12: Google Maps & Clinic Location */}
        <LocationSection settings={content.settings} />

        {/* Section 13: Contact Form & Direct Dial */}
        <ContactSection
          settings={content.settings}
          prefilledSubject={inquirySubject}
        />
      </main>

      {/* Section 27: Footer */}
      <Footer
        settings={content.settings}
        socialLinks={content.socialLinks}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating Action Buttons (Call & WhatsApp) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        <a
          href={`https://wa.me/${content.settings.whatsapp}?text=${encodeURIComponent(
            'Hello Dr. Kifayat Khan, I would like to inquire about a physiotherapy appointment.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all group"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            WhatsApp Doctor
          </span>
        </a>

        <a
          href={`tel:${content.settings.phone}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all group"
          aria-label="Call Doctor Directly"
        >
          <Phone className="w-4 h-4" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            Call Clinic
          </span>
        </a>
      </div>

      {/* Owner / Staff Login Modal */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
