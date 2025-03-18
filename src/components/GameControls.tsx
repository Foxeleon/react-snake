import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

export const GameControls: React.FC = () => {
  const { 
    startGame, 
    resetGame, 
    moveSnake, 
    changeDirection, 
    isGameOver, 
    speed, 
    settings,
    isPlaying,
    toggleSettings,
    toggleRecords
  } = useGameStore();

  // Обработка клавиатурных событий для управления змейкой
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (event.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, isPlaying]);

  // Игровой цикл
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [moveSnake, isGameOver, speed, isPlaying]);
  
  // Обработчики для сенсорного управления на мобильных устройствах
  const handleTouchUp = () => {
    if (isPlaying) changeDirection('UP');
  };
  
  const handleTouchDown = () => {
    if (isPlaying) changeDirection('DOWN');
  };
  
  const handleTouchLeft = () => {
    if (isPlaying) changeDirection('LEFT');
  };
  
  const handleTouchRight = () => {
    if (isPlaying) changeDirection('RIGHT');
  };

  return (
    <div className={`${styles.controls} ${styles[settings.theme]}`}>
      {isGameOver ? (
        <div className={styles.gameOverControls}>
          <h2>Игра окончена!</h2>
          <p>Ваш счет: {useGameStore.getState().score}</p>
          <div className={styles.buttonGroup}>
            <button onClick={resetGame}>
              Играть снова
            </button>
            <button onClick={toggleSettings}>
              Настройки
            </button>
            <button onClick={toggleRecords}>
              Таблица рекордов
            </button>
          </div>
        </div>
      ) : (
        <>
          {!isPlaying && (
            <button onClick={startGame} className={styles.startButton}>
              Начать игру
            </button>
          )}
          
          <div className={`${styles.mobileControls} ${isPlaying ? '' : styles.hidden}`}>
            <div className={styles.touchControls}>
              <button
                onClick={handleTouchUp}
                className={`${styles.touchButton} ${styles.touchUp}`}
              >
                ↑
              </button>
              <div className={styles.middleRow}>
                <button
                  onClick={handleTouchLeft}
                  className={`${styles.touchButton} ${styles.touchLeft}`}
                >
                  ←
                </button>
                <button
                  onClick={handleTouchRight}
                  className={`${styles.touchButton} ${styles.touchRight}`}
                >
                  →
                </button>
              </div>
              <button
                onClick={handleTouchDown}
                className={`${styles.touchButton} ${styles.touchDown}`}
              >
                ↓
              </button>
            </div>
          </div>
          
          <div className={styles.instructions}>
            <p>Используйте стрелки для управления змейкой</p>
          </div>
          
          <div className={styles.menuButtons}>
            <button onClick={toggleSettings} className={styles.settingsButton}>
              ⚙️
            </button>
            <button onClick={toggleRecords} className={styles.recordsButton}>
              🏆
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 