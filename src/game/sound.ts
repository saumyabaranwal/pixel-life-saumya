export type SoundEffect = 'jump' | 'pickup' | 'crash' | 'complete';

interface Tone {
  type: OscillatorType;
  freq: number;
  endFreq?: number;
  start: number;
  duration: number;
  volume: number;
}

const EFFECTS: Record<SoundEffect, Tone[]> = {
  jump: [
    { type: 'triangle', freq: 260, endFreq: 720, start: 0, duration: 0.16, volume: 0.14 },
    { type: 'sine', freq: 520, endFreq: 1440, start: 0, duration: 0.1, volume: 0.05 },
  ],
  pickup: [
    { type: 'triangle', freq: 660, start: 0, duration: 0.1, volume: 0.12 },
    { type: 'triangle', freq: 880, start: 0.09, duration: 0.1, volume: 0.12 },
    { type: 'triangle', freq: 1320, start: 0.18, duration: 0.2, volume: 0.12 },
  ],
  crash: [{ type: 'sawtooth', freq: 220, endFreq: 55, start: 0, duration: 0.35, volume: 0.1 }],
  complete: [
    { type: 'triangle', freq: 523, start: 0, duration: 0.14, volume: 0.12 },
    { type: 'triangle', freq: 659, start: 0.12, duration: 0.14, volume: 0.12 },
    { type: 'triangle', freq: 784, start: 0.24, duration: 0.14, volume: 0.12 },
    { type: 'triangle', freq: 1046, start: 0.36, duration: 0.4, volume: 0.12 },
  ],
};

export interface SoundEngine {
  play: (effect: SoundEffect) => void;
}

export function createSoundEngine(): SoundEngine {
  let context: AudioContext | null = null;

  return {
    play(effect) {
      if (!context) context = new AudioContext();
      if (context.state === 'suspended') void context.resume();

      const now = context.currentTime;
      for (const tone of EFFECTS[effect]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const startAt = now + tone.start;
        const endAt = startAt + tone.duration;

        oscillator.type = tone.type;
        oscillator.frequency.setValueAtTime(tone.freq, startAt);
        if (tone.endFreq) oscillator.frequency.exponentialRampToValueAtTime(tone.endFreq, endAt);

        gain.gain.setValueAtTime(tone.volume, startAt);
        gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(endAt + 0.02);
      }
    },
  };
}
