
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
      const freqMap: Record<FoodType, number> = {
        common: 330,
        medium: 440,
        rare: 550,
        penalty: 220,
        special: 660
      };
      const startF = foodType ? freqMap[foodType] : 440;
      const duration = foodType === 'rare' ? 0.4 : 0.3;

      oscillator.type = foodType === 'penalty' ? 'sawtooth' : 'square';
      oscillator.frequency.setValueAtTime(startF, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
          startF * 2,
          audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
      break;
    }

    case 'eat_special':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
          1760,
          audioContext.currentTime + 0.25
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      break;

    case 'penalty':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
          110,
          audioContext.currentTime + 0.3
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
      break;

    case 'start_game': {
      /*
        Короткая мелодия: C5 → E5 → G5 → C6 + завершающая нота G5
        Каждый импульс 0.11 с, задержка 90 мс, волна square.
      */
      const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      melody.forEach((freq, idx) => {
        setTimeout(() => {
          if (!audioContext) return;
          const o = audioContext.createOscillator();
          const g = audioContext.createGain();
          o.connect(g);
          g.connect(audioContext.destination);

          o.type = 'square';
          o.frequency.setValueAtTime(freq, audioContext.currentTime);
          g.gain.setValueAtTime(0.24, audioContext.currentTime);
          g.gain.exponentialRampToValueAtTime(
              0.001,
              audioContext.currentTime + 0.11
          );

          o.start();
          o.stop(audioContext.currentTime + 0.11);
        }, idx * 90);
      });

      /* завершающая нота чуть длиннее */
      setTimeout(() => {
        if (!audioContext) return;
        const oEnd = audioContext.createOscillator();
        const gEnd = audioContext.createGain();
        oEnd.connect(gEnd);
        gEnd.connect(audioContext.destination);

        oEnd.type = 'triangle';
        oEnd.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
        gEnd.gain.setValueAtTime(0.22, audioContext.currentTime);
        gEnd.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.18
        );

        oEnd.start();
        oEnd.stop(audioContext.currentTime + 0.18);
      }, melody.length * 90);
      break;
    }

    case 'game_over': {
      /* первый нисходящий синус */
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1318.5, audioContext.currentTime); // E6
      oscillator.frequency.exponentialRampToValueAtTime(
          196, // G3
          audioContext.currentTime + 0.8
      );

      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.8
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.8);

      /* второе «квак» через 70 мс: квадрат */
      setTimeout(() => {
        if (!audioContext) return;
        const o2 = audioContext.createOscillator();
        const g2 = audioContext.createGain();
        o2.connect(g2);
        g2.connect(audioContext.destination);

        o2.type = 'square';
        o2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        o2.frequency.exponentialRampToValueAtTime(
            98,
            audioContext.currentTime + 0.9
        ); // G2

        g2.gain.setValueAtTime(0.18, audioContext.currentTime);
        g2.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.9
        );

        o2.start();
        o2.stop(audioContext.currentTime + 0.9);
      }, 70);
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
      oscillator.type = 'sine';
      const envFreq: Record<Environment, number> = {
        jungle: 220,
        sea: 165,
        forest: 196,
        desert: 233,
        steppe: 175
      };
      oscillator.frequency.setValueAtTime(
          envFreq[environment] ?? 200,
          audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
  }
};

