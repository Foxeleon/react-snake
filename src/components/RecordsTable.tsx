import React from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './RecordsTable.module.css';
import { PlayerRecord } from '@/types/game';

export const RecordsTable: React.FC = () => {
  const { records, isRecordsOpen, toggleRecords, settings } = useGameStore();
  
  if (!isRecordsOpen) return null;
  
  // Форматирование даты для вывода
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Перевод названий окружений и размеров доски на русский
  const translateEnvironment = (env: string): string => {
    const translations: Record<string, string> = {
      jungle: 'Джунгли',
      sea: 'Море',
      forest: 'Лес',
      desert: 'Пустыня',
      steppe: 'Степь'
    };
    return translations[env] || env;
  };
  
  const translateBoardSize = (size: string): string => {
    const translations: Record<string, string> = {
      mini: 'Мини',
      small: 'Маленькая',
      medium: 'Средняя',
      large: 'Большая',
      giant: 'Гигантская',
      epic: 'Эпическая'
    };
    return translations[size] || size;
  };
  
  return (
    <div className={styles.recordsOverlay}>
      <div className={`${styles.recordsPanel} ${styles[settings.theme]}`}>
        <h2>Таблица рекордов</h2>
        
        {records.length === 0 ? (
          <p className={styles.noRecords}>Пока нет рекордов. Сыграйте и станьте первым!</p>
        ) : (
          <table className={styles.recordsTable}>
            <thead>
              <tr>
                <th>Место</th>
                <th>Имя</th>
                <th>Очки</th>
                <th>Окружение</th>
                <th>Размер</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: PlayerRecord, index: number) => (
                <tr key={index} className={index < 3 ? styles[`top${index + 1}`] : ''}>
                  <td>{index + 1}</td>
                  <td>{record.name}</td>
                  <td>{record.score}</td>
                  <td>{translateEnvironment(record.environment)}</td>
                  <td>{translateBoardSize(record.boardSize)}</td>
                  <td>{formatDate(record.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button 
          className={styles.closeButton} 
          onClick={toggleRecords}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}; 