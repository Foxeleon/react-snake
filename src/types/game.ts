export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Theme = 'light' | 'dark' | 'retro';

export type Environment = 'jungle' | 'sea' | 'forest' | 'desert' | 'steppe';

export type SnakeType = 
  | 'tropical_green' // джунгли
  | 'red_sea' | 'blue_green_sea' // море
  | 'forest_boa' // лес
  | 'rattlesnake' | 'striped_viper' // пустыня
  | 'mouse_hunter'; // степь

export type BoardSize = 'mini' | 'small' | 'medium' | 'large' | 'giant';

export type FoodType = 
  | 'common' // 10 очков
  | 'medium' // 25 очков
  | 'rare' // 50 очков
  | 'special' // удвоение очков
  | 'penalty'; // -20 очков

export type FieldSelectionMode = 'random' | 'sequential';

export type Difficulty = 'easy' | 'normal' | 'hard';

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
  difficulty: Difficulty;
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
  difficulty: Difficulty;
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
  setDifficulty: (difficulty: Difficulty) => void;
  setSnakeType: (type: SnakeType) => void;
  toggleSettings: () => void;
  toggleRecords: () => void;
  toggleLegend: () => void;
  saveRecord: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
} 