import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  CheckCircle,
  Eye,
  Loader2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ContactMessageRecord } from '../../types';

export const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageRecord | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await api.getContactMessages();
      setMessages(data);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (msg: ContactMessageRecord) => {
    try {
      await api.markMessageRead(msg.id);
      await fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteMessage(id);
      if (selectedMsg?.id === id) setSelectedMsg(null);
      await fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Patient Inquiries & Messages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Incoming appointments, clinical inquiries, and questions from the website contact form
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <p className="text-sm">Loading inquiries...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Mail className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inbox is empty</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                New inquiries submitted on the public website will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[700px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (!msg.isRead) handleMarkRead(msg);
                  }}
                  className={`p-4.5 cursor-pointer transition-colors ${
                    selectedMsg?.id === msg.id
                      ? 'bg-teal-50/80 dark:bg-teal-950/60 border-l-4 border-teal-700 dark:border-teal-500'
                      : msg.isRead
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {msg.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                      {new Date(msg.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-teal-800 dark:text-teal-300 font-medium truncate mb-1">
                    {msg.subject || 'Clinical Inquiry'}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{msg.phoneNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        msg.isRead
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                      }`}
                    >
                      {msg.isRead ? 'Read' : 'New'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail View */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6 flex flex-col justify-between min-h-[400px]">
          {selectedMsg ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider block">
                    Message Detail
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedMsg.fullName}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Received on {new Date(selectedMsg.date).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase block">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${selectedMsg.phoneNumber}`}
                    className="text-sm font-bold text-teal-800 dark:text-teal-300 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{selectedMsg.phoneNumber}</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase block">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:underline truncate block mt-0.5"
                  >
                    {selectedMsg.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Subject
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedMsg.subject || 'General Inquiry'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Inquiry Content
                </span>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Quick Clinical Response Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
                <a
                  href={`tel:${selectedMsg.phoneNumber}`}
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Patient</span>
                </a>

                <a
                  href={`https://wa.me/${selectedMsg.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedMsg.fullName}, this is Dr. Kifayat Khan's clinic replying to your inquiry.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Reply</span>
                </a>

                <a
                  href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMsg.subject || 'Physiotherapy Consultation'}`
                  )}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Reply</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center py-16 text-slate-400 dark:text-slate-500">
              <Eye className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Select an inquiry to read</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Click any message on the left list to review contact details and send replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
