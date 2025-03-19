import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FOOD_DESCRIPTIONS } from '@/constants/game';
import styles from './Legend.module.css';

const Legend: React.FC = () => {
  const { settings } = useGameStore();
  const currentEnvironmentFoods = FOOD_DESCRIPTIONS[settings.environment];

  return (
    <div className={styles.legendContainer}>
      <h3 className={styles.legendTitle}>Легенда объектов:</h3>
      <div className={styles.legend}>
        {currentEnvironmentFoods && Object.entries(currentEnvironmentFoods).map(([type, food]) => (
          <div key={type} className={styles.legendItem}>
            <div className={`${styles.legendIcon} ${styles[`food_${type}`]}`} />
            <div className={styles.legendInfo}>
              <span className={styles.legendName}>{food.name}</span>
              <span className={styles.legendDesc}>{food.description}</span>
              <span 
                className={styles.legendPoints}
                data-negative={typeof food.points === 'number' && food.points < 0}
              >
                {typeof food.points === 'number' 
                  ? `${food.points > 0 ? '+' : ''}${food.points} очков` 
                  : food.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend; 