import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './Legend.module.css';

const Legend: React.FC = () => {
  const { settings } = useGameStore();
  const { environment, snakeType } = settings;

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

  // Получение информации о текущей змее
  const currentSnake = snakeDescriptions[snakeType] || {
    name: 'Неизвестная змея',
    description: 'обитает в различных местах',
    animationDescription: environmentAnimations[environment] || 'двигается особым образом'
  };

  return (
    <div className={`${styles.legendContainer} ${styles[settings.theme]}`}>
      <h2>Легенда</h2>
      
      <div className={styles.snakeInfo}>
        <h3>Ваша змея</h3>
        <p>
          <strong>{currentSnake.name}</strong> {currentSnake.description} и {currentSnake.animationDescription}.
        </p>
      </div>
      
      <div className={styles.foodInfo}>
        <h3>Пища</h3>
        <ul>
          {Object.entries(FOOD_DESCRIPTIONS[environment] || {}).map(([foodName, description]) => (
            <li key={foodName}>
              <strong>{description.name}</strong>: {description.description}
            </li>
          ))}
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