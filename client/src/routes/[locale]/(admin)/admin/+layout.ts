import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url, params }) => {
    // 在 SPA 模式下，逻辑必须在浏览器中运行以访问 document.cookie
    if (!browser) return;

    const isSessionActive = document.cookie.split(';').some(c => c.trim().startsWith('session='));
    const isLoginPage = url.pathname.endsWith('/admin/login');

    // 逻辑 1: 未登录且访问后台 -> 重定向到登录页
    if (!isSessionActive && !isLoginPage) {
        throw redirect(302, `${base}/${params.locale}/admin/login`);
    }

    // 逻辑 2: 已登录且访问登录页 -> 自动跳转到后台首页
    if (isSessionActive && isLoginPage) {
        throw redirect(302, `${base}/${params.locale}/admin`);
    }
};