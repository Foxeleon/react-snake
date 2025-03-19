import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import styles from './GameBoard.module.css';
import { Direction, Position } from '@/types/game';
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

  // Рендер сетки игрового поля
  const renderGrid = () => {
    const cells = [];
    const cellSize = 100 / gridSize;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = !isSnakeHead && snake.some((segment, idx) => segment.x === x && segment.y === y);
        const isFood = foods.some(food => food.position.x === x && food.position.y === y);
        
        let cellClass = styles.cell;
        const cellStyle = {
          width: `${cellSize}`,
          height: `${cellSize}`
        };

        // Стили для вращения головы змеи
        const headStyle = {
          ...cellStyle,
          transform: `rotate(${getHeadRotationDegrees(direction)}deg)`
        };

        // Добавление классов для элементов змеи
        if (isSnakeHead) {
          cellClass = `${cellClass} ${styles.snakeHead} ${styles[snakeType]}`;
        } else if (isSnakeBody) {
          cellClass = `${cellClass} ${styles.snakeBody} ${styles[snakeType]}`;
        }

        // Добавление классов для еды
        const currentFood = foods.find(food => food.position.x === x && food.position.y === y);
        if (isFood && currentFood) {
          const foodClass = `${styles.food} ${styles[`food_${currentFood.name}`] || styles[`food_${currentFood.type}`]}`;
          const isSpecial = currentFood.type === 'special';
          const isBadFood = currentFood.type === 'penalty';

          // Добавление эффекта мигания для особой еды
          if (isSpecial || isBadFood) {
            cellClass = `${cellClass} ${foodClass} ${styles.blinking}`;
          } else {
            cellClass = `${cellClass} ${foodClass}`;
          }
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={isSnakeHead ? headStyle : cellStyle}
            data-x={x}
            data-y={y}
          />
        );
      }
    }

    return cells;
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
      createAnimationEffect(
        environment,
        snake[0],
        gridSize,
        boardRef.current
      );
      
      // Воспроизводим звук движения (с меньшей частотой, чтобы не перегружать звуком)
      if (snake.length % 3 === 0) {
        playSound('move', environment);
      }
    }
  }, [snake, environment, gridSize]);

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

  // Добавляем сенсорное управление для мобильных устройств
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
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Определяем направление свайпа
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальный свайп
        if (deltaX > 30 && lastDirectionRef.current !== 'LEFT') {
          changeDirection('RIGHT');
        } else if (deltaX < -30 && lastDirectionRef.current !== 'RIGHT') {
          changeDirection('LEFT');
        }
      } else {
        // Вертикальный свайп
        if (deltaY > 30 && lastDirectionRef.current !== 'UP') {
          changeDirection('DOWN');
        } else if (deltaY < -30 && lastDirectionRef.current !== 'DOWN') {
          changeDirection('UP');
        }
      }
      
      // Сбрасываем начальные координаты, чтобы избежать множественных срабатываний
      touchStartX = touchEndX;
      touchStartY = touchEndY;
    };
    
    const gameBoard = boardRef.current;
    gameBoard.addEventListener('touchstart', handleTouchStart);
    gameBoard.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      gameBoard.removeEventListener('touchstart', handleTouchStart);
      gameBoard.removeEventListener('touchmove', handleTouchMove);
    };
  }, [changeDirection]);

  return (
    <div className={styles.boardContainer}>
      {doublePointsActive && (
        <div className={styles.doublePointsIndicator}>
          Удвоение очков активно!
        </div>
      )}
      <div
        ref={boardRef}
        className={`${styles.board} ${styles[environment]} ${styles[theme]} ${isGameOver ? styles.gameOver : ''}`}
        data-testid="game-board"
        data-grid-size={gridSize}
      >
        {renderGrid()}
      </div>
    </div>
  );
}; 