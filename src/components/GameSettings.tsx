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

  // Создаем локальное состояние для формы, которое не влияет на основные настройки
  const [formData, setFormData] = useState({
    playerName: settings.playerName,
    environment: settings.environment,
    theme: settings.theme,
    boardSize: settings.boardSize,
    fieldSelectionMode: settings.fieldSelectionMode,
    soundEnabled: settings.soundEnabled,
    snakeType: settings.snakeType,
    showMobileControls: settings.showMobileControls,
    language: settings.language // Добавляем язык в состояние формы
  });

  // Определяем, заблокированы ли настройки размера поля
  const isBoardSizeDisabled = isPlaying; // Блокируем изменение поля во время игры (и паузы)

  // Обновление формы при изменении настроек (это происходит при открытии окна настроек)
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
      language: settings.language // Обновляем язык при изменении настроек
    });
  }, [settings, isPlaying]); // Добавляем isPlaying чтобы форма обновилась если настройки изменились

  // Обработка изменения языка
  const handleLanguageChange = (value: string) => {
    // Здесь используем корректную форму вызова i18n.changeLanguage
    i18n.changeLanguage(value, () => {
      setFormData(prev => ({ ...prev, language: value as Language }));
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Перед сохранением настроек убедимся, что тип змеи соответствует окружению
    const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[formData.environment as Environment];
    if (!availableSnakeTypes.includes(formData.snakeType as SnakeType)) {
      // Если текущий тип змеи не подходит для выбранного окружения, установим первый доступный
      formData.snakeType = availableSnakeTypes[0];
    }

    // Явно передаем все поля, чтобы убедиться, что showMobileControls включено
    updateSettings({
      playerName: formData.playerName,
      environment: formData.environment as Environment,
      theme: formData.theme as Theme,
      boardSize: formData.boardSize as BoardSize,
      fieldSelectionMode: formData.fieldSelectionMode as FieldSelectionMode,
      soundEnabled: formData.soundEnabled,
      snakeType: formData.snakeType as SnakeType,
      showMobileControls: formData.showMobileControls,
      language: formData.language as Language // Добавляем язык в обновление настроек
    });

    toggleSettings(); // Закрываем окно настроек после сохранения
  };

  const handleCancel = () => {
    // При отмене просто закрываем окно настроек без сохранения изменений
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
      } else if (name === 'language') {
        // Для смены языка используем отдельный обработчик
        handleLanguageChange(value);
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
                <option value="jungle">{t('environments.jungle')}</option>
                <option value="sea">{t('environments.sea')}</option>
                <option value="forest">{t('environments.forest')}</option>
                <option value="desert">{t('environments.desert')}</option>
                <option value="steppe">{t('environments.steppe')}</option>
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

            {/* Добавляем переключатель языка */}
            <div className={styles.formGroup}>
              <label htmlFor="language">{t('settings.language')}:</label>
              <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
              >
                <option value="ru">{t('languages.russian')}</option>
                <option value="en">{t('languages.english')}</option>
                <option value="de">{t('languages.german')}</option>
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
