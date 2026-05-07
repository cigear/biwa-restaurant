import { redirect } from '@sveltejs/kit';
import { detectLanguage } from '$lib/infrastructure/i18n/config';

export const ssr = false;

export const load = () => {
    const detectedLocale = detectLanguage();
    throw redirect(307, `/${detectedLocale}/admin/`);
};