import { Environment, Position } from '@/types/gameTypes.ts';

interface ParticleOptions {
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  lifetime: number;
  angle?: number;
}

class Particle {
  x: number;
  y: number;
  initialX: number;
  initialY: number;
  color: string;
  size: number;
  speed: number;
  lifetime: number;
  angle: number;
  alpha: number;
  startTime: number;

  constructor(options: ParticleOptions) {
    this.x = options.x;
    this.y = options.y;
    this.initialX = options.x;
    this.initialY = options.y;
    this.color = options.color;
    this.size = options.size;
    this.speed = options.speed;
    this.lifetime = options.lifetime;
    this.angle = options.angle || Math.random() * Math.PI * 2;
    this.alpha = 1;
    this.startTime = Date.now();
  }

  update() {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.lifetime, 1);

    // Обновляем положение
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Уменьшаем прозрачность и размер со временем
    this.alpha = 1 - progress;
    this.size = this.size * (1 - progress * 0.5);

    return progress < 1; // Возвращаем true, если частица еще активна
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.floor(this.x - this.size / 2),
      Math.floor(this.y - this.size / 2),
      Math.floor(this.size),
      Math.floor(this.size)
    );
    ctx.globalAlpha = 1;
  }
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isActive: boolean = false;

  constructor(containerId: string) {
    // Создаем канвас и добавляем его в контейнер
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1000';
    
    const container = document.getElementById(containerId);
    if (container) {
      container.style.position = 'relative';
      container.appendChild(this.canvas);
      
      // Устанавливаем размер канваса
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    // Получаем контекст канваса
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = ctx;
  }
  
  private resizeCanvas() {
    const container = this.canvas.parentElement;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }
  
  /**
   * Запускает анимацию частиц
   */
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.animate();
  }
  
  /**
   * Останавливает анимацию частиц
   */
  stop() {
    this.isActive = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Очищаем канвас
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
  }
  
  /**
   * Анимирует частицы
   */
  private animate() {
    if (!this.isActive) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Обновляем и отрисовываем частицы
    this.particles = this.particles.filter(particle => {
      const isAlive = particle.update();
      if (isAlive) {
        particle.draw(this.ctx);
      }
      return isAlive;
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Создает эффект частиц на основе окружения
   */
  createEffect(position: Position, gridSize: number, environment: Environment) {
    const cellSize = this.canvas.width / gridSize;
    const centerX = position.x * cellSize + cellSize / 2;
    const centerY = position.y * cellSize + cellSize / 2;
    
    // Параметры частиц зависят от окружения
    let particleColors: string[] = [];
    let particleCount = 0;
    let particleSpeed = 0;
    let particleSize = 0;
    let particleLifetime = 0;
    
    switch (environment) {
      case 'jungle':
        particleColors = ['#32CD32', '#228B22', '#7CFC00'];
        particleCount = 15;
        particleSpeed = 0.5;
        particleSize = 4;
        particleLifetime = 1000;
        break;
        
      case 'sea':
        particleColors = ['#1E90FF', '#00BFFF', '#87CEFA'];
        particleCount = 20;
        particleSpeed = 0.3;
        particleSize = 3;
        particleLifetime = 1500;
        break;
        
      case 'forest':
        particleColors = ['#228B22', '#008000', '#006400'];
        particleCount = 12;
        particleSpeed = 0.4;
        particleSize = 5;
        particleLifetime = 800;
        break;
        
      case 'desert':
        particleColors = ['#FFD700', '#DAA520', '#B8860B'];
        particleCount = 25;
        particleSpeed = 0.6;
        particleSize = 3;
        particleLifetime = 700;
        break;
        
      case 'steppe':
        particleColors = ['#F4A460', '#D2B48C', '#DEB887'];
        particleCount = 18;
        particleSpeed = 0.4;
        particleSize = 4;
        particleLifetime = 900;
        break;
    }
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const size = particleSize + Math.random() * 2;
      const speed = particleSpeed * (0.5 + Math.random());
      const lifetime = particleLifetime * (0.8 + Math.random() * 0.4);
      
      this.particles.push(
        new Particle({
          x: centerX,
          y: centerY,
          color,
          size,
          speed,
          lifetime,
          angle: Math.random() * Math.PI * 2
        })
      );
    }
    
    // Запускаем анимацию, если еще не запущена
    if (!this.animationId) {
      this.start();
    }
  }
  
  /**
   * Создает взрыв частиц (для Game Over)
   */
  createExplosion(position: Position, gridSize: number) {
    const cellSize = this.canvas.width / gridSize;
    const centerX = position.x * cellSize + cellSize / 2;
    const centerY = position.y * cellSize + cellSize / 2;
    
    const colors = ['#FF0000', '#FF4500', '#FF8C00', '#FFD700'];
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 4;
      const speed = 0.8 + Math.random() * 1.5;
      const lifetime = 1500 + Math.random() * 1000;
      
      this.particles.push(
        new Particle({
          x: centerX,
          y: centerY,
          color,
          size,
          speed,
          lifetime,
          angle: Math.random() * Math.PI * 2
        })
      );
    }
    
    // Запускаем анимацию, если еще не запущена
    if (!this.animationId) {
      this.start();
    }
  }
} 