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
  INITIAL_SPEED,
  SPEED_INCREASE_RATE,
  DEFAULT_FIELD_SELECTION_MODE,
  ENVIRONMENT_FOOD_MAPPING,
  DOUBLE_POINTS_DURATION
} from '@/constants/game';
import { loadSettings, loadRecords, saveSettings, addRecord } from '@/utils/storage';

// Вспомогательные функции и константы для логики игры
const environments: Environment[] = ['jungle', 'sea', 'forest', 'desert', 'steppe'];

// Получение начальной позиции змеи
const getInitialSnake = (gridSize: number): Position[] => {
  // Создаем змею в центре поля, направленную вверх
  const centerX = Math.floor(gridSize / 2);
  const centerY = Math.floor(gridSize / 2);
  
  return [
    { x: centerX, y: centerY }, // Голова
    { x: centerX, y: centerY + 1 }, // Тело
    { x: centerX, y: centerY + 2 } // Хвост
  ];
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

  // Получаем имя еды в зависимости от окружения
  const foodOptions = ENVIRONMENT_FOOD_MAPPING[environment][type];
  if (foodOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * foodOptions.length);
    name = foodOptions[randomIndex];
  }

  // Определяем время жизни еды
  const now = Date.now();
  const spawnTime = now;
  // Определяем базовое время жизни еды в зависимости от размера поля
  const baseFoodLifetime = FOOD_EXPIRATION_TIMES[getBoardSizeFromGridSize(gridSize)];
  // Корректируем время жизни в зависимости от типа еды
  let lifetime = baseFoodLifetime;
  if (type === 'special') {
    lifetime *= 0.7; // Особая еда живет меньше
  } else if (type === 'rare') {
    lifetime *= 0.8; // Редкая еда тоже живет меньше
  }
  
  const expiryTime = now + lifetime;

  return {
    position,
    type,
    name,
    points,
    spawnTime,
    expiryTime
  };
};

// Получение размера доски из размера сетки
const getBoardSizeFromGridSize = (gridSize: number): BoardSize => {
  const entries = Object.entries(GRID_SIZES) as [BoardSize, number][];
  for (const [size, size_value] of entries) {
    if (size_value === gridSize) {
      return size;
    }
  }
  return DEFAULT_BOARD_SIZE; // Возвращаем значение по умолчанию, если ничего не найдено
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
  soundEnabled: false,
  fieldSelectionMode: DEFAULT_FIELD_SELECTION_MODE
};

