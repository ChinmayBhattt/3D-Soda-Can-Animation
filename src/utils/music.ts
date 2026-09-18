// Web Audio API Procedural Lo-Fi Chill Refreshment Music Engine
// Smooth, refreshing ambient soundtrack for Blender Juice 3D experience

class MusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;
  private currentStep: number = 0;

  // 80 BPM chill lofi tempo
  private tempo = 80;
  private stepDuration = 60 / this.tempo / 4; // 16th note

  // Chord Progression: Fmaj9 -> G6 -> Em7 -> Am9 (Refreshing, uplifting summer vibe)
  private chords = [
    { bass: 87.31, notes: [174.61, 261.63, 329.63, 392.0, 440.0] }, // Fmaj9
    { bass: 98.0, notes: [196.0, 293.66, 392.0, 493.88, 659.25] },  // G6
    { bass: 82.41, notes: [164.81, 246.94, 293.66, 392.0, 493.88] }, // Em7
    { bass: 110.0, notes: [220.0, 261.63, 329.63, 392.0, 493.88] }, // Am9
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a soft warm synth note
  private playSynthNote(freq: number, startTime: number, duration: number, vol = 0.08) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm triangle + sine blend
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle detune for analog warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Play soft analog tape kick
  private playKick(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, startTime);
    osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.12);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  }

  // Play soft lofi snare / rim click
  private playSnare(startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.13);
  }

  // Play soft shaker on 8th notes
  private playShaker(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.05);
  }

  private tick = () => {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const step16 = this.currentStep % 64; // 4 bars = 64 16th steps
    const chordIndex = Math.floor(step16 / 16);
    const stepInBar = step16 % 16;
    const chord = this.chords[chordIndex];

    // Play Chords on step 0 and gentle arpeggio swell on step 8
    if (stepInBar === 0) {
      // Warm bass
      this.playSynthNote(chord.bass, now, this.stepDuration * 14, 0.18);
      // Chords
      chord.notes.forEach((freq, idx) => {
        this.playSynthNote(freq, now + idx * 0.02, this.stepDuration * 12, 0.06);
      });
    } else if (stepInBar === 8) {
      // Gentle chord pulse
      chord.notes.slice(1).forEach((freq, idx) => {
        this.playSynthNote(freq, now + idx * 0.025, this.stepDuration * 6, 0.045);
      });
    }

    // Drums Groove
    // Kick on 0, 10
    if (stepInBar === 0 || stepInBar === 10) {
      this.playKick(now);
    }

    // Snare on 4, 12
    if (stepInBar === 4 || stepInBar === 12) {
      this.playSnare(now);
    }

    // Shakers on even 16th steps (every 8th note)
    if (stepInBar % 2 === 0) {
      this.playShaker(now);
    }

    this.currentStep++;
  };

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.currentStep = 0;
      this.intervalId = window.setInterval(this.tick, this.stepDuration * 1000);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const musicEngine = new MusicEngine();
