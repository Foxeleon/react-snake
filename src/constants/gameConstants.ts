import {
  BoardSize,
  Environment,
  SnakeType,
  FieldSelectionMode,
  Language,
  FoodName,
  FoodType,
  FoodColors, SnakeStylesMap, SnakeStyle
} from '@/types/gameTypes.ts';

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
export const DOUBLE_POINTS_DURATION = 15250; // 15,25 секунд

// Настройки начальной скорости игры
export const INITIAL_SPEED = 200;
export const SLOW_SPEED = 300;
export const FAST_SPEED = 100;

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
    common: ['scorpion'],
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
    scorpion: {
      nameKey: 'food.desert.scorpion.name',
      descriptionKey: 'food.desert.scorpion.description',
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
    bug: '#5D4037',          // Тёмно-коричневый, цвет тропических жуков
    frog: '#4CAF50',         // Естественный зелёный, как у тропических лягушек
    bird: '#FF9800',         // Тёплый оранжевый, как у тропических птиц
    pineapple: '#FFEB3B',    // Жёлтый, цвет спелого ананаса
    poison_berry: '#E91E63', // Малиновый, цвет ядовитых тропических ягод
    // Типы по умолчанию
    special: '#9C27B0',      // Фиолетовый, цвет редких тропических цветов
    penalty: '#F44336',      // Красный, предупреждающий об опасности
    common: '#8BC34A'        // Светло-зелёный, цвет листвы джунглей
  },
  sea: {
    shrimp: '#FF7043',       // Терракотовый, настоящий цвет креветок
    fish: '#039BE5',         // Морской синий, цвет океанических рыб
    starfish: '#FF5722',     // Тёплый оранжево-красный, цвет морской звезды
    plankton: '#81C784',     // Нежно-зелёный, цвет живого планктона
    jellyfish: '#9575CD',    // Лавандовый, полупрозрачный цвет медуз
    // Типы по умолчанию
    special: '#26C6DA',      // Бирюзовый, цвет тропической лагуны
    penalty: '#E53935',      // Коралловый красный, цвет опасных морских существ
    common: '#4FC3F7'        // Голубой, цвет морской воды
  },
  forest: {
    ant: '#3E2723',          // Тёмно-коричневый, цвет лесных муравьёв
    locust: '#827717',       // Оливково-коричневый, цвет лесной саранчи
    rabbit: '#795548',       // Средний коричневый, цвет дикого кролика
    mushroom: '#BCAAA4',     // Серо-бежевый, цвет лесных грибов
    moldy_berry: '#C2185B',        // Бордовый, цвет лесных ягод
    // Типы по умолчанию
    special: '#558B2F',      // Глубокий зелёный, цвет хвойных деревьев
    penalty: '#D32F2F',      // Яркий красный, цвет ядовитых лесных ягод
    common: '#689F38'        // Лесной зелёный, цвет листвы лиственных деревьев
  },
  desert: {
    scorpion: '#5D4037',     // Тёмно-коричневый, цвет пустынных скорпионов
    beetle: '#795548',       // Коричневый, цвет пустынных жуков
    egg: '#EFEBE9',          // Кремово-белый, цвет яиц пустынных рептилий
    cactus_flower: '#EC407A', // Розовый, цвет цветков кактуса
    thorn: '#8D6E63',        // Коричнево-серый, цвет сухих колючек
    // Типы по умолчанию
    special: '#FFA000',      // Янтарный, цвет песчаных дюн на закате
    penalty: '#6D4C41',      // Глубокий коричневый, цвет ядовитых пустынных насекомых
    common: '#FFD54F'        // Песочно-жёлтый, цвет пустынного ландшафта
  },

  steppe: {
    grasshopper: '#7CB342',  // Светло-зелёный, цвет степных кузнечиков
    gopher: '#8D6E63',       // Землистый коричневый, цвет меха суслика
    mouse: '#9E9E9E',        // Натуральный серый, цвет полевых мышей
    golden_grass: '#FDD835', // Золотисто-жёлтый, цвет высохшей степной травы
    bitter_seed: '#A1887F',  // Серо-коричневый, цвет созревших степных семян
    // Типы по умолчанию
    special: '#AFB42B',      // Желто-зелёный, цвет молодой степной растительности
    penalty: '#6D4C41',      // Землисто-коричневый, цвет ядовитых степных растений
    common: '#DCE775'        // Светло-золотистый, цвет степной травы
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

export const SNAKE_STYLES: SnakeStylesMap = {
  'tropical_green': { bg: '#32CD32', border: '#228B22' },
  'red_sea': { bg: '#FF4500', border: '#B22222' },
  'blue_green_sea': { bg: '#20B2AA', border: '#008B8B' },
  'forest_boa': { bg: '#2E8B57', border: '#004d25' },
  'rattlesnake': { bg: '#DAA520', border: '#B8860B' },
  'striped_viper': { bg: '#D2B48C', border: '#8B4513' },
  'mouse_hunter': { bg: '#CD853F', border: '#8B4513' },
};

// Функция для получения стиля по типу змеи
export const getSnakeStyle = (snakeType: string): SnakeStyle => {
  return SNAKE_STYLES[snakeType] || { bg: '#4CAF50', border: '#388E3C' };
};

export const lightLegendBgColors  = {
  'jungle': '#e8f5e9', // светло-зеленый для джунглей
  'sea': '#e3f2fd',    // светло-голубой для моря
  'forest': '#f1f8e9', // бледно-зеленый для леса
  'desert': '#fff8e1', // песочный для пустыни
  'steppe': '#f5f5f5'  // светло-серый для степи
};

// Определяем цвета для темной темы
export const darkLegendBgColors = {
  'jungle': '#1b3620',    // темно-зеленый для джунглей
  'sea': '#0d253d',       // темно-синий для моря
  'forest': '#1a2e0d',    // темно-зеленый для леса
  'desert': '#3e2e0a',    // темно-песочный для пустыни
  'steppe': '#2c2c2c'     // темно-серый для степи
};