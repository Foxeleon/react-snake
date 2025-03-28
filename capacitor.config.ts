import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.reactsnake.app',
  appName: 'React Snake',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Для разработки можно использовать локальный сервер
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  // Настройки для iOS
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  // Настройки для Android
  android: {
    allowMixedContent: true
  }
};

export default config;
