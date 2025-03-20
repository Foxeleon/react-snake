import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './Legend.module.css';

const Legend: React.FC = () => {
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

  // Цвета змей для разных типов
  const snakeColors: Record<string, string> = {
    'tropical_green': '#4CAF50',  // Зеленый
    'red_sea': '#F44336',         // Красный
    'blue_green_sea': '#00BCD4',  // Сине-зеленый
    'forest_boa': '#8BC34A',      // Светло-зеленый
    'rattlesnake': '#FFC107',     // Желтый
    'striped_viper': '#FF9800',   // Оранжевый
    'mouse_hunter': '#795548'     // Коричневый
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

  // Описания змей и их особенностей в разных окружениях
  const snakeDescriptions: Record<string, { name: string, description: string, animationDescription: string }> = {
    // Змеи в джунглях
    'green_snake': {
      name: 'Зеленая змея',
      description: 'обитает в густых зарослях джунглей',
      animationDescription: 'оставляет за собой лёгкие потоки ветра'
    },
    'python': {
      name: 'Питон',
      description: 'предпочитает тропические леса',
      animationDescription: 'шелестит листвой при движении'
    },
    'viper': {
      name: 'Гадюка',
      description: 'скрывается среди листвы',
      animationDescription: 'рассекает воздух вокруг себя'
    },
    
    // Змеи в море
    'sea_snake': {
      name: 'Морская змея',
      description: 'обитает в тёплых водах океана',
      animationDescription: 'оставляет за собой пузырьки воздуха'
    },
    'eel': {
      name: 'Угорь',
      description: 'скользит среди водорослей',
      animationDescription: 'создаёт вихри в воде'
    },
    
    // Змеи в лесу
    'forest_snake': {
      name: 'Лесная змея',
      description: 'прячется среди травы и листвы',
      animationDescription: 'заставляет листья разлетаться в стороны'
    },
    'grass_snake': {
      name: 'Уж',
      description: 'предпочитает лесные опушки',
      animationDescription: 'шуршит опавшими листьями'
    },
    
    // Змеи в пустыне
    'sand_snake': {
      name: 'Песчаная змея',
      description: 'зарывается в горячий песок',
      animationDescription: 'поднимает облака песка при движении'
    },
    'sidewinder': {
      name: 'Гремучая змея',
      description: 'оставляет S-образные следы на песке',
      animationDescription: 'создаёт песчаные вихри'
    },
    
    // Змеи в степи
    'steppe_adder': {
      name: 'Степная гадюка',
      description: 'скрывается в высокой траве',
      animationDescription: 'вызывает пыльные облачка при движении'
    },
    'ratsnake': {
      name: 'Полоз',
      description: 'охотится на мелких грызунов',
      animationDescription: 'колышет траву и поднимает пыль'
    }
  };

  // Общие описания анимаций в разных окружениях
  const environmentAnimations: Record<string, string> = {
    'jungle': 'создаёт лёгкие потоки ветра',
    'sea': 'оставляет пузырьки воздуха',
    'forest': 'разбрасывает листья вокруг себя',
    'desert': 'поднимает волны песка',
    'steppe': 'вызывает пыльные облака'
  };

  // Получение информации о текущей змее через маппинг
  const mappedSnakeType = snakeTypeMapping[snakeType] || snakeType;
  const currentSnake = snakeDescriptions[mappedSnakeType] || {
    name: `Змея типа ${snakeType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
    description: `обитает в ${environment === 'jungle' ? 'джунглях' : 
                  environment === 'sea' ? 'море' : 
                  environment === 'forest' ? 'лесу' : 
                  environment === 'desert' ? 'пустыне' : 'степи'}`,
    animationDescription: environmentAnimations[environment] || 'двигается особым образом'
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
    const color = snakeColors[snakeType] || '#4CAF50';
    const eyeColor = '#000';

    return (
      <div 
        className={styles.snakeExample} 
        style={{ 
          backgroundColor: color,
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

  return (
    <div className={`${styles.legendContainer} ${styles[settings.theme]}`}>
      <button onClick={toggleLegend} className={styles.closeButton}>×</button>
      <h2>Легенда</h2>
      
      <div className={styles.snakeInfo}>
        <h3>Ваша змея</h3>
        <div className={styles.snakeDisplay}>
          {renderSnakeHead()}
          <p>
            <strong>{currentSnake.name}</strong> {currentSnake.description} и {currentSnake.animationDescription}.
          </p>
        </div>
      </div>
      
      <div className={styles.foodInfo}>
        <h3>Пища</h3>
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
                      : `${description.points > 0 ? '+' : ''}${description.points} очков`}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className={styles.controlsInfo}>
        <h3>Управление</h3>
        <p>Используйте стрелки для управления змейкой.</p>
        <p>На мобильных устройствах доступно управление свайпами.</p>
      </div>
    </div>
  );
};

export default Legend; 