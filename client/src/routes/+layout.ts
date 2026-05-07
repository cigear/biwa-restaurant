import { register, init } from 'svelte-i18n';
import { browser } from '$app/environment';

export const ssr = false;
// 强制预渲染根节点，以便生成 index.html
export const prerender = true;
// 允许客户端路由
export const trailingSlash = 'always';

// 辅助函数：加载特定语言的所有模块并合并
const loadLocale = async (locale: string) => {
	const [common,admin, kds, customer] = await Promise.all([
        import(`../lib/infrastructure/i18n/locales/${locale}/common.json`),
		import(`../lib/infrastructure/i18n/locales/${locale}/admin.json`),
		import(`../lib/infrastructure/i18n/locales/${locale}/kds.json`),
		import(`../lib/infrastructure/i18n/locales/${locale}/customer.json`)
	]);

	return {
        common: common.default,
		admin: admin.default,
		kds: kds.default,
		customer: customer.default
	};
};

// 注册语言加载器
register('en', () => loadLocale('en'));
register('zh', () => loadLocale('zh'));
register('ja', () => loadLocale('ja'));

// 全局初始化 svelte-i18n，设置一个默认回退语言
init({
    fallbackLocale: 'en',
    initialLocale: browser 
        ? window.location.pathname.split('/')[1] || 'en' 
        : 'en',
});
