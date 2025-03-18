import { create } from 'zustand';
import { GameStore, Direction, Position } from '@/types/game';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
];

const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export const useGameStore = create<GameStore>((set, get) => ({
  snake: INITIAL_SNAKE,
  food: generateFood(INITIAL_SNAKE),
  direction: 'UP',
  isGameOver: false,
  score: 0,
  speed: 200,

  startGame: () => {
    set({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: 'UP',
      isGameOver: false,
      score: 0,
      speed: 200,
    });
  },

  moveSnake: () => {
    const { snake, direction, food, score, speed } = get();
    const head = { ...snake[0] };

    switch (direction) {
      case 'UP':
        head.y--;
        break;
      case 'DOWN':
        head.y++;
        break;
      case 'LEFT':
        head.x--;
        break;
      case 'RIGHT':
        head.x++;
        break;
    }

    // Проверка столкновения со стенами
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      set({ isGameOver: true });
      return;
    }

    // Проверка столкновения с собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      set({ isGameOver: true });
      return;
    }

    const newSnake = [head, ...snake];

    // Проверка съедания еды
    if (head.x === food.x && head.y === food.y) {
      set({
        snake: newSnake,
        food: generateFood(newSnake),
        score: score + 10,
        speed: Math.max(50, speed - 5),
      });
    } else {
      newSnake.pop();
      set({
        snake: newSnake,
      });
    }
  },

  changeDirection: (newDirection: Direction) => {
    const { direction } = get();
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (opposites[direction] !== newDirection) {
      set({ direction: newDirection });
    }
  },

  resetGame: () => {
    set({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: 'UP',
      isGameOver: false,
      score: 0,
      speed: 200,
    });
  },

  increaseSpeed: () => {
    const { speed } = get();
    set({ speed: Math.max(50, speed - 5) });
  },
})); 