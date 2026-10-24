import React, { useState } from 'react';
import { THROWBACK_MOMENT } from '../data/mockData';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface ThrowbackModalProps {
  onClose: () => void;
  activePersona: 'Emma' | 'Liam';
}

export const ThrowbackModal: React.FC<ThrowbackModalProps> = ({ onClose, activePersona }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [reflections, setReflections] = useState<string[]>([
    '“We didn’t even have a couch yet, just two mugs and so much hope.” — Emma',
    '“Best pizza we ever ordered. Still have that box’s receipt taped in my journal.” — Liam',
  ]);
  const [newNote, setNewNote] = useState('');

  const handleToggleAudio = () => {
    if (isPlaying) {
      globalAudioSynthesizer.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      globalAudioSynthesizer.playMelody(54, (curr, playing) => {
        setAudioSeconds(curr);
        if (!playing) setIsPlaying(false);
      });
    }
  };

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setReflections([...reflections, `“${newNote.trim()}” — ${activePersona} (Today)`]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 max-h-[92vh] overflow-y-auto flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="throwback-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8c4f23] text-[20px]">
              history_edu
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8c4f23]">
              On This Day · Exactly 1 Year Ago
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              globalAudioSynthesizer.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Vintage Polaroid Card with Slight Tilt */}
        <div className="bg-[#ffffff] p-3 pb-5 rounded-2xl shadow-md border border-[#dbc1b9]/40 flex flex-col gap-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#ece0db]">
            <img
              src={THROWBACK_MOMENT.photoUrl}
              alt={THROWBACK_MOMENT.altText}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#fff8f6]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-[#201a18] shadow-sm">
              Oct 20, 2023 · 9:40 PM
            </div>
            <div className="absolute bottom-3 right-3 bg-[#201a18]/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-[#fbeee9]">
              365 Days Ago
            </div>
          </div>

          <div className="px-1 pt-1">
            <h3 id="throwback-title" className="font-serif text-xl font-semibold text-[#201a18]">
              {THROWBACK_MOMENT.caption.split('.')[0]}
            </h3>
            <p className="text-sm text-[#55433d] mt-1 leading-relaxed">
              {THROWBACK_MOMENT.caption}
            </p>
          </div>

          {/* Partner voice memo from that exact evening */}
          <div className="bg-[#fdf1ec] rounded-xl p-3 flex flex-col gap-2 border border-[#dbc1b9]/30">
            <div className="flex items-center justify-between text-xs text-[#88726c]">
              <span className="font-semibold text-[#8c4f23] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">mic</span>
                Audio Tape Recorded That Night
              </span>
              <span>Oct 20, 2023</span>
            </div>

            <div className="flex items-center gap-3 bg-[#cbe7d1]/50 p-2.5 rounded-full text-[#506857]">
              <button
                type="button"
                onClick={handleToggleAudio}
                className="w-8 h-8 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <div className="flex items-center gap-1 flex-1 h-5 overflow-hidden">
                {[6, 12, 18, 14, 20, 16, 24, 15, 10, 14, 7, 12, 8].map((bar, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying ? 'bg-[#4b6453]' : 'bg-[#4b6453]/40'
                    }`}
                    style={{ height: `${isPlaying ? (bar * (i % 2 === 0 ? 1.3 : 0.7)) % 20 + 4 : bar}px` }}
                  />
                ))}
              </div>

              <span className="text-xs font-mono tabular-nums text-[#506857]">
                {isPlaying ? `0:${audioSeconds.toString().padStart(2, '0')}` : '0:54'}
              </span>
            </div>
          </div>
        </div>

        {/* Reflections: Then vs Now */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#88726c]">
            Whispers &amp; Reflections Across 1 Year
          </h4>
          <div className="flex flex-col gap-2">
            {reflections.map((ref, idx) => (
              <div key={idx} className="bg-[#ffffff] p-3 rounded-xl border border-[#dbc1b9]/30 text-xs text-[#201a18] italic font-serif">
                {ref}
              </div>
            ))}
          </div>

          {/* Add a reflection from today */}
          <form onSubmit={handleAddReflection} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Write a note back in time as ${activePersona}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#99462a] text-[#ffffff] font-semibold text-xs shadow-sm hover:bg-[#7a2f15]"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
