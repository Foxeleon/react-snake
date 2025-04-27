export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Theme = 'light' | 'dark';

export type Environment = 'jungle' | 'sea' | 'forest' | 'desert' | 'steppe';

export type SnakeType = 
  | 'tropical_green' // джунгли
  | 'red_sea' | 'blue_green_sea' // море
  | 'forest_boa' // лес
  | 'rattlesnake' | 'striped_viper' // пустыня
  | 'mouse_hunter'; // степь

export interface SnakeStyle {
  bg: string;
  border: string;
}

export type SnakeStylesMap = Record<string, SnakeStyle>;

export type BoardSize = 'mini' | 'small' | 'medium' | 'large' | 'giant' | 'epic';

export type FoodType = 
  | 'common' // 10 очков
  | 'medium' // 25 очков
  | 'rare' // 50 очков
  | 'special' // удвоение очков
  | 'penalty'; // -20 очков

export type FieldSelectionMode = 'static' | 'sequential' | 'random';

export type Language = 'ru' | 'en' | 'de';

export interface Food {
  position: Position;
  type: FoodType;
  name: string;
  points: number;
  spawnTime: number;
  expiryTime: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerRecord {
  name: string;
  score: number;
  environment: Environment;
  boardSize: BoardSize;
  date: string;
}

export interface GameSettings {
  playerName: string;
  environment: Environment;
  theme: Theme;
  boardSize: BoardSize;
  snakeType: SnakeType;
  gridSize: number;
  foodExpirationTime: number;
  soundEnabled: boolean;
  fieldSelectionMode: FieldSelectionMode;
  showMobileControls: boolean;
  language: Language;
}

export interface GameState {
  snake: Position[];
  foods: Food[];
  direction: Direction;
  isGameOver: boolean;
  score: number;
  speed: number;
  settings: GameSettings;
  doublePointsActive: boolean;
  doublePointsEndTime: number | null;
  records: PlayerRecord[];
  isPlaying: boolean;
  isSettingsOpen: boolean;
  isAuthenticated: boolean;
  isRecordsOpen: boolean;
  showLegend: boolean;
  isPaused: boolean;
  // TODO add isMobile to gameStore
  // isMobile: boolean;
}

export interface GameStore extends GameState {
  startGame: () => void;
  moveSnake: () => void;
  changeDirection: (direction: Direction) => void;
  resetGame: () => void;
  increaseSpeed: () => void;
  setPlayerName: (name: string) => void;
  setEnvironment: (environment: Environment) => void;
  setTheme: (theme: Theme) => void;
  setBoardSize: (size: BoardSize) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFieldSelectionMode: (mode: FieldSelectionMode) => void;
  setSnakeType: (snakeType: SnakeType) => void;
  toggleSettings: () => void;
  toggleRecords: () => void;
  toggleLegend: () => void;
  saveRecord: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
  updateSettings: (settings: {
    environment: "jungle" | "sea" | "forest" | "desert" | "steppe";
    showMobileControls: boolean;
    snakeType: "tropical_green" | "red_sea" | "blue_green_sea" | "forest_boa" | "rattlesnake" | "striped_viper" | "mouse_hunter";
    playerName: string;
    boardSize: "mini" | "small" | "medium" | "large" | "giant" | "epic";
    fieldSelectionMode: "static" | "sequential" | "random";
    theme: "light" | "dark";
    language: "ru" | "en" | "de";
    soundEnabled: boolean
  }) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setRandomEnvironment: () => Environment;
  activateDoublePoints: () => void;
  deactivateDoublePoints: () => void;
  handleFoodCollision: (food: Food) => void;
  setLanguage: (language: Language) => void;
}

// Типы имен еды для каждого окружения
export type JungleFoodName = 'bug' | 'frog' | 'bird' | 'pineapple' | 'poison_berry';
export type SeaFoodName = 'shrimp' | 'fish' | 'starfish' | 'plankton' | 'jellyfish';
export type ForestFoodName = 'ant' | 'rabbit' | 'mushroom' | 'moldy_berry';
export type DesertFoodName = 'beetle' | 'egg' | 'cactus_flower' | 'thorn' | 'scorpion';
export type SteppeFoodName = 'grasshopper' | 'gopher' | 'mouse' | 'golden_grass' | 'bitter_seed';

// Объединенный тип для всех названий еды
export type FoodName =
    | JungleFoodName
    | SeaFoodName
    | ForestFoodName
    | DesertFoodName
    | SteppeFoodName;

// Интерфейсы для каждого окружения
export interface JungleFoodColors {
  bug: string;
  frog: string;
  bird: string;
  pineapple: string;
  poison_berry: string;
  special: string;
  penalty: string;
  common: string;
}

export interface SeaFoodColors {
  shrimp: string;
  fish: string;
  starfish: string;
  plankton: string;
  jellyfish: string;
  special: string;
  penalty: string;
  common: string;
}

export interface ForestFoodColors {
  ant: string;
  locust: string;
  rabbit: string;
  mushroom: string;
  moldy_berry: string;
  special: string;
  penalty: string;
  common: string;
}

export interface DesertFoodColors {
  scorpion: string;
  beetle: string;
  egg: string;
  cactus_flower: string;
  thorn: string;
  special: string;
  penalty: string;
  common: string;
}

export interface SteppeFoodColors {
  grasshopper: string;
  gopher: string;
  mouse: string;
  golden_grass: string;
  bitter_seed: string;
  special: string;
  penalty: string;
  common: string;
}

// Интерфейс для всего объекта FOOD_COLORS
export interface FoodColors {
  jungle: JungleFoodColors;
  sea: SeaFoodColors;
  forest: ForestFoodColors;
  desert: DesertFoodColors;
  steppe: SteppeFoodColors;
}
