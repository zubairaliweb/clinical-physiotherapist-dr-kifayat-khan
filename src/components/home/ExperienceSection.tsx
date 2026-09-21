import React from 'react';
import {
  Briefcase,
  Globe,
  MapPin,
  Clock,
  CheckCircle,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { ExperienceRecord } from '../../types';

interface ExperienceSectionProps {
  experience: ExperienceRecord[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const practiceLocations = [
    { name: 'Islamabad, Pakistan', desc: 'Primary Clinical Practice (Mall of Islamabad)' },
    { name: 'Dubai, United Arab Emirates', desc: 'Professional & Sports Physical Therapy Engagement' },
    { name: 'Riyadh, Saudi Arabia', desc: 'Clinical & Musculoskeletal Consultation' },
    { name: 'Saudi Arabia', desc: 'Regional Practice & Consultation' },
  ];

  const employmentTypes = ['Full-time', 'Part-time', 'Contract'];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Career</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Experience & Professional Roles
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Dedicated clinical physiotherapy career spanning institutional leadership, sports rehabilitation, and international exposure.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {experience.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-50/70 dark:bg-slate-800/80 rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-500 transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {item.employmentType}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>

              {item.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {item.notes}
                </p>
              )}

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Locations of Engagement
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.locations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      <span>{loc}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Practice & Employment Types Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Practice Locations */}
          <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-7 sm:p-8 text-white shadow-md border border-transparent dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Practice Locations & Cross-Border Experience
                </h3>
                <p className="text-xs text-slate-300">
                  Clinical exposure across Pakistan and the Middle East
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practiceLocations.map((loc) => (
                <div
                  key={loc.name}
                  className="bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/80 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">
                      {loc.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {loc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Types */}
          <div className="lg:col-span-4 bg-teal-50/60 dark:bg-slate-800/90 border border-teal-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-900 dark:text-teal-300 font-bold mb-4">
                <Clock className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <h3 className="text-lg">Engagement Models</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Dr. Kifayat Khan provides physical therapy consultations and clinical leadership under multiple structured engagement types:
              </p>
              <div className="space-y-2.5">
                {employmentTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-teal-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{type} Engagements</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-teal-200/60 dark:border-slate-700 text-xs text-teal-800 dark:text-teal-400 font-medium">
              For institutional appointments, department head queries, or sports team support, please contact directly.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
