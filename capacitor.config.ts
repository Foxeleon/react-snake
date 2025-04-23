import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foxeleon.reactsnake',
  appName: 'Snake',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Для разработки
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  // Настройки для iOS
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  android: {
    allowMixedContent: true,
    // Дополнительные параметры Android
    backgroundColor: "#000000", // Черный фон для игры
    // Отключение системных жестов чтобы не мешали управлению игрой
    overrideUserAgent: "Snake Game Android App"
  },
  // Настройки ориентации для игры
  plugins: {
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
