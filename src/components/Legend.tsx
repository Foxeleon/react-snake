import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './Legend.module.css';
import { useTranslation } from 'react-i18next';

const Legend: React.FC = () => {
  const { t } = useTranslation();
  const { settings, toggleLegend } = useGameStore();
  const { environment, snakeType } = settings;

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

  // Цвета еды для разных типов
  const foodColors: Record<string, string> = {
    'bug': '#95a5a6',       // Серый
    'frog': '#3498db',      // Синий
    'bird': '#f1c40f',      // Желтый
    'pineapple': '#2ecc71', // Зеленый
    'poison_berry': '#e74c3c', // Красный

    'shrimp': '#95a5a6',    // Серый
    'fish': '#3498db',      // Синий
    'starfish': '#f1c40f',  // Желтый
    'plankton': '#2ecc71',  // Зеленый
    'jellyfish': '#e74c3c', // Красный

    'ant': '#95a5a6',       // Серый
    'rabbit': '#f1c40f',    // Желтый
    'mushroom': '#2ecc71',  // Зеленый
    'moldy_berry': '#e74c3c', // Красный

    // Пустыня
    'beetle': '#3498db',    // Синий (средняя добыча)
    'egg': '#f1c40f',       // Желтый (редкая добыча)
    'cactus_flower': '#2ecc71', // Зеленый (особая еда)
    'thorn': '#e74c3c',     // Красный (штрафная еда)

    'grasshopper': '#95a5a6', // Серый
    'gopher': '#3498db',      // Синий
    'mouse': '#f1c40f',       // Желтый
    'golden_grass': '#2ecc71', // Зеленый
    'bitter_seed': '#e74c3c'   // Красный
  };

  // Получение подходящего цвета для еды по имени с учетом окружения
  const getFoodColor = (foodName: string): string => {
    if (foodColors[foodName]) {
      return foodColors[foodName];
    }

    // Специальная обработка для пустыни
    if (environment === 'desert' && foodName === 'locust') {
      return '#aab7b7'; // Светло-серый для саранчи в пустыне
    }

    // Определение типа еды по её названию
    if (foodName.includes('bug') || foodName.includes('shrimp') || foodName.includes('ant') ||
        foodName.includes('locust') || foodName.includes('grasshopper')) {
      return '#95a5a6'; // Серый для обычной еды
    }

    if (foodName.includes('frog') || foodName.includes('fish') || foodName.includes('beetle') ||
        foodName.includes('gopher')) {
      return '#3498db'; // Синий для средней еды
    }

    if (foodName.includes('bird') || foodName.includes('starfish') || foodName.includes('rabbit') ||
        foodName.includes('egg') || foodName.includes('mouse')) {
      return '#f1c40f'; // Желтый для редкой еды
    }

    if (foodName.includes('pineapple') || foodName.includes('plankton') || foodName.includes('mushroom') ||
        foodName.includes('flower') || foodName.includes('grass')) {
      return '#2ecc71'; // Зеленый для особой еды
    }

    if (foodName.includes('poison') || foodName.includes('jelly') || foodName.includes('moldy') ||
        foodName.includes('thorn') || foodName.includes('bitter')) {
      return '#e74c3c'; // Красный для штрафной еды
    }

    return '#f1c40f'; // Желтый по умолчанию
  };

  // Добавим более яркое и интересное представление змеи в легенде
  const renderSnakeHead = () => {
    // Получаем цвет змеи из стилей GameBoard для соответствия с игровым полем
    const SNAKE_STYLES = {
      'tropical_green': { bg: '#32CD32', border: '#228B22' },
      'red_sea': { bg: '#FF4500', border: '#B22222' },
      'blue_green_sea': { bg: '#20B2AA', border: '#008B8B' },
      'forest_boa': { bg: '#8B4513', border: '#A0522D' },
      'rattlesnake': { bg: '#F0E68C', border: '#DAA520' },
      'striped_viper': { bg: '#A9A9A9', border: '#696969' },
      'mouse_hunter': { bg: '#9ACD32', border: '#6B8E23' }
    };

    const snakeStyle = SNAKE_STYLES[snakeType] || { bg: '#4CAF50', border: '#388E3C' };
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

        <div className={styles.foodInfo}>
          <h3>{t('legend.food')}</h3>
          <ul className={styles.foodList}>
            {Object.entries(FOOD_DESCRIPTIONS[environment] || {}).map(([foodName, description]) => {
              const isSpecial = typeof description.points === 'string';
              const isPenalty = typeof description.points === 'number' && description.points < 0;

              return (
                  <li key={foodName} className={styles.foodItem}>
                    <div
                        className={styles.foodImage}
                        style={{ backgroundColor: getFoodColor(foodName) }}
                        data-special={isSpecial ? "true" : undefined}
                        data-penalty={isPenalty ? "true" : undefined}
                    ></div>
                    <div className={styles.foodDescription}>
                      <strong>{description.name}</strong>: {description.description}
                      <div
                          className={styles.foodPoints}
                          style={{ color: isPenalty ? '#e74c3c' : (isSpecial ? '#f39c12' : '#4CAF50') }}
                      >
                        {typeof description.points === 'string'
                            ? description.points
                            : t('legend.points', { count: description.points })}
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
