import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS, getFoodColor, getSnakeStyle, legendBackgrounds } from '@/constants/game';
import styles from './Legend.module.css';
import { useTranslation } from 'react-i18next';

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const { settings, toggleLegend } = useGameStore();
  const { environment, snakeType } = settings;

    // Определяем фоновый цвет на основе окружения
    const legendBgColor = legendBackgrounds[environment] || '#f5f5f5';

  // Словарь для маппинга snakeType из констант на тип в описаниях
  const snakeTypeMapping: Record<string, string> = {
    // Джунгли
    'tropical_green': 'green_snake',
    // Море
    'red_sea': 'sea_snake',
    'blue_green_sea': 'eel',
    // Лес
    'forest_boa': 'forest_snake',
    // Пустыня
    'rattlesnake': 'sand_snake',
    'striped_viper': 'sidewinder',
    // Степь
    'mouse_hunter': 'steppe_adder'
  };

  const renderSnakeHead = () => {
    // Используем функцию getSnakeStyle вместо локальной константы
    const snakeStyle = getSnakeStyle(snakeType);
    const eyeColor = '#000';

    return (
        <div
            className={styles.snakeExample}
            style={{
              backgroundColor: snakeStyle.bg,
              border: `3px solid ${snakeStyle.border}`,
              position: 'relative'
            }}
        >
          {/* Глаза змеи */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '6px',
            height: '6px',
            backgroundColor: eyeColor,
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '6px',
            height: '6px',
            backgroundColor: eyeColor,
            borderRadius: '50%'
          }}></div>
        </div>
    );
  };

  // Описания змей и их особенностей в разных окружениях через i18n
  const getSnakeDescription = (snakeType: string) => {
    return {
      name: t(`legend.snakes.${snakeType}.name`),
      description: t(`legend.snakes.${snakeType}.description`),
      animationDescription: t(`legend.snakes.${snakeType}.animation`)
    };
  };

  // Получение информации о текущей змее через маппинг
  const mappedSnakeType = snakeTypeMapping[snakeType] || snakeType;

  // Получаем данные о змее из переводов
  const currentSnake = getSnakeDescription(mappedSnakeType);

  // Получаем описания еды для текущего окружения
  const foodDescriptions = FOOD_DESCRIPTIONS[environment] || {};

  return (
      <div className={`${styles.legendContainer} ${styles[settings.theme]}`}>
        <button onClick={toggleLegend} className={styles.closeButton} aria-label={t('legend.close')}>×</button>
        <h2>{t('legend.title')}</h2>

        <div className={styles.snakeInfo}>
          <h3>{t('legend.yourSnake')}</h3>
          <div className={styles.snakeDisplay}>
            {renderSnakeHead()}
            <p>
              <strong>{currentSnake.name}</strong> {currentSnake.description} {t('legend.and')} {currentSnake.animationDescription}.
            </p>
          </div>
        </div>

        <div className={styles.foodInfo} style={{ backgroundColor: legendBgColor }}>
          <h3>{t('legend.food')}</h3>
          <ul className={styles.foodList}>
            {Object.entries(foodDescriptions).map(([foodName, _]) => {
              return (
                  <li key={foodName} className={styles.foodItem}>
                    <div
                        className={styles.foodImage}
                        style={{ backgroundColor: getFoodColor(environment, foodName) }}
                        data-special={t(`food.${environment}.${foodName}.points`) === 'x2' ? "true" : undefined}
                        data-penalty={Number(t(`food.${environment}.${foodName}.points`)) < 0 ? "true" : undefined}
                    ></div>
                    <div className={styles.foodDescription}>
                      <strong>{t(`food.${environment}.${foodName}.name`)}</strong>: {t(`food.${environment}.${foodName}.description`)}
                      <div
                          className={styles.foodPoints}
                          style={{
                            color: Number(t(`food.${environment}.${foodName}.points`)) < 0
                                ? '#e74c3c'
                                : (t(`food.${environment}.${foodName}.points`) === 'x2' ? '#f39c12' : '#4CAF50')
                          }}
                      >
                        {t(`food.${environment}.${foodName}.points`) === 'x2'
                            ? 'x2'
                            : t('legend.points', { count: Number(t(`food.${environment}.${foodName}.points`)) })}
                      </div>
                    </div>
                  </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.controlsInfo}>
          <h3>{t('legend.controls.title')}</h3>
          <p>{t('legend.controls.keyboard')}</p>
          <p>{t('legend.controls.mobile')}</p>
        </div>
      </div>
  );
};

export default Legend;
