import React, { useEffect, useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { GameSettings } from './GameSettings';
import { RecordsTable as Leaderboard } from './RecordsTable';
import { useGameStore } from '@/store/gameStore';
import Legend from './Legend';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const {
    isPlaying,
    isGameOver,
    score,
    startGame, 
    isPaused,
    pauseGame,
    resumeGame,
    resetGame,
    isSettingsOpen, 
    isRecordsOpen,
    showLegend,
    settings,
    loadSettings,
    toggleSettings,
    toggleRecords,
    toggleLegend
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

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Обработчик для запуска игры
  const handleStartGame = () => {
    startGame();
  };

  // Определяем классы для фона в зависимости от темы и окружения
  const containerClasses = `${styles.gameContainer} ${styles[settings.environment]} ${settings.theme === 'dark' ? styles.dark : ''}`;

  return (
    <div className={containerClasses}>
      <div className={styles.header}>
        <h1 className={styles.gameTitle}>Змейка(Beta Version)</h1>
        <div className={styles.headerButtons}>
          <button onClick={toggleSettings} className={styles.iconButton} title="Настройки">
            ⚙️
          </button>
          <button onClick={toggleRecords} className={styles.iconButton} title="Таблица рекордов">
            🏆
          </button>
          <button 
            onClick={toggleLegend} 
            className={`${styles.iconButton} ${showLegend ? styles.active : ''}`}
            title={showLegend ? "Скрыть легенду" : "Показать легенду"}
          >
            ℹ️
          </button>
        </div>
      </div>
      
      <div className={styles.boardBackground}>
        {/* Панель над игровым полем */}
        <div className={isMobile ? styles.mobileGameControls : styles.desktopGameControls}>
          <div className={styles.scoreIndicator}>
            Счет: {score}
          </div>
          
          {/* Кнопки управления игрой для мобильной версии */}
          {isMobile && (
            <div className={styles.mobileGameButtons}>
              {!isPlaying && !isGameOver && (
                <button 
                  onClick={handleStartGame} 
                  className={styles.mobileStartButton}
                >
                  Начать игру
                </button>
              )}

              {isPlaying && !isGameOver && (
                <button 
                  onClick={isPaused ? resumeGame : pauseGame}
                  className={styles.mobilePauseButton}
                >
                  {isPaused ? 'Продолжить' : 'Пауза'}
                </button>
              )}

              {isGameOver && (
                <button 
                  onClick={resetGame}
                  className={styles.mobileStartButton}
                >
                  Играть снова
                </button>
              )}
            </div>
          )}
        </div>
        
        <GameBoard />
      </div>
      
      {/* Для десктопной версии сохраняем исходную панель управления */}
      {!isMobile && (
        <div className={styles.controlsPanel}>
          <GameControls onStartGame={handleStartGame} />
        </div>
      )}
      
      {/* Отображаем мобильные кнопки управления всегда на мобильном устройстве */}
      {isMobile && <GameControls onStartGame={handleStartGame} />}
      
      {isSettingsOpen && <GameSettings />}
      {isRecordsOpen && <Leaderboard />}
      {showLegend && <Legend />}
    </div>
  );
};

export default Game; 