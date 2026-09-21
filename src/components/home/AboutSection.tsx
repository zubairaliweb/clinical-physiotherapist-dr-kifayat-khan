import React from 'react';
import {
  User,
  Briefcase,
  MapPin,
  Clock,
  Activity,
  Award,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { WebsiteSettingsRecord } from '../../types';

interface AboutSectionProps {
  settings: WebsiteSettingsRecord;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const quickCards = [
    {
      label: 'Experience',
      value: '4+ Years',
      icon: Clock,
      subtext: 'Dedicated Clinical Practice',
      color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    },
    {
      label: 'Profession',
      value: 'Clinical Physiotherapist',
      icon: Activity,
      subtext: 'Musculoskeletal & Mobility Care',
      color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    },
    {
      label: 'Location',
      value: 'Islamabad, Pakistan',
      icon: MapPin,
      subtext: 'Mall of Islamabad, Blue Area',
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      label: 'Role',
      value: 'Sports Physical Therapist',
      icon: Briefcase,
      subtext: 'Athlete & Injury Rehabilitation',
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Professional Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Dr. Kifayat Khan
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Clinical Physiotherapist & Sports Physical Therapist practicing in Islamabad, Pakistan.
          </p>
        </div>

        {/* Clean Profile Layout: Image + Bio + Quick Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Doctor Profile Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Outer card styling */}
              <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <img
                  src={settings.profileImage || '/images/dr_kifayat_khan.jpg'}
                  alt="Dr. Kifayat Khan Clinical Physiotherapist"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/5 object-cover object-top"
                />
                <div className="p-5 bg-white dark:bg-slate-850 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {settings.doctorName}
                      </h3>
                      <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {settings.primaryTitle}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded text-xs font-bold">
                      DPT, KMU
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Room #607, Mall of Islamabad, Blue Area, Islamabad</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Biography & Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                Committed to Restoring Movement, Functional Independence & Physical Well-Being
              </h3>

              <div className="text-slate-600 dark:text-slate-300 space-y-3.5 leading-relaxed text-base">
                <p>
                  <strong className="text-slate-900 dark:text-white">Dr. Kifayat Khan</strong> is a qualified Clinical Physiotherapist and Sports Physical Therapist based in Islamabad, Pakistan. He completed his five-year Doctor of Physical Therapy (DPT) degree from Khyber Medical University, graduating with strong academic and clinical foundations.
                </p>
                <p>
                  With four years of hands-on physiotherapy career experience, Dr. Kifayat Khan serves as Head of Department and Clinical Physiotherapist, delivering personalized patient evaluations, active exercise therapy, manual techniques, and targeted rehabilitation plans for individuals recovering from sports injuries, physical limitations, and chronic musculoskeletal discomfort.
                </p>
              </div>

              {/* Quote Block using owner's exact statement */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border-l-4 border-teal-700 dark:border-teal-500 p-4.5 rounded-r-xl my-4">
                <p className="italic text-slate-800 dark:text-slate-200 font-medium text-base leading-relaxed">
                  "{settings.professionalStatement}"
                </p>
                <span className="block mt-2 text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                  — Dr. Kifayat Khan, Clinical Physiotherapist
                </span>
              </div>
            </div>

            {/* Quick Information Cards Grid (4 Cards as explicitly specified) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {quickCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.label}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${card.color}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          {card.label}
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white block truncate">
                          {card.value}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                          {card.subtext}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Professional Roles badges */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Professional Roles & Practice Areas:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Clinical Physiotherapist',
                  'Sports Physical Therapist',
                  'Head of Department',
                  'Physiotherapist',
                ].map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-semibold"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                    <span>{role}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
