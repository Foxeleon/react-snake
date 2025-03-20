import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './Legend.module.css';

const Legend: React.FC = () => {
  const { settings } = useGameStore();
  const { environment, theme } = settings;

  // Получаем описания еды для текущего окружения
  const foodItems = FOOD_DESCRIPTIONS[environment];

  return (
    <div className={`${styles.legend} ${styles[theme]}`}>
      <h3>Легенда</h3>
      <div className={styles.foodList}>
        {Object.entries(foodItems).map(([key, item]) => (
          <div key={key} className={styles.foodItem}>
            <div className={`${styles.foodIcon} ${styles[`food_${key}`]}`} />
            <div className={styles.foodInfo}>
              <span className={styles.foodName}>{item.name}</span>
              <span className={styles.foodDescription}>{item.description}</span>
              <span className={styles.foodPoints}>
                {typeof item.points === 'string' ? item.points : `${item.points > 0 ? '+' : ''}${item.points} очков`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend; 