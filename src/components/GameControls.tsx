import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameControls.module.css';

export const GameControls: React.FC = () => {
  const { startGame, moveSnake, changeDirection, isGameOver, speed } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection]);

  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [moveSnake, isGameOver, speed]);

  return (
    <div className={styles.controls}>
      <button onClick={startGame} disabled={!isGameOver}>
        {isGameOver ? 'Начать заново' : 'Игра идет...'}
      </button>
      <div className={styles.instructions}>
        <p>Используйте стрелки для управления змейкой</p>
      </div>
    </div>
  );
}; 