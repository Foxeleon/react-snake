import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './Score.module.css';

export const Score: React.FC = () => {
  const { score } = useGameStore();

  return (
    <div className={styles.score}>
      <h2>Счет: {score}</h2>
    </div>
  );
}; 