// TODO fix it
// @ts-ignore
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
    showLegend: false,
    isPaused: false,

    // Методы для игровой логики
    startGame: () => {
      const { settings } = get();
      const initialSnake = getInitialSnake(settings.gridSize);
      
      // Выбираем окружение в зависимости от режима
      let environment = settings.environment;
      let snakeType = settings.snakeType;
      
      if (settings.fieldSelectionMode === 'sequential') {
        // Последовательная смена окружения
        const currentIndex = environments.indexOf(environment);
        const nextIndex = (currentIndex + 1) % environments.length;
        environment = environments[nextIndex];
        
        // Выбираем подходящий тип змеи для нового окружения
        const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[environment];
        snakeType = availableSnakeTypes[0];
      } else if (settings.fieldSelectionMode === 'random') {
        // Случайный выбор окружения
        const randomIndex = Math.floor(Math.random() * environments.length);
        environment = environments[randomIndex];
        
        // Выбираем подходящий тип змеи для нового окружения
        const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[environment];
        snakeType = availableSnakeTypes[0];
      } else {
        // В режиме 'static' проверяем соответствие типа змеи текущему окружению
        const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[environment];
        if (!availableSnakeTypes.includes(snakeType)) {
          // Если текущий тип змеи не подходит для данного окружения, выбираем первый доступный
          snakeType = availableSnakeTypes[0];
        }
      }
      
      // Обновляем настройки с выбранным окружением и типом змеи
      const updatedSettings = { 
        ...settings, 
        environment,
        snakeType
      };
      
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

    setSnakeType: (snakeType: SnakeType) => {
      // Проверяем, доступен ли этот тип змеи для текущего окружения
      const { settings } = get();
      const availableTypes = ENVIRONMENT_TO_SNAKE_TYPES[settings.environment];
      
      if (availableTypes.includes(snakeType)) {
        set({
          settings: {
            ...settings,
            snakeType
          }
        });
      }
    },

    setFieldSelectionMode: (fieldSelectionMode: FieldSelectionMode) => {
      const { settings } = get();
      set({
        settings: {
          ...settings,
          fieldSelectionMode
        }
      });
    },

    toggleLegend: () => {
      set(state => ({ showLegend: !state.showLegend }));
    },

    moveSnake: () => {
      const { snake, foods, direction, isGameOver, isPlaying, isPaused } = get();
      
      if (isGameOver || !isPlaying || isPaused) return;
      
      // Получаем новую позицию головы змеи
      const head = snake[0];
      const newHead = { ...head };
      const gridSize = get().settings.gridSize;
      
      switch (direction) {
        case 'UP':
          newHead.y = newHead.y - 1;
          break;
        case 'DOWN':
          newHead.y = newHead.y + 1;
          break;
        case 'LEFT':
          newHead.x = newHead.x - 1;
          break;
        case 'RIGHT':
          newHead.x = newHead.x + 1;
          break;
      }
      
      // Проверяем столкновение со стенами
      if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
        set({ isGameOver: true });
        return;
      }
      
      // Проверяем столкновение с самой собой
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        set({ isGameOver: true });
        return;
      }
      
      // Проверяем столкновение с едой
      const now = Date.now();
      const eatenFoodIndex = foods.findIndex(food => 
        food.position.x === newHead.x && 
        food.position.y === newHead.y &&
        food.expiryTime > now
      );
      
      let newFoods = [...foods];
      let newSnake = [newHead, ...snake];
      
      if (eatenFoodIndex !== -1) {
        const eatenFood = foods[eatenFoodIndex];
        
        // Обрабатываем столкновение с едой
        get().handleFoodCollision(eatenFood);
        
        // Удаляем съеденную еду и генерируем новую
        newFoods = [
          ...foods.slice(0, eatenFoodIndex),
          ...foods.slice(eatenFoodIndex + 1),
          generateFood(newSnake, get().settings.gridSize, get().settings.environment)
        ];
        
        // Увеличиваем скорость
        get().increaseSpeed();
      } else {
        // Если еда не съедена, удаляем хвост
        newSnake = newSnake.slice(0, -1);
        
        // Удаляем просроченную еду и генерируем новую
        const expiredFoodIndexes = foods
          .map((food, index) => ({ index, expired: food.expiryTime <= now }))
          .filter(item => item.expired)
          .map(item => item.index);
        
        if (expiredFoodIndexes.length > 0) {
          newFoods = foods.filter((_, index) => !expiredFoodIndexes.includes(index));
          for (let i = 0; i < expiredFoodIndexes.length; i++) {
            newFoods.push(generateFood(newSnake, get().settings.gridSize, get().settings.environment));
          }
        }
      }
      
      // Проверяем, не истекло ли время действия удвоения очков
      const { doublePointsActive, doublePointsEndTime } = get();
      if (doublePointsActive && doublePointsEndTime && now >= doublePointsEndTime) {
        get().deactivateDoublePoints();
      }
      
      set({
        snake: newSnake,
        foods: newFoods
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
      // Получаем доступные типы змей для выбранного окружения
      const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[environment];
      
      // Автоматически выбираем первый доступный тип змеи для нового окружения
      const snakeType = availableSnakeTypes[0];
      
      set(state => ({
        settings: {
          ...state.settings,
          environment,
          snakeType // Автоматически обновляем тип змеи
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
    },

    updateSettings: (newSettings: {
      playerName: string;
      environment: Environment;
      theme: Theme;
      boardSize: BoardSize;
      fieldSelectionMode: FieldSelectionMode;
      soundEnabled: boolean;
      snakeType: SnakeType;
    }) => {
      const gridSize = GRID_SIZES[newSettings.boardSize];
      const foodExpirationTime = FOOD_EXPIRATION_TIMES[newSettings.boardSize];
      
      // Проверяем, подходит ли выбранный тип змеи для выбранного окружения
      const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[newSettings.environment];
      let { snakeType } = newSettings;
      if (!availableSnakeTypes.includes(snakeType)) {
        // Если тип змеи не подходит, выбираем первый доступный
        snakeType = availableSnakeTypes[0];
      }
      
      // Обновляем настройки с правильным размером сетки, временем жизни еды и типом змеи
      const updatedSettings: GameSettings = {
        ...newSettings,
        gridSize,
        foodExpirationTime,
        snakeType
      };
      
      set(state => ({
        ...state,
        settings: updatedSettings
      }));
      
      // Если игра не активна, пересоздаем змею с новым размером
      const { isPlaying } = get();
      if (!isPlaying) {
        const initialSnake = getInitialSnake(gridSize);
        set({
          snake: initialSnake,
          foods: [generateFood(initialSnake, gridSize, newSettings.environment)]
        });
      }
      
      // Сохраняем настройки в localStorage
      saveSettings(updatedSettings);
    },

    pauseGame: () => {
      set({ isPaused: true });
    },
    
    resumeGame: () => {
      set({ isPaused: false });
    },

    // Метод для установки случайного окружения
    setRandomEnvironment: () => {
      const randomIndex = Math.floor(Math.random() * environments.length);
      const randomEnvironment = environments[randomIndex];
      
      // Получаем подходящий тип змеи для нового окружения
      const availableSnakeTypes = ENVIRONMENT_TO_SNAKE_TYPES[randomEnvironment];
      const randomSnakeType = availableSnakeTypes[0];
      
      // Обновляем настройки
      set(state => ({
        settings: {
          ...state.settings,
          environment: randomEnvironment,
          snakeType: randomSnakeType
        }
      }));
      
      return randomEnvironment;
    },

    // Добавляем метод для активации удвоения очков
    activateDoublePoints: () => {
      const now = Date.now();
      set({
        doublePointsActive: true,
        doublePointsEndTime: now + DOUBLE_POINTS_DURATION
      });
    },

    // Добавляем метод для деактивации удвоения очков
    deactivateDoublePoints: () => {
      set({
        doublePointsActive: false,
        doublePointsEndTime: null
      });
    },

    // Обновляем метод обработки столкновения с едой
    handleFoodCollision: (food: Food) => {
      const { score, doublePointsActive } = get();
      let newScore = score;

      // Обрабатываем очки в зависимости от типа еды
      if (food.type === 'special') {
        // Активируем удвоение очков
        get().activateDoublePoints();
      } else {
        // Для всех остальных типов еды учитываем множитель очков
        const pointsMultiplier = doublePointsActive ? 2 : 1;
        newScore += food.points * pointsMultiplier;
      }

      // Обновляем состояние
      set({ score: newScore });
    }
  };
}); 