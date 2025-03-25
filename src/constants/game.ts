import { BoardSize, Environment, SnakeType, FieldSelectionMode } from '@/types/game';

// Константы для размеров игрового поля
export const GRID_SIZES: Record<BoardSize, number> = {
  mini: 15,      // Было 10
  small: 20,     // Было 15
  medium: 25,    // Было 20
  large: 30,     // Было 25
  giant: 35      // Было 30
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

// Режимы выбора поля
export const FIELD_SELECTION_MODES: Record<string, FieldSelectionMode> = {
  static: 'static',         // Не менять поле
  sequential: 'sequential', // Последовательно менять поле
  random: 'random'          // Случайно менять поле
};

// Порядок смены окружений для последовательного режима
export const ENVIRONMENT_SEQUENCE: Environment[] = [
  'jungle', 'sea', 'forest', 'desert', 'steppe'
];

// Настройки игры по умолчанию
export const DEFAULT_PLAYER_NAME = 'Игрок';
export const DEFAULT_ENVIRONMENT: Environment = 'jungle';
export const DEFAULT_THEME = 'light';
export const DEFAULT_BOARD_SIZE: BoardSize = 'medium';
export const DEFAULT_FIELD_SELECTION_MODE: FieldSelectionMode = 'static';

// Вероятности появления еды
export const FOOD_SPAWN_PROBABILITIES = {
  common: 0.6,   // 60% шанс обычной еды
  medium: 0.2,   // 20% шанс средней еды
  rare: 0.05,    // 5% шанс редкой еды
  special: 0.8,  // 10% шанс особой еды
  penalty: 0.15  // 15% шанс штрафной еды
};

// Время действия эффекта удвоения очков (в миллисекундах)
export const DOUBLE_POINTS_DURATION = 15000; // 15 секунд

// Настройки начальной скорости игры
export const INITIAL_SPEED = 200;

// Снижение скорости при поедании еды (выше значение = быстрее игра)
export const SPEED_INCREASE_RATE = 2;

// Маппинг типов еды к именам еды для разных окружений
export const ENVIRONMENT_FOOD_MAPPING: Record<Environment, Record<string, string[]>> = {
  jungle: {
    common: ['bug'],
    medium: ['frog'],
    rare: ['bird'],
    special: ['pineapple'],
    penalty: ['poison_berry']
  },
  sea: {
    common: ['shrimp'],
    medium: ['fish'],
    rare: ['starfish'],
    special: ['plankton'],
    penalty: ['jellyfish']
  },
  forest: {
    common: ['ant'],
    medium: ['locust'],
    rare: ['rabbit'],
    special: ['mushroom'],
    penalty: ['moldy_berry']
  },
  desert: {
    common: ['locust'],
    medium: ['beetle'],
    rare: ['egg'],
    special: ['cactus_flower'],
    penalty: ['thorn']
  },
  steppe: {
    common: ['grasshopper'],
    medium: ['gopher'],
    rare: ['mouse'],
    special: ['golden_grass'],
    penalty: ['bitter_seed']
  }
};

// Описания пищи для разных окружений
export const FOOD_DESCRIPTIONS: Record<Environment, Record<string, { name: string; description: string; points: number | string }>> = {
  jungle: {
    bug: { 
      name: 'Жук', 
      description: 'Обычная еда в джунглях', 
      points: 10 
    },
    frog: { 
      name: 'Лягушка', 
      description: 'Средняя добыча', 
      points: 25 
    },
    bird: { 
      name: 'Птица', 
      description: 'Редкая добыча', 
      points: 50 
    },
    pineapple: { 
      name: 'Ананас', 
      description: 'Удваивает получаемые очки на 15 секунд', 
      points: 'x2' 
    },
    poison_berry: { 
      name: 'Ядовитая ягода', 
      description: 'Штрафная еда, избегайте её', 
      points: -20 
    }
  },
  sea: {
    shrimp: { 
      name: 'Креветка', 
      description: 'Обычная еда в море', 
      points: 10 
    },
    fish: { 
      name: 'Рыба', 
      description: 'Средняя добыча', 
      points: 25 
    },
    starfish: { 
      name: 'Морская звезда', 
      description: 'Редкая добыча', 
      points: 50 
    },
    plankton: { 
      name: 'Планктон', 
      description: 'Удваивает получаемые очки на 15 секунд', 
      points: 'x2' 
    },
    jellyfish: { 
      name: 'Медуза', 
      description: 'Штрафная еда, избегайте её', 
      points: -20 
    }
  },
  forest: {
    ant: { 
      name: 'Муравей', 
      description: 'Обычная еда в лесу', 
      points: 10 
    },
    locust: { 
      name: 'Саранча', 
      description: 'Средняя добыча', 
      points: 25 
    },
    rabbit: { 
      name: 'Кролик', 
      description: 'Редкая добыча', 
      points: 50 
    },
    mushroom: { 
      name: 'Гриб', 
      description: 'Удваивает получаемые очки на 15 секунд', 
      points: 'x2' 
    },
    moldy_berry: { 
      name: 'Плесневелая ягода', 
      description: 'Штрафная еда, избегайте её', 
      points: -20 
    }
  },
  desert: {
    locust: { 
      name: 'Саранча', 
      description: 'Обычная еда в пустыне', 
      points: 10 
    },
    beetle: { 
      name: 'Жук-скарабей', 
      description: 'Средняя добыча', 
      points: 25 
    },
    egg: { 
      name: 'Яйцо', 
      description: 'Редкая добыча', 
      points: 50 
    },
    cactus_flower: { 
      name: 'Цветок кактуса', 
      description: 'Удваивает получаемые очки на 15 секунд', 
      points: 'x2' 
    },
    thorn: { 
      name: 'Колючка', 
      description: 'Штрафная еда, избегайте её', 
      points: -20 
    }
  },
  steppe: {
    grasshopper: { 
      name: 'Кузнечик', 
      description: 'Обычная еда в степи', 
      points: 10 
    },
    gopher: { 
      name: 'Суслик', 
      description: 'Средняя добыча', 
      points: 25 
    },
    mouse: { 
      name: 'Мышь', 
      description: 'Редкая добыча', 
      points: 50 
    },
    golden_grass: { 
      name: 'Золотистая трава', 
      description: 'Удваивает получаемые очки на 15 секунд', 
      points: 'x2' 
    },
    bitter_seed: { 
      name: 'Горькое семя', 
      description: 'Штрафная еда, избегайте её', 
      points: -20 
    }
  }
}; 