import React from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Video,
  ArrowRight,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { WebsiteSettingsRecord } from '../../types';

interface HeroProps {
  settings: WebsiteSettingsRecord;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200"
    >
      {/* Subtle Medical Geometric Accents (Non-intrusive, dignified) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-15">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-cyan-100/50 blur-2xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-slate-200/40 blur-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Clinical Title & Introduction */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Professional Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Available for Clinical Consultations in Islamabad</span>
            </div>

            {/* Doctor Name & Primary Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {settings.doctorName}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-teal-800 dark:text-teal-400">
                {settings.primaryTitle}
              </p>
            </div>

            {/* Supporting Roles */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 flex-wrap">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-medium">
                Sports Physical Therapist
              </span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-medium">
                Head of Department
              </span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-medium">
                Physiotherapist
              </span>
            </div>

            {/* Location Tag */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{settings.cityCountry}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Room #607, 6th Floor, Mall of Islamabad, Blue Area
              </span>
            </div>

            {/* Short Professional Introduction */}
            <div className="border-l-3 border-teal-600 dark:border-teal-500 pl-4 py-1">
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                "{settings.heroStatement}"
              </p>
            </div>

            {/* Professional Statement Quote */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="font-semibold text-teal-900 dark:text-teal-300 block mb-0.5">
                Clinical Philosophy:
              </span>
              {settings.professionalStatement}
            </p>

            {/* Action Buttons: Primary, Secondary, Additional */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {/* Primary CTA: "Contact Me" */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-md shadow-teal-900/10 hover:shadow-lg transition-all"
              >
                <span>Contact Me</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Secondary CTA: "View Location" */}
              <a
                href="#location"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors"
              >
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>View Location</span>
              </a>

              {/* Additional CTA: "View Videos" */}
              <a
                href="#videos"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors"
              >
                <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>View Videos</span>
              </a>
            </div>

            {/* Direct Phone & WhatsApp Access for Mobile/Immediate Care */}
            <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-1.5 text-teal-800 dark:text-teal-300 hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Call Direct: {settings.phone}</span>
              </a>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp Appointment</span>
              </a>
            </div>
          </div>

          {/* Right Column: Doctor Profile Visual & Credential Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Outer Frame with Mathematical Radii */}
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-cyan-500 rounded-3xl rotate-2 scale-102 opacity-20 blur-md" />

              {/* Main Card Container */}
              <div className="relative bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Profile Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={settings.profileImage || '/images/dr_kifayat_khan.jpg'}
                    alt="Dr. Kifayat Khan – Clinical Physiotherapist"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                  />
                  {/* Subtle gradient vignette at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span>Dr. Kifayat Khan</span>
                    </p>
                    <p className="text-xs text-slate-200">
                      Doctor of Physical Therapy (DPT)
                    </p>
                  </div>
                </div>

                {/* Floating Micro-Badge: Experience */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5">
                    <span className="block text-xl font-extrabold text-teal-800 dark:text-teal-400">
                      {settings.experienceYears}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Years Career Experience
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">
                      Mall of Islamabad
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Clinical Practice
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Credential Chip */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white dark:bg-slate-900 border border-teal-200/90 dark:border-teal-800 shadow-lg px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal">Degree</span>
                  <span className="font-bold text-teal-900 dark:text-teal-300">DPT · Khyber Medical Univ.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
