import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BoardSize, Environment, Theme, FieldSelectionMode } from '@/types/game';
import styles from './GameSettings.module.css';
import { GRID_SIZES, ENVIRONMENT_TO_SNAKE_TYPES } from '@/constants/game';

export const GameSettings: React.FC = () => {
  const { 
    settings, 
    setPlayerName, 
    setEnvironment, 
    setTheme, 
    setBoardSize, 
    setSoundEnabled,
    setFieldSelectionMode,
    isSettingsOpen, 
    toggleSettings,
    saveSettings 
  } = useGameStore();
  
  const [name, setName] = useState(settings.playerName);
  
  // Обработчик изменения имени игрока
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  // Обработчик сохранения настроек
  const handleSave = () => {
    setPlayerName(name);
    saveSettings();
    toggleSettings();
  };
  
  // Обработчик изменения окружения
  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEnvironment(e.target.value as Environment);
  };
  
  // Обработчик изменения темы
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };
  
  // Обработчик изменения размера доски
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardSize(e.target.value as BoardSize);
  };

  // Обработчик изменения настройки звука
  const handleSoundEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundEnabled(e.target.checked);
  };
  
  // Обработчик изменения режима выбора поля
  const handleFieldSelectionModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldSelectionMode(e.target.value as FieldSelectionMode);
  };
  
  if (!isSettingsOpen) return null;
  
  return (
    <div className={styles.settingsOverlay}>
      <div className={`${styles.settingsPanel} ${styles[settings.theme]}`}>
        <h2>Настройки игры</h2>
        
        <div className={styles.settingGroup}>
          <label htmlFor="playerName">Имя игрока:</label>
          <input 
            type="text" 
            id="playerName" 
            value={name} 
            onChange={handleNameChange}
            placeholder="Введите ваше имя" 
          />
        </div>
        
        <div className={styles.settingGroup}>
          <label htmlFor="theme">Тема:</label>
          <select 
            id="theme" 
            value={settings.theme} 
            onChange={handleThemeChange}
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </div>
        
        <div className={styles.settingGroup}>
          <label htmlFor="environment">Окружение:</label>
          <select 
            id="environment" 
            value={settings.environment} 
            onChange={handleEnvironmentChange}
          >
            <option value="jungle">Джунгли</option>
            <option value="sea">Море</option>
            <option value="forest">Лес</option>
            <option value="desert">Пустыня</option>
            <option value="steppe">Степь</option>
          </select>
        </div>
        
        <div className={styles.settingGroup}>
          <label htmlFor="fieldSelectionMode">Режим выбора поля:</label>
          <select 
            id="fieldSelectionMode" 
            value={settings.fieldSelectionMode} 
            onChange={handleFieldSelectionModeChange}
          >
            <option value="random">Случайный выбор</option>
            <option value="sequential">Последовательный выбор</option>
          </select>
          <small className={styles.hint}>
            Последовательный режим будет менять окружение каждую новую игру (джунгли, море, лес и т.д.)
          </small>
        </div>
        
        <div className={styles.settingGroup}>
          <label htmlFor="boardSize">Размер поля:</label>
          <select 
            id="boardSize" 
            value={settings.boardSize} 
            onChange={handleBoardSizeChange}
          >
            <option value="mini">Мини (10x10)</option>
            <option value="small">Маленькая (15x15)</option>
            <option value="medium">Средняя (20x20)</option>
            <option value="large">Большая (25x25)</option>
            <option value="giant">Гигантская (30x30)</option>
          </select>
        </div>
        
        <div className={styles.settingGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={handleSoundEnabledChange}
            />
            Включить звук
          </label>
        </div>
        
        <div className={styles.settingGroup}>
          <p>Текущий тип змеи: {settings.snakeType}</p>
          <p>Доступные типы для выбранного окружения:</p>
          <ul className={styles.snakeTypes}>
            {ENVIRONMENT_TO_SNAKE_TYPES[settings.environment].map(type => (
              <li key={type} className={type === settings.snakeType ? styles.selected : ''}>
                {type.replace('_', ' ')}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={toggleSettings}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}; 