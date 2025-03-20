import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

export interface GameControlsProps {
  onStartGame?: () => void;
}
// TODO проверить змей в легенде на соответствие со змеёй на поле
export const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const { 
    isPlaying, 
    isGameOver,
    resetGame,
    isPaused,
    pauseGame,
    resumeGame,
    toggleLegend,
    toggleSettings
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

      <div className={styles.additionalControls}>
        <button 
          onClick={toggleSettings}
          className={styles.controlButton}
          title="Настройки"
        >
          ⚙️
        </button>
        
        <button 
          onClick={toggleLegend}
          className={styles.controlButton}
          title="Легенда"
        >
          📋
        </button>
      </div>

      <div className={styles.instructions}>
        <p>Используйте стрелки для управления змейкой</p>
      </div>
    </div>
  );
}; 