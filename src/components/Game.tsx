import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameBoard } from './GameBoard';
import styles from './Game.module.css';
import { Score } from './Score';
import { GameControls } from './GameControls';
import { GameSettings } from './GameSettings';
import { RecordsTable } from './RecordsTable';
import { WelcomeScreen } from './WelcomeScreen';
import { initAudio } from '@/utils/sound';

const Game = () => {
  const { 
    isPlaying, 
    isGameOver, 
    isSettingsOpen, 
    isRecordsOpen, 
    settings, 
    loadSettings
  } = useGameStore();
  
  const gameLoopRef = useRef<number | null>(null);
  
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
  
  // Запуск игрового цикла
  useEffect(() => {
    const { moveSnake, speed } = useGameStore.getState();
    
    if (isPlaying && !isGameOver) {
      // Функция игрового цикла
      const gameLoop = () => {
        moveSnake();
        // Обновляем скорость из текущего состояния
        const currentSpeed = useGameStore.getState().speed;
        gameLoopRef.current = window.setTimeout(gameLoop, currentSpeed);
      };
      
      // Запуск игрового цикла
      gameLoopRef.current = window.setTimeout(gameLoop, speed);
      
      // Очистка при размонтировании
      return () => {
        if (gameLoopRef.current !== null) {
          clearTimeout(gameLoopRef.current);
        }
      };
    }
  }, [isPlaying, isGameOver]);
  
  // Скрываем окно настроек при начале игры
  useEffect(() => {
    if (isPlaying) {
      const { isSettingsOpen, isRecordsOpen, toggleSettings, toggleRecords } = useGameStore.getState();
      
      if (isSettingsOpen) {
        toggleSettings();
      }
      
      if (isRecordsOpen) {
        toggleRecords();
      }
    }
  }, [isPlaying]);
  
  return (
    <div 
      className={`${styles.game} ${styles[settings.theme]}`}
      data-testid="game-container"
    >
      <h1 className={styles.title}>Змейка 8-бит</h1>
      
      {(!isPlaying && !isGameOver) ? (
        <WelcomeScreen />
      ) : (
        <>
          <Score />
          <GameBoard />
          <GameControls />
        </>
      )}
      
      {isSettingsOpen && <GameSettings />}
      {isRecordsOpen && <RecordsTable />}
    </div>
  );
};

export default Game; 