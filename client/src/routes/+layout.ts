import { register, init, getLocaleFromPathname } from 'svelte-i18n';
import { browser } from '$app/environment';

export const ssr = false;
// 强制预渲染根节点，以便生成 index.html
export const prerender = true;
// 允许客户端路由
export const trailingSlash = 'always';

// 注册所有语言包
register('en', () => import('$lib/infrastructure/i18n/locales/en.json'));
register('zh', () => import('$lib/infrastructure/i18n/locales/zh.json'));
register('ja', () => import('$lib/infrastructure/i18n/locales/ja.json'));

// 全局初始化 svelte-i18n，设置一个默认回退语言
init({
    fallbackLocale: 'en',
    initialLocale: browser ? getLocaleFromPathname(new RegExp(window.location.pathname)) ?? 'en' : 'en',
});
