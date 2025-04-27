import { GameSettings, PlayerRecord } from '@/types/gameTypes.ts';
import { Capacitor } from '@capacitor/core';
import { lockToPortrait } from '@/utils';

// Ключи для локального хранилища
const STORAGE_KEYS = {
  SETTINGS: 'snakeGameSettings',
  RECORDS: 'snakeGameRecords'
};

// Функция для шифрования данных
const encryptData = (data: any): string => {
  try {
    // Используем encodeURIComponent для преобразования Unicode в URL-encoded строку,
    // которая содержит только ASCII символы
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    console.error('Error encrypting data:', e);
    return JSON.stringify(data); // Фолбэк без шифрования в случае ошибки
  }
};

// Функция для дешифрования данных
const decryptData = <T>(encryptedData: string): T | null => {
  try {
    // Расшифровываем и декодируем URL-encoded строку обратно в Unicode
    return JSON.parse(decodeURIComponent(atob(encryptedData))) as T;
  } catch (e) {
    // Если не удалось дешифровать, возможно, данные сохранены без шифрования
    try {
      return JSON.parse(encryptedData) as T;
    } catch (innerError) {
      console.error('Error decrypting data:', e, innerError);
      return null;
    }
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

export const initCapacitor = async () => {
  // Проверяем, запущено ли приложение на мобильном устройстве через Capacitor
  if (Capacitor.isNativePlatform()) {
    await lockToPortrait();
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