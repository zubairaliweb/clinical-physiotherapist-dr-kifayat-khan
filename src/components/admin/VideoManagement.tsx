import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Play,
  Loader2,
  AlertCircle,
  Tag,
  Calendar,
} from 'lucide-react';
import { api } from '../../lib/api';
import { VideoRecord } from '../../types';

export const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Rehabilitation');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminVideos();
      setVideos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAdd = () => {
    setTitle('');
    setDescription('');
    setThumbnail('/images/sports_rehab.jpg');
    setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setCategory('Rehabilitation');
    setIsPublished(true);
    setIsAdding(true);
  };

  const openEdit = (v: VideoRecord) => {
    setEditingVideo(v);
    setTitle(v.title);
    setDescription(v.description);
    setThumbnail(v.thumbnail);
    setVideoUrl(v.videoUrl);
    setCategory(v.category);
    setIsPublished(v.isPublished);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingVideo) {
        await api.updateVideo(editingVideo.id, {
          title,
          description,
          thumbnail,
          videoUrl,
          category,
          isPublished,
        });
        setEditingVideo(null);
      } else {
        await api.addVideo({
          title,
          description,
          thumbnail,
          videoUrl,
          category,
          isPublished,
        });
        setIsAdding(false);
      }
      await fetchVideos();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (v: VideoRecord) => {
    try {
      await api.updateVideo(v.id, { isPublished: !v.isPublished });
      await fetchVideos();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteVideo(id);
      setDeleteConfirmId(null);
      await fetchVideos();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Video Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage educational, exercise, and clinical guidance video items
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
            <p className="text-sm">Loading video library...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>No videos found. Click "Add New Video" to publish one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {vid.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vid.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {vid.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xl">
                      {vid.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                        {vid.category}
                      </span>
                      <span className="truncate max-w-xs text-slate-400">
                        {vid.videoUrl}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => togglePublish(vid)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium"
                    title={vid.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {vid.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => openEdit(vid)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-blue-50 text-blue-700 text-xs font-medium"
                    title="Edit Video"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(vid.id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-rose-700 text-xs font-medium"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAdding || editingVideo) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAdding(false);
            setEditingVideo(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingVideo(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cervical Spine Mobility & Desk Posture Routine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rehabilitation, Sports Therapy, Posture Care, Patient Guide..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Video URL (YouTube, Vimeo, or MP4) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  placeholder="/images/sports_rehab.jpg or custom image URL"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short educational summary of movements and clinical points..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="pub-check" className="text-xs font-bold text-slate-700">
                  Publish to Public Website Immediately
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingVideo(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
                >
                  {submitting ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-center text-slate-900">
              Delete Video Item?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              This will remove this video from both the website and library.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 px-4 rounded-xl bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
