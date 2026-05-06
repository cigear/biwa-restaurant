// src/lib/infrastructure/i18n/config.ts
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));
register('ja', () => import('./locales/ja.json'));

function getInitialLocale(): string {
    // 修正为 getLocaleFromNavigator
    const detected = getLocaleFromNavigator();
    
    if (!detected) return 'ja';

    const shortCode = detected.split('-')[0].toLowerCase();
    const supported = ['zh', 'ja', 'en'];
    
    return supported.includes(shortCode) ? shortCode : 'ja';
}

init({
    fallbackLocale: 'en',
    initialLocale: getInitialLocale(),
});