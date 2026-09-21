import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { WebsiteSettingsRecord } from '../../types';

interface ContactSectionProps {
  settings: WebsiteSettingsRecord;
  prefilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  prefilledSubject,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(`Inquiry: ${prefilledSubject}`);
    }
  }, [prefilledSubject]);

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required.';
    } else if (phoneNumber.trim().replace(/[^0-9]/g, '').length < 8) {
      errs.phoneNumber = 'Please enter a valid phone number (at least 8 digits).';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    if (!message.trim()) {
      errs.message = 'Please provide a brief message or description of symptoms.';
    } else if (message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.sendContactMessage({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        subject: subject.trim() || 'Physiotherapy Consultation Inquiry',
        message: message.trim(),
      });

      setSuccessMessage(response.message || 'Thank you! Your message has been received.');
      // Clear form
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch (err: any) {
      setServerError(err.message || 'Failed to send message. Please try calling directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Consultation & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Dr. Kifayat Khan
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Reach out directly for appointment bookings, clinical inquiries, or sports rehabilitation evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Communication Channels & Phone/WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl p-7 sm:p-8 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Quick Clinical Connect
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                For urgent clinical appointments or prompt responses, telephone and WhatsApp direct messages are monitored during clinic hours.
              </p>

              {/* Phone CTA Card */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Telephone
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {settings.phone}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${settings.phone}`}
                    className="px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white font-bold text-xs shadow-2xs transition-all"
                  >
                    Call Now
                  </a>
                </div>

                {/* WhatsApp CTA Card */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        WhatsApp Fast Chat
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Direct Messaging
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                      'Hello Dr. Kifayat Khan, I would like to schedule a physical therapy session.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Clinic Location Reminder */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Clinic: </strong>
                    {settings.clinicFloorRoom}, Mall of Islamabad, Blue Area, Islamabad.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Hours: </strong>
                    Monday – Saturday (By Appointment)
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Standard Notice */}
            <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
              <strong className="block font-bold text-sm mb-1 text-teal-950 dark:text-teal-300">
                Confidentiality & Privacy
              </strong>
              All patient consultations and clinical inquiries are handled strictly in accordance with healthcare privacy standards. Inquiries submitted via this form are transmitted to Dr. Kifayat Khan's private management system.
            </div>
          </div>

          {/* Right Column: Formal Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl p-7 sm:p-9 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Send an Inquiry or Appointment Request
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
                Please complete the form below. Required fields are marked with an asterisk (*).
              </p>

              {/* Success Notification Alert */}
              {successMessage && (
                <div className="mb-6 p-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Message Sent Successfully</h4>
                    <p className="text-xs mt-0.5 text-emerald-800 dark:text-emerald-300">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Server Error Alert */}
              {serverError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block text-sm">Unable to Send</span>
                    <span>{serverError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Usman"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                        errors.fullName
                          ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900'
                          : 'border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900/40'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0313 8161676"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                        errors.phoneNumber
                          ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900'
                          : 'border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900/40'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. usman@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900'
                          : 'border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900/40'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Subject / Reason
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Knee Rehabilitation Assessment"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900/40 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Message / Physical Challenge Details *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe symptoms, movement restrictions, injury history, or preferred appointment day/time..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all resize-y ${
                      errors.message
                        ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900'
                        : 'border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900/40'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-md shadow-teal-950/10 focus:outline-hidden focus:ring-2 focus:ring-teal-500 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
