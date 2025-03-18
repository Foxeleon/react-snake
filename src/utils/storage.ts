import { GameSettings, PlayerRecord } from '@/types/game';

// Ключи для локального хранилища
const STORAGE_KEYS = {
  SETTINGS: 'snakeGameSettings',
  RECORDS: 'snakeGameRecords'
};

// Функция для шифрования данных
const encryptData = (data: any): string => {
  // Простое шифрование - в реальном приложении использовать более надежный метод
  return btoa(JSON.stringify(data));
};

// Функция для дешифрования данных
const decryptData = <T>(encryptedData: string): T | null => {
  try {
    return JSON.parse(atob(encryptedData)) as T;
  } catch (e) {
    console.error('Error decrypting data:', e);
    return null;
  }
};

// Сохранение настроек в локальное хранилище
export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, encryptData(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

// Загрузка настроек из локального хранилища
export const loadSettings = (): GameSettings | null => {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!storedSettings) return null;
    
    return decryptData<GameSettings>(storedSettings);
  } catch (e) {
    console.error('Error loading settings:', e);
    return null;
  }
};

// Сохранение рекордов в локальное хранилище
export const saveRecords = (records: PlayerRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, encryptData(records));
  } catch (e) {
    console.error('Error saving records:', e);
  }
};

// Загрузка рекордов из локального хранилища
export const loadRecords = (): PlayerRecord[] => {
  try {
    const storedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!storedRecords) return [];
    
    const records = decryptData<PlayerRecord[]>(storedRecords);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    console.error('Error loading records:', e);
    return [];
  }
};

// Добавление нового рекорда и сортировка
export const addRecord = (newRecord: PlayerRecord): PlayerRecord[] => {
  const records = loadRecords();
  const updatedRecords = [...records, newRecord]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Сохраняем только топ-10 рекордов
  
  saveRecords(updatedRecords);
  return updatedRecords;
}; 