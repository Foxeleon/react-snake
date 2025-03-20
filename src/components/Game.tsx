import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameBoard } from './GameBoard';
import styles from './Game.module.css';
import { Score } from './Score';
import { GameControls } from './GameControls';
import { GameSettings } from './GameSettings';
import { RecordsTable } from './RecordsTable';
import { WelcomeScreen } from './WelcomeScreen';
import Legend from './Legend';
import { initAudio } from '@/utils/sound';

const Game = () => {
  const { 
    isPlaying, 
    isGameOver, 
    isSettingsOpen, 
    isRecordsOpen,
    showLegend,
    settings, 
    loadSettings
  } = useGameStore();
  
  // Локальное состояние для отслеживания, нужно ли показывать экран приветствия
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  
  // Загрузка настроек при первом рендере
  useEffect(() => {
    loadSettings();
    
    // Инициализация аудио при первом взаимодействии
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [loadSettings]);
  
  // Скрытие экрана приветствия при начале игры
  useEffect(() => {
    if (isPlaying) {
      setShowWelcomeScreen(false);
    }
  }, [isPlaying]);
  
  // Обработчик для начала игры
  const handleStartGame = () => {
    setShowWelcomeScreen(false);
  };
  
  return (
    <div 
      className={`${styles.game} ${styles[settings.theme]}`}
      data-testid="game-container"
    >
      <h1 className={styles.title}>Змейка(snake_react v_alfa)</h1>
      
      {(!isPlaying && !isGameOver && showWelcomeScreen) ? (
        <WelcomeScreen onStart={handleStartGame} />
      ) : (
        <>
          <Score />
          <GameBoard />
          <GameControls onStartGame={handleStartGame} />
          {showLegend && <Legend />}
        </>
      )}
      
      {isSettingsOpen && <GameSettings />}
      {isRecordsOpen && <RecordsTable />}
    </div>
  );
};

export default Game; 