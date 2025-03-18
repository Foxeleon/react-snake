import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameBoard.module.css';

const GRID_SIZE = 20;

export const GameBoard: React.FC = () => {
  const { snake, food } = useGameStore();

  return (
    <div className={styles.board}>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            className={`${styles.cell} ${isSnake ? styles.snake : ''} ${
              isFood ? styles.food : ''
            }`}
          />
        );
      })}
    </div>
  );
}; 