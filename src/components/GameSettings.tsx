import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BoardSize, Difficulty, Environment, SnakeType, Theme } from '@/types/game';
import { ENVIRONMENT_TO_SNAKE_TYPES, FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './GameSettings.module.css';

const GameSettings: React.FC = () => {
  const { 
    settings, 
    setPlayerName, 
    setTheme, 
    setEnvironment, 
    setBoardSize, 
    setSnakeType,
    setSoundEnabled,
    setFieldSelectionMode,
    setDifficulty
  } = useGameStore();

  const [availableSnakeTypes, setAvailableSnakeTypes] = useState<SnakeType[]>(
    ENVIRONMENT_TO_SNAKE_TYPES[settings.environment] || []
  );

  useEffect(() => {
    // Обновляем доступные типы змеи при изменении окружения
    const snakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[settings.environment] || [];
    setAvailableSnakeTypes(snakeTypes);
    
    // Если текущий тип змеи не доступен в новом окружении, выбираем первый доступный
    if (!snakeTypes.includes(settings.snakeType) && snakeTypes.length > 0) {
      setSnakeType(snakeTypes[0]);
    }
  }, [settings.environment, setSnakeType]);

  // Обработчики изменения настроек
  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };

  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEnvironment(e.target.value as Environment);
  };

  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardSize(e.target.value as BoardSize);
  };

  const handleSnakeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSnakeType(e.target.value as SnakeType);
  };

  const handleSoundEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundEnabled(e.target.checked);
  };

  const handleFieldSelectionModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldSelectionMode(e.target.value as 'random' | 'sequential');
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as Difficulty);
  };

  // Получаем доступные для текущего окружения типы еды для легенды
  const currentEnvironmentFoods = FOOD_DESCRIPTIONS[settings.environment];

  return (
    <div className={styles.settings}>
      <h2 className={styles.title}>Настройки игры</h2>

      <div className={styles.formGroup}>
        <label htmlFor="playerName">Имя игрока:</label>
        <input
          type="text"
          id="playerName"
          value={settings.playerName}
          onChange={handlePlayerNameChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="theme">Тема:</label>
        <select
          id="theme"
          value={settings.theme}
          onChange={handleThemeChange}
          className={styles.select}
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
          <option value="retro">Ретро</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="environment">Окружение:</label>
        <select
          id="environment"
          value={settings.environment}
          onChange={handleEnvironmentChange}
          className={styles.select}
        >
          <option value="jungle">Джунгли</option>
          <option value="sea">Море</option>
          <option value="forest">Лес</option>
          <option value="desert">Пустыня</option>
          <option value="steppe">Степь</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="snakeType">Тип змеи:</label>
        <select
          id="snakeType"
          value={settings.snakeType}
          onChange={handleSnakeTypeChange}
          className={styles.select}
        >
          {availableSnakeTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'tropical_green' && 'Тропическая зеленая'}
              {type === 'red_sea' && 'Красно-морская'}
              {type === 'blue_green_sea' && 'Сине-зеленая морская'}
              {type === 'forest_boa' && 'Лесной удав'}
              {type === 'rattlesnake' && 'Гремучая змея'}
              {type === 'striped_viper' && 'Полосатая гадюка'}
              {type === 'mouse_hunter' && 'Охотник на мышей'}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="boardSize">Размер поля:</label>
        <select
          id="boardSize"
          value={settings.boardSize}
          onChange={handleBoardSizeChange}
          className={styles.select}
        >
          <option value="mini">Мини (10x10)</option>
          <option value="small">Маленький (15x15)</option>
          <option value="medium">Средний (20x20)</option>
          <option value="large">Большой (25x25)</option>
          <option value="giant">Гигантский (30x30)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="difficulty">Сложность:</label>
        <select
          id="difficulty"
          value={settings.difficulty}
          onChange={handleDifficultyChange}
          className={styles.select}
        >
          <option value="easy">Легкая</option>
          <option value="normal">Нормальная</option>
          <option value="hard">Сложная</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fieldSelectionMode">Режим выбора поля:</label>
        <select
          id="fieldSelectionMode"
          value={settings.fieldSelectionMode}
          onChange={handleFieldSelectionModeChange}
          className={styles.select}
        >
          <option value="random">Случайный</option>
          <option value="sequential">Последовательный</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="soundEnabled" className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id="soundEnabled"
            checked={settings.soundEnabled}
            onChange={handleSoundEnabledChange}
            className={styles.checkbox}
          />
          Звуковые эффекты
        </label>
      </div>

      <div className={styles.legendContainer}>
        <h3 className={styles.legendTitle}>Легенда объектов:</h3>
        <div className={styles.legend}>
          {currentEnvironmentFoods && Object.entries(currentEnvironmentFoods).map(([type, food]) => (
            <div key={type} className={styles.legendItem}>
              <div className={`${styles.legendIcon} ${styles[`food_${type}`]}`} />
              <div className={styles.legendInfo}>
                <span className={styles.legendName}>{food.name}</span>
                <span className={styles.legendDesc}>{food.description}</span>
                <span className={styles.legendPoints}>
                  {typeof food.points === 'number' ? `${food.points > 0 ? '+' : ''}${food.points} очков` : food.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSettings; 