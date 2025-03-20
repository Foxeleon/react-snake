import { useState, useEffect } from 'react';
import Game from './components/Game';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGameStore } from './store/gameStore';
import './App.css';

function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { loadSettings, settings } = useGameStore();
  
  useEffect(() => {
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
    <div className="app">
      {isFirstLaunch ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App; 