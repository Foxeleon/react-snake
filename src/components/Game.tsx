import React from 'react';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { Score } from './Score';
import styles from './Game.module.css';

export const Game: React.FC = () => {
  return (
    <div className={styles.game}>
      <h1>Змейка</h1>
      <Score />
      <GameBoard />
      <GameControls />
    </div>
  );
}; 