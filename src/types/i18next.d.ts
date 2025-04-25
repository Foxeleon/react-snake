import 'i18next';
import type {
    InitOptions as I18NextInitOptions,
} from 'i18next';
import {
    DetectorOptions as LanguageDetectorOptions
} from 'i18next-browser-languagedetector';

declare module 'i18next' {
    // Расширяем интерфейс InitOptions
    export interface InitOptions extends I18NextInitOptions {
        detection?: {
            order?: string[];
            lookupQuerystring?: string;
            lookupCookie?: string;
            lookupLocalStorage?: string;
            caches?: string[];
            cookieExpiration?: number;
            cookieDomain?: string;
        };
    }

    // Правильная типизация для LanguageDetector
    export interface DetectorOptions extends LanguageDetectorOptions {
        order?: string[];
    }
}
