import React, { useState } from 'react';
import { Album, MemoryItem } from '../types';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface AlbumsScreenProps {
  albums: Album[];
  currentCircle: 'us' | 'family';
  onAddAlbum: (newAlbum: Album) => void;
}

export const AlbumsScreen: React.FC<AlbumsScreenProps> = ({
  albums,
  currentCircle,
  onAddAlbum,
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Album Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [chapter, setChapter] = useState('Chapter 05');
  const [description, setDescription] = useState('');

  const visibleAlbums = albums.filter(
    (a) => currentCircle === 'family' || a.circleId === 'us'
  );

  const handleOpenAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentSpreadIndex(0);
  };

  const handleCloseAlbum = () => {
    globalAudioSynthesizer.stop();
    setIsPlayingAudio(false);
    setSelectedAlbum(null);
  };

  const handleToggleAudio = (duration = 35) => {
    if (isPlayingAudio) {
      globalAudioSynthesizer.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      globalAudioSynthesizer.playMelody(duration, (_, playing) => {
        if (!playing) setIsPlayingAudio(false);
      });
    }
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      chapterNumber: chapter.trim() || 'Special Chapter',
      subtitle: subtitle.trim() || 'Curated intimate moments',
      coverPhoto: visibleAlbums[0]?.coverPhoto || '',
      dateRange: 'Autumn 2024',
      memoryCount: 1,
      description: description.trim() || 'A new chapter in our story.',
      circleId: currentCircle,
      memories: visibleAlbums[0]?.memories || [],
    };

    onAddAlbum(newAlbum);
    setShowCreateModal(false);
    setTitle('');
    setSubtitle('');
    setDescription('');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 md:px-0 pb-28 gap-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <section className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8c4f23] font-semibold">
            Heirloom Keepsakes
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#201a18]">
            Curated Photobooks
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#99462a] text-[#ffffff] text-xs font-semibold hover:bg-[#7a2f15] active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          <span>New Album</span>
        </button>
      </section>

      {/* Album List: Editorial Cloth Covers */}
      <section className="flex flex-col gap-4">
        {visibleAlbums.map((album) => (
          <article
            key={album.id}
            onClick={() => handleOpenAlbum(album)}
            className="group cursor-pointer bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#dbc1b9]/40 hover:shadow-md hover:border-[#99462a]/40 transition-all flex flex-col sm:flex-row gap-4 items-center"
          >
            {/* Cloth Book Cover Mockup */}
            <div className="relative w-full sm:w-40 aspect-[4/3] rounded-xl overflow-hidden bg-[#f8ebe6] shadow-xs shrink-0 group-hover:scale-[1.02] transition-transform">
              <img
                src={album.coverPhoto}
                alt={album.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201a18]/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[#ffffff] text-[10px] font-mono">
                <span>{album.chapterNumber}</span>
                <span>{album.memoryCount} moments</span>
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2 w-full">
              <div>
                <span className="text-[11px] font-semibold text-[#8c4f23] tracking-wide uppercase">
                  {album.dateRange}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#201a18] group-hover:text-[#99462a] transition-colors">
                  {album.title}
                </h3>
                <p className="text-xs text-[#55433d] mt-1 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#dbc1b9]/30">
                <span className="text-[11px] text-[#88726c] italic truncate max-w-[200px]">
                  {album.subtitle}
                </span>
                <span className="text-xs font-semibold text-[#99462a] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Album</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Interactive Photobook Spread Reader Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#201a18]/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#fff8f6] rounded-3xl p-5 sm:p-8 shadow-2xl border border-[#dbc1b9]/60 max-h-[92vh] overflow-y-auto flex flex-col gap-6">
            {/* Photobook Toolbar */}
            <div className="flex items-center justify-between border-b border-[#dbc1b9]/40 pb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#8c4f23]">
                  {selectedAlbum.chapterNumber} · Photobook Spread
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#201a18]">
                  {selectedAlbum.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseAlbum}
                className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Photobook Two-Page Spread Layout */}
            {selectedAlbum.memories.length > 0 ? (
              (() => {
                const memory =
                  selectedAlbum.memories[currentSpreadIndex % selectedAlbum.memories.length];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Left Page: Polaroid Frame */}
                    <div className="bg-[#ffffff] p-3 pb-8 rounded-2xl shadow-md border border-[#dbc1b9]/40 flex flex-col gap-3">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#f8ebe6]">
                        <img
                          src={memory.photoUrl}
                          alt={memory.altText}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#fff8f6]/90 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#201a18]">
                          Photo by {memory.author}
                        </div>
                      </div>
                      <div className="text-center font-serif text-xs text-[#88726c] tracking-wide pt-2">
                        {memory.date} · {memory.location || 'Our Flat'}
                      </div>
                    </div>

                    {/* Right Page: Journal Page with Letterpress Styling */}
                    <div className="bg-[#fdf1ec] p-6 rounded-2xl shadow-inner border border-[#dbc1b9]/40 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#8c4f23] pb-2 border-b border-[#dbc1b9]/30">
                          <span className="font-mono">Page {(currentSpreadIndex + 1).toString().padStart(2, '0')}</span>
                          <span>{memory.time}</span>
                        </div>

                        <p className="font-serif italic text-base leading-relaxed text-[#201a18] mt-4">
                          “{memory.caption}”
                        </p>

                        {memory.reaction && (
                          <div className="mt-4 p-3 rounded-xl bg-[#ffffff]/80 border border-[#dbc1b9]/30 text-xs text-[#55433d] flex items-center gap-2">
                            <span className="text-base">{memory.reaction.emoji}</span>
                            <span>
                              <strong>{memory.reaction.author}:</strong> {memory.reaction.note}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Voice Note if attached */}
                      {memory.audioMemo && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAudio(memory.audioMemo?.duration)}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-[#cbe7d1] text-[#082013] text-xs font-semibold shadow-xs hover:bg-[#b2cdb9] transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px]">
                                {isPlayingAudio ? 'pause' : 'play_arrow'}
                              </span>
                              <span>Play Voice Memento</span>
                            </span>
                            <span className="font-mono">{memory.audioMemo.durationFormatted}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-12 text-[#88726c] font-serif">
                This album is waiting for its first photographs.
              </div>
            )}

            {/* Spread Pagination Controls */}
            {selectedAlbum.memories.length > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-[#dbc1b9]/40">
                <button
                  type="button"
                  disabled={currentSpreadIndex === 0}
                  onClick={() => setCurrentSpreadIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-1.5 rounded-full bg-[#f2e6e1] text-xs font-semibold text-[#55433d] disabled:opacity-40 flex items-center gap-1 hover:bg-[#ece0db]"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Previous Page</span>
                </button>

                <span className="text-xs font-mono text-[#88726c]">
                  Page {currentSpreadIndex + 1} of {selectedAlbum.memories.length}
                </span>

                <button
                  type="button"
                  disabled={currentSpreadIndex >= selectedAlbum.memories.length - 1}
                  onClick={() =>
                    setCurrentSpreadIndex((prev) =>
                      Math.min(selectedAlbum.memories.length - 1, prev + 1)
                    )
                  }
                  className="px-4 py-1.5 rounded-full bg-[#ffdbd0] text-xs font-semibold text-[#390b00] disabled:opacity-40 flex items-center gap-1 hover:bg-[#ffb59e]"
                >
                  <span>Next Page</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#201a18]">
                Create Keepsake Album
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2e6e1] text-[#55433d] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#55433d] block mb-1">
                  Album Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Fires & Slow Cooking"
                  className="w-full px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#55433d] block mb-1">
                  Chapter Number / Subtitle
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Chapter 05"
                    className="w-28 px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18]"
                  />
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Wool socks and cedar fires"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#55433d] block mb-1">
                  Introduction / Preface Note
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why this chapter matters to us..."
                  className="w-full p-3 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#55433d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#99462a] text-[#ffffff] text-xs font-semibold shadow-xs hover:bg-[#7a2f15]"
                >
                  Bind Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
