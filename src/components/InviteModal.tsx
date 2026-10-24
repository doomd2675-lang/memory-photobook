import React, { useState } from 'react';

interface InviteModalProps {
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [inviteName, setInviteName] = useState('Grandma Rose');
  const [role, setRole] = useState<'Family Elder' | 'Close Friend' | 'Family Member'>('Family Elder');
  const [allowAudioMemo, setAllowAudioMemo] = useState(true);

  const inviteLink = `https://us-and-ours.app/invite/family-circle?code=KINFOLK-${Math.abs(
    inviteName.length * 3421
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8c4f23] text-[22px]">
              group_add
            </span>
            <h2 id="invite-modal-title" className="font-serif text-xl font-semibold text-[#201a18]">
              Invite to Family Circle
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
          Allow loved ones to peek into your calm daily snapshots, leave warm voice memos, and share their own moments without algorithmic noise.
        </p>

        {/* Guest Setup */}
        <div className="flex flex-col gap-3 bg-[#f8ebe6] p-4 rounded-2xl border border-[#dbc1b9]/40">
          <div>
            <label className="text-[11px] font-semibold text-[#88726c] uppercase tracking-wider block mb-1">
              Who are you inviting?
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Grandma Rose, Sister Sophie"
              className="w-full px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#88726c] uppercase tracking-wider block mb-1">
              Relationship / Role
            </label>
            <div className="flex gap-2">
              {(['Family Elder', 'Family Member', 'Close Friend'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    role === r
                      ? 'bg-[#99462a] text-[#ffffff] shadow-xs'
                      : 'bg-[#ffffff] text-[#55433d] border border-[#dbc1b9]/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#55433d]">Allow voice message replies</span>
            <input
              type="checkbox"
              checked={allowAudioMemo}
              onChange={(e) => setAllowAudioMemo(e.target.checked)}
              className="w-4 h-4 accent-[#99462a] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Link Box */}
        <div className="bg-[#ffffff] p-3 rounded-2xl border border-[#dbc1b9]/50 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#88726c] uppercase tracking-wider">Private Invite Link</span>
            <span className="text-xs font-mono text-[#201a18] truncate">{inviteLink}</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-full bg-[#ffdbd0] hover:bg-[#ffb59e] text-[#541400] text-xs font-semibold shrink-0 transition-all flex items-center gap-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Done Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
