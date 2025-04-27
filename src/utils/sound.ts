import { Environment, FoodType } from "@/types/gameTypes.ts";
import { useGameStore } from '@/store/gameStore';

//TODO исправить и добавить звуки
// Типы звуковых эффектов
export type SoundEffect = 
  | 'eat'
  | 'eat_special'
  | 'penalty'
  | 'game_over'
  | 'level_up'
  | 'move';

// Контекст звукового синтезатора
let audioContext: AudioContext | null = null;

/**
 * Создание звукового контекста при первом взаимодействии с пользователем
 */
export const initAudio = (): void => {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

/**
 * Генерирует 8-битные звуковые эффекты в зависимости от действия
 */
export const playSound = (
  effect: SoundEffect, 
  environment: Environment = 'jungle',
  foodType?: FoodType
): void => {
  // Проверяем, включен ли звук в настройках
  const { settings } = useGameStore.getState();
  if (!settings.soundEnabled) return;

  if (!audioContext) {
    initAudio();
    if (!audioContext) return;
  }
  
  // Базовые параметры для осциллятора
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  
  // Подключение узлов
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Настройка типа и параметров осциллятора в зависимости от эффекта
  switch (effect) {
    case 'eat':
      // Разные звуки в зависимости от типа еды
      if (foodType) {
        switch (foodType) {
          case 'common':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              660, audioContext.currentTime + 0.1
            );
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01, audioContext.currentTime + 0.3
            );
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
          case 'medium':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              880, audioContext.currentTime + 0.1
            );
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01, audioContext.currentTime + 0.3
            );
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
          case 'rare':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(550, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              1100, audioContext.currentTime + 0.15
            );
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01, audioContext.currentTime + 0.4
            );
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
            
          case 'penalty':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              110, audioContext.currentTime + 0.3
            );
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01, audioContext.currentTime + 0.4
            );
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
        }
      } else {
        // Стандартный звук поедания
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          880, audioContext.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01, audioContext.currentTime + 0.3
        );
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
      break;
      
    case 'eat_special':
      // Специальный звук для двойных очков
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1760, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, audioContext.currentTime + 0.5
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Добавим второй осциллятор для более богатого звука
      setTimeout(() => {
        if (!audioContext) return;
        
        let osc2 = audioContext.createOscillator();
        let gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1320, audioContext.currentTime);
        osc2.frequency.setValueAtTime(1760, audioContext.currentTime + 0.1);
        osc2.frequency.setValueAtTime(2200, audioContext.currentTime + 0.2);
        
        gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(
          0.01, audioContext.currentTime + 0.5
        );
        
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 50);
      break;
      
    case 'penalty':
      // Звук при штрафе
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        110, audioContext.currentTime + 0.3
      );
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, audioContext.currentTime + 0.4
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
      break;
      
    case 'game_over':
      // Звук окончания игры
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        55, audioContext.currentTime + 1.5
      );
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, audioContext.currentTime + 1.5
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.5);
      
      // Добавим второй осциллятор для более драматичного эффекта
      setTimeout(() => {
        if (!audioContext) return;
        
        let osc2 = audioContext.createOscillator();
        let gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(220, audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(
          55, audioContext.currentTime + 1.5
        );
        
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(
          0.01, audioContext.currentTime + 1.5
        );
        
        osc2.start();
        osc2.stop(audioContext.currentTime + 1.5);
      }, 100);
      break;
      
    case 'level_up':
      // Звук повышения уровня
      oscillator.type = 'square';
      
      // Играем гамму
      [330, 392, 494, 587, 659, 784, 880].forEach((freq, index) => {
        setTimeout(() => {
          if (!audioContext) return;
          
          let tempOsc = audioContext.createOscillator();
          let tempGain = audioContext.createGain();
          
          tempOsc.connect(tempGain);
          tempGain.connect(audioContext.destination);
          
          tempOsc.type = 'square';
          tempOsc.frequency.setValueAtTime(freq, audioContext.currentTime);
          
          tempGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          tempGain.gain.exponentialRampToValueAtTime(
            0.01, audioContext.currentTime + 0.15
          );
          
          tempOsc.start();
          tempOsc.stop(audioContext.currentTime + 0.15);
        }, index * 100);
      });
      return; // Возвращаемся, так как выше не запускаем основной осциллятор
      
    case 'move':
      // Тихий звук движения змеи - разный для каждого окружения
      oscillator.type = 'sine';
      
      switch (environment) {
        case 'jungle':
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
          break;
        case 'sea':
          oscillator.frequency.setValueAtTime(165, audioContext.currentTime);
          break;
        case 'forest':
          oscillator.frequency.setValueAtTime(196, audioContext.currentTime);
          break;
        case 'desert':
          oscillator.frequency.setValueAtTime(233, audioContext.currentTime);
          break;
        case 'steppe':
          oscillator.frequency.setValueAtTime(175, audioContext.currentTime);
          break;
      }
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, audioContext.currentTime + 0.1
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
  }
}; 