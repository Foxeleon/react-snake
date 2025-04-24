import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameSettings.module.css';
import { BoardSize, Environment, FieldSelectionMode, Language, SnakeType, Theme } from '@/types/game';
import { ENVIRONMENT_TO_SNAKE_TYPES } from '@/constants/game';
import { useTranslation } from 'react-i18next';

export const GameSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings, toggleSettings, isPlaying } = useGameStore();

  const [isMobile] = useState(false);

  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    playerName: settings.playerName,
    environment: settings.environment,
    theme: settings.theme,
    boardSize: settings.boardSize,
    fieldSelectionMode: settings.fieldSelectionMode,
    soundEnabled: settings.soundEnabled,
    snakeType: settings.snakeType,
    showMobileControls: settings.showMobileControls,
    language: settings.language
  });

  // Блокировка размера поля во время игры
  const isBoardSizeDisabled = isPlaying;

  // Обновление формы при изменении настроек
  useEffect(() => {
    setFormData({
      playerName: settings.playerName,
      environment: settings.environment,
      theme: settings.theme,
      boardSize: settings.boardSize,
      fieldSelectionMode: settings.fieldSelectionMode,
      soundEnabled: settings.soundEnabled,
      snakeType: settings.snakeType,
      showMobileControls: settings.showMobileControls,
      language: settings.language
    });
  }, [settings, isPlaying]);

  // Обработка изменения языка
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value, () => {
      setFormData(prev => ({ ...prev, language: value as Language }));
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Проверка типа змеи для выбранного окружения
    const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[formData.environment as Environment];
    if (!availableSnakeTypes.includes(formData.snakeType as SnakeType)) {
      formData.snakeType = availableSnakeTypes[0];
    }

    updateSettings({
      playerName: formData.playerName,
      environment: formData.environment as Environment,
      theme: formData.theme as Theme,
      boardSize: formData.boardSize as BoardSize,
      fieldSelectionMode: formData.fieldSelectionMode as FieldSelectionMode,
      soundEnabled: formData.soundEnabled,
      snakeType: formData.snakeType as SnakeType,
      showMobileControls: formData.showMobileControls,
      language: formData.language as Language
    });

    toggleSettings();
  };

  const handleCancel = () => {
    toggleSettings();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'boardSize' && isBoardSizeDisabled) {
      return;
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      if (name === 'environment') {
        const newEnvironment = value as Environment;
        const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[newEnvironment];
        setFormData(prev => ({
          ...prev,
          environment: newEnvironment,
          snakeType: availableSnakeTypes[0]
        }));
      } else if (name === 'language') {
        handleLanguageChange(value);
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[formData.environment as Environment];

  return (
      <div className={`${styles.settingsOverlay} ${styles[settings.theme]}`}>
        <div className={styles.settingsContainer}>
          <h2 className={styles.settingsTitle}>{t('settings.title')}</h2>
          <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label htmlFor="playerName">{t('settings.playerName')}:</label>
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
              <label htmlFor="environment">{t('settings.environment.title')}:</label>
              <select
                  id="environment"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
              >
                <option value="jungle">{t('settings.environment.jungle')}</option>
                <option value="sea">{t('settings.environment.sea')}</option>
                <option value="forest">{t('settings.environment.forest')}</option>
                <option value="desert">{t('settings.environment.desert')}</option>
                <option value="grassland">{t('settings.environment.grassland')}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="theme">{t('settings.theme.title')}:</label>
              <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
              >
                <option value="light">{t('settings.theme.light')}</option>
                <option value="dark">{t('settings.theme.dark')}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="boardSize">
                {t('settings.boardSize')}:
                {isBoardSizeDisabled && (
                    <span className={styles.disabledNote}> ({t('settings.notAvailableDuringGame')})</span>
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
                <option value="mini">{t('settings.gridSize.mini')}</option>
                <option value="small">{t('settings.gridSize.small')}</option>
                <option value="medium">{t('settings.gridSize.medium')}</option>
                <option value="large">{t('settings.gridSize.large')}</option>
                <option value="giant">{t('settings.gridSize.giant')}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fieldSelectionMode">{t('settings.fieldSelectionMode')}:</label>
              <select
                  id="fieldSelectionMode"
                  name="fieldSelectionMode"
                  value={formData.fieldSelectionMode}
                  onChange={handleChange}
              >
                <option value="static">{t('fieldSelectionModes.static')}</option>
                <option value="sequential">{t('fieldSelectionModes.sequential')}</option>
                <option value="random">{t('fieldSelectionModes.random')}</option>
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
                {t('settings.enableSound')}
              </label>
            </div>

            {isMobile && (
                <div className={styles.formGroup}>
                  <label>
                    <input
                        type="checkbox"
                        name="showMobileControls"
                        checked={formData.showMobileControls}
                        onChange={handleChange}
                    />
                    {t('settings.showMobileControls')}
                  </label>
                </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="snakeType">{t('settings.snakeType')}:</label>
              <select
                  id="snakeType"
                  name="snakeType"
                  value={formData.snakeType}
                  onChange={handleChange}
              >
                {availableSnakeTypes.map(type => (
                    <option key={type} value={type}>
                      {t(`snakes.${type}`)}
                    </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="language">{t('settings.language.title')}:</label>
              <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
              >
                <option value="ru">{t('settings.language.ru')}</option>
                <option value="en">{t('settings.language.en')}</option>
                <option value="de">{t('settings.language.de')}</option>
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                {t('common.cancel')}
              </button>
              <button type="submit" className={styles.saveButton}>
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};
