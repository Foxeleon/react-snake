import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

interface GameControlsProps {
  onStartGame: () => void;
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
    toggleSettings,
    changeDirection
  } = useGameStore();

  const handleDirectionClick = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    changeDirection(direction);
  };

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
      
      {/* Мобильные контроллеры */}
      <div className={styles.mobileControls}>
        <div className={styles.touchControls}>
          {/* Кнопка "Вверх" */}
          <button 
            className={styles.touchButton} 
            onClick={() => handleDirectionClick('UP')}
            aria-label="Вверх"
          >
            ⬆️
          </button>
          
          <div className={styles.middleRow}>
            {/* Кнопка "Влево" */}
            <button 
              className={styles.touchButton} 
              onClick={() => handleDirectionClick('LEFT')}
              aria-label="Влево"
            >
              ⬅️
            </button>
            
            {/* Кнопка "Вправо" */}
            <button 
              className={styles.touchButton} 
              onClick={() => handleDirectionClick('RIGHT')}
              aria-label="Вправо"
            >
              ➡️
            </button>
          </div>
          
          {/* Кнопка "Вниз" */}
          <button 
            className={styles.touchButton} 
            onClick={() => handleDirectionClick('DOWN')}
            aria-label="Вниз"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  );
}; 