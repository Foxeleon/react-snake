import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

declare module 'i18next' {
    interface DetectorOptions {
        cookieExpiration?: number;
        cookieDomain?: string;
    }
}

// Импорт переводов (для небольших проектов можно импортировать напрямую)
import translationRU from './locales/ru_translation.json';
import translationEN from './locales/en_translation.json';
import translationDE from './locales/de_translation.json';
import translationCH from './locales/ch_translation.json';
import translationES from './locales/es_translation.json';
import translationFR from './locales/fr_translation.json';
import translationIT from './locales/it_translation.json';
import translationGR from './locales/gr_translation.json';
import translationJP from './locales/jp_translation.json';
import translationKOR from './locales/kоr_translation.json';
import translationTR from './locales/tr_translation.json';

const resources = {
    ru: {
        translation: translationRU
    },
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    },
    ch: {
        translation: translationCH
    },
    fr: {
        translation: translationFR
    },
    it: {
        translation: translationIT
    },
    es: {
        translation: translationES
    },
    gr: {
        translation: translationGR
    },
    jp: {
        translation: translationJP
    },
    kor: {
        translation: translationKOR
    },
    tr: {
        translation: translationTR
    }
};

i18n
    // загрузка переводов с сервера (для больших проектов)
    .use(Backend)
    // определение языка пользователя
    .use(LanguageDetector)
    // передача i18n в react
    .use(initReactI18next)
    // инициализация i18next
    .init({
        resources,
        fallbackLng: 'en', // язык по умолчанию
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // не экранировать HTML
        },

        // общие настройки конфигурации
        detection: {
            order: ['localStorage', 'navigator', 'querystring', 'cookie', 'htmlTag'],
            lookupQuerystring: 'lng', // параметр URL для установки языка
            lookupCookie: 'i18next', // имя cookie
            lookupLocalStorage: 'i18nextLngReactSnake', // ключ в localStorage
            // Кэширование выбранного языка
            caches: ['localStorage', 'cookie'],
            cookieExpiration: 7,
            // Для поддоменов
            cookieDomain: window.location.hostname
        },

        react: {
            useSuspense: true
        }
    }).then(() => {});

export default i18n;
