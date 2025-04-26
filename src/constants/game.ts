import {
  BoardSize,
  Environment,
  SnakeType,
  FieldSelectionMode,
  Language,
  FoodName,
  FoodType,
  FoodColors
} from '@/types/game';

export const DEFAULT_LANGUAGE: Language = 'en';

// Константы для размеров игрового поля
export const GRID_SIZES: Record<BoardSize, number> = {
  mini: 10,
  small: 15,
  medium: 20,
  large: 25,
  giant: 30,
  epic:  35,
};

// Константы для времени исчезновения еды (в миллисекундах)
export const FOOD_EXPIRATION_TIMES: Record<BoardSize, number> = {
  mini: 12000,
  small: 10000,
  medium: 8000,
  large: 6000,
  giant: 4000,
  epic:  4000,
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
export const DEFAULT_PLAYER_NAME = 'Player';
export const DEFAULT_ENVIRONMENT: Environment = 'jungle';
export const DEFAULT_THEME = 'light';
export const DEFAULT_BOARD_SIZE: BoardSize = 'medium';
export const DEFAULT_FIELD_SELECTION_MODE: FieldSelectionMode = 'sequential';

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
// constants/game.ts
export const FOOD_DESCRIPTIONS: Record<Environment, Record<string, {
  nameKey: string;
  descriptionKey: string;
  points: number | string
}>> = {
  jungle: {
    bug: {
      nameKey: 'food.jungle.bug.name',
      descriptionKey: 'food.jungle.bug.description',
      points: 10
    },
    frog: {
      nameKey: 'food.jungle.frog.name',
      descriptionKey: 'food.jungle.frog.description',
      points: 25
    },
    bird: {
      nameKey: 'food.jungle.bird.name',
      descriptionKey: 'food.jungle.bird.description',
      points: 50
    },
    pineapple: {
      nameKey: 'food.jungle.pineapple.name',
      descriptionKey: 'food.jungle.pineapple.description',
      points: 'x2'
    },
    poison_berry: {
      nameKey: 'food.jungle.poison_berry.name',
      descriptionKey: 'food.jungle.poison_berry.description',
      points: -20
    }
  },
  sea: {
    shrimp: {
      nameKey: 'food.sea.shrimp.name',
      descriptionKey: 'food.sea.shrimp.description',
      points: 10
    },
    fish: {
      nameKey: 'food.sea.fish.name',
      descriptionKey: 'food.sea.fish.description',
      points: 25
    },
    starfish: {
      nameKey: 'food.sea.starfish.name',
      descriptionKey: 'food.sea.starfish.description',
      points: 50
    },
    plankton: {
      nameKey: 'food.sea.plankton.name',
      descriptionKey: 'food.sea.plankton.description',
      points: 'x2'
    },
    jellyfish: {
      nameKey: 'food.sea.jellyfish.name',
      descriptionKey: 'food.sea.jellyfish.description',
      points: -20
    }
  },
  forest: {
    ant: {
      nameKey: 'food.forest.ant.name',
      descriptionKey: 'food.forest.ant.description',
      points: 10
    },
    locust: {
      nameKey: 'food.forest.locust.name',
      descriptionKey: 'food.forest.locust.description',
      points: 25
    },
    rabbit: {
      nameKey: 'food.forest.rabbit.name',
      descriptionKey: 'food.forest.rabbit.description',
      points: 50
    },
    mushroom: {
      nameKey: 'food.forest.mushroom.name',
      descriptionKey: 'food.forest.mushroom.description',
      points: 'x2'
    },
    moldy_berry: {
      nameKey: 'food.forest.moldy_berry.name',
      descriptionKey: 'food.forest.moldy_berry.description',
      points: -20
    }
  },
  desert: {
    locust: {
      nameKey: 'food.desert.locust.name',
      descriptionKey: 'food.desert.locust.description',
      points: 10
    },
    beetle: {
      nameKey: 'food.desert.beetle.name',
      descriptionKey: 'food.desert.beetle.description',
      points: 25
    },
    egg: {
      nameKey: 'food.desert.egg.name',
      descriptionKey: 'food.desert.egg.description',
      points: 50
    },
    cactus_flower: {
      nameKey: 'food.desert.cactus_flower.name',
      descriptionKey: 'food.desert.cactus_flower.description',
      points: 'x2'
    },
    thorn: {
      nameKey: 'food.desert.thorn.name',
      descriptionKey: 'food.desert.thorn.description',
      points: -20
    }
  },
  steppe: {
    grasshopper: {
      nameKey: 'food.steppe.grasshopper.name',
      descriptionKey: 'food.steppe.grasshopper.description',
      points: 10
    },
    gopher: {
      nameKey: 'food.steppe.gopher.name',
      descriptionKey: 'food.steppe.gopher.description',
      points: 25
    },
    mouse: {
      nameKey: 'food.steppe.mouse.name',
      descriptionKey: 'food.steppe.mouse.description',
      points: 50
    },
    golden_grass: {
      nameKey: 'food.steppe.golden_grass.name',
      descriptionKey: 'food.steppe.golden_grass.description',
      points: 'x2'
    },
    bitter_seed: {
      nameKey: 'food.steppe.bitter_seed.name',
      descriptionKey: 'food.steppe.bitter_seed.description',
      points: -20
    }
  }
};

export const FOOD_COLORS: FoodColors = {
  jungle: {
    bug: '#8B4513',          // Коричневый (жук)
    frog: '#7CFC00',         // Ярко-зеленый (лягушка)
    bird: '#FFD700',         // Золотистый (птица)
    pineapple: '#c9c75f',    // Желто-зеленый (ананас)
    poison_berry: '#8A2BE2', // Фиолетовый (ядовитая ягода)
    // Типы по умолчанию
    special: '#FF00FF',      // Пурпурный (особая еда)
    penalty: '#FF0000',      // Красный (штрафная еда)
    common: '#4CAF50'        // Зеленый (обычная еда)
  },
  sea: {
    shrimp: '#FFA07A',       // Светло-лососевый (креветка)
    fish: '#87CEEB',         // Небесно-голубой (рыба)
    starfish: '#FFA500',     // Оранжевый (морская звезда)
    plankton: '#00FFFF',     // Бирюзовый (планктон)
    jellyfish: '#EE82EE',    // Фиолетовый (медуза)
    // Типы по умолчанию
    special: '#00BFFF',      // Голубой (особая еда)
    penalty: '#DC143C',      // Малиновый (штрафная еда)
    common: '#4CAF50'        // Зеленый (обычная еда)
  },
  forest: {
    ant: '#A52A2A',          // Коричневый (муравей)
    locust: '#D2691E',       // Шоколадный (саранча)
    rabbit: '#805d5d',       // Серо-коричневый (кролик)
    mushroom: '#D2B48C',     // Песочный (гриб)
    moldy_berry: '#556B2F',  // Оливковый (плесневелая ягода)
    // Типы по умолчанию
    special: '#228B22',      // Лесной зеленый (особая еда)
    penalty: '#B22222',      // Огненно-кирпичный (штрафная еда)
    common: '#4CAF50'        // Зеленый (обычная еда)
  },
  desert: {
    locust: '#B8860B',       // Темно-золотистый (саранча)
    beetle: '#2E8B57',       // Морской зеленый (жук)
    egg: '#F4A460',          // Песочно-коричневый (яйцо)
    cactus_flower: '#000000',// Черный (цветок кактуса)
    thorn: '#CD853F',        // Перу (колючка)
    // Типы по умолчанию
    special: '#DAA520',      // Золотисто-буроватый (особая еда)
    penalty: '#800000',      // Бордовый (штрафная еда)
    common: '#4CAF50'        // Зеленый (обычная еда)
  },
  steppe: {
    grasshopper: '#9ACD32',  // Желто-зеленый (кузнечик)
    gopher: '#A0522D',       // Сиена (суслик)
    mouse: '#FFFFF0',        // Кремовый (мышь)
    golden_grass: '#6B8E23', // Оливково-зеленый (золотая трава)
    bitter_seed: '#f5a353',  // (горькое семя)
    // Типы по умолчанию
    special: '#BDB76B',      // Темный хаки (особая еда)
    penalty: '#8B0000',      // Темно-красный (штрафная еда)
    common: '#4CAF50'        // Зеленый (обычная еда)
  }
};


// Универсальная функция для получения цвета еды
export const getFoodColor = (
    environment: Environment,
    foodName: FoodName | string,
    foodType: FoodType = 'common'
): string => {
  // Проверяем существование окружения
  if (!FOOD_COLORS[environment]) {
    return '#4CAF50'; // Зеленый по умолчанию
  }

  // Сначала пробуем найти цвет по имени
  if (FOOD_COLORS[environment][foodName as keyof (typeof FOOD_COLORS)[typeof environment]]) {
    return FOOD_COLORS[environment][foodName as keyof (typeof FOOD_COLORS)[typeof environment]];
  }

  // Если не нашли по имени, используем тип
  return FOOD_COLORS[environment][foodType as keyof typeof FOOD_COLORS[typeof environment]] || FOOD_COLORS[environment].common;
};
