/**
 * Функция debounce для ограничения частоты вызовов
 * @param func Функция, которую нужно обернуть
 * @param delay Задержка в миллисекундах
 */
export function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function(this: any, ...args: Parameters<F>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
