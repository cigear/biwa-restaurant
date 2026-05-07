import { waitLocale, locale as localeStore } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
    const { locale } = params;
    
    // 设置当前语言并等待语言包加载完成
    localeStore.set(locale);
    await waitLocale(locale);
};