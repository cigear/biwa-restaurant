import { getLocaleFromNavigator } from 'svelte-i18n';

export const supportedLocales = ['zh', 'en', 'ja'];
export const defaultLocale = 'en';

export function detectLanguage(): string {
    const browserLocale = getLocaleFromNavigator() ?? defaultLocale;
    return supportedLocales.find(locale => 
        browserLocale.startsWith(locale) || browserLocale.split('-')[0] === locale
    ) || defaultLocale;
}