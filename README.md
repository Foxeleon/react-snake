# 🐍 Змейка 8-бит

Современная версия классической игры "Змейка" с 8-битной стилистикой, разнообразными окружениями, реалистичными движениями, различными видами еды и рекордами игроков.

## ✨ Особенности

- **8-битные анимации и графика** в стиле ретро-игр
- **5 окружений**: джунгли, море, лес, пустыня и степь, каждое со своими уникальными визуальными элементами
- **7 типов змей** с различными визуальными стилями, адаптированными под окружение
- **Разнообразная еда** с разной ценностью и эффектами (обычная, средняя, редкая, особая и штрафная)
- **Специальные эффекты** - удвоение очков, штрафы и звуковые эффекты
- **Таблица рекордов** с сохранением результатов
- **Настройки игры** - выбор темы, окружения, размера игрового поля и имени игрока
- **Адаптивный дизайн** для мобильных устройств с сенсорным управлением

## 🛠️ Технологии

- **React** + **TypeScript** для разработки интерфейса
- **Zustand** для управления состоянием
- **CSS Modules** для стилизации
- **Web Audio API** для генерации 8-битных звуковых эффектов
- **Canvas API** для эффектов частиц

## 🚀 Запуск проекта

### Предварительные требования

- Node.js 16+ и npm/yarn

### Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/react-snake.git
cd react-snake
```

2. Установите зависимости:
```bash
npm install
# или
yarn
```

3. Запустите проект для разработки:
```bash
npm start
# или
yarn start
```

4. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере

### Сборка для продакшн

```bash
npm run build
# или
yarn build
```

## 🎮 Управление

- **Клавиши стрелок** - управление змейкой
- **Enter/Пробел** - начать/перезапустить игру
- **P** - пауза
- **Esc** - вызов меню настроек
- **R** - показать таблицу рекордов
- **Сенсорное управление** - свайпы и кнопки на экране (для мобильных устройств)

## 🌟 Режимы игры

- **Размеры игрового поля**: mini (10x10), small (15x15), medium (20x20), large (25x25), giant (30x30)
- **Темы**: светлая и темная
- **Окружения**, каждое со своими:
  - Уникальными фонами
  - Видами змей
  - Типами еды и их эффектами

## 🧩 Структура проекта

```
src/
├── assets/          # Ассеты игры (фоны, спрайты)
├── components/      # Компоненты React
├── constants/       # Константы и конфигурации
├── store/           # Хранилища состояния Zustand
├── types/           # TypeScript типы
└── utils/           # Вспомогательные функции
```

## 🔧 Кастомизация

Вы можете настроить игру, изменив значения в файлах констант:

- `src/constants/game.ts` - основные параметры игры
- `src/assets/` - заменить спрайты и фоны

## 📝 Лицензия

[MIT](LICENSE)

---

Создано с ❤️ используя React и TypeScript.