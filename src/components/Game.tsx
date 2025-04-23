import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GameBoard } from './GameBoard';
import { GameSettings } from './GameSettings';
import { useGameStore } from '@/store/gameStore';
import Legend from './Legend';
import styles from './Game.module.css';
import desktopStyles from './DesktopGameControls.module.css';
import { usePlatform } from '@/hooks/usePlatform.ts';

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
    showLegend,
    settings,
    loadSettings,
    toggleSettings,
    toggleLegend,
    doublePointsActive,
    doublePointsEndTime,
    changeDirection
  } = useGameStore();

  // Определяем, на мобильном ли устройстве
  const [isMobile, setIsMobile] = useState(false);
  
  // Отслеживаем время паузы для корректировки таймера удвоения очков
  const pauseStartTimeRef = useRef<number | null>(null);
  const pauseTotalDurationRef = useRef<number>(0);
  const { isNative } = usePlatform();
  
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

  // Отслеживание времени паузы
  useEffect(() => {
    if (isPaused && isPlaying && !pauseStartTimeRef.current) {
      // Запоминаем время начала паузы
      pauseStartTimeRef.current = Date.now();
    } else if (!isPaused && pauseStartTimeRef.current) {
      // Вычисляем продолжительность паузы и добавляем к общей продолжительности
      const pauseDuration = Date.now() - pauseStartTimeRef.current;
      pauseTotalDurationRef.current += pauseDuration;
      pauseStartTimeRef.current = null;
    }
  }, [isPaused, isPlaying]);

  // Обработчик для запуска игры
  const handleStartGame = () => {
    // Сбрасываем счетчики паузы при начале новой игры
    pauseStartTimeRef.current = null;
    pauseTotalDurationRef.current = 0;
    startGame();
  };

  // Для расчета оставшегося времени удвоения очков, мемоизируем функцию
  const getDoublePointsTimeLeft = useCallback((): number => {
    if (!doublePointsActive || !doublePointsEndTime) return 0;
    
    const now = Date.now();
    
    // Корректируем расчет с учетом времени, проведенного на паузе
    let adjustedEndTime = doublePointsEndTime + pauseTotalDurationRef.current;
    
    // Если сейчас пауза, не учитываем текущее время паузы
    if (isPaused && pauseStartTimeRef.current) {
      const currentPauseDuration = now - pauseStartTimeRef.current;
      adjustedEndTime += currentPauseDuration;
    }
    
    const timeLeft = Math.max(0, adjustedEndTime - now);
    return Math.floor(timeLeft / 1000); // Используем floor вместо ceil для более точного отображения
  }, [doublePointsActive, doublePointsEndTime, isPaused]);

  // Обновление таймера каждую секунду
  const [timeLeft, setTimeLeft] = useState<number>(0); // Инициализируем с 0

  useEffect(() => {
    // Немедленно устанавливаем начальное значение
    setTimeLeft(getDoublePointsTimeLeft());

    if (!doublePointsActive || isPaused) return;

    const timerId = setInterval(() => {
      const newTimeLeft = getDoublePointsTimeLeft();
      setTimeLeft(newTimeLeft);

      // Если время истекло, очищаем интервал
      if (newTimeLeft <= 0) {
        clearInterval(timerId);
      }
    }, 100); // Обновляем чаще для более точного отображения

    return () => clearInterval(timerId);
  }, [doublePointsActive, getDoublePointsTimeLeft, isPaused]);

  // Определяем классы для фона в зависимости от темы и окружения
  const containerClasses = `${styles.gameContainer} ${styles[settings.environment]} ${settings.theme === 'dark' ? styles.dark : ''}`;

  // Рендер индикатора удвоения очков
  const renderDoublePointsIndicator = () => {
    if (!doublePointsActive) return null;
    
    if (isMobile) {
      return (
        <div className={styles.mobileDoublePointsIndicator}>
          x2 ({timeLeft}с)
        </div>
      );
    }
    
    return (
      <div className={styles.doublePointsIndicator}>
        ОЧКИ УДВОЕНЫ! ({timeLeft}с)
      </div>
    );
  };

  // Классы в зависимости от темы
  const themeClass = settings.theme === 'dark' ? styles.dark : '';

  return (
      <div className={containerClasses}>
        <div className={styles.header}>
          <h1 className={styles.gameTitle}>🐍(β)</h1>
          <div className={styles.headerButtons}>
            <button onClick={toggleSettings} className={styles.iconButton} title="Настройки">
              ⚙️
            </button>
            {/* TODO fix records
            <button onClick={toggleRecords} className={styles.iconButton} title="Таблица рекордов">
              🏆
            </button>
            */}
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
          {/* Панель с общими элементами для всех версий */}
          <div className={styles.gameTopPanel}>
            <div className={styles.scoreIndicator}>
              Счет: {score}
            </div>

            {/* Зарезервированное место для индикатора удвоения очков */}
            <div className={styles.doublePointsContainer}>
              {renderDoublePointsIndicator()}
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

          <GameBoard/>
        </div>

        {!(isMobile || isNative) && (
            <div className={`${desktopStyles.controls} ${themeClass}`}>
              {!isPlaying && !isGameOver && (
                  <button
                      onClick={handleStartGame}
                      className={desktopStyles.startButton}
                      data-testid="start-button"
                  >
                    Начать игру
                  </button>
              )}

              {isPlaying && !isGameOver && (
                  <button
                      onClick={isPaused ? resumeGame : pauseGame}
                      className={desktopStyles.pauseButton}
                  >
                    {isPaused ? 'Продолжить' : 'Пауза'}
                  </button>
              )}

              {isGameOver && (
                  <div className={desktopStyles.gameOverControls}>
                    <h2>Игра окончена!</h2>
                    <div className={desktopStyles.buttonGroup}>
                      <button onClick={resetGame}>Играть снова</button>
                    </div>
                  </div>
              )}

              <div className={desktopStyles.instructions}>
                <p>Используйте стрелки для управления змейкой</p>
              </div>
            </div>
        )}


        {/* Мобильная панель управления */}
        {(isMobile || isNative) && settings.showMobileControls && (
            <div className={styles.mobileControls}>
              <div className={styles.mobileControlButtons}>
                <button
                    className={styles.mobileControlButton}
                    data-direction="UP"
                    onClick={() => changeDirection('UP')}
                >
                  ⬆️
                </button>
                <button
                    className={styles.mobileControlButton}
                    data-direction="LEFT"
                    onClick={() => changeDirection('LEFT')}
                >
                  ⬅️
                </button>
                <button
                    className={styles.mobileControlButton}
                    data-direction="RIGHT"
                    onClick={() => changeDirection('RIGHT')}
                >
                  ➡️
                </button>
                <button
                    className={styles.mobileControlButton}
                    data-direction="DOWN"
                    onClick={() => changeDirection('DOWN')}
                >
                  ⬇️
                </button>
              </div>
            </div>
        )}

        {isSettingsOpen && <GameSettings/>}
        {/* TODO fix records
          {isRecordsOpen && <Leaderboard/>}
        */}
        {showLegend && <Legend/>}
      </div>
  );
};

export default Game; 