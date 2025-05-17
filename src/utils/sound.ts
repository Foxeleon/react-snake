
import { Environment, FoodType } from '@/types/gameTypes.ts';
import { useGameStore } from '@/store/gameStore';

/* ---------- типы звуковых эффектов ---------- */
export type SoundEffect =
    | 'eat'
    | 'eat_special'
    | 'penalty'
    | 'game_over'
    | 'level_up'
    | 'move'
    | 'start_game'
    | 'game_paused'
    | 'game_resumed';               // ← добавили

/* ---------- AudioContext ---------- */
let audioContext: AudioContext | null = null;

export const initAudio = (): void => {
  if (audioContext === null) {
    audioContext = new (window.AudioContext ||
        // @ts-ignore
        window.webkitAudioContext)();
  }
};

const playTone = (
    audioContext: AudioContext,
    startFreq: number,
    endFreq: number | null = null,
    volume: number = 0.25,
    duration: number = 0.8,
    oscillatorType: OscillatorType = 'sine',
    startTime: number = 0
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure oscillator
  oscillator.type = oscillatorType;
  oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime + startTime);

  if (endFreq && endFreq !== startFreq) {
    oscillator.frequency.exponentialRampToValueAtTime(
        endFreq,
        audioContext.currentTime + startTime + duration
    );
  }

  // Configure smoother envelope
  gainNode.gain.setValueAtTime(0.001, audioContext.currentTime + startTime);
  // Smoother attack (0.03s)
  gainNode.gain.exponentialRampToValueAtTime(
      volume,
      audioContext.currentTime + startTime + Math.min(duration * 0.3, 0.03)
  );
  // Smooth release
  gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + startTime + duration
  );

  // Start and stop oscillator
  oscillator.start(audioContext.currentTime + startTime);
  oscillator.stop(audioContext.currentTime + startTime + duration);

  return { oscillator, gainNode };
};

const playBeep = (
    audioContext: AudioContext,
    frequency: number,
    volume: number = 0.3,
    attackTime: number = 0.03,
    releaseTime: number = 0.15,
    startTime: number = 0
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Connect the audio nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Configure envelope
  gainNode.gain.setValueAtTime(0.001, audioContext.currentTime + startTime);
  gainNode.gain.exponentialRampToValueAtTime(
      volume,
      audioContext.currentTime + startTime + attackTime
  );
  gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + startTime + releaseTime
  );

  // Start and stop oscillator
  oscillator.start(audioContext.currentTime + startTime);
  oscillator.stop(audioContext.currentTime + startTime + releaseTime);

  return { oscillator, gainNode };
};

