import React, { useState } from 'react';
import { ASSET_IMAGES } from '../data/mockData';
import { CoupleConfig, MemoryItem } from '../types';

interface SnapMemoryModalProps {
  activePersona: string;
  currentCircle: 'us' | 'family';
  onClose: () => void;
  onSaveMemory: (memory: MemoryItem) => void;
  coupleConfig: CoupleConfig;
}

const PRESET_MOMENTS = [
  {
    title: 'Autumn Golden Hour Walk',
    url: ASSET_IMAGES.laughingPark,
    caption: 'Leaves falling all around us, catching golden hour in the park.',
    location: 'Highbury Fields',
  },
  {
    title: 'Morning Coffee Ritual',
    url: ASSET_IMAGES.coffeeMugs,
    caption: 'Fresh beans, cozy linen, and peaceful light.',
    location: 'Kitchen table',
  },
  {
    title: 'Handmade Pasta & Wine',
    url: ASSET_IMAGES.pastaNight,
    caption: 'Simmered with love while slow jazz spun on the turntable.',
    location: 'Our flat',
  },
  {
    title: 'Rainy Day Reading Nook',
    url: ASSET_IMAGES.rainyWindow,
    caption: 'Watching droplets trace the glass with hot cinnamon tea.',
    location: 'Living room bay window',
  },
  {
    title: 'Grandma’s Sunday Baking',
    url: ASSET_IMAGES.grandmaKitchen,
    caption: 'Warm berry pie and stories that never get old.',
    location: 'Grandma’s Cottage',
  },
];

export const SnapMemoryModal: React.FC<SnapMemoryModalProps> = ({
  activePersona,
  currentCircle,
  onClose,
  onSaveMemory,
  coupleConfig,
}) => {
  const { partner1Name, hasPartner, partner2Name } = coupleConfig;
  const [author, setAuthor] = useState<string>(activePersona || partner1Name);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_MOMENTS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [caption, setCaption] = useState(PRESET_MOMENTS[0].caption);
  const [location, setLocation] = useState(PRESET_MOMENTS[0].location);
  const [attachVoiceMemo, setAttachVoiceMemo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectPreset = (preset: typeof PRESET_MOMENTS[0]) => {
    setSelectedPhoto(preset.url);
    setCaption(preset.caption);
    setLocation(preset.location);
    setCustomPhotoUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhoto(event.target.result as string);
          setCustomPhotoUrl(event.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMemory: MemoryItem = {
      id: `mem-${Date.now()}`,
      circleId: currentCircle,
      author: author,
      authorInitial: author[0],
      date: 'Sunday, Oct 20',
      dateKey: '2024-10-20',
      time: timeStr,
      photoUrl: selectedPhoto,
      altText: caption,
      caption: caption.trim(),
      likesCount: 0,
      isLiked: false,
      location: location.trim() || 'Home',
      ...(attachVoiceMemo
        ? {
            audioMemo: {
              duration: 34,
              durationFormatted: '0:34',
              author: author,
              soundwaveBars: [6, 14, 18, 12, 22, 16, 12, 15, 8, 11, 6],
            },
          }
        : {}),
    };

    onSaveMemory(newMemory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 max-h-[90vh] overflow-y-auto flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="snap-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#99462a] text-[22px]">
              photo_camera
            </span>
            <h2 id="snap-modal-title" className="font-serif text-xl font-semibold text-[#201a18]">
              Snap a Shared Moment
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Author Selector */}
          <div className="flex items-center justify-between bg-[#f8ebe6] p-2 rounded-2xl border border-[#dbc1b9]/40">
            <span className="text-xs font-semibold text-[#55433d] pl-2">Capture by:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAuthor(partner1Name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  author === partner1Name
                    ? 'bg-[#d97757] text-[#ffffff] shadow-sm'
                    : 'text-[#55433d] hover:bg-[#ece0db]'
                }`}
              >
                <span>{partner1Name}</span>
              </button>
              {hasPartner && (
                <button
                  type="button"
                  onClick={() => setAuthor(partner2Name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    author === partner2Name
                      ? 'bg-[#4b6453] text-[#ffffff] shadow-sm'
                      : 'text-[#55433d] hover:bg-[#ece0db]'
                  }`}
                >
                  <span>{partner2Name}</span>
                </button>
              )}
            </div>
          </div>

          {/* Photo Preview & Frame */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#ece0db] border border-[#dbc1b9]/50 shadow-inner group">
            <img
              src={selectedPhoto}
              alt="Moment preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-[1.01]"
            />
            <div className="absolute top-3 left-3 bg-[#fff8f6]/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-semibold text-[#201a18]">
              <span
                className={`w-3 h-3 rounded-full ${
                  author === 'Emma' ? 'bg-[#d97757]' : 'bg-[#4b6453]'
                }`}
              />
              <span>{author}</span>
            </div>

            {/* Upload or Camera replacement trigger */}
            <label className="absolute bottom-3 right-3 bg-[#201a18]/80 hover:bg-[#201a18] text-[#ffffff] px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md active:scale-95">
              <span className="material-symbols-outlined text-[16px]">upload</span>
              <span>{isUploading ? 'Loading...' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preset Photo Library Quick Selector */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#88726c] uppercase block mb-1.5">
              Or Choose from Today’s Roll:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_MOMENTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhoto === preset.url
                      ? 'border-[#99462a] ring-2 ring-[#ffdbd0]'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  title={preset.title}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Caption Field */}
          <div>
            <label className="text-xs font-semibold text-[#55433d] block mb-1">
              Journal Caption
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment tender?..."
              className="w-full p-3 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-sm text-[#201a18] focus:outline-none focus:ring-2 focus:ring-[#99462a]/50 resize-none"
            />
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#88726c] text-[18px]">
              location_on
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Kitchen nook, Highbury Park)"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
            />
          </div>

          {/* Attach Voice Memento Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#cbe7d1]/30 border border-[#cbe7d1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4b6453] text-[20px]">mic</span>
              <div>
                <p className="text-xs font-semibold text-[#201a18]">
                  Attach 30s Ambient Voice Note
                </p>
                <p className="text-[11px] text-[#55433d]">
                  Whisper a little love note with this snapshot
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAttachVoiceMemo(!attachVoiceMemo)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                attachVoiceMemo ? 'bg-[#4b6453]' : 'bg-[#dbc1b9]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-[#ffffff] shadow-sm transform transition-transform ${
                  attachVoiceMemo ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#55433d] hover:bg-[#f2e6e1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Publish to Dual Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
