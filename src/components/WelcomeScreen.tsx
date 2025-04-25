import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './WelcomeScreen.module.css';
import { GameSettings } from '@/components/GameSettings.tsx';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onStart?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const { setPlayerName, startGame, settings, toggleSettings, isSettingsOpen } = useGameStore();
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
    if (onStart) onStart();
  };

  return (
      <div className={styles.welcomeOverlay}>
        <div className={`${styles.welcomePanel} ${styles[settings.theme]}`}>
          <h1>{t('welcome.title')}</h1>
          <p>{t('welcome.description')}</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="playerName">{t('welcome.nameLabel')}</label>
              <input
                  type="text"
                  id="playerName"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={t('welcome.namePlaceholder')}
                  className={showError ? styles.inputError : ''}
              />
              {showError && <p className={styles.errorText}>{t('welcome.nameError')}</p>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.startButton}>
                {t('welcome.startButton')}
              </button>
              <button
                  type="button"
                  className={styles.settingsButton}
                  onClick={toggleSettings}
              >
                {t('welcome.settingsButton')}
              </button>
              {/* TODO fix Records
            <button
              type="button"
              className={styles.Button}
              onClick={() => useGameStore.getState().toggleRecords()}
            >
              {t('welcome.recordsButton')}
            </button>
            */}
            </div>
          </form>
        </div>
        {isSettingsOpen && <GameSettings/>}
      </div>
  );
};
