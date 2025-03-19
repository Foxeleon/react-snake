import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStart?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { startGame: storeStartGame, settings } = useGameStore();

  const handleStartGame = () => {
    if (onStart) {
      onStart();
    } else {
      storeStartGame();
    }
  };

  return (
    <div className={`${styles.welcomeScreen} ${styles[settings.theme]}`}>
      <h2 className={styles.title}>Добро пожаловать в игру "Змейка"!</h2>
      
      <div className={styles.instructions}>
        <p>Используйте стрелки для управления змейкой.</p>
        <p>Собирайте еду, чтобы расти и набирать очки.</p>
        <p>Избегайте столкновений со стенами и собственным хвостом.</p>
      </div>
      
      <p className={styles.version}>Версия 2.0</p>
      
      <button 
        className={styles.startButton} 
        onClick={handleStartGame}
      >
        Начать игру
      </button>
    </div>
  );
}; 