import { useState, useEffect } from 'react';
import Game from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGameStore } from './store/gameStore';
import './App.css';
import { debounce, initCapacitor } from '@/utils';
import { Capacitor } from '@capacitor/core';
import { unlockOrientation } from '@/utils';
import { usePlatform } from '@/hooks/usePlatform.ts';
import { DEFAULT_PLAYER_NAME } from '@/constants/game.ts';

function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
    const hasPlayerName = settings.playerName !== DEFAULT_PLAYER_NAME;
    setIsFirstLaunch(!hasPlayerName);
  }, [loadSettings, settings.playerName]);

  // Обновляем состояние isMobile при изменении размера окна
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Проверяем при монтировании компонента
    checkIfMobile();

    const debouncedCheckIfMobile = debounce(checkIfMobile, 500);

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', debouncedCheckIfMobile);

    // Удаляем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('resize', debouncedCheckIfMobile);
    };
  }, [isMobile]);
  
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