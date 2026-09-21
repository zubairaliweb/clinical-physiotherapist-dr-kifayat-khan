import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Building,
  Clock,
  CheckCircle2,
  ExternalLink,
  Car,
} from 'lucide-react';
import { WebsiteSettingsRecord } from '../../types';

interface LocationSectionProps {
  settings: WebsiteSettingsRecord;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  return (
    <section id="location" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Clinic Location & Directions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Visit Mall of Islamabad Clinic
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Conveniently situated in Islamabad's central business and medical corridor at Blue Area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Clinic Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl p-7 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider block mb-1">
                  Private Practice Suite
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {settings.doctorName}
                </h3>
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                  {settings.primaryTitle}
                </p>
              </div>

              {/* Exact Clinic Address Block */}
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Clinic Address
                    </h4>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {settings.clinicFloorRoom},
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Mall of Islamabad, Jinnah Ave, Block J, Blue Area, Area F 7/1, Islamabad, 44210, Pakistan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Consultation Hours
                    </h4>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                      Monday to Saturday: In-Person Clinical Sessions
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Prior appointment booking recommended
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Direct Contact Phone
                    </h4>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-base font-extrabold text-teal-800 dark:text-teal-400 hover:underline block mt-0.5"
                    >
                      {settings.phone}
                    </a>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mobile & WhatsApp enabled
                    </p>
                  </div>
                </div>
              </div>

              {/* Building Amenities */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Location Highlights:
                </span>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Elevator access to 6th Floor (Room #607)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Central Blue Area parking facilities</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Dedicated physiotherapy examination & treatment setup</span>
                </p>
              </div>
            </div>

            {/* Action Buttons: Get Directions & Call Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <a
                href={settings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-sm transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed Frame */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="relative w-full h-[400px] lg:h-full min-h-[380px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <iframe
                title="Dr. Kifayat Khan Clinic Mall of Islamabad"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/90 rounded-b-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Mall of Islamabad, Jinnah Ave, Blue Area, Islamabad</span>
              </span>
              <a
                href={settings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
