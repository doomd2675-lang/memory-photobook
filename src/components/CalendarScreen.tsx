import React, { useState } from 'react';
import { MemoryItem } from '../types';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface CalendarScreenProps {
  memories: MemoryItem[];
  activePersona: 'Emma' | 'Liam';
  currentCircle: 'us' | 'family';
  onSelectDate: (dateKey: string) => void;
  onOpenSnapModal: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  memories,
  activePersona,
  currentCircle,
  onOpenSnapModal,
}) => {
  const [selectedDateKey, setSelectedDateKey] = useState('2024-10-20');
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'voice'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // October 2024 dates simulation (Oct 1 to Oct 31)
  // Oct 1 2024 was Tuesday
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = 2; // Tuesday start (Sunday=0, Monday=1, Tuesday=2)

  // Map memories by dateKey
  const memoriesByDate: Record<string, MemoryItem[]> = {};
  memories.forEach((m) => {
    if (!memoriesByDate[m.dateKey]) {
      memoriesByDate[m.dateKey] = [];
    }
    memoriesByDate[m.dateKey].push(m);
  });

  const selectedDayMemories = (memoriesByDate[selectedDateKey] || []).filter((m) => {
    if (filterType === 'photos') return true;
    if (filterType === 'voice') return !!m.audioMemo;
    return true;
  });

  const handleToggleAudio = (id: string, duration = 30) => {
    if (playingAudioId === id) {
      globalAudioSynthesizer.stop();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      globalAudioSynthesizer.playMelody(duration, (_, playing) => {
        if (!playing) setPlayingAudioId(null);
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 md:px-0 pb-28 gap-6 animate-in fade-in duration-300">
      {/* Calendar Header Banner */}
      <section className="bg-gradient-to-br from-[#ffdbc8]/60 via-[#f8ebe6] to-[#ffdbd0]/50 rounded-2xl p-5 border border-[#dbc1b9]/40 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8c4f23] font-semibold">
              Shared Archive
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#201a18]">
              October 2024
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff8f6] shadow-xs border border-[#dbc1b9]/40 text-xs font-semibold text-[#99462a]">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span>284 Days Active</span>
          </div>
        </div>

        {/* Filter chips (functional tabs) */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-[#99462a] text-[#ffffff] shadow-xs'
                : 'bg-[#fff8f6] text-[#55433d] hover:bg-[#f2e6e1]'
            }`}
          >
            All Moments
          </button>
          <button
            type="button"
            onClick={() => setFilterType('photos')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterType === 'photos'
                ? 'bg-[#99462a] text-[#ffffff] shadow-xs'
                : 'bg-[#fff8f6] text-[#55433d] hover:bg-[#f2e6e1]'
            }`}
          >
            With Photos
          </button>
          <button
            type="button"
            onClick={() => setFilterType('voice')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterType === 'voice'
                ? 'bg-[#99462a] text-[#ffffff] shadow-xs'
                : 'bg-[#fff8f6] text-[#55433d] hover:bg-[#f2e6e1]'
            }`}
          >
            Voice Mementos
          </button>
        </div>
      </section>

      {/* Calendar Grid Container */}
      <section className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#dbc1b9]/40 flex flex-col gap-3">
        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#88726c] pb-2 border-b border-[#dbc1b9]/30">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Leading empty blanks */}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}

          {daysInMonth.map((day) => {
            const dateKey = `2024-10-${day.toString().padStart(2, '0')}`;
            const dayMems = memoriesByDate[dateKey] || [];
            const hasMemory = dayMems.length > 0;
            const isSelected = selectedDateKey === dateKey;
            const isToday = day === 20;

            const thumbnail = dayMems[0]?.photoUrl;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDateKey(dateKey)}
                className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-between border transition-all ${
                  isSelected
                    ? 'border-[#99462a] bg-[#ffdbd0]/40 ring-2 ring-[#99462a]/20 shadow-xs scale-105 z-10'
                    : isToday
                    ? 'border-[#99462a]/60 bg-[#fff8f6]'
                    : 'border-transparent hover:bg-[#f8ebe6]/70'
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-[#99462a]'
                      : isToday
                      ? 'text-[#99462a] font-bold'
                      : 'text-[#201a18]'
                  }`}
                >
                  {day}
                </span>

                {thumbnail ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-[#ffffff] shadow-xs">
                    <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : hasMemory ? (
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4b6453]" />
                  </div>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-[#dbc1b9]/50" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Day Spread */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8c4f23] text-[20px]">
              event_note
            </span>
            <h3 className="font-serif text-xl font-semibold text-[#201a18]">
              {selectedDateKey === '2024-10-20'
                ? 'Today · Sunday, Oct 20'
                : selectedDateKey === '2024-10-19'
                ? 'Yesterday · Saturday, Oct 19'
                : `Date · ${selectedDateKey}`}
            </h3>
          </div>

          <button
            type="button"
            onClick={onOpenSnapModal}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdbd0] text-[#541400] text-xs font-semibold hover:bg-[#ffb59e] active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Moment</span>
          </button>
        </div>

        {selectedDayMemories.length === 0 ? (
          <div className="bg-[#ffffff] rounded-2xl p-8 border border-dashed border-[#dbc1b9] text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8ebe6] flex items-center justify-center text-[#88726c]">
              <span className="material-symbols-outlined text-[24px]">photo_camera</span>
            </div>
            <p className="text-sm font-serif text-[#201a18]">
              A quiet blank page waiting for ink &amp; light.
            </p>
            <button
              type="button"
              onClick={onOpenSnapModal}
              className="px-5 py-2 rounded-full bg-[#99462a] text-[#ffffff] text-xs font-semibold shadow-xs hover:bg-[#7a2f15]"
            >
              Add a moment for this day
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {selectedDayMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-[#ffffff] rounded-2xl p-3 border border-[#dbc1b9]/40 shadow-xs flex flex-col sm:flex-row gap-3 items-start"
              >
                <div className="w-full sm:w-36 aspect-[4/3] rounded-xl overflow-hidden bg-[#f8ebe6] shrink-0">
                  <img
                    src={mem.photoUrl}
                    alt={mem.altText}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-2 w-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#99462a] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#d97757]" />
                        {mem.author}
                      </span>
                      <span className="text-[11px] text-[#88726c]">{mem.time}</span>
                    </div>
                    <p className="text-xs text-[#201a18] mt-1 line-clamp-2 leading-relaxed">
                      {mem.caption}
                    </p>
                  </div>

                  {mem.audioMemo && (
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(mem.id, mem.audioMemo?.duration)}
                      className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#cbe7d1]/50 hover:bg-[#cbe7d1] text-[#506857] text-xs font-medium transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {playingAudioId === mem.id ? 'pause' : 'play_arrow'}
                      </span>
                      <span>Listen to voice note ({mem.audioMemo.durationFormatted})</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
