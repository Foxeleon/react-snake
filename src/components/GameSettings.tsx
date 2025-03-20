import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameSettings.module.css';
import { Environment, BoardSize, FieldSelectionMode, SnakeType } from '@/types/game';
import { GRID_SIZES, ENVIRONMENT_TO_SNAKE_TYPES } from '@/constants/game';

export const GameSettings: React.FC = () => {
  const { settings, updateSettings, toggleSettings, isPlaying, isPaused } = useGameStore();
  
  const [formData, setFormData] = useState({
    playerName: settings.playerName,
    environment: settings.environment,
    theme: settings.theme,
    boardSize: settings.boardSize,
    fieldSelectionMode: settings.fieldSelectionMode,
    soundEnabled: settings.soundEnabled,
    snakeType: settings.snakeType
  });

  // Определяем, заблокированы ли настройки размера поля
  const isBoardSizeDisabled = isPlaying; // Блокируем изменение поля во время игры (и паузы)

  // Обновление формы при изменении настроек
  useEffect(() => {
    setFormData({
      playerName: settings.playerName,
      environment: settings.environment,
      theme: settings.theme,
      boardSize: settings.boardSize,
      fieldSelectionMode: settings.fieldSelectionMode,
      soundEnabled: settings.soundEnabled,
      snakeType: settings.snakeType
    });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Перед сохранением настроек убедимся, что тип змеи соответствует окружению
    const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[formData.environment as Environment];
    if (!availableSnakeTypes.includes(formData.snakeType as SnakeType)) {
      // Если текущий тип змеи не подходит для выбранного окружения, установим первый доступный
      formData.snakeType = availableSnakeTypes[0];
    }
    
    updateSettings(formData);
    toggleSettings();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Проверяем, не пытается ли пользователь изменить размер поля во время паузы
    if (name === 'boardSize' && isBoardSizeDisabled) {
      return; // Игнорируем изменение размера поля на паузе
    }
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Если меняется окружение, нужно обновить и тип змеи
      if (name === 'environment') {
        const newEnvironment = value as Environment;
        const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[newEnvironment];
        
        // Выбираем первый доступный тип змеи для нового окружения
        setFormData(prev => ({ 
          ...prev, 
          environment: newEnvironment,
          snakeType: availableSnakeTypes[0] 
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  // Получаем доступные типы змей для выбранного окружения
  const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[formData.environment as Environment];

  return (
    <div className={`${styles.settingsOverlay} ${styles[settings.theme]}`}>
      <div className={styles.settingsContainer}>
        <h2 className={styles.settingsTitle}>Настройки игры</h2>
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
          <div className={styles.formGroup}>
            <label htmlFor="playerName">Имя игрока:</label>
            <input
              type="text"
              id="playerName"
              name="playerName"
              value={formData.playerName}
              onChange={handleChange}
              maxLength={20}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="environment">Окружение:</label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
            >
              <option value="jungle">Джунгли</option>
              <option value="sea">Море</option>
              <option value="forest">Лес</option>
              <option value="desert">Пустыня</option>
              <option value="steppe">Степь</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="theme">Тема:</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="boardSize">
              Размер поля:
              {isBoardSizeDisabled && (
                <span className={styles.disabledNote}> (недоступно во время игры)</span>
              )}
            </label>
            <select
              id="boardSize"
              name="boardSize"
              value={formData.boardSize}
              onChange={handleChange}
              disabled={isBoardSizeDisabled}
              className={isBoardSizeDisabled ? styles.disabledSelect : ''}
            >
              <option value="mini">Мини ({GRID_SIZES.mini}x{GRID_SIZES.mini})</option>
              <option value="small">Малый ({GRID_SIZES.small}x{GRID_SIZES.small})</option>
              <option value="medium">Средний ({GRID_SIZES.medium}x{GRID_SIZES.medium})</option>
              <option value="large">Большой ({GRID_SIZES.large}x{GRID_SIZES.large})</option>
              <option value="giant">Гигантский ({GRID_SIZES.giant}x{GRID_SIZES.giant})</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fieldSelectionMode">Режим выбора поля:</label>
            <select
              id="fieldSelectionMode"
              name="fieldSelectionMode"
              value={formData.fieldSelectionMode}
              onChange={handleChange}
            >
              <option value="static">Статичный</option>
              <option value="sequential">Последовательный</option>
              <option value="random">Случайный</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="soundEnabled"
                checked={formData.soundEnabled}
                onChange={handleChange}
              />
              Включить звук
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="snakeType">Тип змеи:</label>
            <select
              id="snakeType"
              name="snakeType"
              value={formData.snakeType}
              onChange={handleChange}
            >
              {availableSnakeTypes.map(type => (
                <option key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={toggleSettings} className={styles.cancelButton}>
              Отмена
            </button>
            <button type="submit" className={styles.saveButton}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 