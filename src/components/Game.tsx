import React, { useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { GameSettings } from './GameSettings';
import { RecordsTable as Leaderboard } from './RecordsTable';
import { useGameStore } from '@/store/gameStore';
import Legend from './Legend';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const {
    startGame, 
    isSettingsOpen, 
    isRecordsOpen,
    showLegend,
    settings,
    loadSettings,
    toggleSettings,
    toggleRecords,
    toggleLegend
  } = useGameStore();

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
        <div className={styles.scoreIndicator}>
          Счет: {useGameStore.getState().score}
        </div>
        
        <GameBoard />
      </div>
      
      <div className={styles.controlsPanel}>
        <GameControls onStartGame={handleStartGame} />
      </div>
      
      {isSettingsOpen && <GameSettings />}
      {isRecordsOpen && <Leaderboard />}
      {showLegend && <Legend />}
    </div>
  );
};

export default Game; 