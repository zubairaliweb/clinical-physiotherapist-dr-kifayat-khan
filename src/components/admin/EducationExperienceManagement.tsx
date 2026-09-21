import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { EducationRecord, ExperienceRecord } from '../../types';

interface Props {
  initialEducation: EducationRecord[];
  initialExperience: ExperienceRecord[];
  onRefresh: () => void;
}

export const EducationExperienceManagement: React.FC<Props> = ({
  initialEducation,
  initialExperience,
  onRefresh,
}) => {
  const [educationList, setEducationList] = useState<EducationRecord[]>(initialEducation);
  const [experienceList, setExperienceList] = useState<ExperienceRecord[]>(initialExperience);

  const [savingEdu, setSavingEdu] = useState(false);
  const [savingExp, setSavingExp] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Education handlers
  const updateEduField = (index: number, field: keyof EducationRecord, val: string) => {
    const updated = [...educationList];
    (updated[index] as any)[field] = val;
    setEducationList(updated);
  };

  const addEdu = () => {
    setEducationList([
      ...educationList,
      {
        id: `edu-${Date.now()}`,
        institution: 'University / Institute Name',
        degree: 'Degree Title',
        field: 'Field of Study',
        duration: 'Year - Year',
        grade: '',
        activities: '',
      },
    ]);
  };

  const removeEdu = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const saveEducation = async () => {
    setSavingEdu(true);
    setStatusMsg(null);
    try {
      await api.updateEducation(educationList);
      setStatusMsg('Education history updated successfully.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update education');
    } finally {
      setSavingEdu(false);
    }
  };

  // Experience handlers
  const updateExpField = (index: number, field: keyof ExperienceRecord, val: any) => {
    const updated = [...experienceList];
    (updated[index] as any)[field] = val;
    setExperienceList(updated);
  };

  const addExp = () => {
    setExperienceList([
      ...experienceList,
      {
        id: `exp-${Date.now()}`,
        title: 'Professional Role',
        employmentType: 'Full-time',
        locations: ['Islamabad, Pakistan'],
        notes: 'Clinical scope and rehabilitation focus...',
      },
    ]);
  };

  const removeExp = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const saveExperience = async () => {
    setSavingExp(true);
    setStatusMsg(null);
    try {
      await api.updateExperience(experienceList);
      setStatusMsg('Professional roles & experience updated successfully.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update experience');
    } finally {
      setSavingExp(false);
    }
  };

  return (
    <div className="space-y-8">
      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Education Management Section */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-700" />
              <span>Education & Academic Degrees</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified degrees and pre-medical qualifications
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addEdu}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree</span>
            </button>
            <button
              onClick={saveEducation}
              disabled={savingEdu}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {savingEdu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Education</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {educationList.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Degree Entry #{idx + 1}
                </span>
                <button
                  onClick={() => removeEdu(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEduField(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEduField(idx, 'degree', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Field
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEduField(idx, 'field', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => updateEduField(idx, 'duration', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Grade (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.grade || ''}
                    onChange={(e) => updateEduField(idx, 'grade', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Activities / Societies
                </label>
                <input
                  type="text"
                  value={edu.activities || ''}
                  onChange={(e) => updateEduField(idx, 'activities', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Management Section */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-700" />
              <span>Professional Roles & Practice Areas</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Roles, employment models, and regional practice locations
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addExp}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
            <button
              onClick={saveExperience}
              disabled={savingExp}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {savingExp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Experience</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {experienceList.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Role #{idx + 1}
                </span>
                <button
                  onClick={() => removeExp(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExpField(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={exp.employmentType}
                    onChange={(e) => updateExpField(idx, 'employmentType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Locations (Comma Separated)
                </label>
                <input
                  type="text"
                  value={exp.locations.join(', ')}
                  onChange={(e) =>
                    updateExpField(
                      idx,
                      'locations',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Notes / Focus Area
                </label>
                <textarea
                  rows={2}
                  value={exp.notes || ''}
                  onChange={(e) => updateExpField(idx, 'notes', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
