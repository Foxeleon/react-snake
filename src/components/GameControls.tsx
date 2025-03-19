import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

interface GameControlsProps {
  onStartGame?: () => void; // Опциональный пропс для обработки запуска игры
}

export const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const { 
    startGame, 
    resetGame, 
    moveSnake, 
    changeDirection, 
    isGameOver, 
    speed, 
    settings,
    isPlaying,
    isPaused,
    toggleSettings,
    toggleRecords,
    toggleLegend,
    togglePause,
    showLegend
  } = useGameStore();

  // Обработка нажатия на кнопку "Играть снова"
  const handlePlayAgain = () => {
    resetGame(); // Сбрасываем состояние игры
    
    // Сразу запускаем игру без показа стартового экрана
    setTimeout(() => {
      startGame();
      if (onStartGame) onStartGame();
    }, 0);
  };

  // Обработка клавиатурных событий для управления змейкой
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      
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
        case ' ': // Пробел для паузы
        case 'p': // Или клавиша P
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, isPlaying, isGameOver, togglePause]);

  // Игровой цикл
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [moveSnake, isGameOver, speed, isPlaying, isPaused]);
  
  // Обработчики для сенсорного управления на мобильных устройствах
  const handleTouchUp = () => {
    if (isPlaying && !isPaused) changeDirection('UP');
  };
  
  const handleTouchDown = () => {
    if (isPlaying && !isPaused) changeDirection('DOWN');
  };
  
  const handleTouchLeft = () => {
    if (isPlaying && !isPaused) changeDirection('LEFT');
  };
  
  const handleTouchRight = () => {
    if (isPlaying && !isPaused) changeDirection('RIGHT');
  };

  return (
    <div className={`${styles.controls} ${styles[settings.theme]}`}>
      {/* Верхние кнопки управления - всегда видимы */}
      <div className={styles.menuButtons}>
        <button onClick={toggleSettings} className={styles.settingsButton} title="Настройки">
          ⚙️
        </button>
        <button onClick={toggleRecords} className={styles.recordsButton} title="Рекорды">
          🏆
        </button>
        <button 
          onClick={toggleLegend} 
          className={`${styles.legendButton} ${showLegend ? styles.active : ''}`}
          title={showLegend ? "Скрыть легенду" : "Показать легенду"}
        >
          ℹ️
        </button>
        {isPlaying && (
          <button
            onClick={togglePause}
            className={`${styles.pauseButton} ${isPaused ? styles.active : ''}`}
            title={isPaused ? "Продолжить игру" : "Пауза"}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        )}
      </div>

      {isGameOver ? (
        <div className={styles.gameOverControls}>
          <h2>Игра окончена!</h2>
          <p>Ваш счет: {useGameStore.getState().score}</p>
          <div className={styles.buttonGroup}>
            <button onClick={handlePlayAgain}>
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
            <button 
              onClick={() => {
                startGame();
                if (onStartGame) onStartGame();
              }}
              className={styles.startButton}
            >
              Начать игру
            </button>
          )}
          
          <div className={`${styles.mobileControls} ${isPlaying && !isPaused ? '' : styles.hidden}`}>
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
        </>
      )}
    </div>
  );
}; 