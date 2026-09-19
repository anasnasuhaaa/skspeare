// Whimsical Fairytale Web Audio API Synthesizer
// Provides enchanted harp ambiance, magical chimes, and dress-up sound effects

class FairySoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: ReturnType<typeof setInterval> | null = null;
  public isMuted: boolean = false;
  private isPlayingMusic: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("fae_sound_muted");
      if (saved !== null) {
        this.isMuted = saved === "true";
      }
    }
  }

  private getContext(): AudioContext | null {
    if (this.isMuted || typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fae_sound_muted", String(this.isMuted));
    }
    if (this.isMuted) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
    return this.isMuted;
  }

  // Play a soft, crystal bell/harp chime
  playBell(freq: number, duration: number = 1.4, volume: number = 0.07) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with overtone for an ethereal music box timbre
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      // Subtle warm sub-harmonic for celestial body
      if (freq > 400) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(freq * 0.5, now);
        subGain.gain.setValueAtTime(volume * 0.25, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + duration * 0.7 + 0.05);
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Magical sparkle twinkle on selecting dress-up item
  playSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBell(freq, 0.45, 0.045);
        }, idx * 40);
      });
    } catch {}
  }

  // Soft fairy flutter / leaf whoosh
  playFlutter() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.16);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Secret garden door opening sound: deep resonant forest chime followed by ascending magical cascade
  playDoorOpen() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Resonant deep wooden chime
      const oscBass = ctx.createOscillator();
      const gainBass = ctx.createGain();
      oscBass.type = "sine";
      oscBass.frequency.setValueAtTime(196, now); // G3
      gainBass.gain.setValueAtTime(0.12, now);
      gainBass.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      oscBass.connect(gainBass);
      gainBass.connect(ctx.destination);
      oscBass.start(now);
      oscBass.stop(now + 2.6);

      // Cascading light chimes
      const fanfare = [392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      fanfare.forEach((f, i) => {
        setTimeout(() => {
          this.playBell(f, 0.85, 0.065);
        }, 140 + i * 105);
      });
    } catch {}
  }

  // Start gentle fairytale ambient arpeggiated music
  startAmbientMusic() {
    if (this.isMuted || this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Pentatonic fairytale melody pattern
    const scale = [
      523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51,
    ]; // C5, D5, E5, G5, A5, C6, D6, E6
    const pattern = [0, 2, 4, 3, 5, 4, 2, 1, 0, 3, 5, 7, 5, 4, 2, 0];
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (this.isMuted) return;
      const freq = scale[pattern[step % pattern.length]];
      const vol = step % 4 === 0 ? 0.03 : 0.018;
      this.playBell(freq, 1.8, vol);
      step++;
    }, 650);
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundEngine = new FairySoundEngine();
