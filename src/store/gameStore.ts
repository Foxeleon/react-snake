import { create } from 'zustand';
import { 
  GameStore, 
  Direction, 
  Position, 
  Environment,
  Theme,
  BoardSize,
  Food,
  FoodType,
  SnakeType,
  PlayerRecord,
  GameSettings,
  FieldSelectionMode
} from '@/types/game';
import {
  GRID_SIZES,
  FOOD_EXPIRATION_TIMES,
  ENVIRONMENT_TO_SNAKE_TYPES,
  DEFAULT_PLAYER_NAME,
  DEFAULT_ENVIRONMENT,
  DEFAULT_THEME,
  DEFAULT_BOARD_SIZE,
  FOOD_SPAWN_PROBABILITIES,
  DOUBLE_POINTS_DURATION,
  INITIAL_SPEED,
  SPEED_INCREASE_RATE
} from '@/constants/game';
import { loadSettings, loadRecords, saveSettings, addRecord } from '@/utils/storage';

// Начальная позиция змейки
const getInitialSnake = (gridSize: number): Position[] => {
  const middle = Math.floor(gridSize / 2);
  return [
    { x: middle, y: middle },
    { x: middle, y: middle + 1 },
  ];
};

// Последовательный выбор окружений
let nextEnvironmentIndex = 0;
const environments: Environment[] = ['jungle', 'sea', 'forest', 'desert', 'steppe'];

// Получение следующего окружения для последовательного режима
const getNextEnvironment = (): Environment => {
  const environment = environments[nextEnvironmentIndex];
  nextEnvironmentIndex = (nextEnvironmentIndex + 1) % environments.length;
  return environment;
};

// Функция для генерации еды с учетом типа и вероятности
const generateFood = (snake: Position[], gridSize: number, environment: Environment): Food => {
  // Генерация случайной позиции для еды
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

  // Определение типа еды на основе вероятности
  const random = Math.random();
  let type: FoodType;
  let name = '';
  let points = 0;
  
  if (random < FOOD_SPAWN_PROBABILITIES.rare) {
    type = 'rare';
    points = 50;
  } else if (random < FOOD_SPAWN_PROBABILITIES.rare + FOOD_SPAWN_PROBABILITIES.medium) {
    type = 'medium';
    points = 25;
  } else if (random < FOOD_SPAWN_PROBABILITIES.rare + FOOD_SPAWN_PROBABILITIES.medium + FOOD_SPAWN_PROBABILITIES.penalty) {
    type = 'penalty';
    points = -20;
  } else if (random < FOOD_SPAWN_PROBABILITIES.rare + FOOD_SPAWN_PROBABILITIES.medium + FOOD_SPAWN_PROBABILITIES.penalty + FOOD_SPAWN_PROBABILITIES.special) {
    type = 'special';
    points = 0; // Особая еда не дает очков напрямую, а включает удвоение
  } else {
    type = 'common';
    points = 10;
  }

  // Называем еду в зависимости от окружения и типа
  switch (environment) {
    case 'jungle':
      if (type === 'common') name = 'bug';
      else if (type === 'medium') name = 'frog';
      else if (type === 'rare') name = 'bird';
      else if (type === 'special') name = 'pineapple';
      else if (type === 'penalty') name = 'poison_berry';
      break;
    case 'sea':
      if (type === 'common') name = 'shrimp';
      else if (type === 'medium') name = 'fish';
      else if (type === 'rare') name = 'starfish';
      else if (type === 'special') name = 'plankton';
      else if (type === 'penalty') name = 'jellyfish';
      break;
    case 'forest':
      if (type === 'common') name = 'ant';
      else if (type === 'medium') name = 'locust';
      else if (type === 'rare') name = 'rabbit';
      else if (type === 'special') name = 'mushroom';
      else if (type === 'penalty') name = 'moldy_berry';
      break;
    case 'desert':
      if (type === 'common') name = 'locust';
      else if (type === 'medium') name = 'beetle';
      else if (type === 'rare') name = 'egg';
      else if (type === 'special') name = 'cactus_flower';
      else if (type === 'penalty') name = 'thorn';
      break;
    case 'steppe':
      if (type === 'common') name = 'grasshopper';
      else if (type === 'medium') name = 'gopher';
      else if (type === 'rare') name = 'mouse';
      else if (type === 'special') name = 'golden_grass';
      else if (type === 'penalty') name = 'bitter_seed';
      break;
  }
  
  const now = Date.now();
  const boardSize = getBoardSizeFromGridSize(gridSize);
  const expirationTime = FOOD_EXPIRATION_TIMES[boardSize];
  
  return {
    position,
    type,
    name,
    points,
    spawnTime: now,
    expiryTime: now + expirationTime
  };
};

