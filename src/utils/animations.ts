import { Environment, Position } from "@/types/game";

/**
 * Создает элемент с анимационным эффектом на игровом поле
 */
export const createAnimationEffect = (
  environment: Environment,
  position: Position,
  gridSize: number,
  boardElement: HTMLElement
): void => {
  const effectElement = document.createElement('div');
  const cellSize = boardElement.clientWidth / gridSize;
  
  // Установка стилей для элемента эффекта
  effectElement.style.position = 'absolute';
  effectElement.style.left = `${position.x * cellSize}px`;
  effectElement.style.top = `${position.y * cellSize}px`;
  effectElement.style.width = `${cellSize}px`;
  effectElement.style.height = `${cellSize}px`;
  effectElement.style.zIndex = '3';
  effectElement.style.pointerEvents = 'none';
  
  // Применение специфических эффектов в зависимости от окружения
  switch (environment) {
    case 'jungle':
      // Эффект линьки в джунглях - светящийся след
      effectElement.style.backgroundColor = 'rgba(144, 238, 144, 0.6)';
      effectElement.style.boxShadow = '0 0 15px rgba(144, 238, 144, 0.8)';
      effectElement.style.borderRadius = '50%';
      effectElement.style.animation = 'fadeOut 1s forwards';
      break;
      
    case 'sea':
      // Эффект пузырьков в воде
      for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        bubble.style.borderRadius = '50%';
        
        // Увеличиваем размер пузырьков
        const bubbleSize = Math.max(cellSize * 0.2, Math.random() * 10 + 5);
        bubble.style.width = `${bubbleSize}px`;
        bubble.style.height = `${bubbleSize}px`;
        
        // Случайное начальное положение внутри клетки
        bubble.style.left = `${Math.random() * (cellSize - bubbleSize)}px`;
        bubble.style.bottom = '0';
        
        // Анимация пузырьков
        bubble.style.animation = `bubbleRise ${Math.random() * 1 + 0.5}s linear forwards`;
        
        effectElement.appendChild(bubble);
      }
      break;
      
    case 'forest':
      // Эффект шелеста листьев в лесу
      for (let i = 0; i < 3; i++) {
        const leaf = document.createElement('div');
        leaf.style.position = 'absolute';
        leaf.style.backgroundColor = `rgba(${50 + Math.random() * 100}, ${100 + Math.random() * 155}, ${50}, 0.7)`;
        leaf.style.width = `${Math.max(cellSize * 0.15, 6)}px`;
        leaf.style.height = `${Math.max(cellSize * 0.15, 6)}px`;
        leaf.style.borderRadius = '2px';
        leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Случайное начальное положение
        leaf.style.left = `${Math.random() * cellSize}px`;
        leaf.style.top = `${Math.random() * cellSize}px`;
        
        // Анимация падения листьев
        leaf.style.animation = `leafFall ${Math.random() * 2 + 1}s ease-in-out forwards`;
        
        effectElement.appendChild(leaf);
      }
      break;
      
    case 'desert':
      // Эффект пыли в пустыне
      effectElement.style.backgroundColor = 'rgba(244, 164, 96, 0.5)';
      effectElement.style.borderRadius = '50%';
      effectElement.style.transform = 'scale(0.8)';
      effectElement.style.animation = 'dustCloud 0.8s forwards';
      break;
      
    case 'steppe':
      // Эффект колышащейся травы в степи
      for (let i = 0; i < 4; i++) {
        const grass = document.createElement('div');
        grass.style.position = 'absolute';
        grass.style.backgroundColor = `rgba(${140 + Math.random() * 70}, ${150 + Math.random() * 100}, ${50}, 0.7)`;
        grass.style.width = `${Math.max(cellSize * 0.08, 3)}px`;
        grass.style.height = `${Math.max(cellSize * 0.3, 10)}px`;
        grass.style.borderRadius = '2px 2px 0 0';
        
        // Случайное положение внизу клетки
        grass.style.left = `${Math.random() * cellSize}px`;
        grass.style.bottom = '0';
        
        // Анимация колыхания
        grass.style.transformOrigin = 'bottom center';
        grass.style.animation = `grassWave ${Math.random() * 0.5 + 0.7}s ease-in-out infinite alternate`;
        
        effectElement.appendChild(grass);
      }
      break;
      
    default:
      break;
  }
  
  // Добавление элемента эффекта на игровое поле
  boardElement.appendChild(effectElement);
  
  // Удаление элемента после завершения анимации
  setTimeout(() => {
    if (boardElement.contains(effectElement)) {
      boardElement.removeChild(effectElement);
    }
  }, 1200); // Увеличиваем время для более заметного эффекта
};

// Добавление стилей для анимаций
export const addAnimationStyles = (): void => {
  // Создаем стилевой элемент, если его еще нет
  if (!document.getElementById('snake-animation-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'snake-animation-styles';
    
    const css = `
      @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.3); }
      }
      
      @keyframes bubbleRise {
        0% { 
          bottom: 0;
          opacity: 0.8;
          transform: translateX(0);
        }
        50% {
          transform: translateX(${Math.random() > 0.5 ? '+' : '-'}5px);
        }
        100% { 
          bottom: 100%;
          opacity: 0;
          transform: translateX(0);
        }
      }
      
      @keyframes dustCloud {
        0% { 
          opacity: 0.7;
          transform: scale(0.8);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.4);
        }
        100% { 
          opacity: 0;
          transform: scale(1.8);
        }
      }
      
      @keyframes leafFall {
        0% {
          opacity: 0.8;
          transform: translateY(0) rotate(0deg);
        }
        50% {
          opacity: 0.5;
          transform: translateY(50%) rotate(180deg);
        }
        100% {
          opacity: 0;
          transform: translateY(100%) rotate(360deg);
        }
      }
      
      @keyframes grassWave {
        0% {
          transform: rotate(-5deg);
        }
        100% {
          transform: rotate(5deg);
        }
      }
    `;
    
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }
}; 