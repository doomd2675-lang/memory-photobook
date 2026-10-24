// Web Audio API ambient audio synthesizer for voice mementos and voice memos
// Generates warm, comforting analog-style notes and soft tape warmth without relying on external MP3 URLs.

class SimpleAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private currentProgress = 0;
  private onProgressCb: ((seconds: number, isPlaying: boolean) => void) | null = null;
  private duration = 42;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMelody(durationSeconds = 42, onProgress?: (seconds: number, isPlaying: boolean) => void) {
    this.initContext();
    if (!this.ctx) return;

    this.duration = durationSeconds;
    this.onProgressCb = onProgress || null;
    this.isPlaying = true;

    // Play a gentle pentatonic sequence reminiscent of a personal audio note
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63, 293.66];
    let noteIdx = 0;

    const playChime = () => {
      if (!this.isPlaying || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft triangle tone for warm acoustic feel
      osc.type = 'triangle';
      const freq = notes[noteIdx % notes.length];
      noteIdx++;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Soft envelope
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    };

    // Trigger notes periodically
    playChime();
    const noteInterval = window.setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(noteInterval);
        return;
      }
      playChime();
    }, 1400);

    // Progress counter
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.currentProgress += 1;
      if (this.currentProgress >= this.duration) {
        this.stop();
        return;
      }
      if (this.onProgressCb) {
        this.onProgressCb(this.currentProgress, true);
      }
    }, 1000);

    if (this.onProgressCb) {
      this.onProgressCb(this.currentProgress, true);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentProgress = 0;
    if (this.onProgressCb) {
      this.onProgressCb(0, false);
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onProgressCb) {
      this.onProgressCb(this.currentProgress, false);
    }
  }

  toggle(durationSeconds = 42, onProgress?: (seconds: number, isPlaying: boolean) => void) {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.playMelody(durationSeconds, onProgress);
      return true;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const globalAudioSynthesizer = new SimpleAudioSynthesizer();
