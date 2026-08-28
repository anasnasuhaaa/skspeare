"use client";

// ============================================================
// Procedural Web Audio API Sound Synthesizer
// Generates 100% self-contained sound effects in pure code
// without any external audio assets (.mp3/.ogg)
// ============================================================

class SoundFX {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
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
  }

  // Create a buffer of white noise for whooshes and splashes
  private createNoiseBuffer(duration = 0.5): AudioBuffer | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Zombie Guttural Growl / Snarl (Procedural Horror Voice)
  playZombieGrowl() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Throaty Low Oscillators with Formant Resonance
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";

      osc1.frequency.setValueAtTime(70, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.75);

      osc2.frequency.setValueAtTime(74, now);
      osc2.frequency.exponentialRampToValueAtTime(116, now + 0.25);
      osc2.frequency.exponentialRampToValueAtTime(48, now + 0.75);

      // Vocal Throat Formant Filter
      const formant = ctx.createBiquadFilter();
      formant.type = "bandpass";
      formant.Q.setValueAtTime(4.0, now);
      formant.frequency.setValueAtTime(420, now);
      formant.frequency.exponentialRampToValueAtTime(780, now + 0.3);
      formant.frequency.exponentialRampToValueAtTime(260, now + 0.75);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.24, now + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      // Guttural Breath Noise
      const noiseBuffer = this.createNoiseBuffer(0.8);
      if (noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.Q.setValueAtTime(3.0, now);
        noiseFilter.frequency.setValueAtTime(650, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(350, now + 0.75);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.8);
      }

      osc1.connect(formant);
      osc2.connect(formant);
      formant.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.82);
      osc2.stop(now + 0.82);
    } catch {}
  }

  // 2. Katana Whoosh (Airy, metallic blade slicing through air)
  playWhoosh(intensity = 1.0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const noiseBuffer = this.createNoiseBuffer(0.3);
      if (!noiseBuffer) return;

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(3.5, now);
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(
        Math.min(3200 * intensity, 12000),
        now + 0.1
      );
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.28);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22 * intensity, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      // High metallic sine overtone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1600 * intensity, now);
      osc.frequency.exponentialRampToValueAtTime(2800 * intensity, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.08 * intensity, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noiseSource.start(now);
      osc.start(now);
      noiseSource.stop(now + 0.3);
      osc.stop(now + 0.3);
    } catch {}
  }

  // 3. Blood Slash & Crisp Katana Cut Impact
  playSlashCut() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Deep meat/body slice impact (pitch-dropping saw)
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

      const oscFilter = ctx.createBiquadFilter();
      oscFilter.type = "lowpass";
      oscFilter.frequency.setValueAtTime(1400, now);
      oscFilter.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Sharp steel blade bite (high resonance ping)
      const ping = ctx.createOscillator();
      ping.type = "triangle";
      ping.frequency.setValueAtTime(2400, now);
      ping.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      const pingGain = ctx.createGain();
      pingGain.gain.setValueAtTime(0.35, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      ping.connect(pingGain);
      pingGain.connect(ctx.destination);

      // Wet blood splatter burst (filtered noise)
      const noiseBuffer = this.createNoiseBuffer(0.25);
      if (noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(1200, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.28, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.25);
      }

      osc.start(now);
      ping.start(now);
      osc.stop(now + 0.25);
      ping.stop(now + 0.2);
    } catch {}
  }

  // 4. Crystal Purification Chimes (Heavenly arpeggios + harmonic bell resonance)
  playCrystalPurification() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Pentatonic / Crystal Chord Frequencies (C6, E6, G6, B6, C7, E7)
      const chimes = [1046.5, 1318.5, 1567.98, 1975.5, 2093.0, 2637.0];

      chimes.forEach((freq, i) => {
        const startTime = now + i * 0.055;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        // Sub harmonic shimmer
        const shimmer = ctx.createOscillator();
        shimmer.type = "triangle";
        shimmer.frequency.setValueAtTime(freq * 2.01, startTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.85);

        const shimmerGain = ctx.createGain();
        shimmerGain.gain.setValueAtTime(0.001, startTime);
        shimmerGain.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(ctx.destination);

        osc.start(startTime);
        shimmer.start(startTime);
        osc.stop(startTime + 0.9);
        shimmer.stop(startTime + 0.7);
      });
    } catch {}
  }

  // 5. Deep Sub-bass Impact Rumble (For screen shake power fantasy)
  playSubRumble() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {}
  }
}

export const soundFX = new SoundFX();
