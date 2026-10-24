export interface Reaction {
  emoji: string;
  author: string;
  note?: string;
  timestamp: string;
}

export interface AudioMemo {
  duration: number; // in seconds
  durationFormatted: string;
  author: string;
  soundwaveBars: number[];
}

export interface MemoryItem {
  id: string;
  circleId: 'us' | 'family';
  author: 'Emma' | 'Liam' | 'Grandma Rose' | string;
  authorInitial: string;
  authorRole?: string;
  date: string; // e.g. "Sunday, Oct 20, 2024"
  dateKey: string; // e.g. "2024-10-20"
  time: string; // e.g. "8:15 AM"
  photoUrl: string;
  altText: string;
  caption: string;
  likesCount: number;
  isLiked?: boolean;
  reaction?: Reaction;
  audioMemo?: AudioMemo;
  location?: string;
}

export interface DailySpark {
  id: string;
  question: string;
  date: string;
  dateKey: string;
  bothAnswered: boolean;
  emmaAnswer?: {
    text: string;
    time: string;
    audioSeconds?: number;
  };
  liamAnswer?: {
    text: string;
    time: string;
    audioSeconds?: number;
  };
}

export interface CircleMember {
  id: string;
  name: string;
  initial: string;
  avatar?: string;
  role: string;
  color: string;
}

export interface Circle {
  id: 'us' | 'family';
  name: string;
  subtitle: string;
  memberCount: number;
  members: CircleMember[];
}

export interface Album {
  id: string;
  title: string;
  chapterNumber: string;
  subtitle: string;
  coverPhoto: string;
  dateRange: string;
  memoryCount: number;
  description: string;
  circleId: 'us' | 'family';
  memories: MemoryItem[];
}

export interface CoupleConfig {
  partner1Name: string;
  partner1Initial: string;
  hasPartner: boolean;
  partner2Name: string;
  partner2Initial: string;
  circleTitle?: string;
  relationshipStartDate?: string;
  streakDays?: number;
}

export type TabType = 'today' | 'calendar' | 'albums' | 'us';
