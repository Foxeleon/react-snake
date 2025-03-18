export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  isGameOver: boolean;
  score: number;
  speed: number;
}

export interface GameStore extends GameState {
  startGame: () => void;
  moveSnake: () => void;
  changeDirection: (direction: Direction) => void;
  resetGame: () => void;
  increaseSpeed: () => void;
} 