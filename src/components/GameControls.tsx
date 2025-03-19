import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

interface GameControlsProps {
  onStartGame?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const { 
    isPlaying, 
    isGameOver, 
    startGame: storeStartGame, 
    resetGame,
    changeDirection,
    settings
  } = useGameStore();

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame();
    } else {
      storeStartGame();
    }
  };

  // Обработчики для сенсорного управления
  const handleUp = () => {
    if (isPlaying) changeDirection('UP');
  };

  const handleDown = () => {
    if (isPlaying) changeDirection('DOWN');
  };

  const handleLeft = () => {
    if (isPlaying) changeDirection('LEFT');
  };

  const handleRight = () => {
    if (isPlaying) changeDirection('RIGHT');
  };

  return (
    <div className={`${styles.controls} ${styles[settings.theme]}`}>
      {!isPlaying && !isGameOver && (
        <button 
          className={styles.startButton} 
          onClick={handleStartGame}
        >
          Начать игру
        </button>
      )}
      
      {isGameOver && (
        <div className={styles.gameOverControls}>
          <h2>Игра окончена!</h2>
          <button 
            onClick={resetGame} 
            className={styles.resetButton}
          >
            Играть снова
          </button>
        </div>
      )}
      
      {isPlaying && (
        <div className={styles.touchControls}>
          <button className={styles.upButton} onClick={handleUp}>
            ↑
          </button>
          <div className={styles.middleControls}>
            <button className={styles.leftButton} onClick={handleLeft}>
              ←
            </button>
            <button className={styles.rightButton} onClick={handleRight}>
              →
            </button>
          </div>
          <button className={styles.downButton} onClick={handleDown}>
            ↓
          </button>
        </div>
      )}
    </div>
  );
}; 