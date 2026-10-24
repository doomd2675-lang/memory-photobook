import React, { useState } from 'react';
import { CoupleConfig } from '../types';

interface EditCoupleModalProps {
  coupleConfig: CoupleConfig;
  onSave: (config: CoupleConfig) => void;
  onClose: () => void;
}

export const EditCoupleModal: React.FC<EditCoupleModalProps> = ({
  coupleConfig,
  onSave,
  onClose,
}) => {
  const [partner1Name, setPartner1Name] = useState(coupleConfig.partner1Name);
  const [hasPartner, setHasPartner] = useState(coupleConfig.hasPartner);
  const [partner2Name, setPartner2Name] = useState(coupleConfig.partner2Name || 'Noah');
  const [circleTitle, setCircleTitle] = useState(
    coupleConfig.circleTitle ||
      (coupleConfig.hasPartner
        ? `Us (${coupleConfig.partner1Name} & ${coupleConfig.partner2Name})`
        : `My Journal (${coupleConfig.partner1Name})`)
  );
  const [streakDays, setStreakDays] = useState(coupleConfig.streakDays || 284);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1Name.trim()) return;

    const p1Trimmed = partner1Name.trim();
    const p2Trimmed = partner2Name.trim() || 'Partner';

    const newConfig: CoupleConfig = {
      partner1Name: p1Trimmed,
      partner1Initial: p1Trimmed[0].toUpperCase(),
      hasPartner: hasPartner,
      partner2Name: p2Trimmed,
      partner2Initial: p2Trimmed[0].toUpperCase(),
      circleTitle:
        circleTitle.trim() ||
        (hasPartner ? `Us (${p1Trimmed} & ${p2Trimmed})` : `My Journal (${p1Trimmed})`),
      relationshipStartDate: coupleConfig.relationshipStartDate || 'Jan 10, 2024',
      streakDays: Number(streakDays) || 284,
    };

    onSave(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 max-h-[92vh] overflow-y-auto flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-couple-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#99462a] text-[22px]">
              edit_note
            </span>
            <h2 id="edit-couple-title" className="font-serif text-xl font-semibold text-[#201a18]">
              Names &amp; Journal Setup
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2e6e1] hover:bg-[#ece0db] text-[#55433d] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-[#55433d] leading-relaxed">
          Customize your name and choose whether to add a partner or keep this space as your personal keepsake journal.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Partner 1 (Primary User) */}
          <div className="flex flex-col gap-1.5 bg-[#ffffff] p-3.5 rounded-2xl border border-[#dbc1b9]/40 shadow-xs">
            <label className="text-xs font-semibold text-[#201a18] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#d97757] text-[#ffffff] flex items-center justify-center text-[10px] font-bold">
                {partner1Name ? partner1Name[0].toUpperCase() : '1'}
              </span>
              <span>Your Name (Primary Member)</span>
            </label>
            <input
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              placeholder="e.g. Maya, Emma, Alex"
              className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#dbc1b9] text-sm text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
              required
            />
          </div>

          {/* Add Partner (Optional) Toggle Card */}
          <div className="bg-[#f8ebe6] p-4 rounded-2xl border border-[#dbc1b9]/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4b6453] text-[20px]">
                  favorite
                </span>
                <div>
                  <span className="text-xs font-semibold text-[#201a18] block">
                    Add Partner (Optional)
                  </span>
                  <span className="text-[11px] text-[#55433d]">
                    {hasPartner ? 'Shared dual journal with partner' : 'Solo keepsake mode enabled'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHasPartner(!hasPartner)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  hasPartner ? 'bg-[#99462a]' : 'bg-[#dbc1b9]'
                }`}
                aria-pressed={hasPartner}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-[#ffffff] shadow-sm transform transition-transform ${
                    hasPartner ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Partner 2 input if partner added */}
            {hasPartner && (
              <div className="pt-2 border-t border-[#dbc1b9]/40 flex flex-col gap-1.5 animate-in fade-in duration-150">
                <label className="text-xs font-semibold text-[#201a18] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center text-[10px] font-bold">
                    {partner2Name ? partner2Name[0].toUpperCase() : '2'}
                  </span>
                  <span>Partner's Name</span>
                </label>
                <input
                  type="text"
                  value={partner2Name}
                  onChange={(e) => setPartner2Name(e.target.value)}
                  placeholder="e.g. Noah, Liam, Sam"
                  className="w-full px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-sm text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
                />
              </div>
            )}
          </div>

          {/* Quick preset name pairings */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#88726c] uppercase tracking-wider">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { p1: 'Maya', p2: 'Noah' },
                { p1: 'Chloe', p2: 'Oliver' },
                { p1: 'Elena', p2: 'Julian' },
                { p1: 'Emma', p2: 'Liam' },
                { p1: 'Maya', p2: '' }, // Solo
              ].map((pairing, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPartner1Name(pairing.p1);
                    if (pairing.p2) {
                      setHasPartner(true);
                      setPartner2Name(pairing.p2);
                      setCircleTitle(`Us (${pairing.p1} & ${pairing.p2})`);
                    } else {
                      setHasPartner(false);
                      setCircleTitle(`My Journal (${pairing.p1})`);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#ffffff] hover:bg-[#f2e6e1] text-[11px] font-medium text-[#55433d] border border-[#dbc1b9]/40 transition-colors"
                >
                  {pairing.p2 ? `${pairing.p1} & ${pairing.p2}` : `${pairing.p1} (Solo)`}
                </button>
              ))}
            </div>
          </div>

          {/* Days Together */}
          <div className="flex items-center justify-between bg-[#ffffff] p-3 rounded-2xl border border-[#dbc1b9]/40">
            <div>
              <span className="text-xs font-semibold text-[#201a18] block">
                {hasPartner ? 'Days Together' : 'Days Journaling'}
              </span>
              <span className="text-[11px] text-[#88726c]">Consecutive active days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="9999"
                value={streakDays}
                onChange={(e) => setStreakDays(Number(e.target.value))}
                className="w-20 px-2 py-1 rounded-lg bg-[#fff8f6] border border-[#dbc1b9] text-xs font-semibold text-[#99462a] text-center"
              />
              <span className="text-xs text-[#55433d]">days</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dbc1b9]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#55433d] hover:bg-[#f2e6e1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
