import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

export interface GameControlsProps {
  onStartGame?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const { 
    isPlaying, 
    isGameOver,
    resetGame,
    isPaused,
    pauseGame,
    resumeGame
  } = useGameStore();

  return (
    <div className={styles.controls}>
      {!isPlaying && !isGameOver && (
        <button 
          onClick={onStartGame} 
          className={styles.startButton}
          data-testid="start-button"
        >
          Начать игру
        </button>
      )}

      {isPlaying && !isGameOver && (
        <button 
          onClick={isPaused ? resumeGame : pauseGame}
          className={styles.pauseButton}
        >
          {isPaused ? 'Продолжить' : 'Пауза'}
        </button>
      )}

      {isGameOver && (
        <div className={styles.gameOverControls}>
          <h2>Игра окончена!</h2>
          <p>Ваш счет: {useGameStore.getState().score}</p>
          <div className={styles.buttonGroup}>
            <button onClick={resetGame}>Играть снова</button>
          </div>
        </div>
      )}

      <div className={styles.instructions}>
        <p>Используйте стрелки для управления змейкой</p>
      </div>
    </div>
  );
}; 