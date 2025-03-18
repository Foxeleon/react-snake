import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './Score.module.css';

export const Score: React.FC = () => {
  const { score, doublePointsActive, doublePointsEndTime, settings } = useGameStore();

  // Расчет оставшегося времени действия удвоения очков
  const getDoublePointsTimeLeft = (): number => {
    if (!doublePointsActive || !doublePointsEndTime) return 0;
    
    const now = Date.now();
    const timeLeft = Math.max(0, doublePointsEndTime - now);
    return Math.ceil(timeLeft / 1000); // округляем до секунд
  };
  
  const timeLeft = getDoublePointsTimeLeft();

  return (
    <div className={`${styles.score} ${styles[settings.theme]}`}>
      <h2>Счет: <span className={doublePointsActive ? styles.doubleScore : ''}>{score}</span></h2>
      
      {doublePointsActive && (
        <div className={styles.doublePointsActive}>
          <p>Удвоение очков активно!</p>
          <p className={styles.timeLeft}>Осталось: {timeLeft} сек.</p>
        </div>
      )}
    </div>
  );
}; 