// Получение размера доски из размера сетки
const getBoardSizeFromGridSize = (gridSize: number): BoardSize => {
  switch (gridSize) {
    case 10: return 'mini';
    case 15: return 'small';
    case 20: return 'medium';
    case 25: return 'large';
    case 30: return 'giant';
    default: return 'medium';
  }
};

// Получение типа змеи на основе окружения
const getDefaultSnakeType = (environment: Environment): SnakeType => {
  const types = ENVIRONMENT_TO_SNAKE_TYPES[environment];
  return types[0]; // Возвращаем первый доступный тип для данного окружения
};

// Дефолтные настройки
const DEFAULT_SETTINGS: GameSettings = {
  playerName: DEFAULT_PLAYER_NAME,
  environment: DEFAULT_ENVIRONMENT,
  theme: DEFAULT_THEME,
  boardSize: DEFAULT_BOARD_SIZE,
  snakeType: getDefaultSnakeType(DEFAULT_ENVIRONMENT),
  gridSize: GRID_SIZES[DEFAULT_BOARD_SIZE],
  foodExpirationTime: FOOD_EXPIRATION_TIMES[DEFAULT_BOARD_SIZE],
  soundEnabled: true,
  fieldSelectionMode: 'random'
};

export const useGameStore = create<GameStore>((set, get) => {
  // Загрузка настроек и рекордов при инициализации
  const savedSettings = loadSettings() || DEFAULT_SETTINGS;
  const savedRecords = loadRecords();
  
  const initialSnake = getInitialSnake(savedSettings.gridSize);
  
  return {
    // Состояние игры
    snake: initialSnake,
    foods: [generateFood(initialSnake, savedSettings.gridSize, savedSettings.environment)],
  direction: 'UP',
  isGameOver: false,
  score: 0,
    speed: INITIAL_SPEED,
    settings: savedSettings,
    doublePointsActive: false,
    doublePointsEndTime: null,
    records: savedRecords,
    isPlaying: false,
    isSettingsOpen: false,
    isAuthenticated: false,
    isRecordsOpen: false,

    // Методы для игровой логики
  startGame: () => {
      const { settings } = get();
      const initialSnake = getInitialSnake(settings.gridSize);
      
      // Выбираем окружение в зависимости от режима
      let environment = settings.environment;
      if (settings.fieldSelectionMode === 'sequential') {
        environment = getNextEnvironment();
      }
      
      const updatedSettings = { ...settings, environment, snakeType: getDefaultSnakeType(environment) };
      
    set({
        snake: initialSnake,
        foods: [generateFood(initialSnake, settings.gridSize, environment)],
      direction: 'UP',
      isGameOver: false,
      score: 0,
        speed: INITIAL_SPEED,
        isPlaying: true,
        doublePointsActive: false,
        doublePointsEndTime: null,
        settings: updatedSettings
    });
  },

  moveSnake: () => {
      const { snake, foods, direction, score, speed, settings, doublePointsActive, doublePointsEndTime } = get();
    const head = { ...snake[0] };

      // Проверяем, не закончилось ли время удвоения очков
      let isDoublePointsActive = doublePointsActive;
      if (doublePointsActive && doublePointsEndTime && Date.now() > doublePointsEndTime) {
        isDoublePointsActive = false;
      }

      // Движение головы змеи
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
        head.x >= settings.gridSize ||
      head.y < 0 ||
        head.y >= settings.gridSize
    ) {
        set({ isGameOver: true, isPlaying: false });
        get().saveRecord();
      return;
    }

    // Проверка столкновения с собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        set({ isGameOver: true, isPlaying: false });
        get().saveRecord();
      return;
    }

    const newSnake = [head, ...snake];
      let newFoods = [...foods];
      let newScore = score;
      let newSpeed = speed;
      let newDoublePointsActive = isDoublePointsActive;
      let newDoublePointsEndTime = doublePointsEndTime;

    // Проверка съедания еды
      const eatenFoodIndex = foods.findIndex(food => 
        food.position.x === head.x && food.position.y === head.y
      );

      if (eatenFoodIndex !== -1) {
        const eatenFood = foods[eatenFoodIndex];
        
        // Удаляем съеденную еду
        newFoods.splice(eatenFoodIndex, 1);
        
        // Обрабатываем особую еду
        if (eatenFood.type === 'special') {
          newDoublePointsActive = true;
          newDoublePointsEndTime = Date.now() + DOUBLE_POINTS_DURATION;
        } else {
          // Добавляем очки
          let pointsToAdd = eatenFood.points;
          if (newDoublePointsActive) {
            pointsToAdd *= 2;
          }
          newScore += pointsToAdd;
          
          // Увеличиваем скорость, только если очки положительные
          if (pointsToAdd > 0) {
            newSpeed = Math.max(50, newSpeed - SPEED_INCREASE_RATE);
          }
        }
    } else {
        // Если еда не съедена, укорачиваем змею
      newSnake.pop();
      }

      // Проверяем, не истекло ли время у какой-либо еды
      const now = Date.now();
      newFoods = newFoods.filter(food => food.expiryTime > now);

      // Генерируем новую еду с определенной вероятностью
      if (newFoods.length < 3 && Math.random() < 0.1) {
        newFoods.push(generateFood(newSnake, settings.gridSize, settings.environment));
      }

      set({
        snake: newSnake,
        foods: newFoods,
        score: newScore,
        speed: newSpeed,
        doublePointsActive: newDoublePointsActive,
        doublePointsEndTime: newDoublePointsEndTime
      });
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
      const { settings } = get();
      const initialSnake = getInitialSnake(settings.gridSize);
      
    set({
        snake: initialSnake,
        foods: [generateFood(initialSnake, settings.gridSize, settings.environment)],
      direction: 'UP',
      isGameOver: false,
      score: 0,
        speed: INITIAL_SPEED,
        isPlaying: false,
        doublePointsActive: false,
        doublePointsEndTime: null
    });
  },

  increaseSpeed: () => {
    const { speed } = get();
      set({ speed: Math.max(50, speed - SPEED_INCREASE_RATE) });
    },

    // Методы для управления настройками
    setPlayerName: (name: string) => {
      set(state => ({
        settings: {
          ...state.settings,
          playerName: name
        }
      }));
      get().saveSettings();
    },

    setEnvironment: (environment: Environment) => {
      set(state => ({
        settings: {
          ...state.settings,
          environment,
          snakeType: getDefaultSnakeType(environment)
        }
      }));
      get().saveSettings();
    },

    setTheme: (theme: Theme) => {
      set(state => ({
        settings: {
          ...state.settings,
          theme
        }
      }));
      get().saveSettings();
    },

    setBoardSize: (boardSize: BoardSize) => {
      set(state => ({
        settings: {
          ...state.settings,
          boardSize,
          gridSize: GRID_SIZES[boardSize],
          foodExpirationTime: FOOD_EXPIRATION_TIMES[boardSize]
        }
      }));
      get().saveSettings();
    },
    
    setSoundEnabled: (enabled: boolean) => {
      set(state => ({
        settings: {
          ...state.settings,
          soundEnabled: enabled
        }
      }));
      get().saveSettings();
    },
    
    setFieldSelectionMode: (mode: FieldSelectionMode) => {
      set(state => ({
        settings: {
          ...state.settings,
          fieldSelectionMode: mode
        }
      }));
      get().saveSettings();
    },

    toggleSettings: () => {
      set(state => ({
        isSettingsOpen: !state.isSettingsOpen
      }));
    },

    toggleRecords: () => {
      set(state => ({
        isRecordsOpen: !state.isRecordsOpen
      }));
    },

    saveRecord: () => {
      const { score, settings } = get();
      if (score <= 0) return;

      const newRecord: PlayerRecord = {
        name: settings.playerName,
        score,
        environment: settings.environment,
        boardSize: settings.boardSize,
        date: new Date().toISOString()
      };

      const updatedRecords = addRecord(newRecord);
      set({ records: updatedRecords });
    },

    loadSettings: () => {
      const savedSettings = loadSettings();
      if (savedSettings) {
        set({ settings: savedSettings });
      }
    },

    saveSettings: () => {
      const { settings } = get();
      saveSettings(settings);
    }
  };
}); 