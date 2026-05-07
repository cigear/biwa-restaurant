import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { getLocaleFromNavigator } from 'svelte-i18n';

export function load() {
    if (browser) {
        const supportedLocales = ['zh', 'en', 'ja']; // 定义你支持的语言列表
        const browserLocale = getLocaleFromNavigator() ?? 'en'; // 获取浏览器语言，如果为 null 则默认为 'en'

        // 查找浏览器语言是否在支持列表中，或者其主要语言部分是否在支持列表中
        const detectedLocale = supportedLocales.find(locale => 
            browserLocale.startsWith(locale) || browserLocale.split('-')[0] === locale
        ) || 'en'; // 如果没有匹配到，则默认为 'en'

        throw redirect(307, `/${detectedLocale}/`);
    }
    // 如果不是在浏览器环境（例如SSR），可以重定向到默认语言或抛出错误
    throw redirect(307, '/en/'); // 默认重定向到英文，或者你可以选择其他默认语言
}