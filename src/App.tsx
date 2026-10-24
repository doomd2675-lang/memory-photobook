/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TodayScreen } from './components/TodayScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { AlbumsScreen } from './components/AlbumsScreen';
import { UsScreen } from './components/UsScreen';
import { DailySparkModal } from './components/DailySparkModal';
import { SnapMemoryModal } from './components/SnapMemoryModal';
import { VoiceMementoModal } from './components/VoiceMementoModal';
import { ThrowbackModal } from './components/ThrowbackModal';
import { InviteModal } from './components/InviteModal';
import { EditCoupleModal } from './components/EditCoupleModal';
import {
  INITIAL_ALBUMS,
  INITIAL_DAILY_SPARKS,
  INITIAL_MEMORIES,
  ASSET_IMAGES,
} from './data/mockData';
import { Album, CoupleConfig, DailySpark, MemoryItem, TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [currentCircle, setCurrentCircle] = useState<'us' | 'family'>('us');

  // Dynamic Couple Configuration with changed names and optional partner mode
  const [coupleConfig, setCoupleConfig] = useState<CoupleConfig>({
    partner1Name: 'Maya',
    partner1Initial: 'M',
    hasPartner: true, // Adding a partner is optional
    partner2Name: 'Noah',
    partner2Initial: 'N',
    circleTitle: 'Us (Maya & Noah)',
    relationshipStartDate: 'Jan 10, 2024',
    streakDays: 284,
  });

  const [activePersona, setActivePersona] = useState<string>('Maya');

  // Initialize memories with dynamic names
  const [memories, setMemories] = useState<MemoryItem[]>(() =>
    INITIAL_MEMORIES.map((m) => {
      if (m.author === 'Emma') {
        return {
          ...m,
          author: 'Maya',
          authorInitial: 'M',
          reaction: m.reaction
            ? { ...m.reaction, author: 'Noah' }
            : undefined,
          audioMemo: m.audioMemo
            ? { ...m.audioMemo, author: 'Noah' }
            : undefined,
        };
      }
      if (m.author === 'Liam') {
        return {
          ...m,
          author: 'Noah',
          authorInitial: 'N',
          reaction: m.reaction
            ? { ...m.reaction, author: 'Maya' }
            : undefined,
        };
      }
      return m;
    })
  );

  const [dailySparks, setDailySparks] = useState<DailySpark[]>(INITIAL_DAILY_SPARKS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);

  // Modal Dialog States
  const [showDailySparkModal, setShowDailySparkModal] = useState(false);
  const [showSnapModal, setShowSnapModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showThrowbackModal, setShowThrowbackModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditCoupleModal, setShowEditCoupleModal] = useState(false);

  const todaySpark = dailySparks[0];

  const handleTogglePersona = () => {
    if (!coupleConfig.hasPartner) return;
    setActivePersona((prev) =>
      prev === coupleConfig.partner1Name
        ? coupleConfig.partner2Name
        : coupleConfig.partner1Name
    );
  };

  const handleUpdateCoupleConfig = (newConfig: CoupleConfig) => {
    // Map existing memories from old names to new names
    const oldP1 = coupleConfig.partner1Name;
    const oldP2 = coupleConfig.partner2Name;

    setMemories((prev) =>
      prev.map((m) => {
        let newAuthor = m.author;
        let newInitial = m.authorInitial;
        let newReaction = m.reaction;
        let newAudio = m.audioMemo;

        if (m.author === oldP1) {
          newAuthor = newConfig.partner1Name;
          newInitial = newConfig.partner1Initial;
        } else if (m.author === oldP2) {
          newAuthor = newConfig.partner2Name;
          newInitial = newConfig.partner2Initial;
        }

        if (newReaction) {
          if (newReaction.author === oldP1) {
            newReaction = { ...newReaction, author: newConfig.partner1Name };
          } else if (newReaction.author === oldP2) {
            newReaction = { ...newReaction, author: newConfig.partner2Name };
          }
        }

        if (newAudio) {
          if (newAudio.author === oldP1) {
            newAudio = { ...newAudio, author: newConfig.partner1Name };
          } else if (newAudio.author === oldP2) {
            newAudio = { ...newAudio, author: newConfig.partner2Name };
          }
        }

        return {
          ...m,
          author: newAuthor,
          authorInitial: newInitial,
          reaction: newReaction,
          audioMemo: newAudio,
        };
      })
    );

    setActivePersona(newConfig.partner1Name);
    setCoupleConfig(newConfig);
  };

  const handleSaveMemory = (newMemory: MemoryItem) => {
    setMemories([newMemory, ...memories]);
  };

  const handleSaveVoiceMemento = (author: string, note: string, durationSeconds: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDuration = `0:${durationSeconds.toString().padStart(2, '0')}`;

    const newMemory: MemoryItem = {
      id: `voice-${Date.now()}`,
      circleId: currentCircle,
      author: author,
      authorInitial: author[0] || 'M',
      date: 'Sunday, Oct 20',
      dateKey: '2024-10-20',
      time: timeStr,
      photoUrl:
        author === coupleConfig.partner1Name
          ? ASSET_IMAGES.coffeeMugs
          : ASSET_IMAGES.laughingPark,
      altText: 'Audio memory capture',
      caption: note,
      likesCount: 1,
      isLiked: true,
      audioMemo: {
        duration: durationSeconds,
        durationFormatted: formattedDuration,
        author: author,
        soundwaveBars: [5, 12, 18, 22, 16, 20, 14, 18, 10, 12, 6],
      },
    };

    setMemories([newMemory, ...memories]);
  };

  const handleToggleLike = (memoryId: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === memoryId) {
          const isLiked = !m.isLiked;
          return {
            ...m,
            isLiked,
            likesCount: isLiked ? m.likesCount + 1 : Math.max(0, m.likesCount - 1),
          };
        }
        return m;
      })
    );
  };

  const handleUpdateSparkAnswer = (author: string, text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDailySparks((prev) =>
      prev.map((sp, idx) => {
        if (idx === 0) {
          if (author === coupleConfig.partner1Name) {
            return {
              ...sp,
              emmaAnswer: { text, time: timeStr, audioSeconds: 18 },
            };
          } else {
            return {
              ...sp,
              liamAnswer: { text, time: timeStr, audioSeconds: 24 },
            };
          }
        }
        return sp;
      })
    );
  };

  const handleAddAlbum = (newAlbum: Album) => {
    setAlbums([newAlbum, ...albums]);
  };

  return (
    <div className="bg-[#fff8f6] font-sans text-[#201a18] antialiased min-h-screen flex flex-col selection:bg-[#ffdbd0] selection:text-[#541400]">
      {/* Top Header with AppLogo & Couple Controls */}
      <Header
        currentCircle={currentCircle}
        onSelectCircle={setCurrentCircle}
        activePersona={activePersona}
        onTogglePersona={handleTogglePersona}
        onOpenProfile={() => setShowProfileModal(true)}
        coupleConfig={coupleConfig}
        onOpenEditCouple={() => setShowEditCoupleModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-24 pb-28 bg-[#fff8f6]">
        {activeTab === 'today' && (
          <TodayScreen
            memories={memories}
            dailySpark={todaySpark}
            currentCircle={currentCircle}
            activePersona={activePersona}
            onTogglePersona={handleTogglePersona}
            onOpenDailySpark={() => setShowDailySparkModal(true)}
            onOpenSnapModal={() => setShowSnapModal(true)}
            onOpenVoiceModal={() => setShowVoiceModal(true)}
            onOpenThrowback={() => setShowThrowbackModal(true)}
            onOpenInvite={() => setShowInviteModal(true)}
            onToggleLike={handleToggleLike}
            coupleConfig={coupleConfig}
            onOpenEditCouple={() => setShowEditCoupleModal(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarScreen
            memories={memories}
            activePersona={activePersona as 'Emma' | 'Liam'}
            currentCircle={currentCircle}
            onSelectDate={() => {}}
            onOpenSnapModal={() => setShowSnapModal(true)}
          />
        )}

        {activeTab === 'albums' && (
          <AlbumsScreen
            albums={albums}
            currentCircle={currentCircle}
            onAddAlbum={handleAddAlbum}
          />
        )}

        {activeTab === 'us' && (
          <UsScreen
            activePersona={activePersona}
            onTogglePersona={handleTogglePersona}
            onOpenDailySpark={() => setShowDailySparkModal(true)}
            onOpenInvite={() => setShowInviteModal(true)}
            memories={memories}
            coupleConfig={coupleConfig}
            onOpenEditCouple={() => setShowEditCoupleModal(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar (with updated Us icon) */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Interactive Modals */}
      {showDailySparkModal && (
        <DailySparkModal
          spark={todaySpark}
          activePersona={activePersona}
          onClose={() => setShowDailySparkModal(false)}
          onUpdateAnswer={handleUpdateSparkAnswer}
          coupleConfig={coupleConfig}
        />
      )}

      {showSnapModal && (
        <SnapMemoryModal
          activePersona={activePersona}
          currentCircle={currentCircle}
          onClose={() => setShowSnapModal(false)}
          onSaveMemory={handleSaveMemory}
          coupleConfig={coupleConfig}
        />
      )}

      {showVoiceModal && (
        <VoiceMementoModal
          activePersona={activePersona as 'Emma' | 'Liam'}
          onClose={() => setShowVoiceModal(false)}
          onSaveVoiceMemento={handleSaveVoiceMemento}
        />
      )}

      {showThrowbackModal && (
        <ThrowbackModal
          activePersona={activePersona as 'Emma' | 'Liam'}
          onClose={() => setShowThrowbackModal(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}

      {/* Edit Couple Names & Optional Partner Modal */}
      {showEditCoupleModal && (
        <EditCoupleModal
          coupleConfig={coupleConfig}
          onSave={handleUpdateCoupleConfig}
          onClose={() => setShowEditCoupleModal(false)}
        />
      )}

      {/* Profile & Persona Switcher Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 flex flex-col gap-4 text-center">
            <div className="relative mx-auto">
              <img
                src={ASSET_IMAGES.profileEmma}
                alt={coupleConfig.partner1Name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#fff8f6] shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#4b6453] rounded-full ring-2 ring-[#fff8f6]" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#201a18]">
                {coupleConfig.hasPartner
                  ? `${coupleConfig.partner1Name} & ${coupleConfig.partner2Name}'s Sanctuary`
                  : `${coupleConfig.partner1Name}'s Sanctuary`}
              </h3>
              <p className="text-xs text-[#88726c] mt-0.5">
                Active Perspective:{' '}
                <strong className="text-[#99462a]">{activePersona}</strong>
              </p>
            </div>

            <div className="bg-[#f8ebe6] p-3 rounded-2xl border border-[#dbc1b9]/40 flex flex-col gap-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-[#55433d]">Active Circle:</span>
                <span className="font-semibold text-[#201a18]">
                  {currentCircle === 'us'
                    ? coupleConfig.hasPartner
                      ? `Us (${coupleConfig.partner1Name} & ${coupleConfig.partner2Name})`
                      : `My Journal (${coupleConfig.partner1Name})`
                    : 'Family Circle'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#55433d]">
                  {coupleConfig.hasPartner ? 'Days Together:' : 'Journal Streak:'}
                </span>
                <span className="font-semibold text-[#99462a]">
                  Day {coupleConfig.streakDays || 284}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#55433d]">Partner Mode:</span>
                <span className="text-[#4b6453] font-semibold">
                  {coupleConfig.hasPartner ? 'Couple Space' : 'Solo Space'}
                </span>
              </div>
            </div>

            {coupleConfig.hasPartner && (
              <button
                type="button"
                onClick={handleTogglePersona}
                className="w-full py-2.5 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>
                  Switch perspective to{' '}
                  {activePersona === coupleConfig.partner1Name
                    ? coupleConfig.partner2Name
                    : coupleConfig.partner1Name}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setShowProfileModal(false);
                setShowEditCoupleModal(true);
              }}
              className="w-full py-2 rounded-full border border-[#dbc1b9] text-[#55433d] hover:bg-[#f2e6e1] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Couple Names &amp; Settings</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] font-semibold text-xs shadow-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