/* ---------- основной проигрыватель ---------- */
export const playSound = (
    effect: SoundEffect,
    environment: Environment = 'jungle',
    foodType?: FoodType
): void => {
  const { settings } = useGameStore.getState();
  if (!settings.soundEnabled) return;

  if (!audioContext) initAudio();
  if (!audioContext) return;

  /*----- создаём локальный осциллятор ‑----*/
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (effect) {
    case 'eat': {
      if (!foodType) return;

      const freqMap: Record<FoodType, number> = {
        common: 330,
        medium: 440,
        rare: 550,
        penalty: 220,
        special: 660
      };

      const startFreq = freqMap[foodType];
      const endFreq = startFreq * 1.5;
      const duration = foodType === 'rare' ? 0.4 : 0.3;
      const volume = 0.22;

      playTone(
          audioContext,
          startFreq,
          endFreq,
          volume,
          duration,
          'square'
      );
      break;
    }

    case 'eat_special': {
      // Create a more distinctive sound with multiple harmonics
      // Main tone - higher pitch with nice sweep
      playTone(
          audioContext,
          880,        // Starting at A5
          1760,       // Up to A6
          0.2,        // Moderate volume
          0.3,        // Main sound duration
          'triangle'  // Smoother triangle wave
      );

      // Secondary tone with slight delay for richer sound
      playTone(
          audioContext,
          660,        // Starting at E5
          1320,       // Up to E6
          0.15,       // Lower volume for secondary tone
          0.25,       // Slightly shorter duration
          'sine',     // Smoother sine wave
          0.05        // Slight delay after first tone
      );
      break;
    }

    case 'penalty': {
      // Create a more distinctive error sound with two tones
      // First tone - high to low sweep
      playTone(
          audioContext,
          440,        // Starting at A4
          110,        // Down to A2
          0.2,        // Volume
          0.3,        // Duration
          'sawtooth'  // Harsh sawtooth for error sound
      );

      // Secondary tone with slight delay for more impactful effect
      playTone(
          audioContext,
          330,        // Starting at E4
          82.5,       // Down to E2
          0.15,       // Lower volume for secondary tone
          0.35,       // Slightly longer duration
          'sawtooth', // Keep the harsh sawtooth
          0.08        // Slight delay after first tone
      );
      break;
    }

    case 'start_game': {
      /*
        Smoother, lower melody: G4 → B4 → D5 → G5 + final note D5
        Using sine waves instead of square, with slight overlap for smoother transitions
        Each note slightly longer (0.15s) with smoother envelopes
      */
      const melody = [
        { note: 392.00, type: 'sine', duration: 0.15 }, // G4 (instead of C5)
        { note: 493.88, type: 'sine', duration: 0.15 }, // B4 (instead of E5)
        { note: 587.33, type: 'sine', duration: 0.15 }, // D5 (instead of G5)
        { note: 783.99, type: 'sine', duration: 0.15 }, // G5 (instead of C6)
      ];

      // Play each note with a small overlap for smooth transition
      melody.forEach((item, idx) => {
        playTone(
            audioContext!,
            item.note,
            null,         // No pitch bend within notes
            0.22,         // Slightly lower volume
            item.duration,
            item.type as OscillatorType,
            idx * 0.12    // Slight overlap between notes (120ms spacing instead of 90ms)
        );
      });

      // Final note is longer and uses sine with slight pitch bend down
      playTone(
          audioContext,
          587.33,        // D5 (instead of G5)
          554.37,        // Slight bend down to C#5 for resolution
          0.20,          // Slightly lower volume
          0.25,          // Longer final note
          'sine',        // Smoother sine wave instead of triangle
          melody.length * 0.12  // Start after the melody finishes
      );
      break;
    }

    case 'game_over': {
      // First tone: lower starting pitch, smooth sine wave
      // Original: 1318.5Hz (E6) to 196Hz (G3)
      // New: 880Hz (A5) to 146.8Hz (D3) - lower overall pitch
      playTone(
          audioContext,
          880,    // A5 - lower starting frequency
          146.8,  // D3 - lower ending frequency
          0.25,   // volume
          1.0     // slightly longer duration for more dramatic effect
      );

      // Second tone: smoother sine wave instead of harsh square
      // Original: square wave 659.25Hz (E5) to 98Hz (G2)
      // New: sine wave 440Hz (A4) to 73.4Hz (D2) - smoother and lower
      playTone(
          audioContext,
          440,    // A4 - lower starting frequency
          73.4,   // D2 - lower ending frequency
          0.2,    // slightly lower volume
          1.1,    // slightly longer duration
          'sine', // smoother sine wave instead of harsh square
          0.08    // slight delay (80ms) after first tone starts
      );
      break;
    }

    case 'level_up':
      [330, 392, 494, 587, 659, 784, 880].forEach((f, idx) => {
        setTimeout(() => {
          if (!audioContext) return;
          const o = audioContext.createOscillator();
          const g = audioContext.createGain();
          o.connect(g);
          g.connect(audioContext.destination);

          o.type = 'square';
          o.frequency.setValueAtTime(f, audioContext.currentTime);

          g.gain.setValueAtTime(0.2, audioContext.currentTime);
          g.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.15
          );

          o.start();
          o.stop(audioContext.currentTime + 0.15);
        }, idx * 100);
      });
      break;

    case 'game_paused': {
      // First beep (higher tone)
      playBeep(audioContext, 440, 0.3);

      // Second beep (lower tone) after delay
      playBeep(audioContext, 330, 0.25, 0.03, 0.15, 0.12);
      break;
    }
    case 'game_resumed': {
      // First beep (lower tone)
      playBeep(audioContext, 330, 0.3);

      // Second beep (higher tone) after delay
      playBeep(audioContext, 440, 0.25, 0.03, 0.15, 0.12);
      break;
    }


    case 'move':
      const mainOsc = audioContext.createOscillator();
      const modulatorOsc = audioContext.createOscillator();
      const modulatorGain = audioContext.createGain();

      // Connect modulator to main oscillator frequency
      modulatorOsc.connect(modulatorGain);
      modulatorGain.connect(mainOsc.frequency);
      mainOsc.connect(gainNode);

      // Soft bubble-like sound with sine wave
      mainOsc.type = 'sine';
      modulatorOsc.type = 'sine';

      // Environment-specific base frequencies (gentle mid-range)
      const envFreq: Record<Environment, number> = {
        jungle: 180,
        sea: 140,
        forest: 160,
        desert: 190,
        steppe: 150
      };

      const baseFreq = envFreq[environment] ?? 160;

      // Set main tone
      mainOsc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);

      // Set up frequency modulation (subtle bubbling effect)
      modulatorOsc.frequency.setValueAtTime(8, audioContext.currentTime);
      modulatorGain.gain.setValueAtTime(10, audioContext.currentTime);

      // Very soft attack
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.025, audioContext.currentTime + 0.02);

      // Gentle decay with slight pitch rise for 'pop' feeling
      mainOsc.frequency.linearRampToValueAtTime(baseFreq * 1.2, audioContext.currentTime + 0.12);
      gainNode.gain.setValueAtTime(0.025, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);

      // Start and stop both oscillators
      mainOsc.start();
      modulatorOsc.start();
      mainOsc.stop(audioContext.currentTime + 0.12);
      modulatorOsc.stop(audioContext.currentTime + 0.12);
      break;
  }
};

