import React from 'react';
import {
  Share2,
  ExternalLink,
  Linkedin,
  Facebook,
  Video,
} from 'lucide-react';
import { SocialLinksRecord } from '../../types';

interface SocialSectionProps {
  socialLinks: SocialLinksRecord;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ socialLinks }) => {
  const platforms = [
    {
      name: 'LinkedIn',
      handle: 'Dr. Kifayat Khan, DPT',
      desc: 'Connect for clinical physiotherapy networks, academic updates, and sports physical therapy discussions.',
      url: socialLinks.linkedin || 'https://www.linkedin.com/in/',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white',
      badgeColor: 'bg-blue-600 text-white',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      handle: '@drkifayatkhan',
      desc: 'Watch quick physiotherapy movement tips, daily posture hacks, and sports rehabilitation demos.',
      url: socialLinks.tiktok || 'https://www.tiktok.com/',
      color: 'bg-slate-900 text-white border-slate-800 hover:bg-black',
      badgeColor: 'bg-pink-500 text-white',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      handle: 'Dr. Kifayat Khan Physiotherapist',
      desc: 'Follow clinic announcements, health articles, patient awareness posts, and community events.',
      url: socialLinks.facebook || 'https://www.facebook.com/',
      color: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-600 hover:text-white',
      badgeColor: 'bg-sky-600 text-white',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="social" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>Connect & Follow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Official Social Media Profiles
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Stay connected with Dr. Kifayat Khan across official social channels for physiotherapy awareness, exercises, and patient education.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-7 flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform">
                    {platform.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${platform.badgeColor}`}>
                    Official
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {platform.name}
                </h3>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-3">
                  {platform.handle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {platform.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-700/80">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all group-hover:border-teal-400"
                >
                  <span>Follow / View Profile</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
