
import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Position, Direction, Environment, Food } from '@/types/gameTypes.ts';
import styles from './GameBoard.module.css';
import { addAnimationStyles, createAnimationEffect } from '@/utils/animations';
import { playSound } from '@/utils';
import { getFoodColor, getSnakeStyle } from '@/constants/gameConstants.ts';
import SnakeSegment from '@/components/SnakeSegment.tsx';

export const GameBoard = () => {
  const {
    snake,
    foods,
    direction,
    isGameOver,
    settings,
    changeDirection,
    isPlaying,
    isPaused,
    moveSnake,
    speed
  } = useGameStore();

  const { gridSize, environment, theme, snakeType } = settings;

  // Ref для доступа к DOM-элементу игрового поля
  const boardRef = useRef<HTMLDivElement>(null);
  const lastDirectionRef = useRef(direction);

  // Ref для отслеживания предыдущего состояния игры
  const wasPausedRef = useRef(isPaused);

  // Инициализация анимаций
  useEffect(() => {
    addAnimationStyles();
  }, []);

  // Состояние для отслеживания размеров окна
  const [, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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

  // Отдельный эффект для отслеживания начала новой игры
  useEffect(() => {
    // Сохраняем предыдущее состояние паузы перед обновлением
    const wasPaused = wasPausedRef.current;

    // Обновляем текущее состояние
    wasPausedRef.current = isPaused;

    if (isPaused) {
      // Если игра на паузе - проигрываем звук паузы
      playSound('game_paused', environment);
    } else if (wasPaused && isPlaying) {
      // Если игра была на паузе, а теперь уже нет, и при этом игра активна
      // проигрываем звук возобновления
      playSound('game_resumed', environment);
    }

    // Обновляем ref перед следующим рендером
    wasPausedRef.current = isPaused;
  }, [isPlaying, isPaused, environment]);

  // Добавим обработку ввода с клавиатуры
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPaused) return;

      switch (event.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused, changeDirection]);

  // Игровой цикл
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, isPaused, moveSnake, speed]);

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

    // Базовая ширина клетки в процентах
    const cellSize = 100 / gridSize;

    // Стратегия фиксированной ширины поля для разных размеров сетки
    let cellStyles;

    switch(gridSize) {
      case 10: // mini
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '1.2rem',
          // Исправляем: используем переменную gridSize вместо жесткого значения
          minWidth: `calc(100% / 10)`,
          minHeight: `calc(100% / 10)`
        };
        break;
      case 15: // small
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '1.2rem',
          // Предотвращаем сжатие для 15×15
          minWidth: `calc(100% / 15)`,
          minHeight: `calc(100% / 15)`
        };
        break;
      case 20: // medium
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '1rem',
          // Предотвращаем сжатие для 20×20
          minWidth: `calc(100% / 20)`,
          minHeight: `calc(100% / 20)`
        };
        break;
      case 25: // large
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '0.9rem'
        };
        break;
      case 30: // giant
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '0.8rem'
        };
        break;
      case 35: // epic
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          fontSize: '0.7rem'
        };
        break;
      default:
        cellStyles = {
          width: `${cellSize}%`,
          height: `${cellSize}%`
        };
    }

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEvenCell = (x + y) % 2 === 0;
        let cellClass = styles.cell;

        // Создаем базовую ячейку с обновленными стилями
        cells.push(
            <div
                key={`${x}-${y}`}
                className={cellClass}
                style={cellStyles}
                data-x={x}
                data-y={y}
                data-is-even={isEvenCell.toString()}
                data-grid-size={gridSize}
            >
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
    const isSnakeBody = !isSnakeHead && snake.some((segment) => segment.x === x && segment.y === y);
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
      // Получаем стили из константы
      const snakeStyle = getSnakeStyle(snakeType);

      return (
          <div
              className={styles.snakeHead}
              style={{
                ...headStyle,
                backgroundColor: snakeStyle.bg,
                border: `3px solid ${snakeStyle.border}`
              }}
          />
      );
    }

    if (isSnakeBody) {
      const segment = snake.find(segment => segment.x === x && segment.y === y);
      const snakeStyle = getSnakeStyle(snakeType);
      if (segment) {
        return (
            <SnakeSegment
                key={`${segment.x}-${segment.y}`}
                position={{ x: segment.x, y: segment.y }}
                SnakeStyle={snakeStyle}
            />
        );
      }
    }

    // Отображение еды
    if (isFood) {
      const currentFood: Food | undefined = foods.find(food => food.position.x === x && food.position.y === y);
      if (currentFood) {
        const isSpecial: boolean = currentFood.type === 'special';
        const isBadFood: boolean = currentFood.type === 'penalty';

        // Получаем цвет из универсальной функции
        const foodColor = getFoodColor(settings.environment, currentFood.name, currentFood.type);

        // Сохраняем базовый класс для стилей формы и других параметров
        const foodClass = styles.food;

        // Создаем стиль с цветом
        const foodStyle = {
          backgroundColor: foodColor
        };

        // Добавляем эффект мигания для особой еды
        if (isSpecial || isBadFood) {
          return <div className={`${foodClass} ${styles.blinking}`} style={foodStyle} />;
        } else {
          return <div className={foodClass} style={foodStyle} />;
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
      createSnakeAnimation(snake[0], environment);
      playSound('move', environment);
    }
  }, [snake, environment, gridSize, direction]);

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
        <div
            ref={boardRef}
            className={`${styles.board} ${styles[environment]} ${styles[theme]} ${isGameOver ? styles.gameOver : ''}`}
            data-grid-size={gridSize}
        >
          {renderGrid()}
        </div>
      </div>
  );
};

export default GameBoard;