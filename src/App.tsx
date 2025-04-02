import { useState, useEffect } from 'react';
import Game from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGameStore } from './store/gameStore';
import './App.css';
import { initCapacitor } from '@/utils/storage.ts';
import { Capacitor } from '@capacitor/core';
import { unlockOrientation } from '@/utils/capacitorUtils.ts';
import { usePlatform } from '@/hooks/usePlatform.ts';

function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { loadSettings, settings } = useGameStore();
  const { isIOS } = usePlatform();
  
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
          <Game />
      )}
    </div>
  );
}

export default App; 