import React, { useState } from 'react';
import { CoupleConfig, DailySpark } from '../types';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface DailySparkModalProps {
  spark: DailySpark;
  activePersona: string;
  onClose: () => void;
  onUpdateAnswer: (author: string, text: string) => void;
  coupleConfig: CoupleConfig;
}

export const DailySparkModal: React.FC<DailySparkModalProps> = ({
  spark,
  activePersona,
  onClose,
  onUpdateAnswer,
  coupleConfig,
}) => {
  const { partner1Name, partner1Initial, hasPartner, partner2Name, partner2Initial } =
    coupleConfig;

  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState(
    activePersona === partner2Name
      ? spark.liamAnswer?.text || ''
      : spark.emmaAnswer?.text || ''
  );

  const handleToggleAudio = (author: string, seconds = 20) => {
    if (isPlayingAudio === author) {
      globalAudioSynthesizer.stop();
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(author);
      globalAudioSynthesizer.playMelody(seconds, (curr, playing) => {
        setAudioProgress(curr);
        if (!playing) {
          setIsPlayingAudio(null);
        }
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftAnswer.trim()) return;
    onUpdateAnswer(activePersona, draftAnswer.trim());
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 max-h-[90vh] overflow-y-auto flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="spark-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#8c4f23] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8c4f23]">
              Daily Spark · {spark.date}
            </span>
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

        {/* Prompt Question */}
        <div>
          <h2 id="spark-title" className="font-serif text-2xl text-[#201a18] leading-snug">
            {spark.question}
          </h2>
          <p className="text-xs text-[#88726c] mt-1">
            {hasPartner
              ? 'A small daily question to keep your hearts listening to one another.'
              : 'A mindful daily question for your personal reflections.'}
          </p>
        </div>

        {/* Answers Cards */}
        <div className="flex flex-col gap-4">
          {/* Partner 1's Answer Card */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#dbc1b9]/40 shadow-xs flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#d97757] text-[#ffffff] flex items-center justify-center text-xs font-semibold">
                  {partner1Initial}
                </div>
                <span className="text-sm font-semibold text-[#201a18]">{partner1Name}</span>
                <span className="text-[11px] text-[#88726c]">
                  {spark.emmaAnswer?.time || 'Pending response'}
                </span>
              </div>

              {spark.emmaAnswer?.audioSeconds && (
                <button
                  type="button"
                  onClick={() => handleToggleAudio(partner1Name, spark.emmaAnswer?.audioSeconds)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdbd0]/60 text-[#99462a] hover:bg-[#ffdbd0] text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPlayingAudio === partner1Name ? 'pause' : 'play_arrow'}
                  </span>
                  <span>
                    {isPlayingAudio === partner1Name
                      ? `0:${audioProgress.toString().padStart(2, '0')}`
                      : `0:${spark.emmaAnswer.audioSeconds}`}
                  </span>
                </button>
              )}
            </div>

            <div className="bg-[#fdf1ec]/50 rounded-xl p-3 border-l-2 border-[#99462a]">
              <p className="font-serif italic text-[15px] leading-relaxed text-[#201a18]">
                {spark.emmaAnswer?.text ? `“${spark.emmaAnswer.text}”` : `${partner1Name} hasn’t replied yet.`}
              </p>
            </div>
          </div>

          {/* Partner 2's Answer Card (if partner added) */}
          {hasPartner ? (
            <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#dbc1b9]/40 shadow-xs flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#4b6453] text-[#ffffff] flex items-center justify-center text-xs font-semibold">
                    {partner2Initial}
                  </div>
                  <span className="text-sm font-semibold text-[#201a18]">{partner2Name}</span>
                  <span className="text-[11px] text-[#88726c]">
                    {spark.liamAnswer?.time || 'Pending response'}
                  </span>
                </div>

                {spark.liamAnswer?.audioSeconds && (
                  <button
                    type="button"
                    onClick={() => handleToggleAudio(partner2Name, spark.liamAnswer?.audioSeconds)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cbe7d1]/50 text-[#506857] hover:bg-[#cbe7d1] text-xs font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isPlayingAudio === partner2Name ? 'pause' : 'play_arrow'}
                    </span>
                    <span>
                      {isPlayingAudio === partner2Name
                        ? `0:${audioProgress.toString().padStart(2, '0')}`
                        : `0:${spark.liamAnswer.audioSeconds}`}
                    </span>
                  </button>
                )}
              </div>

              <div className="bg-[#fdf1ec]/50 rounded-xl p-3 border-l-2 border-[#4b6453]">
                <p className="font-serif italic text-[15px] leading-relaxed text-[#201a18]">
                  {spark.liamAnswer?.text
                    ? `“${spark.liamAnswer.text}”`
                    : `${partner2Name} hasn’t replied yet.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#f8ebe6] rounded-2xl p-4 border border-dashed border-[#dbc1b9] text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#8c4f23] text-[22px]">
                favorite_border
              </span>
              <p className="text-xs text-[#55433d]">
                Adding a partner is optional. You can reflect solo or connect a partner anytime.
              </p>
            </div>
          )}
        </div>

        {/* Edit or Add Reflection Section */}
        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-semibold text-[#55433d]">
              Update your answer as {activePersona}:
            </label>
            <textarea
              rows={3}
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              placeholder="Write from the heart..."
              className="w-full p-3 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-sm text-[#201a18] focus:outline-none focus:ring-2 focus:ring-[#99462a]/50 resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#55433d] hover:bg-[#f2e6e1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] text-xs font-semibold shadow-sm transition-all"
              >
                Save My Spark
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-[#99462a] underline underline-offset-4 hover:text-[#7a2f15] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              <span>Edit my response ({activePersona})</span>
            </button>

            <span className="text-[11px] text-[#88726c]">Preserved in Our Vault</span>
          </div>
        )}
      </div>
    </div>
  );
};
