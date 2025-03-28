import { ScreenOrientation } from '@capacitor/screen-orientation';

/**
 * Блокировка ориентации экрана в портретном режиме
 */
export async function lockToPortrait() {
    try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
        console.log('Ориентация экрана заблокирована в портретном режиме');
    } catch (error) {
        console.error('Ошибка при блокировке ориентации экрана:', error);
    }
}

/**
 * Разблокировка ориентации экрана
 */
export async function unlockOrientation() {
    try {
        await ScreenOrientation.unlock();
        console.log('Ориентация экрана разблокирована');
    } catch (error) {
        console.error('Ошибка при разблокировке ориентации экрана:', error);
    }
}
