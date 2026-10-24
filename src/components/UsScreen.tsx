import React, { useState } from 'react';
import { CoupleConfig, DailySpark, MemoryItem } from '../types';
import { ASSET_IMAGES, INITIAL_DAILY_SPARKS } from '../data/mockData';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface UsScreenProps {
  activePersona: string;
  onTogglePersona: () => void;
  onOpenDailySpark: () => void;
  onOpenInvite: () => void;
  memories: MemoryItem[];
  coupleConfig: CoupleConfig;
  onOpenEditCouple: () => void;
}

export const UsScreen: React.FC<UsScreenProps> = ({
  activePersona,
  onTogglePersona,
  onOpenDailySpark,
  onOpenInvite,
  memories,
  coupleConfig,
  onOpenEditCouple,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [selectedVaultTab, setSelectedVaultTab] = useState<'sparks' | 'tapes' | 'milestones'>('sparks');

  const { partner1Name, partner1Initial, hasPartner, partner2Name, partner2Initial, streakDays } =
    coupleConfig;

  // Audio memories
  const audioMemories = memories.filter((m) => !!m.audioMemo);

  const handleToggleAudio = (id: string, duration = 30) => {
    if (playingAudioId === id) {
      globalAudioSynthesizer.stop();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      globalAudioSynthesizer.playMelody(duration, (_, isPlaying) => {
        if (!isPlaying) setPlayingAudioId(null);
      });
    }
  };

  const handleExportPhotobook = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 md:px-0 pb-28 gap-6 animate-in fade-in duration-300">
      {/* Sanctuary Hero Banner */}
      <section className="bg-gradient-to-br from-[#ffdbc8] via-[#f8ebe6] to-[#ffdbd0] rounded-3xl p-6 shadow-sm border border-[#dbc1b9]/50 flex flex-col items-center text-center relative overflow-hidden">
        {/* Floating Medallions */}
        <div className="flex items-center justify-center -space-x-4 mb-3">
          <div className="relative">
            <img
              src={ASSET_IMAGES.profileEmma}
              alt={partner1Name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#fff8f6] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#d97757] rounded-full ring-2 ring-[#fff8f6] flex items-center justify-center text-[9px] text-[#ffffff] font-bold">
              {partner1Initial}
            </span>
          </div>

          {hasPartner ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center text-2xl font-serif font-bold ring-4 ring-[#fff8f6] shadow-md">
                {partner2Initial}
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#4b6453] rounded-full ring-2 ring-[#fff8f6] flex items-center justify-center text-[9px] text-[#ffffff] font-bold">
                {partner2Initial}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenEditCouple}
              className="w-16 h-16 rounded-full bg-[#fff8f6] text-[#8c4f23] border-2 border-dashed border-[#dbc1b9] flex flex-col items-center justify-center text-xs ring-4 ring-[#fff8f6] hover:bg-[#f8ebe6] transition-colors"
              title="Add partner to this space (optional)"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="text-[9px] font-semibold">Partner</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201a18]">
            {hasPartner ? `${partner1Name} & ${partner2Name}` : `${partner1Name}'s Sanctuary`}
          </h2>
          <button
            type="button"
            onClick={onOpenEditCouple}
            className="w-7 h-7 rounded-full bg-[#ffffff]/80 hover:bg-[#ffffff] text-[#99462a] flex items-center justify-center shadow-2xs transition-all"
            title="Edit couple names or toggle partner mode"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
          </button>
        </div>

        <p className="text-xs text-[#55433d] mt-1">
          {hasPartner
            ? 'Our intimate heirloom living room · Established Jan 10, 2024'
            : 'Personal heirloom memory space · Mindful daily keepsakes'}
        </p>

        {/* Milestone Pill Bar */}
        <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-[#dbc1b9]/40">
          <div className="bg-[#fff8f6]/85 backdrop-blur-sm p-2.5 rounded-2xl flex flex-col items-center">
            <span className="font-serif text-lg font-bold text-[#99462a]">
              {streakDays || 284}
            </span>
            <span className="text-[10px] text-[#88726c] uppercase tracking-wider font-semibold">
              {hasPartner ? 'Days Together' : 'Days Journaling'}
            </span>
          </div>
          <div className="bg-[#fff8f6]/85 backdrop-blur-sm p-2.5 rounded-2xl flex flex-col items-center">
            <span className="font-serif text-lg font-bold text-[#4b6453]">524</span>
            <span className="text-[10px] text-[#88726c] uppercase tracking-wider font-semibold">
              Moments Saved
            </span>
          </div>
          <div className="bg-[#fff8f6]/85 backdrop-blur-sm p-2.5 rounded-2xl flex flex-col items-center">
            <span className="font-serif text-lg font-bold text-[#8c4f23]">81</span>
            <span className="text-[10px] text-[#88726c] uppercase tracking-wider font-semibold">
              Days to 1 Year
            </span>
          </div>
        </div>

        {/* Action button */}
        {hasPartner ? (
          <button
            type="button"
            onClick={onTogglePersona}
            className="mt-4 px-4 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fff8f6] text-[#99462a] text-xs font-semibold shadow-xs border border-[#dbc1b9]/40 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
            <span>Switch View: Currently viewing as {activePersona}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenEditCouple}
            className="mt-4 px-4 py-1.5 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Add Partner (Optional)</span>
          </button>
        )}
      </section>

      {/* Vault Tabs: Daily Sparks vs Audio Tapes vs Milestones */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center bg-[#f8ebe6] p-1 rounded-full border border-[#dbc1b9]/40">
          <button
            type="button"
            onClick={() => setSelectedVaultTab('sparks')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedVaultTab === 'sparks'
                ? 'bg-[#ffffff] text-[#99462a] shadow-xs'
                : 'text-[#55433d] hover:text-[#201a18]'
            }`}
          >
            Sparks Vault
          </button>
          <button
            type="button"
            onClick={() => setSelectedVaultTab('tapes')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedVaultTab === 'tapes'
                ? 'bg-[#ffffff] text-[#99462a] shadow-xs'
                : 'text-[#55433d] hover:text-[#201a18]'
            }`}
          >
            Voice Mementos ({audioMemories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedVaultTab('milestones')}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedVaultTab === 'milestones'
                ? 'bg-[#ffffff] text-[#99462a] shadow-xs'
                : 'text-[#55433d] hover:text-[#201a18]'
            }`}
          >
            Our Milestones
          </button>
        </div>

        {/* Tab 1: Daily Sparks Vault */}
        {selectedVaultTab === 'sparks' && (
          <div className="flex flex-col gap-3">
            {INITIAL_DAILY_SPARKS.map((spark) => (
              <div
                key={spark.id}
                className="bg-[#ffffff] rounded-2xl p-4 shadow-xs border border-[#dbc1b9]/40 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#8c4f23]">{spark.date}</span>
                  <span className="text-[11px] text-[#88726c]">
                    {hasPartner ? 'Both Answered' : 'Reflected'}
                  </span>
                </div>

                <h4 className="font-serif text-base font-semibold text-[#201a18]">
                  {spark.question}
                </h4>

                <div className={`grid ${hasPartner ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2 pt-1`}>
                  <div className="bg-[#fdf1ec] p-2.5 rounded-xl border border-[#dbc1b9]/30 text-xs">
                    <span className="font-semibold text-[#99462a] block mb-0.5">
                      {partner1Name}
                    </span>
                    <p className="font-serif italic text-[#201a18]">
                      “{spark.emmaAnswer?.text}”
                    </p>
                  </div>
                  {hasPartner && (
                    <div className="bg-[#fdf1ec] p-2.5 rounded-xl border border-[#dbc1b9]/30 text-xs">
                      <span className="font-semibold text-[#4b6453] block mb-0.5">
                        {partner2Name}
                      </span>
                      <p className="font-serif italic text-[#201a18]">
                        “{spark.liamAnswer?.text}”
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Audio Tapes Cassette Library */}
        {selectedVaultTab === 'tapes' && (
          <div className="flex flex-col gap-3">
            {audioMemories.map((mem) => {
              const isPlaying = playingAudioId === mem.id;
              return (
                <div
                  key={mem.id}
                  className="bg-[#ffffff] rounded-2xl p-3.5 border border-[#dbc1b9]/40 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(mem.id, mem.audioMemo?.duration)}
                      className="w-10 h-10 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-transform hover:bg-[#344c3c]"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <div>
                      <h4 className="text-xs font-semibold text-[#201a18]">
                        {mem.audioMemo?.author}’s Voice Note
                      </h4>
                      <p className="text-[11px] text-[#88726c] mt-0.5 truncate max-w-[200px]">
                        {mem.caption}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-[#506857] tabular-nums">
                      {mem.audioMemo?.durationFormatted}
                    </span>
                    <span className="text-[10px] text-[#88726c] hidden sm:inline">
                      {mem.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Milestones Timeline */}
        {selectedVaultTab === 'milestones' && (
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#dbc1b9]/40 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#99462a] text-[20px]">
                  flag
                </span>
                <h3 className="font-serif text-lg font-bold text-[#201a18]">
                  Our Story Timeline
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenEditCouple}
                className="text-xs font-semibold text-[#99462a] hover:underline"
              >
                Edit Details
              </button>
            </div>

            <div className="relative pl-6 border-l-2 border-[#ffdbd0] flex flex-col gap-5 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#99462a] ring-4 ring-[#fff8f6]" />
                <span className="font-semibold text-[#99462a]">Oct 20, 2024 · Today</span>
                <p className="text-sm font-serif font-bold text-[#201a18] mt-0.5">
                  Day {streakDays || 284} {hasPartner ? 'Together' : 'Journaling'}
                </p>
                <p className="text-[#55433d] mt-0.5">
                  {hasPartner
                    ? `${partner1Name} and ${partner2Name} logged autumn moments.`
                    : `${partner1Name} captured mindful memories.`}
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#8c4f23] ring-4 ring-[#fff8f6]" />
                <span className="font-semibold text-[#8c4f23]">Oct 20, 2023</span>
                <p className="text-sm font-serif font-bold text-[#201a18] mt-0.5">
                  Moved into Our Flat
                </p>
                <p className="text-[#55433d] mt-0.5">
                  Eating pizza on cardboard boxes under fairy lights.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#4b6453] ring-4 ring-[#fff8f6]" />
                <span className="font-semibold text-[#4b6453]">Jan 10, 2024</span>
                <p className="text-sm font-serif font-bold text-[#201a18] mt-0.5">
                  First Milestone Date
                </p>
                <p className="text-[#55433d] mt-0.5">
                  Cold walk through the park with warm apple cider.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Keepsake Actions & Printing */}
      <section className="bg-[#f8ebe6] rounded-2xl p-4 border border-[#dbc1b9]/40 flex flex-col gap-3">
        <h4 className="font-serif text-base font-semibold text-[#201a18]">
          Keepsake Settings &amp; Living Room
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={handleExportPhotobook}
            className="p-3 rounded-xl bg-[#ffffff] hover:bg-[#fff8f6] border border-[#dbc1b9]/40 flex flex-col items-center gap-1.5 text-center text-[#201a18] font-semibold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#99462a]">
              print
            </span>
            <span>Print Photobook (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onOpenInvite}
            className="p-3 rounded-xl bg-[#ffffff] hover:bg-[#fff8f6] border border-[#dbc1b9]/40 flex flex-col items-center gap-1.5 text-center text-[#201a18] font-semibold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#4b6453]">
              group_add
            </span>
            <span>Family Circle Access</span>
          </button>
        </div>
      </section>
    </div>
  );
};
