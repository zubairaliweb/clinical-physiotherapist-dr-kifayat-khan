import React, { useState } from 'react';
import {
  Video,
  Play,
  Calendar,
  Tag,
  X,
  ExternalLink,
  Layers,
  Inbox,
} from 'lucide-react';
import { VideoRecord } from '../../types';

interface VideoSectionProps {
  videos: VideoRecord[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(videos.map((v) => v.category)))];

  const filteredVideos =
    activeCategory === 'All'
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  // Helper to extract YouTube embed URL if applicable
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <section id="videos" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>Clinical Education & Movement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Educational & Professional Videos
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Guided exercise routines, rehabilitation principles, and patient posture advice demonstrated by Dr. Kifayat Khan.
          </p>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-2xs">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Videos Available</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently no videos are published in this category. The administrator can upload and publish videos from the Staff Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-500 transition-all overflow-hidden"
              >
                {/* Thumbnail with Play Overlay */}
                <div
                  className="relative aspect-16/9 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  onClick={() => setSelectedVideo(vid)}
                >
                  <img
                    src={vid.thumbnail || '/images/sports_rehab.jpg'}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-teal-500 transition-all">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 text-teal-300 backdrop-blur-xs">
                      {vid.category}
                    </span>
                  </div>

                  {vid.date && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/70 text-slate-200">
                        {vid.date}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & Watch Action */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedVideo(vid)}
                      className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-400 transition-colors cursor-pointer line-clamp-2"
                    >
                      {vid.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{vid.category}</span>
                    </span>

                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 shadow-2xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="bg-slate-900 text-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
                <div className="min-w-0 pr-4">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    {selectedVideo.category}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate">
                    {selectedVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className="relative aspect-16/9 w-full bg-black">
                {selectedVideo.videoUrl.includes('youtube') ||
                selectedVideo.videoUrl.includes('youtu.be') ||
                selectedVideo.videoUrl.includes('vimeo') ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Video className="w-16 h-16 text-teal-400 mb-3" />
                    <p className="text-sm text-slate-300 max-w-md mb-4">
                      Direct video stream URL: {selectedVideo.videoUrl}
                    </p>
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs"
                    >
                      <span>Open Video Stream</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer Description */}
              <div className="p-4 bg-slate-950/90 text-xs sm:text-sm text-slate-300">
                <p>{selectedVideo.description}</p>
                <div className="mt-2 text-slate-400 text-xs flex items-center gap-3">
                  <span>Dr. Kifayat Khan Clinical Physiotherapy</span>
                  {selectedVideo.date && <span>• {selectedVideo.date}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
