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
    isPlaying, 
    startGame, 
    isSettingsOpen, 
    isRecordsOpen,
    showLegend,
    settings,
    loadSettings
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
      <h1 className={styles.gameTitle}>Змейка(snake_react v_alfa)</h1>
      
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