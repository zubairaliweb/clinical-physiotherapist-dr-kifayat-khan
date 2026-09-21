import React from 'react';
import {
  Phone,
  MapPin,
  Mail,
  Shield,
  Activity,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { WebsiteSettingsRecord, SocialLinksRecord } from '../../types';

interface FooterProps {
  settings: WebsiteSettingsRecord;
  socialLinks: SocialLinksRecord;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  socialLinks,
  onOpenAdmin,
}) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Videos', href: '#videos' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
    { label: 'Location', href: '#location' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Doctor Intro */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {settings.doctorName}
                </h3>
                <p className="text-xs text-teal-400 font-semibold">
                  {settings.primaryTitle} · DPT
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              With 4 years of clinical experience in physiotherapy, dedicated to helping patients recover movement, enhance functional mobility, and overcome physical limitations.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings.clinicAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Direct Contact: {settings.phone}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-teal-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Profiles & Admin Entry */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Official Social Profiles
            </h4>
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              <a
                href={socialLinks.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-2 py-1"
              >
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href={socialLinks.tiktok || 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-2 py-1"
              >
                <span>TikTok</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href={socialLinks.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-2 py-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Owner & Staff Management System</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {currentYear} Dr. Kifayat Khan. All Rights Reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-500">
            Clinical Physiotherapist · Mall of Islamabad, Pakistan · Contact: {settings.phone}
          </p>
        </div>
      </div>
    </footer>
  );
};
