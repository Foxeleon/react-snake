import { BoardSize, Environment, SnakeType, FieldSelectionMode, Language } from '@/types/game';

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
export const DEFAULT_PLAYER_NAME = 'Игрок';
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
