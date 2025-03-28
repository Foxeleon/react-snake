import { Capacitor } from '@capacitor/core';

export const usePlatform = () => {
  const platform = Capacitor.getPlatform();
  
  return {
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isNative: platform === 'ios' || platform === 'android',
    isWeb: platform === 'web'
  };
}; 