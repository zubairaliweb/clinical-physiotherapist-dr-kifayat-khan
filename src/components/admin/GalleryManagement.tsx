import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  X,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { GalleryRecord } from '../../types';

export const GalleryManagement: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminGallery();
      setGallery(data);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAdd = () => {
    setTitle('');
    setDescription('');
    setImageUrl('/images/physio_clinic.jpg');
    setIsPublished(true);
    setIsAdding(true);
  };

  const openEdit = (g: GalleryRecord) => {
    setEditingItem(g);
    setTitle(g.title);
    setDescription(g.description);
    setImageUrl(g.imageUrl);
    setIsPublished(g.isPublished);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await api.uploadImage(base64);
        setImageUrl(uploadedUrl);
      } catch (err: any) {
        alert(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await api.updateGalleryItem(editingItem.id, {
          title,
          description,
          imageUrl,
          isPublished,
        });
        setEditingItem(null);
      } else {
        await api.addGalleryItem({
          title,
          description,
          imageUrl,
          isPublished,
        });
        setIsAdding(false);
      }
      await fetchGallery();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
      setDeleteConfirmId(null);
      await fetchGallery();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Clinic Gallery Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage high-resolution clinic photos, treatment room captures, and clinical equipment
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Photo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-6">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
            <p className="text-sm">Loading gallery items...</p>
          </div>
        ) : gallery.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>No photos in gallery. Click "Upload / Add Photo" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div className="aspect-4/3 w-full overflow-hidden bg-slate-200 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-blue-700 shadow-xs"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-rose-700 shadow-xs"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAdding || editingItem) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAdding(false);
            setEditingItem(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingItem ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Physiotherapy Suite Mall of Islamabad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo Image URL or File Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="/images/physio_clinic.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </div>
              </div>

              {imageUrl && (
                <div className="aspect-16/9 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-48">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about the procedure, environment, or equipment shown..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gal-pub"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="gal-pub" className="text-xs font-bold text-slate-700">
                  Visible in Public Website Gallery
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingItem(null);
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
                  {submitting ? 'Saving...' : 'Save Photo'}
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
              Delete Gallery Photo?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              This photo will be removed from the gallery.
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
