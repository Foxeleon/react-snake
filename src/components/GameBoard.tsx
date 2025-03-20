import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Position, Direction, Environment } from '@/types/game';
import styles from './GameBoard.module.css';
import { addAnimationStyles, createAnimationEffect } from '@/utils/animations';
import { playSound } from '@/utils/sound';

export const GameBoard = () => {
  const {
    snake,
    foods,
    direction,
    isGameOver,
    settings,
    doublePointsActive,
    moveSnake,
    changeDirection
  } = useGameStore();

  const { gridSize, environment, theme, snakeType } = settings;
  
  // Ref для доступа к DOM-элементу игрового поля
  const boardRef = useRef<HTMLDivElement>(null);
  const lastDirectionRef = useRef(direction);

  // Инициализация анимаций
  useEffect(() => {
    addAnimationStyles();
  }, []);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      // Форсируем ререндер при изменении размера окна
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    // Вызываем сразу для начальной настройки
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Состояние для отслеживания размеров окна
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Обработка окончания игры
  useEffect(() => {
    if (isGameOver) {
      playSound('game_over', environment);
    }
  }, [isGameOver, environment]);

  // Обработка изменения направления
  useEffect(() => {
    lastDirectionRef.current = direction;
  }, [direction]);

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyToDirection: { [key: string]: Direction } = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
        'KeyW': 'UP',
        'KeyS': 'DOWN',
        'KeyA': 'LEFT',
        'KeyD': 'RIGHT'
      };

      const newDirection = keyToDirection[event.code];
      if (newDirection) {
        event.preventDefault();
        
        // Проверяем, чтобы змея не двигалась в противоположном направлении
        const opposites: { [key in Direction]: Direction } = {
          'UP': 'DOWN',
          'DOWN': 'UP',
          'LEFT': 'RIGHT',
          'RIGHT': 'LEFT'
        };
        
        if (newDirection !== opposites[lastDirectionRef.current]) {
          changeDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection]);

  // Обработка сенсорных жестов для мобильных устройств
  useEffect(() => {
    if (!boardRef.current) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // Минимальное расстояние для обнаружения свайпа - уменьшаем чувствительность
      const minSwipeDistance = 20;
      
      // Определяем направление свайпа
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        // Горизонтальный свайп
        if (diffX > 0) {
          // Свайп влево
          changeDirection('LEFT');
        } else {
          // Свайп вправо
          changeDirection('RIGHT');
        }
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
        // Вертикальный свайп
        if (diffY > 0) {
          // Свайп вверх
          changeDirection('UP');
        } else {
          // Свайп вниз
          changeDirection('DOWN');
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    };
    
    const board = boardRef.current;
    board.addEventListener('touchstart', handleTouchStart);
    board.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      board.removeEventListener('touchstart', handleTouchStart);
      board.removeEventListener('touchmove', handleTouchMove);
    };
  }, [changeDirection]);

  // Рендер сетки игрового поля
  const renderGrid = () => {
    const cells = [];
    const cellSize = 100 / gridSize;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Определяем, является ли клетка "четной" для шахматного узора
        // Используем для определения четности (x + y) % 2 === 0
        const isEvenCell = (x + y) % 2 === 0;
        
        // Базовый класс для ячейки
        let cellClass = styles.cell;
        
        const cellStyle = {
          width: `${cellSize}%`,
          height: `${cellSize}%`
        };

        // Создаем базовую ячейку
        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={cellStyle}
            data-x={x}
            data-y={y}
            data-is-even={isEvenCell.toString()}
          >
            {/* Элементы на клетке (змея или еда) */}
            {renderCellContent(x, y)}
          </div>
        );
      }
    }

    return cells;
  };

  // Рендер содержимого ячейки (змея или еда)
  const renderCellContent = (x: number, y: number) => {
    const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
    const isSnakeBody = !isSnakeHead && snake.some((segment, idx) => segment.x === x && segment.y === y);
    const isFood = foods.some(food => food.position.x === x && food.position.y === y);
    
    // Если ячейка пустая
    if (!isSnakeHead && !isSnakeBody && !isFood) {
      return null;
    }
    
    // Стили для вращения головы змеи
    const headStyle = {
      transform: `rotate(${getHeadRotationDegrees(direction)}deg)`
    };

    // Отображение головы змеи
    if (isSnakeHead) {
      return <div className={`${styles.snakeHead} ${styles[snakeType]}`} style={headStyle} />;
    }
    
    // Отображение тела змеи
    if (isSnakeBody) {
      return <div className={`${styles.snakeBody} ${styles[snakeType]}`} />;
    }
    
    // Отображение еды
    if (isFood) {
      const currentFood = foods.find(food => food.position.x === x && food.position.y === y);
      if (currentFood) {
        const foodClass = `${styles.food} ${styles[`food_${currentFood.name}`] || styles[`food_${currentFood.type}`]}`;
        const isSpecial = currentFood.type === 'special';
        const isBadFood = currentFood.type === 'penalty';

        // Добавление эффекта мигания для особой еды
        if (isSpecial || isBadFood) {
          return <div className={`${foodClass} ${styles.blinking}`} />;
        } else {
          return <div className={foodClass} />;
        }
      }
    }
    
    return null;
  };

  // Определение угла поворота головы змеи в градусах
  const getHeadRotationDegrees = (direction: Direction): number => {
    switch (direction) {
      case 'UP': return 0;
      case 'RIGHT': return 90;
      case 'DOWN': return 180;
      case 'LEFT': return 270;
      default: return 0;
    }
  };

  // Обработка анимации движения змеи
  useEffect(() => {
    if (snake.length > 0 && boardRef.current) {
      // Создаем анимационный эффект для текущей позиции головы змеи
      createSnakeAnimation(snake[0], environment);
      
      // Воспроизводим звук движения (с меньшей частотой, чтобы не перегружать звуком)
      if (snake.length % 3 === 0) {
        playSound('move', environment);
      }
    }
  }, [snake, environment, gridSize, direction]);

  // Обработка поедания еды
  useEffect(() => {
    if (snake.length > 0 && foods.length > 0) {
      const head = snake[0];
      const eatenFood = foods.find(food => head.x === food.position.x && head.y === food.position.y);
      
      if (eatenFood) {
        // Воспроизводим соответствующий звук
        if (eatenFood.type === 'special') {
          playSound('eat_special', environment);
        } else if (eatenFood.type === 'penalty') {
          playSound('penalty', environment);
        } else {
          playSound('eat', environment, eatenFood.type);
        }
      }
    }
  }, [snake, foods, environment]);

  // Отображение индикатора удвоения очков
  const renderDoublePointsIndicator = () => {
    if (doublePointsActive) {
      return (
        <div className={styles.doublePointsIndicator}>
          x2 ОЧКИ УДВОЕНЫ!
        </div>
      );
    }
    return null;
  };

  // Функция для создания анимации при движении змеи
  const createSnakeAnimation = (position: Position, environment: Environment) => {
    if (!boardRef.current) return;
    
    createAnimationEffect(
      environment,
      position,
      settings.gridSize,
      boardRef.current,
      direction // Передаем текущее направление движения змеи
    );
  };

  return (
    <div className={styles.boardContainer}>
      {renderDoublePointsIndicator()}
      <div 
        ref={boardRef}
        className={`${styles.board} ${styles[environment]} ${styles[theme]} ${isGameOver ? styles.gameOver : ''}`}
      >
        {renderGrid()}
      </div>
    </div>
  );
}; 

export default GameBoard; 