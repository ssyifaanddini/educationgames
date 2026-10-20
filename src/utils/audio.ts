// Web Audio API Synthesizer - works 100% offline with zero external audio assets!
// Default is muted (off by default) as specified in user request.

class AudioManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true; // Off by default

  constructor() {
    // Check saved preference if available
    const saved = localStorage.getItem('gambreng_sound_enabled');
    if (saved === 'true') {
      this.isMuted = false;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('gambreng_sound_enabled', (!this.isMuted).toString());
    if (!this.isMuted) {
      this.initCtx();
      this.playClick();
    }
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext failed
    }
  }

  public playDiceRoll() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Series of tiny wooden clicks
      for (let i = 0; i < 4; i++) {
        const time = this.ctx.currentTime + i * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + Math.random() * 200, time);
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.04);
      }
    } catch {
      // Ignore audio error
    }
  }

  public playPawnHop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  public playCardDraw() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {
      // Ignore
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Arpeggio C5, E5, G5, C6 (Twinkle fanfare)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Gentle warm wobble chime (non-punishing "Coba lagi ya!")
      const notes = [440, 392];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = this.ctx.currentTime + idx * 0.15;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.4 },
      ];
      let offset = 0;
      melody.forEach(item => {
        if (!this.ctx) return;
        const time = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + item.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + item.d);
        offset += item.d;
      });
    } catch {
      // Ignore
    }
  }
}

export const audio = new AudioManager();
