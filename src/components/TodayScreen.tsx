import React, { useState } from 'react';
import { CoupleConfig, DailySpark, MemoryItem } from '../types';
import { THROWBACK_MOMENT } from '../data/mockData';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface TodayScreenProps {
  memories: MemoryItem[];
  dailySpark: DailySpark;
  currentCircle: 'us' | 'family';
  activePersona: string;
  onTogglePersona: () => void;
  onOpenDailySpark: () => void;
  onOpenSnapModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenThrowback: () => void;
  onOpenInvite: () => void;
  onToggleLike: (memoryId: string) => void;
  coupleConfig: CoupleConfig;
  onOpenEditCouple: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  memories,
  dailySpark,
  currentCircle,
  activePersona,
  onTogglePersona,
  onOpenDailySpark,
  onOpenSnapModal,
  onOpenVoiceModal,
  onOpenThrowback,
  onOpenInvite,
  onToggleLike,
  coupleConfig,
  onOpenEditCouple,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const { partner1Name, partner1Initial, hasPartner, partner2Name, partner2Initial, streakDays } =
    coupleConfig;

  // Filter memories for today and current circle
  const todayMemories = memories.filter(
    (m) => m.dateKey === '2024-10-20' && (currentCircle === 'family' || m.circleId === 'us')
  );

  const handleToggleVoiceMemo = (memId: string, duration = 42) => {
    if (playingAudioId === memId) {
      globalAudioSynthesizer.stop();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(memId);
      globalAudioSynthesizer.playMelody(duration, (curr, isPlaying) => {
        setAudioSeconds(curr);
        if (!isPlaying) {
          setPlayingAudioId(null);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 md:px-0 pb-28 gap-6 animate-in fade-in duration-300">
      {/* Top Status Bar: Streak & Circle Switcher */}
      <section className="flex items-center justify-between gap-2 pt-1">
        {/* Streak Pill */}
        <button
          type="button"
          onClick={() => setShowStreakModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffdbd0]/60 hover:bg-[#ffdbd0] text-[#390b00] shadow-xs active:scale-95 transition-all text-left"
          title="View milestone journey"
        >
          <span
            className="material-symbols-outlined text-[18px] text-[#99462a]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <span className="text-xs font-semibold tracking-wide">
            Day {streakDays || 284} {hasPartner ? 'Together' : 'Journaling'}
          </span>
        </button>

        {/* Active Pair Indicator or Add Partner (Optional) */}
        {hasPartner ? (
          <button
            onClick={onTogglePersona}
            type="button"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#201a18] shadow-xs active:scale-95 transition-all"
            title={`Active: ${activePersona}. Click to switch to ${
              activePersona === partner1Name ? partner2Name : partner1Name
            }`}
          >
            <div className="flex items-center -space-x-2">
              <div
                className={`w-6 h-6 rounded-full ${
                  activePersona === partner1Name
                    ? 'bg-[#d97757] text-[#ffffff] ring-2 ring-[#fff8f6]'
                    : 'bg-[#d97757]/80 text-[#ffffff]'
                } flex items-center justify-center text-[10px] font-semibold shadow-xs`}
              >
                {partner1Initial}
              </div>
              <div
                className={`w-6 h-6 rounded-full ${
                  activePersona === partner2Name
                    ? 'bg-[#4b6453] text-[#ffffff] ring-2 ring-[#fff8f6]'
                    : 'bg-[#4b6453]/80 text-[#ffffff]'
                } flex items-center justify-center text-[10px] font-semibold shadow-xs`}
              >
                {partner2Initial}
              </div>
            </div>
            <span className="text-xs font-semibold text-[#55433d]">
              {partner1Name} &amp; {partner2Name}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#88726c]">
              unfold_more
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenEditCouple}
            type="button"
            className="flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#201a18] shadow-xs active:scale-95 transition-all"
            title="Click to optionally add a partner or edit journal name"
          >
            <div className="w-6 h-6 rounded-full bg-[#d97757] text-[#ffffff] flex items-center justify-center text-[10px] font-semibold">
              {partner1Initial}
            </div>
            <span className="text-xs font-semibold text-[#55433d]">{partner1Name}</span>
            <span className="text-[11px] text-[#8c4f23] font-medium">+ Add Partner</span>
          </button>
        )}
      </section>

      {/* Daily Spark / Connection Prompt */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffdbc8]/70 via-[#f8ebe6] to-[#ffdbd0]/50 p-4 shadow-sm border border-[#dbc1b9]/40">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fff8f6]/85 backdrop-blur-sm text-[#8c4f23]">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Daily Spark
            </span>
          </div>
          <span className="text-xs font-medium text-[#55433d]">
            {hasPartner ? 'Both answered ✨' : 'Reflected today ✨'}
          </span>
        </div>

        <h2 className="font-serif text-[20px] leading-snug text-[#201a18] my-2">
          {dailySpark.question}
        </h2>

        <div className="flex items-center justify-between text-[#55433d] pt-1">
          <p className="text-xs italic text-[#88726c] truncate max-w-[240px]">
            {hasPartner
              ? `Tap to see ${partner2Name}'s handwritten reply`
              : 'Tap to read handwritten answers'}
          </p>
          <button
            type="button"
            onClick={onOpenDailySpark}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffffff] text-[#99462a] text-xs font-semibold shadow-xs hover:bg-[#fff8f6] active:scale-95 transition-transform"
          >
            <span>Read answers</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Section Header: Today's Photo Stream */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-[#8c4f23] uppercase tracking-widest font-semibold block">
            Sunday, Oct 20
          </span>
          <h3 className="font-serif text-2xl font-semibold text-[#201a18]">
            {hasPartner ? "Today's Dual Log" : "Today's Keepsake Log"}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[#55433d] text-xs font-semibold bg-[#f2e6e1] px-3 py-1 rounded-full border border-[#dbc1b9]/30">
          <span className="w-2 h-2 rounded-full bg-[#4b6453] animate-pulse" />
          <span>{todayMemories.length} {hasPartner ? 'of 2 in' : 'moments in'}</span>
        </div>
      </div>

      {/* Photo Cards */}
      <section className="flex flex-col gap-6">
        {todayMemories.map((mem) => {
          const isP1 = mem.author === partner1Name || mem.author === 'Emma';
          const isPlayingThis = playingAudioId === mem.id;
          const authorInitial = mem.authorInitial || mem.author[0];

          return (
            <article
              key={mem.id}
              className="bg-[#ffffff] rounded-2xl p-3 shadow-md border border-[#dbc1b9]/40 flex flex-col gap-3 transition-transform hover:-translate-y-0.5 duration-200"
            >
              {/* Media Frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f8ebe6]">
                <img
                  className="w-full h-full object-cover"
                  alt={mem.altText}
                  src={mem.photoUrl}
                  loading="lazy"
                />

                {/* Author Overlay Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#fff8f6]/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      isP1 ? 'bg-[#d97757]' : 'bg-[#4b6453]'
                    } text-[#ffffff] flex items-center justify-center text-[10px] font-bold`}
                  >
                    {authorInitial}
                  </div>
                  <span className="text-xs font-semibold text-[#201a18]">{mem.author}</span>
                </div>

                {/* Timestamp Pill */}
                <div className="absolute top-3 right-3 bg-[#362f2c]/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[#fbeee9] text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>{mem.time}</span>
                </div>

                {/* Location indicator if present */}
                {mem.location && (
                  <div className="absolute bottom-3 left-3 bg-[#201a18]/65 backdrop-blur-md px-2 py-0.5 rounded-full text-[#ffffff] text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    <span>{mem.location}</span>
                  </div>
                )}
              </div>

              {/* Journal Caption & Note */}
              <div className="px-1 pt-0.5">
                <p className="text-[15px] leading-relaxed text-[#201a18] font-normal">
                  {mem.caption}
                </p>
              </div>

              {/* Voice Memo Audio Bar if attached */}
              {mem.audioMemo && (
                <div className="bg-[#fdf1ec] rounded-xl p-2.5 flex flex-col gap-2 border border-[#dbc1b9]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-[18px] text-[#99462a]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                      <span className="text-xs text-[#201a18] font-medium">
                        {mem.audioMemo.author} reacted &amp; left a memo
                      </span>
                    </div>
                    <span className="text-[11px] text-[#88726c]">
                      {mem.reaction?.timestamp || '9:04 AM'}
                    </span>
                  </div>

                  {/* Voice Memo Audio Bar */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#cbe7d1]/40 text-[#506857]">
                    <button
                      aria-label="Play audio memo"
                      type="button"
                      onClick={() => handleToggleVoiceMemo(mem.id, mem.audioMemo?.duration)}
                      className="w-7 h-7 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center shadow-xs shrink-0 active:scale-90 transition-transform hover:bg-[#344c3c]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlayingThis ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    {/* Soundwave Visualizer Bars */}
                    <div className="flex items-center gap-1 flex-1 h-5 overflow-hidden">
                      {mem.audioMemo.soundwaveBars.map((height, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isPlayingThis ? 'bg-[#4b6453]' : 'bg-[#4b6453]/60'
                          }`}
                          style={{
                            height: isPlayingThis
                              ? `${Math.max(4, (height * (i % 2 === 0 ? 1.4 : 0.8)) % 20)}px`
                              : `${height}px`,
                          }}
                        />
                      ))}
                    </div>

                    <span className="text-xs text-[#506857] shrink-0 tabular-nums font-mono font-medium">
                      {isPlayingThis
                        ? `0:${audioSeconds.toString().padStart(2, '0')}`
                        : mem.audioMemo.durationFormatted}
                    </span>
                  </div>
                </div>
              )}

              {/* Partner's Reaction Shelf (without audio bar or custom note) */}
              {!mem.audioMemo && mem.reaction && (
                <div className="bg-[#fdf1ec] rounded-xl p-2.5 flex items-center justify-between border border-[#dbc1b9]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#ffdbd0] flex items-center justify-center text-[#99462a] text-[13px]">
                      {mem.reaction.emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#201a18] leading-none">
                        {mem.reaction.author}
                      </span>
                      <span className="text-xs text-[#88726c] italic mt-0.5">
                        {mem.reaction.note}
                      </span>
                    </div>
                  </div>

                  <button
                    aria-label="Toggle heart reaction"
                    type="button"
                    onClick={() => onToggleLike(mem.id)}
                    className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ffdbd0] text-[#99462a] flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={mem.isLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {mem.isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Quick Action CTA Hub */}
      <section className="bg-[#f8ebe6] rounded-2xl p-4 flex flex-col gap-4 shadow-sm border border-[#dbc1b9]/40">
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-semibold text-[#201a18]">
            Add to Story
          </span>
          <span className="text-xs text-[#88726c]">Unlimited storage</span>
        </div>

        {/* Primary Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Snap Memory Button */}
          <button
            onClick={onOpenSnapModal}
            className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] shadow-md active:scale-98 transition-transform cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">photo_camera</span>
            <span className="text-sm font-semibold">Snap Memory</span>
          </button>

          {/* Record Voice Memo Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#ffffff] hover:bg-[#fff8f6] text-[#4b6453] shadow-xs border border-[#dbc1b9]/40 active:scale-98 transition-transform cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
            <span className="text-sm font-semibold text-[#201a18]">Voice Memento</span>
          </button>
        </div>

        {/* Micro circle invite or add partner prompt link */}
        <div className="flex items-center justify-between pt-1 border-t border-[#dbc1b9]/30">
          <div className="flex items-center gap-2 text-[#55433d]">
            <span className="material-symbols-outlined text-[18px] text-[#8c4f23]">
              {hasPartner ? 'group_add' : 'person_add'}
            </span>
            <span className="text-xs">
              {hasPartner
                ? 'Want grandma or friends to peek in?'
                : 'Want to invite or add a partner?'}
            </span>
          </div>
          <button
            onClick={hasPartner ? onOpenInvite : onOpenEditCouple}
            className="text-xs font-semibold text-[#99462a] underline underline-offset-4 decoration-[#d97757] hover:text-[#7a2f15]"
            type="button"
          >
            {hasPartner ? 'Invite Member' : '+ Add Partner'}
          </button>
        </div>
      </section>

      {/* On This Day (1 Year Ago) Throwback Card */}
      <section className="bg-[#f2e6e1]/70 rounded-2xl p-4 shadow-sm border border-[#dbc1b9]/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#8c4f23]">
              history_edu
            </span>
            <span className="font-serif text-lg font-semibold text-[#201a18]">
              On This Day
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#311300] font-semibold">
            1 Year Ago
          </span>
        </div>

        {/* Mini Polaroid Preview spread */}
        <div className="flex items-center gap-3 bg-[#ffffff] p-2.5 rounded-xl shadow-xs border border-[#dbc1b9]/30">
          {/* Mini Polaroid Mockup */}
          <div className="w-20 h-24 bg-[#fff8f6] p-1.5 pb-4 rounded-lg shadow-sm shrink-0 -rotate-2 transform border border-[#dbc1b9]/40">
            <div className="w-full h-16 rounded overflow-hidden bg-[#f8ebe6]">
              <img
                className="w-full h-full object-cover"
                alt={THROWBACK_MOMENT.altText}
                src={THROWBACK_MOMENT.photoUrl}
              />
            </div>
            <div className="mt-1 text-center text-[8px] font-mono text-[#88726c] truncate">
              Oct 20, 2023
            </div>
          </div>

          {/* Throwback Note & Pill CTA */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h4 className="text-xs font-semibold text-[#201a18] truncate">
                First night in the new flat
              </h4>
              <p className="text-xs text-[#55433d] line-clamp-2 mt-0.5 leading-relaxed">
                Eating takeout pizza directly off cardboard boxes while the kettle boiled.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenThrowback}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdbd0] text-[#390b00] text-xs font-semibold active:scale-95 transition-transform shadow-2xs hover:bg-[#ffb59e]"
                type="button"
              >
                <span>View throwback</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Streak / Journey Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#ffdbd0] text-[#99462a] flex items-center justify-center mx-auto shadow-inner">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#8c4f23] uppercase tracking-wider">
                {hasPartner ? 'Our Shared Streak' : 'My Journal Streak'}
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#201a18] mt-1">
                {streakDays || 284} Days
              </h3>
              <p className="text-xs text-[#55433d] mt-1">
                {hasPartner
                  ? `With ${partner1Name} & ${partner2Name}, not a single day passed without leaving a tender trace.`
                  : `${streakDays || 284} consecutive days of mindful moments and slow reflections.`}
              </p>
            </div>

            <div className="bg-[#f8ebe6] p-3 rounded-2xl border border-[#dbc1b9]/40 text-left flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#55433d]">
                <span>Next Milestone:</span>
                <span className="font-semibold text-[#99462a]">300 Days (in 16 days)</span>
              </div>
              <div className="w-full bg-[#dbc1b9]/50 h-2 rounded-full overflow-hidden">
                <div className="bg-[#99462a] h-full rounded-full" style={{ width: '94.6%' }} />
              </div>
              <div className="flex justify-between text-[#88726c] text-[11px]">
                <span>{streakDays || 284} / 300 days</span>
                <span>Day 300 Reward: Bound Photobook</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowStreakModal(false)}
              className="w-full py-2.5 rounded-full bg-[#99462a] text-[#ffffff] font-semibold text-xs shadow-sm hover:bg-[#7a2f15]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
