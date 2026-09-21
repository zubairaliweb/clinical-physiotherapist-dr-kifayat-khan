import React from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { EducationRecord } from '../../types';

interface EducationSectionProps {
  education: EducationRecord[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education & Qualifications
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Rigorous university and pre-medical academic training forming the foundation of Dr. Kifayat Khan's clinical practice.
          </p>
        </div>

        {/* Elegant Timeline Layout */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Timeline Guide Line */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-teal-200 dark:bg-teal-800/60" />

          <div className="space-y-8">
            {education.map((item, idx) => (
              <div key={item.id || idx} className="relative md:pl-20">
                {/* Timeline Icon Marker */}
                <div className="hidden md:flex absolute left-4.5 -translate-x-1/2 top-6 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-700 dark:border-teal-500 items-center justify-center text-teal-700 shadow-sm z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-700 dark:bg-teal-500" />
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md mb-2 border border-teal-100 dark:border-teal-800/50">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.degree}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {item.institution}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Field of Study
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                        {item.field}
                      </span>
                    </div>

                    {item.grade && (
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Academic Grade
                        </span>
                        <span className="font-bold text-teal-700 dark:text-teal-400 text-base">
                          Grade: {item.grade}
                        </span>
                      </div>
                    )}

                    {item.activities && (
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Activities & Societies
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-base flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{item.activities}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
