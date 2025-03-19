import { BoardSize, Difficulty, Environment, FoodType, SnakeType } from '@/types/game';

// Константы для размеров игрового поля
export const GRID_SIZES: Record<BoardSize, number> = {
  mini: 10,
  small: 15,
  medium: 20,
  large: 25,
  giant: 30
};

// Константы для времени исчезновения еды (в миллисекундах) по умолчанию (нормальный режим)
export const DEFAULT_FOOD_EXPIRATION_TIMES: Record<BoardSize, number> = {
  mini: 12000,    // 12 секунд
  small: 10000,   // 10 секунд
  medium: 8000,   // 8 секунд
  large: 6000,    // 6 секунд
  giant: 4000     // 4 секунды
};

// Модификаторы времени исчезновения еды по уровням сложности
export const DIFFICULTY_EXPIRATION_MODIFIERS: Record<Difficulty, number> = {
  easy: 5000,     // +5 секунд на легком уровне
  normal: 0,      // стандартное время на нормальном уровне
  hard: -3000     // -3 секунды на сложном уровне
};

// Модификаторы для скорости по уровням сложности
export const DIFFICULTY_SPEED_MODIFIERS: Record<Difficulty, number> = {
  easy: 50,       // Медленнее на 50мс
  normal: 0,      // Стандартная скорость
  hard: -50       // Быстрее на 50мс
};

// Модификаторы для вероятности появления штрафной еды по уровням сложности
export const DIFFICULTY_PENALTY_MODIFIERS: Record<Difficulty, number> = {
  easy: -0.05,    // Реже на 5%
  normal: 0,      // Стандартная вероятность
  hard: 0.05      // Чаще на 5%
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
export const DEFAULT_DIFFICULTY: Difficulty = 'normal';

// Вероятности появления еды (нормальный режим)
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

// Описания еды по типам
export interface FoodDescription {
  name: string;
  description: string;
  points: string | number;
}

// Описания еды по окружениям
export const FOOD_DESCRIPTIONS: Record<Environment, Record<FoodType, FoodDescription>> = {
  jungle: {
    common: { name: 'Жук', description: 'Обычная еда', points: 10 },
    medium: { name: 'Лягушка', description: 'Средняя еда', points: 25 },
    rare: { name: 'Птица', description: 'Редкая еда', points: 50 },
    special: { name: 'Ананас', description: 'Особая еда - удваивает очки на 15 секунд', points: 'x2' },
    penalty: { name: 'Ядовитая ягода', description: 'Штрафная еда', points: -20 }
  },
  sea: {
    common: { name: 'Креветка', description: 'Обычная еда', points: 10 },
    medium: { name: 'Рыба', description: 'Средняя еда', points: 25 },
    rare: { name: 'Морская звезда', description: 'Редкая еда', points: 50 },
    special: { name: 'Планктон', description: 'Особая еда - удваивает очки на 15 секунд', points: 'x2' },
    penalty: { name: 'Медуза', description: 'Штрафная еда', points: -20 }
  },
  forest: {
    common: { name: 'Муравей', description: 'Обычная еда', points: 10 },
    medium: { name: 'Кузнечик', description: 'Средняя еда', points: 25 },
    rare: { name: 'Кролик', description: 'Редкая еда', points: 50 },
    special: { name: 'Гриб', description: 'Особая еда - удваивает очки на 15 секунд', points: 'x2' },
    penalty: { name: 'Плесневелая ягода', description: 'Штрафная еда', points: -20 }
  },
  desert: {
    common: { name: 'Кузнечик', description: 'Обычная еда', points: 10 },
    medium: { name: 'Жук', description: 'Средняя еда', points: 25 },
    rare: { name: 'Яйцо', description: 'Редкая еда', points: 50 },
    special: { name: 'Цветок кактуса', description: 'Особая еда - удваивает очки на 15 секунд', points: 'x2' },
    penalty: { name: 'Колючка', description: 'Штрафная еда', points: -20 }
  },
  steppe: {
    common: { name: 'Кузнечик', description: 'Обычная еда', points: 10 },
    medium: { name: 'Сурок', description: 'Средняя еда', points: 25 },
    rare: { name: 'Мышь', description: 'Редкая еда', points: 50 },
    special: { name: 'Золотая трава', description: 'Особая еда - удваивает очки на 15 секунд', points: 'x2' },
    penalty: { name: 'Горькое семя', description: 'Штрафная еда', points: -20 }
  }
}; 