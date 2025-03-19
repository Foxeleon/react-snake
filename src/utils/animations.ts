import { Environment, Position, Direction } from "@/types/game";

/**
 * Создает элемент с анимационным эффектом на игровом поле
 */
export const createAnimationEffect = (
  position: Position,
  environment: Environment,
  direction: Direction = 'RIGHT',
  gridSize: number = 15,
  boardElement: HTMLElement = document.getElementById('gameBoard') as HTMLElement
): void => {
  const effectElement = document.createElement('div');
  
  // Вычисляем размер и позицию в процентах
  const cellSize = 100 / gridSize;
  
  effectElement.style.position = 'absolute';
  effectElement.style.left = `${position.x * cellSize}%`;
  effectElement.style.top = `${position.y * cellSize}%`;
  effectElement.style.width = `${cellSize}%`;
  effectElement.style.height = `${cellSize}%`;
  effectElement.style.zIndex = '3';
  effectElement.style.pointerEvents = 'none';
  
  // Применение специфических эффектов в зависимости от окружения
  switch (environment) {
    case 'jungle':
      // Улучшенный эффект ветра в джунглях, меньше и аккуратнее
      for (let i = 0; i < 6; i++) { // Уменьшил количество эффектов
        const windEffect = document.createElement('div');
        windEffect.style.position = 'absolute';
        
        // Приглушенные оттенки зеленого для эффекта ветра
        const greenIntensity = 180 + Math.random() * 75;
        windEffect.style.backgroundColor = `rgba(${100 + Math.random() * 50}, ${greenIntensity}, ${100 + Math.random() * 50}, ${0.2 + Math.random() * 0.2})`; // Меньшая непрозрачность
        windEffect.style.borderRadius = '50%';
        
        // Меньший размер эффекта ветра
        const windSize = 12 + Math.random() * 18; // Уменьшили максимальный размер
        windEffect.style.width = `${windSize}%`;
        windEffect.style.height = `${windSize * 0.6}%`;
        windEffect.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Позиционирование волн ветра вокруг змеи, но не на голове
        let windX, windY;
        
        // Позиционирование в зависимости от направления движения
        switch (i % 3) {
          case 0: // Сбоку от змеи, а не впереди головы
            if (direction === 'RIGHT') {
              windX = -10 + Math.random() * 20; // Слева
              windY = 20 + Math.random() * 60;
            } else if (direction === 'LEFT') {
              windX = 90 + Math.random() * 20; // Справа
              windY = 20 + Math.random() * 60;
            } else if (direction === 'UP') {
              windX = 20 + Math.random() * 60;
              windY = 90 + Math.random() * 20; // Снизу
            } else { // DOWN
              windX = 20 + Math.random() * 60;
              windY = -10 + Math.random() * 20; // Сверху
            }
            break;
          case 1: // Справа от змеи
            windX = direction === 'UP' || direction === 'DOWN' ? 80 + Math.random() * 15 : 50 + Math.random() * 20;
            windY = direction === 'LEFT' || direction === 'RIGHT' ? 20 + Math.random() * 15 : 50 + Math.random() * 20;
            break;
          default: // Слева от змеи
            windX = direction === 'UP' || direction === 'DOWN' ? 5 + Math.random() * 15 : 30 + Math.random() * 20;
            windY = direction === 'LEFT' || direction === 'RIGHT' ? 65 + Math.random() * 15 : 30 + Math.random() * 20;
            break;
        }
        
        windEffect.style.left = `${windX}%`;
        windEffect.style.top = `${windY}%`;
        
        // Задержка для разнообразия анимации
        const animationDelay = i * 0.06;
        windEffect.style.animation = `jungleWind ${0.4 + Math.random() * 0.2}s ${animationDelay}s forwards`; // Быстрее исчезает
        
        effectElement.appendChild(windEffect);
      }
      break;
      
    case 'sea':
      // Эффект пузырьков в воде
      for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        bubble.style.borderRadius = '50%';
        
        // Увеличиваем размер пузырьков (в процентах)
        const bubbleSize = Math.max(5, Math.random() * 20);
        bubble.style.width = `${bubbleSize}%`;
        bubble.style.height = `${bubbleSize}%`;
        
        // Случайное начальное положение внутри клетки
        bubble.style.left = `${Math.random() * (100 - bubbleSize)}%`;
        bubble.style.bottom = '0';
        
        // Анимация пузырьков
        bubble.style.animation = `bubbleRise ${Math.random() * 1 + 0.5}s linear forwards`;
        
        effectElement.appendChild(bubble);
      }
      break;
      
    case 'forest':
      // Эффект разлетающихся листьев в лесу
      // Создаем 6-8 листьев, распределенных по обеим сторонам и на голове
      const leafCount = 6 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.style.position = 'absolute';
        
        // Разнообразные оттенки зеленого для листьев
        const greenHue = 50 + Math.random() * 100;
        const greenSaturation = 150 + Math.random() * 105;
        leaf.style.backgroundColor = `rgba(${greenHue}, ${greenSaturation}, ${30 + Math.random() * 30}, 0.7)`;
        
        // Различные формы листьев
        const leafVariety = Math.floor(Math.random() * 3);
        switch (leafVariety) {
          case 0: // Овальный лист
            leaf.style.borderRadius = '50% 50% 50% 50%';
            break;
          case 1: // Заостренный лист
            leaf.style.borderRadius = '50% 50% 0 50%';
            break;
          case 2: // Округлый лист
            leaf.style.borderRadius = '50%';
            break;
        }
        
        // Размер листа в процентах
        const leafSize = Math.max(6, Math.random() * 15);
        leaf.style.width = `${leafSize}%`;
        leaf.style.height = `${leafSize * (0.8 + Math.random() * 0.4)}%`;
        
        // Поворот листа
        leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Позиционирование листьев:
        // Часть спереди от головы, часть по бокам
        let startPositionX, startPositionY;
        
        if (i < 2) { // Перед головой
          startPositionX = 50 - 25 * Math.random();
          startPositionY = 0;
        } else if (i < 4) { // Справа
          startPositionX = 80 + 20 * Math.random();
          startPositionY = 30 + 40 * Math.random();
        } else { // Слева
          startPositionX = 0 - 10 * Math.random();
          startPositionY = 30 + 40 * Math.random();
        }
        
        leaf.style.left = `${startPositionX}%`;
        leaf.style.top = `${startPositionY}%`;
        
        // Направление разлета зависит от положения листа
        let xDirection, yDirection;
        
        if (startPositionX < 40) { // Левая сторона или перед головой - летит влево
          xDirection = -1 - Math.random();
        } else { // Правая сторона - летит вправо
          xDirection = 1 + Math.random();
        }
        
        if (startPositionY < 30) { // Верх - летит вверх
          yDirection = -1 - Math.random();
        } else { // Середина/низ - летит в разных направлениях
          yDirection = Math.random() * 2 - 1;
        }
        
        // Анимация разлета листьев
        const animationDuration = 0.3 + Math.random() * 0.5;
        leaf.style.animation = `leafScatter ${animationDuration}s ease-out forwards`;
        leaf.style.animationDelay = `${Math.random() * 0.2}s`;
        
        // Добавляем стили для индивидуальной анимации каждого листа
        const keyframes = document.createElement('style');
        keyframes.textContent = `
          @keyframes leafScatter-${i} {
            0% {
              opacity: 0.8;
              transform: translate(0, 0) rotate(${Math.random() * 360}deg);
            }
            100% {
              opacity: 0;
              transform: translate(${xDirection * 100}%, ${yDirection * 100}%) rotate(${Math.random() * 720}deg);
            }
          }
        `;
        document.head.appendChild(keyframes);
        leaf.style.animation = `leafScatter-${i} ${animationDuration}s ease-out forwards`;
        
        effectElement.appendChild(leaf);
      }
      break;
      
    case 'desert':
      // Эффект рассекающейся волны песка в пустыне
      // 1. Создаем волну песка вокруг змеи
      const sandWave = document.createElement('div');
      sandWave.style.position = 'absolute';
      sandWave.style.width = '200%';
      sandWave.style.height = '200%';
      sandWave.style.left = '-50%';
      sandWave.style.top = '-50%';
      sandWave.style.borderRadius = '50%';
      sandWave.style.background = 'radial-gradient(circle, rgba(240, 230, 140, 0.7) 0%, rgba(240, 230, 140, 0.4) 30%, rgba(240, 230, 140, 0.1) 70%, rgba(240, 230, 140, 0) 100%)';
      sandWave.style.animation = 'sandWave 0.8s forwards';
      
      // Направление волны песка (смещение центра волны)
      if (direction === 'RIGHT') {
        sandWave.style.left = '-70%';
      } else if (direction === 'LEFT') {
        sandWave.style.left = '-30%';
      } else if (direction === 'UP') {
        sandWave.style.top = '-30%';
      } else if (direction === 'DOWN') {
        sandWave.style.top = '-70%';
      }
      
      effectElement.appendChild(sandWave);
      
      // 2. Создаем облачка песка вокруг змеи
      for (let i = 0; i < 6; i++) {
        const sandParticle = document.createElement('div');
        sandParticle.style.position = 'absolute';
        
        // Цвет частиц песка
        const sandColor = 210 + Math.random() * 30;
        sandParticle.style.backgroundColor = `rgba(${sandColor}, ${sandColor - 50}, ${sandColor - 110}, ${0.4 + Math.random() * 0.3})`;
        sandParticle.style.borderRadius = '50%';
        
        // Размер частиц песка
        const particleSize = 8 + Math.random() * 15;
        sandParticle.style.width = `${particleSize}%`;
        sandParticle.style.height = `${particleSize}%`;
        
        // Позиция частиц песка - вокруг змеи с акцентом на направление движения
        let particleX, particleY;
        
        // Расположение частиц песка в зависимости от направления
        if (direction === 'RIGHT') {
          // Больше частиц слева (за змеей)
          particleX = (i % 2 === 0) ? (0 + Math.random() * 40) : (60 + Math.random() * 40);
          particleY = 20 + Math.random() * 60;
        } else if (direction === 'LEFT') {
          // Больше частиц справа (за змеей)
          particleX = (i % 2 === 0) ? (60 + Math.random() * 40) : (0 + Math.random() * 40);
          particleY = 20 + Math.random() * 60;
        } else if (direction === 'UP') {
          // Больше частиц снизу (за змеей)
          particleX = 20 + Math.random() * 60;
          particleY = (i % 2 === 0) ? (60 + Math.random() * 40) : (0 + Math.random() * 40);
        } else if (direction === 'DOWN') {
          // Больше частиц сверху (за змеей)
          particleX = 20 + Math.random() * 60;
          particleY = (i % 2 === 0) ? (0 + Math.random() * 40) : (60 + Math.random() * 40);
        } else {
          // Случайное расположение
          particleX = Math.random() * 100;
          particleY = Math.random() * 100;
        }
        
        sandParticle.style.left = `${particleX}%`;
        sandParticle.style.top = `${particleY}%`;
        
        // Задержка для разной скорости анимации
        const animationDelay = i * 0.05;
        sandParticle.style.animation = `sandParticle 0.6s ${animationDelay}s forwards`;
        
        effectElement.appendChild(sandParticle);
      }
      break;
      
    case 'steppe':
      // Новый эффект облаков пыли в степи
      for (let i = 0; i < 5; i++) {
        const dustCloud = document.createElement('div');
        dustCloud.style.position = 'absolute';
        
        // Цвет пыли - оттенки коричневого/серого
        const dustColor = 170 + Math.random() * 50;
        dustCloud.style.backgroundColor = `rgba(${dustColor}, ${dustColor - 30}, ${dustColor - 60}, ${0.3 + Math.random() * 0.2})`;
        dustCloud.style.borderRadius = '50%';
        
        // Размер облака пыли
        const dustSize = 15 + Math.random() * 20;
        dustCloud.style.width = `${dustSize}%`;
        dustCloud.style.height = `${dustSize * (0.6 + Math.random() * 0.4)}%`;
        
        // Позиционирование облаков пыли
        // Распределяем за змеей и по бокам, в зависимости от направления
        let dustX, dustY;
        
        // Настраиваем позицию относительно направления движения
        if (direction === 'LEFT' || direction === 'RIGHT') {
          // Горизонтальное движение - облака по бокам и сзади
          dustX = direction === 'RIGHT' ? 
                  (i % 2 === 0 ? 0 : 30) + Math.random() * 20 :  // Для движения вправо - облака слева сзади
                  (i % 2 === 0 ? 70 : 50) + Math.random() * 20;  // Для движения влево - облака справа сзади
          dustY = 20 + Math.random() * 60; // Распределяем по высоте
        } else {
          // Вертикальное движение - облака сверху/снизу и по бокам
          dustX = 20 + Math.random() * 60; // Распределяем по ширине
          dustY = direction === 'DOWN' ? 
                  (i % 2 === 0 ? 0 : 30) + Math.random() * 20 :  // Для движения вниз - облака сверху
                  (i % 2 === 0 ? 70 : 50) + Math.random() * 20;  // Для движения вверх - облака снизу
        }
        
        dustCloud.style.left = `${dustX}%`;
        dustCloud.style.top = `${dustY}%`;
        
        // Добавляем небольшое дрожание для эффекта вихря
        dustCloud.style.animation = `steppeCloud ${0.6 + Math.random() * 0.3}s forwards`;
        
        effectElement.appendChild(dustCloud);
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
  }, 800); // Время для более точного соответствия движению змеи
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
      
      @keyframes leafScatter {
        0% {
          opacity: 0.8;
          transform: translate(0, 0) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translate(var(--leafX, 100%), var(--leafY, 100%)) rotate(360deg);
        }
      }
      
      @keyframes jungleWind {
        0% { 
          opacity: 0.6;
          transform: scale(0.2) rotate(0deg);
        }
        50% {
          opacity: 0.4;
          transform: scale(0.9) rotate(120deg);
        }
        100% { 
          opacity: 0;
          transform: scale(1.2) rotate(240deg);
        }
      }
      
      @keyframes sandWave {
        0% { 
          opacity: 0.8;
          transform: scale(0.2);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.9);
        }
        100% { 
          opacity: 0;
          transform: scale(1.5);
        }
      }
      
      @keyframes sandParticle {
        0% { 
          opacity: 0.7;
          transform: scale(0.4) translate(0, 0);
        }
        50% {
          opacity: 0.4;
          transform: scale(1.2) translate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 15}px, ${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 15}px);
        }
        100% { 
          opacity: 0;
          transform: scale(1.8) translate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 30}px, ${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 30}px);
        }
      }
      
      @keyframes desertSandCloud {
        0% { 
          opacity: 0.7;
          transform: scale(0.3);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2);
        }
        100% { 
          opacity: 0;
          transform: scale(1.8);
        }
      }
      
      @keyframes steppeCloud {
        0% {
          opacity: 0.7;
          transform: translate(0, 0) scale(0.5);
        }
        20% {
          opacity: 0.6;
          transform: translate(${Math.random() > 0.5 ? '+' : '-'}5px, ${Math.random() > 0.5 ? '+' : '-'}5px) scale(0.8);
        }
        40% {
          opacity: 0.5;
          transform: translate(${Math.random() > 0.5 ? '+' : '-'}8px, ${Math.random() > 0.5 ? '+' : '-'}3px) scale(1.1);
        }
        70% {
          opacity: 0.3;
          transform: translate(${Math.random() > 0.5 ? '+' : '-'}12px, ${Math.random() > 0.5 ? '+' : '-'}8px) scale(1.4);
        }
        100% {
          opacity: 0;
          transform: translate(${Math.random() > 0.5 ? '+' : '-'}15px, ${Math.random() > 0.5 ? '+' : '-'}10px) scale(1.6);
        }
      }
    `;
    
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }
}; 