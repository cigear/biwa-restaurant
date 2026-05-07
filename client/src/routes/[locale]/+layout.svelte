<script lang="ts">
    import { isLoading, locale } from 'svelte-i18n';
    import { page } from '$app/stores';
    let { children } = $props();

    // ✅ 使用 Svelte 5 的 $effect 来动态设置 HTML 的 lang 属性
    // 这解决了非法 HTML 标签导致的渲染中断问题
    $effect(() => {
        const currentLocale = $page.params.locale;
        if (currentLocale) {
            document.documentElement.lang = currentLocale;
        }
    });
</script>

{#if $isLoading}
    <!-- 正在加载语言包时的占位 UI -->
    <div class="flex h-screen items-center justify-center bg-white">
        <div class="flex flex-col items-center gap-2">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
            <p class="text-zinc-500 font-medium">Loading translations...</p>
        </div>
    </div>
{:else}
    {@render children()}
{/if}