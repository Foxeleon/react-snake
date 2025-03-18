import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './WelcomeScreen.module.css';

export const WelcomeScreen: React.FC = () => {
  const { setPlayerName, startGame, settings } = useGameStore();
  const [name, setName] = useState(settings.playerName);
  const [showError, setShowError] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setShowError(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length === 0) {
      setShowError(true);
      return;
    }
    
    setPlayerName(name);
    startGame();
  };
  
  return (
    <div className={styles.welcomeOverlay}>
      <div className={`${styles.welcomePanel} ${styles[settings.theme]}`}>
        <h1>Добро пожаловать в игру "Змейка"!</h1>
        <p>Захватывающая 8-битная игра с различными типами змей и окружений</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="playerName">Как вас зовут?</label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={handleNameChange}
              placeholder="Введите ваше имя"
              className={showError ? styles.inputError : ''}
            />
            {showError && <p className={styles.errorText}>Пожалуйста, введите ваше имя</p>}
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.startButton}>
              Начать игру
            </button>
            <button 
              type="button" 
              className={styles.settingsButton}
              onClick={() => useGameStore.getState().toggleSettings()}
            >
              Настройки
            </button>
            <button 
              type="button" 
              className={styles.recordsButton}
              onClick={() => useGameStore.getState().toggleRecords()}
            >
              Рекорды
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 