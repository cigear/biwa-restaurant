import { waitLocale, locale as localeStore, getLocaleFromNavigator } from 'svelte-i18n';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { supportedLocales, detectLanguage } from '$lib/infrastructure/i18n/config';

export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = async ({ params, url }) => {
    const { locale } = params;
    
    if (!supportedLocales.includes(locale)) {
        const detectedLocale = detectLanguage();

        const segments = url.pathname.split('/');
        segments[1] = detectedLocale; // 路径格式通常是 /locale/path...
        throw redirect(307, segments.join('/') || `/${detectedLocale}/`);
    }

    // 设置当前语言并等待语言包加载完成
    localeStore.set(locale);
    await waitLocale(locale);
};