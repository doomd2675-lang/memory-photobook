import React, { useState, useEffect, useRef } from 'react';
import { globalAudioSynthesizer } from '../utils/audioPlayer';

interface VoiceMementoModalProps {
  activePersona: 'Emma' | 'Liam';
  onClose: () => void;
  onSaveVoiceMemento: (author: string, note: string, durationSeconds: number) => void;
}

export const VoiceMementoModal: React.FC<VoiceMementoModalProps> = ({
  activePersona,
  onClose,
  onSaveVoiceMemento,
}) => {
  const [author, setAuthor] = useState<'Emma' | 'Liam'>(activePersona);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [note, setNote] = useState('Whispered from our morning stroll');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      globalAudioSynthesizer.stop();
    };
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedDuration(0);
    setHasRecorded(false);
    setIsPlayingPreview(false);

    timerRef.current = window.setInterval(() => {
      setRecordedDuration((prev) => {
        if (prev >= 60) {
          handleStopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setHasRecorded(true);
  };

  const handleTogglePreview = () => {
    if (isPlayingPreview) {
      globalAudioSynthesizer.stop();
      setIsPlayingPreview(false);
    } else {
      setIsPlayingPreview(true);
      globalAudioSynthesizer.playMelody(recordedDuration || 24, (_, playing) => {
        if (!playing) setIsPlayingPreview(false);
      });
    }
  };

  const handleSave = () => {
    const finalDuration = recordedDuration || 28;
    onSaveVoiceMemento(author, note.trim() || 'Voice memento', finalDuration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a18]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#fff8f6] rounded-3xl p-6 shadow-2xl border border-[#dbc1b9]/60 flex flex-col gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4b6453] text-[22px]">mic</span>
            <h2 id="voice-modal-title" className="font-serif text-xl font-semibold text-[#201a18]">
              Record Voice Memento
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

        {/* Vintage Cassette / Reel Box */}
        <div className="bg-[#201a18] text-[#fbeee9] rounded-2xl p-5 shadow-lg border border-[#362f2c] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Tape Label */}
          <div className="w-full bg-[#f8ebe6] text-[#201a18] px-3 py-1.5 rounded-lg mb-4 flex items-center justify-between border-b-2 border-[#d97757]">
            <span className="font-serif text-xs font-semibold tracking-wide">
              Side A · Us &amp; Ours Keepsake
            </span>
            <span className="text-[10px] font-mono text-[#88726c] uppercase">Analog Tape</span>
          </div>

          {/* Cassette Spools with Rotation */}
          <div className="w-full flex items-center justify-around py-3 px-4 bg-[#362f2c] rounded-xl border border-[#55433d]">
            <div
              className={`w-12 h-12 rounded-full border-4 border-dashed border-[#dbc1b9] flex items-center justify-center ${
                isRecording || isPlayingPreview ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#ffdbd0]" />
            </div>

            {/* Tape Window */}
            <div className="h-6 w-20 bg-[#201a18] rounded border border-[#55433d] flex items-center justify-center">
              <div className="h-1 w-14 bg-[#99462a] rounded-full" />
            </div>

            <div
              className={`w-12 h-12 rounded-full border-4 border-dashed border-[#dbc1b9] flex items-center justify-center ${
                isRecording || isPlayingPreview ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#ffdbd0]" />
            </div>
          </div>

          {/* Live Waveform Indicator */}
          <div className="w-full flex items-center justify-center gap-1.5 h-8 mt-4">
            {[4, 12, 18, 24, 14, 20, 26, 16, 8, 14, 20, 10, 6].map((bar, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isRecording || isPlayingPreview ? 'bg-[#cbe7d1]' : 'bg-[#55433d]'
                }`}
                style={{
                  height: isRecording || isPlayingPreview ? `${Math.max(6, (bar * (i % 2 === 0 ? 1.2 : 0.8)) % 28)}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Time Counter */}
          <div className="text-sm font-mono tracking-widest mt-2 text-[#ffdbd0]">
            00:{recordedDuration.toString().padStart(2, '0')}
            {isRecording && <span className="inline-block w-2 h-2 rounded-full bg-[#ba1a1a] ml-2 animate-ping" />}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-3">
          {!hasRecorded && !isRecording && (
            <button
              type="button"
              onClick={handleStartRecording}
              className="px-6 py-3 rounded-full bg-[#ba1a1a] hover:bg-[#93000a] text-[#ffffff] font-semibold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              <span>Hold to Record Whisper</span>
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-6 py-3 rounded-full bg-[#201a18] hover:bg-[#362f2c] text-[#ffffff] font-semibold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">stop</span>
              <span>Finish Recording</span>
            </button>
          )}

          {hasRecorded && !isRecording && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePreview}
                className="px-4 py-2 rounded-full bg-[#cbe7d1] hover:bg-[#b2cdb9] text-[#082013] font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlayingPreview ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlayingPreview ? 'Pause Note' : 'Listen Back'}</span>
              </button>

              <button
                type="button"
                onClick={handleStartRecording}
                className="px-3 py-2 rounded-full text-xs text-[#88726c] hover:text-[#201a18]"
              >
                Re-record
              </button>
            </div>
          )}
        </div>

        {/* Note / Memo Details */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#55433d]">Note for partner</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Whispered from our Sunday morning walk"
            className="w-full px-3 py-2 rounded-xl bg-[#ffffff] border border-[#dbc1b9] text-xs text-[#201a18] focus:outline-none focus:ring-1 focus:ring-[#99462a]"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#88726c]">Speaker:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAuthor('Emma')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  author === 'Emma' ? 'bg-[#d97757] text-[#ffffff]' : 'bg-[#f2e6e1] text-[#55433d]'
                }`}
              >
                Emma
              </button>
              <button
                type="button"
                onClick={() => setAuthor('Liam')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  author === 'Liam' ? 'bg-[#4b6453] text-[#ffffff]' : 'bg-[#f2e6e1] text-[#55433d]'
                }`}
              >
                Liam
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dbc1b9]/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#55433d] hover:bg-[#f2e6e1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasRecorded && !recordedDuration}
            className={`px-5 py-2 rounded-full font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 ${
              hasRecorded || recordedDuration > 0
                ? 'bg-[#99462a] hover:bg-[#7a2f15] text-[#ffffff] active:scale-95'
                : 'bg-[#dbc1b9] text-[#55433d] cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Save to Story</span>
          </button>
        </div>
      </div>
    </div>
  );
};
