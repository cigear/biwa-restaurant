import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    // 当访问 /[locale]/ 下不存在的路径时，重定向回 /[locale]/ 根目录
    throw redirect(307, `/${params.locale}/kds/`);
};
