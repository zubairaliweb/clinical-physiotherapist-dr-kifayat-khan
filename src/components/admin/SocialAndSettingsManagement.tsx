import React, { useState } from 'react';
import {
  Settings,
  Share2,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { api } from '../../lib/api';
import { WebsiteSettingsRecord, SocialLinksRecord } from '../../types';

interface Props {
  initialSettings: WebsiteSettingsRecord;
  initialSocial: SocialLinksRecord;
  onRefresh: () => void;
}

export const SocialAndSettingsManagement: React.FC<Props> = ({
  initialSettings,
  initialSocial,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<WebsiteSettingsRecord>(initialSettings);
  const [social, setSocial] = useState<SocialLinksRecord>(initialSocial);

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Change Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatusMsg(null);
    try {
      await api.updateSettings(settings);
      setStatusMsg('Website content and settings saved successfully.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSocialSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocial(true);
    setStatusMsg(null);
    try {
      await api.updateSocial(social);
      setStatusMsg('Social profile links updated successfully.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save social links');
    } finally {
      setSavingSocial(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr(null);
    setPassMsg(null);

    if (newPassword.length < 6) {
      setPassErr('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErr('Passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.changePassword(newPassword);
      setPassMsg(res.message || 'Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassErr(err.message || 'Failed to update password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8">
      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Website Core Content & Practice Settings */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs text-slate-900 dark:text-slate-100">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>Practice Profile & Contact Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Update doctor credentials, clinical titles, phone number, clinic address, and statements
          </p>
        </div>

        <form onSubmit={handleSettingsSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Doctor Full Name
              </label>
              <input
                type="text"
                value={settings.doctorName}
                onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Primary Title
              </label>
              <input
                type="text"
                value={settings.primaryTitle}
                onChange={(e) => setSettings({ ...settings, primaryTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Experience Years
              </label>
              <input
                type="text"
                value={settings.experienceYears}
                onChange={(e) => setSettings({ ...settings, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                WhatsApp Number (with Country Code)
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Clinic Room & Floor
              </label>
              <input
                type="text"
                value={settings.clinicFloorRoom}
                onChange={(e) => setSettings({ ...settings, clinicFloorRoom: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Full Clinic Address
              </label>
              <input
                type="text"
                value={settings.clinicAddress}
                onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              Hero Introduction Quote
            </label>
            <input
              type="text"
              value={settings.heroStatement}
              onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              Professional Statement / Philosophy
            </label>
            <textarea
              rows={3}
              value={settings.professionalStatement}
              onChange={(e) => setSettings({ ...settings, professionalStatement: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Profile Photo URL
              </label>
              <input
                type="text"
                value={settings.profileImage}
                onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
                Google Maps Directions URL
              </label>
              <input
                type="text"
                value={settings.googleMapsDirectionsUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsDirectionsUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm flex items-center gap-2"
            >
              {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Practice Content</span>
            </button>
          </div>
        </form>
      </div>

      {/* Social Media Links */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs text-slate-900 dark:text-slate-100">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>Official Social Media Accounts</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Links updated here will immediately reflect on the public website cards
          </p>
        </div>

        <form onSubmit={handleSocialSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={social.linkedin}
              onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              TikTok Profile URL
            </label>
            <input
              type="text"
              value={social.tiktok}
              onChange={(e) => setSocial({ ...social, tiktok: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              Facebook Page URL
            </label>
            <input
              type="text"
              value={social.facebook}
              onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={savingSocial}
              className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm flex items-center gap-2"
            >
              {savingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Social Profiles</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Change Password */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs text-slate-900 dark:text-slate-100">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>Admin Credentials & Security</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Change staff/owner password for accessing the private dashboard
          </p>
        </div>

        {passMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold mb-4">
            {passMsg}
          </div>
        )}

        {passErr && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold mb-4">
            {passErr}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPass}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm flex items-center gap-2"
            >
              {changingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
