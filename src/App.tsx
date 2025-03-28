import { useState, useEffect } from 'react';
import Game from './components/Game';
import Legend from './components/Legend';
import { GameSettings } from './components/GameSettings';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGameStore } from './store/gameStore';
import { usePlatform } from './hooks/usePlatform';
import './App.css';
import { initCapacitor } from '@/utils/storage.ts';
import { Capacitor } from '@capacitor/core';
import { unlockOrientation } from '@/utils/capacitorUtils.ts';

function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { loadSettings, settings } = useGameStore();
  const { isIOS, isNative } = usePlatform();
  
  useEffect(() => {

    initCapacitor().then(() => {
      if (Capacitor.isNativePlatform()) {
            unlockOrientation().then(() => {});
          }
    });
    // Загружаем настройки при первом монтировании компонента
    loadSettings();
    
    // Проверяем, есть ли сохраненное имя игрока (признак первого запуска)
    const hasPlayerName = settings.playerName !== 'Игрок';
    setIsFirstLaunch(!hasPlayerName);
  }, [loadSettings, settings.playerName]);
  
  const handleStart = () => {
    setIsFirstLaunch(false);
  };
  
  return (
    <div className={`app ${isIOS ? 'ios-safe-area' : ''}`}>
      {isFirstLaunch ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <div className="game-container">
          <Game />
          <div className={`controls-container ${isNative ? 'mobile-controls' : ''}`}>
            <Legend />
            <GameSettings />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 