import { BoardSize, Environment, SnakeType } from '@/types/game';

// Константы для размеров игрового поля
export const GRID_SIZES: Record<BoardSize, number> = {
  mini: 10,
  small: 15,
  medium: 20,
  large: 25,
  giant: 30
};

// Константы для времени исчезновения еды (в миллисекундах)
export const FOOD_EXPIRATION_TIMES: Record<BoardSize, number> = {
  mini: 12000,    // 12 секунд
  small: 10000,   // 10 секунд
  medium: 8000,   // 8 секунд
  large: 6000,    // 6 секунд
  giant: 4000     // 4 секунды
};

// Соотношение типов змей к окружению
export const ENVIRONMENT_TO_SNAKE_TYPES: Record<Environment, SnakeType[]> = {
  jungle: ['tropical_green'],
  sea: ['red_sea', 'blue_green_sea'],
  forest: ['forest_boa'],
  desert: ['rattlesnake', 'striped_viper'],
  steppe: ['mouse_hunter']
};

// Настройки игры по умолчанию
export const DEFAULT_PLAYER_NAME = 'Игрок';
export const DEFAULT_ENVIRONMENT: Environment = 'jungle';
export const DEFAULT_THEME = 'light';
export const DEFAULT_BOARD_SIZE: BoardSize = 'medium';

// Вероятности появления еды
export const FOOD_SPAWN_PROBABILITIES = {
  common: 0.6,   // 60% шанс обычной еды
  medium: 0.2,   // 20% шанс средней еды
  rare: 0.05,    // 5% шанс редкой еды
  special: 0.1,  // 10% шанс особой еды
  penalty: 0.15  // 15% шанс штрафной еды
};

// Время действия эффекта удвоения очков (в миллисекундах)
export const DOUBLE_POINTS_DURATION = 15000; // 15 секунд

// Настройки начальной скорости игры
export const INITIAL_SPEED = 200;

// Снижение скорости при поедании еды (выше значение = быстрее игра)
export const SPEED_INCREASE_RATE = 2; 