import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';
import { Direction } from '@/types/game';

interface GameControlsProps {
  onStartGame: () => void;
}

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
    changeDirection,
    settings,
  } = useGameStore();

  // Определяем, на мобильном ли устройстве
  const [isMobile, setIsMobile] = useState(false);
  
  // Обновляем состояние isMobile при изменении размера окна
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Проверяем при монтировании компонента
    checkIfMobile();
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', checkIfMobile);
    
    // Удаляем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Обработчики для кнопок направления
  const handleDirectionClick = (direction: Direction) => {
    changeDirection(direction);
  };

  // Классы в зависимости от темы
  const themeClass = settings.theme === 'dark' ? styles.dark : '';

  // Если мобильное устройство, показываем только кнопки направления
  if (isMobile) {
    return (
      <div className={`${styles.mobileControls} ${themeClass}`}>
        <div className={styles.mobileControlsContainer}>
          <div className={styles.touchControls}>
            <button
              className={styles.touchButton}
              onClick={() => handleDirectionClick('UP')}
              aria-label="Вверх"
            >
              ↑
            </button>
            <div className={styles.middleRow}>
              <button
                className={styles.touchButton}
                onClick={() => handleDirectionClick('LEFT')}
                aria-label="Влево"
              >
                ←
              </button>
              <button
                className={styles.touchButton}
                onClick={() => handleDirectionClick('RIGHT')}
                aria-label="Вправо"
              >
                →
              </button>
            </div>
            <button
              className={styles.touchButton}
              onClick={() => handleDirectionClick('DOWN')}
              aria-label="Вниз"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className={`${styles.controls} ${themeClass}`}>
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
    </div>
  );
}; 