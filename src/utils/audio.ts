// Web Audio API Procedural Sound Synthesizer for Soda Can Pop & Effervescence

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playCanCrack() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sharp Metallic Pop / Snap
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // 2. High-pressure gas release Hiss (Pink/White noise with bandpass sweep)
    const bufferSize = ctx.sampleRate * 0.75;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now + 0.02);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.65);
    filter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.75, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now + 0.02);
    whiteNoise.stop(now + 0.75);

    // 3. Bubbling Carbonation Fizz (Random micro-pops)
    for (let i = 0; i < 14; i++) {
      const bubbleTime = now + 0.1 + Math.random() * 0.8;
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = 'sine';
      const startFreq = 800 + Math.random() * 900;
      bOsc.frequency.setValueAtTime(startFreq, bubbleTime);
      bOsc.frequency.exponentialRampToValueAtTime(startFreq + 500, bubbleTime + 0.035);

      bGain.gain.setValueAtTime(0.08, bubbleTime);
      bGain.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.035);

      bOsc.connect(bGain);
      bGain.connect(ctx.destination);
      bOsc.start(bubbleTime);
      bOsc.stop(bubbleTime + 0.04);
    }
  }

  public playBubblePop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
