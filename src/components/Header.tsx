import React from 'react';
import { ASSET_IMAGES } from '../data/mockData';
import { CoupleConfig } from '../types';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  currentCircle: 'us' | 'family';
  onSelectCircle: (circleId: 'us' | 'family') => void;
  activePersona: string;
  onTogglePersona: () => void;
  onOpenProfile: () => void;
  coupleConfig: CoupleConfig;
  onOpenEditCouple: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCircle,
  onSelectCircle,
  activePersona,
  onTogglePersona,
  onOpenProfile,
  coupleConfig,
  onOpenEditCouple,
}) => {
  const { partner1Name, hasPartner, partner2Name } = coupleConfig;

  const circleName = hasPartner
    ? `Us (${partner1Name} & ${partner2Name})`
    : `Us (${partner1Name})`;

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#fff8f6]/92 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(42,36,33,0.05)] border-b border-[#dbc1b9]/30">
      <div className="max-w-4xl mx-auto h-20 px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Lockup with Proper Vector AppLogo */}
        <div className="flex items-center gap-2.5">
          <AppLogo size={34} />
          <div className="flex flex-col">
            <span className="font-serif text-[20px] sm:text-[22px] font-semibold text-[#99462a] tracking-tight leading-none">
              Us &amp; Ours
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#8c4f23] font-medium hidden sm:inline">
              Keepsakes &amp; Moments
            </span>
          </div>
        </div>

        {/* Center: Circle Switcher Tabs */}
        <div className="flex items-center bg-[#f8ebe6] rounded-full p-1 shadow-[inset_0_1px_3px_rgba(42,36,33,0.06)] border border-[#dbc1b9]/40 max-w-[280px] sm:max-w-none">
          <button
            type="button"
            onClick={() => onSelectCircle('us')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 truncate ${
              currentCircle === 'us'
                ? 'bg-[#fff8f6] text-[#99462a] shadow-[0_2px_8px_rgba(42,36,33,0.08)]'
                : 'text-[#55433d] hover:text-[#201a18]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
                currentCircle === 'us' ? 'bg-[#d97757] opacity-100' : 'opacity-0'
              }`}
            />
            <span className="truncate">{circleName}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCircle('family')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              currentCircle === 'family'
                ? 'bg-[#fff8f6] text-[#99462a] shadow-[0_2px_8px_rgba(42,36,33,0.08)]'
                : 'text-[#55433d] hover:text-[#201a18]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                currentCircle === 'family' ? 'bg-[#d97757] opacity-100' : 'opacity-0'
              }`}
            />
            <span>Family Circle</span>
          </button>
        </div>

        {/* Right: Active Persona Switcher, Optional Partner prompt & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {hasPartner ? (
            <button
              type="button"
              onClick={onTogglePersona}
              title={`Posting as ${activePersona} (Click to switch to ${
                activePersona === partner1Name ? partner2Name : partner1Name
              })`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-xs font-medium text-[#55433d] transition-colors"
            >
              <span className="text-[11px] text-[#88726c]">Active:</span>
              <span className="font-semibold text-[#99462a]">{activePersona}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenEditCouple}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#cbe7d1]/50 hover:bg-[#cbe7d1] text-xs font-semibold text-[#506857] transition-colors"
              title="Add a partner to this journal (optional)"
            >
              <span className="material-symbols-outlined text-[14px]">person_add</span>
              <span>+ Add Partner</span>
            </button>
          )}

          {/* Quick Edit Names Cog / Pencil */}
          <button
            type="button"
            onClick={onOpenEditCouple}
            className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] flex items-center justify-center transition-colors"
            title="Edit couple names &amp; partner settings"
            aria-label="Edit couple names"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="User profile and settings"
            className="relative flex items-center justify-center p-0.5 rounded-full bg-[#f2e6e1] ring-1 ring-[#dbc1b9]/50 hover:ring-[#99462a]/50 transition-all active:scale-95 shrink-0"
          >
            <img
              alt={partner1Name}
              className="w-8 h-8 rounded-full object-cover"
              src={ASSET_IMAGES.profileEmma}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4b6453] rounded-full ring-2 ring-[#fff8f6]" />
          </button>
        </div>
      </div>
    </header>
  );
};
