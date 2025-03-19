import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { Score } from './Score';
import GameSettings from './GameSettings';
import Legend from './Legend';
import { WelcomeScreen } from './WelcomeScreen';
import { RecordsTable } from './RecordsTable';
import { initAudio } from '@/utils/sound';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const { 
    settings,
    startGame,
    moveSnake,
    changeDirection,
    resetGame,
    isPlaying,
    isGameOver,
    speed
  } = useGameStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Инициализация аудио
  useEffect(() => {
    initAudio();
  }, []);

  // Настройка интервала для движения змеи
  useEffect(() => {
    let gameLoop: number | null = null;

    if (isPlaying && !isGameOver && !isPaused) {
      gameLoop = window.setInterval(() => {
        moveSnake();
      }, speed);
    }

    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [isPlaying, isGameOver, isPaused, speed, moveSnake]);

  // Обработчик для клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Если открыты настройки, не обрабатываем клавиши движения
      if (showSettings) return;
      
      switch (e.key) {
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
        case ' ':
          // Пробел для старта игры
          if (!isPlaying && !isGameOver) {
            startGame();
            setShowWelcome(false);
          } else if (isGameOver) {
            resetGame();
          } else {
            setIsPaused(!isPaused);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, startGame, resetGame, isPlaying, isGameOver, showSettings, isPaused]);

  // Скрываем окно приветствия при начале игры
  useEffect(() => {
    if (isPlaying) {
      setShowWelcome(false);
    }
  }, [isPlaying]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  const toggleRecords = () => {
    setShowRecords(!showRecords);
  };

  const handleStartGame = () => {
    startGame();
    setShowWelcome(false);
  };

  return (
    <div className={`${styles.gameContainer} ${styles[settings.theme]}`}>
      <h1 className={styles.title}>Змейка v2.0</h1>
      
      {showWelcome ? (
        <WelcomeScreen />
      ) : (
        <>
          <Score />
          
          <div className={styles.buttonsContainer}>
            <button 
              className={styles.settingsButton} 
              onClick={toggleSettings}
            >
              {showSettings ? 'Скрыть настройки' : 'Настройки'}
            </button>
            <button 
              className={styles.legendButton} 
              onClick={toggleLegend}
            >
              {showLegend ? 'Скрыть легенду' : 'Показать легенду'}
            </button>
            <button 
              className={styles.recordsButton} 
              onClick={toggleRecords}
            >
              {showRecords ? 'Скрыть рекорды' : 'Рекорды'}
            </button>
          </div>
          
          {showSettings && <GameSettings />}
          {showLegend && <Legend />}
          {showRecords && <RecordsTable />}
          
          <GameBoard />
          <GameControls onStartGame={handleStartGame} />
          
          <div className={styles.info}>
            <p>Сложность: {settings.difficulty === 'easy' ? 'Легкая' : settings.difficulty === 'normal' ? 'Нормальная' : 'Сложная'}</p>
            <p>Режим поля: {settings.fieldSelectionMode === 'random' ? 'Случайный' : 'Последовательный'}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Game; 