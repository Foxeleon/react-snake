import React, { useEffect, useState, useRef } from 'react';
import { GameBoard } from './GameBoard';
import { GameSettings } from './GameSettings';
import { useGameStore } from '@/store/gameStore';
import Legend from './Legend';
import styles from './Game.module.css';
import desktopStyles from './DesktopGameControls.module.css';
import { usePlatform } from '@/hooks/usePlatform.ts';
import { useTranslation } from 'react-i18next';

const Game: React.FC = () => {
  const { t } = useTranslation();
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
    changeDirection,
    pausedDoublePointsTimeLeft
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

  // Обновление таймера каждую секунду
  const [timeLeft, setTimeLeft] = useState<number>(0); // Инициализируем с 0

  useEffect(() => {
    let intervalId: number | null = null;

    // Добавляем проверку !isGameOver
    if (doublePointsActive && doublePointsEndTime && !isPaused && !isGameOver) {
      intervalId = window.setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = doublePointsEndTime - currentTime;

        setTimeLeft(timeLeft > 0 ? Math.floor(timeLeft / 1000) : 0);

        if (timeLeft <= 0) {
          clearInterval(intervalId!);
          setTimeLeft(0);
        }
      }, 100);
    } else if (isPaused && pausedDoublePointsTimeLeft !== null) {
      setTimeLeft(Math.floor(pausedDoublePointsTimeLeft / 1000));
      // Добавляем очистку таймера при окончании игры
    } else if (isGameOver) {
      setTimeLeft(0);
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [doublePointsActive, doublePointsEndTime, isPaused, pausedDoublePointsTimeLeft, isGameOver]); // Добавляем isGameOver в зависимости



  // Определяем классы для фона в зависимости от темы и окружения
  const containerClasses = `${styles.gameContainer} ${styles[settings.environment]} ${settings.theme === 'dark' ? styles.dark : ''} ${isNative ? styles.gameContainerNative : ''}`;

  // Рендер индикатора удвоения очков
  const renderDoublePointsIndicator = () => {
    if (!doublePointsActive) return null;

    if (isMobile) {
      return (
          <div className={styles.mobileDoublePointsIndicator}>
            {t('game.doublePoints.mobile', { seconds: timeLeft })}
          </div>
      );
    }

    return (
        <div className={styles.doublePointsIndicator}>
          {t('game.doublePoints.desktop', { seconds: timeLeft })}
        </div>
    );
  };

  // Классы в зависимости от темы
  const themeClass = settings.theme === 'dark' ? styles.dark : '';

  return (
      <div className={containerClasses}>
        <div className={styles.header}>
          <h1 className={styles.gameTitle}>🐍{t('game.gameTitle')}</h1>
          <div className={styles.headerButtons}>
            <button onClick={toggleSettings} className={styles.iconButton} title={t('game.buttons.settings')}>
              ⚙️
            </button>
            {/* TODO fix records
            <button onClick={toggleRecords} className={styles.iconButton} title={t('game.buttons.records')}>
              🏆
            </button>
            */}
            <button
                onClick={toggleLegend}
                className={`${styles.iconButton} ${showLegend ? styles.active : ''}`}
                title={showLegend ? t('game.buttons.hideLegend') : t('game.buttons.showLegend')}
            >
              ℹ️
            </button>
          </div>
        </div>

        <div className={styles.boardBackground}>
          {/* Панель с общими элементами для всех версий */}
          <div className={styles.gameTopPanel}>
            <div className={styles.scoreIndicator}>
              {t('game.score', { score })}
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
                        {t('game.start')}
                      </button>
                  )}

                  {isPlaying && !isGameOver && (
                      <button
                          onClick={isPaused ? resumeGame : pauseGame}
                          className={styles.mobilePauseButton}
                      >
                        {isPaused ? t('game.resume') : t('game.pause')}
                      </button>
                  )}

                  {isGameOver && (
                      <button
                          onClick={resetGame}
                          className={styles.mobileStartButton}
                      >
                        {t('game.restart')}
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
                    {t('game.start')}
                  </button>
              )}

              {isPlaying && !isGameOver && (
                  <button
                      onClick={isPaused ? resumeGame : pauseGame}
                      className={desktopStyles.pauseButton}
                  >
                    {isPaused ? t('game.resume') : t('game.pause')}
                  </button>
              )}

              {isGameOver && (
                  <div className={desktopStyles.gameOverControls}>
                    <h2>{t('game.gameOver')}</h2>
                    <div className={desktopStyles.buttonGroup}>
                      <button onClick={resetGame}>{t('game.restart')}</button>
                    </div>
                  </div>
              )}

              <div className={desktopStyles.instructions}>
                <p>{t('game.controls.arrows')}</p>
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