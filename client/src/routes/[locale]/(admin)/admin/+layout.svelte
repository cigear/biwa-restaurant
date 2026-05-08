<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { page } from '$app/state';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { supportedLocales } from '$lib/infrastructure/i18n/config';

    let { children } = $props();
    let isSidebarOpen = $state(true);
    let isLangMenuOpen = $state(false);
    let isUserMenuOpen = $state(false);

    const menuItems = [
        { name: 'admin.menu.dashboard', icon: 'bi-speedometer2', path: '' },
        { name: 'admin.menu.orders', icon: 'bi-cart', path: '/orders' },
        { name: 'admin.menu.menuItems', icon: 'bi-patch-check', path: '/menu' },
        { name: 'admin.menu.users', icon: 'bi-people', path: '/users' },
        { name: 'admin.menu.settings', icon: 'bi-gear', path: '/settings' }
    ];

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function toggleLangMenu() {
        isLangMenuOpen = !isLangMenuOpen;
    }

    function toggleUserMenu() {
        isUserMenuOpen = !isUserMenuOpen;
    }

    async function handleLogout() {
        // 清除 Cookie：将其过期时间设为过去
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        isUserMenuOpen = false;
        await goto(`${base}/${page.params.locale}/admin/login`);
    }

    // 生成切换语言后的 URL
    // 例如从 /en/admin/orders 切换到 /ja/admin/orders
    function getSwitchLocaleUrl(newLocale: string) {
        const segments = page.url.pathname.split('/');
        segments[1] = newLocale; // 路径格式通常为 /locale/admin/...
        return segments.join('/') + page.url.search;
    }
</script>

{#if page.url.pathname.includes('/admin/login')}
    <div class="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
        {@render children()}
    </div>
{:else}
    <div class="min-h-screen bg-zinc-100 flex overflow-hidden">
        <!-- Sidebar -->
        <aside 
            class="bg-zinc-900 text-zinc-300 transition-all duration-300 ease-in-out flex flex-col
            {isSidebarOpen ? 'w-64' : 'w-20'}"
        >
            <!-- Brand -->
            <div class="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
                <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold mr-3 shrink-0">B</div>
                {#if isSidebarOpen}
                    <span class="font-bold text-lg text-white truncate">BIWA ADMIN</span>
                {/if}
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1 px-3">
                    {#each menuItems as item}
                        <li>
                            <a 
                                href="{base}/{page.params.locale}/admin{item.path}"
                                class="flex items-center p-3 rounded-lg hover:bg-zinc-800 transition-colors
                                {page.url.pathname.endsWith(item.path) ? 'bg-orange-600 text-white' : ''}"
                            >
                                <i class="bi {item.icon} text-xl shrink-0"></i>
                                {#if isSidebarOpen}
                                    <span class="ml-3 font-medium truncate">{$_(item.name)}</span>
                                {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Header -->
            <header class="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
                <div class="flex items-center gap-4">
                    <button onclick={toggleSidebar} class="text-zinc-500 hover:text-zinc-800 p-2" aria-label={$_('common.actions.toggle_menu')}>
                        <i class="bi bi-list text-2xl"></i>
                    </button>
                    <h1 class="text-xl font-semibold text-zinc-800">{$_('admin.dashboard')}</h1>
                </div>
                
                <div class="flex items-center gap-4">
                    <!-- Language Switcher -->
                    <div class="relative">
                        <button 
                            onclick={toggleLangMenu}
                            class="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 border border-zinc-200 rounded-lg uppercase flex items-center gap-2 bg-zinc-50 transition-colors"
                        >
                            <i class="bi bi-translate text-orange-500"></i>
                            {page.params.locale}
                            <i class="bi bi-chevron-down text-[10px] transition-transform {isLangMenuOpen ? 'rotate-180' : ''}"></i>
                        </button>

                        {#if isLangMenuOpen}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div 
                                class="absolute right-0 mt-2 w-32 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-50"
                                onclick={() => isLangMenuOpen = false}
                            >
                                {#each supportedLocales as loc}
                                    <a 
                                        href={getSwitchLocaleUrl(loc)}
                                        data-sveltekit-preload-data="off"
                                        class="block px-4 py-2 text-sm text-zinc-700 hover:bg-orange-50 hover:text-orange-700 transition-colors {page.params.locale === loc ? 'font-bold bg-zinc-50 text-orange-600' : ''}"
                                    >
                                        {loc === 'en' ? 'English' : loc === 'zh' ? '中文' : '日本語'}
                                    </a>
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <!-- User Menu -->
                    <div class="relative">
                        <button 
                            onclick={toggleUserMenu}
                            class="flex items-center gap-2 hover:bg-zinc-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
                        >
                            <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" class="w-8 h-8 rounded-full border shadow-sm" />
                            <span class="text-sm font-medium text-zinc-700 hidden md:block">Administrator</span>
                            <i class="bi bi-chevron-down text-[10px] transition-transform {isUserMenuOpen ? 'rotate-180' : ''}"></i>
                        </button>

                        {#if isUserMenuOpen}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div 
                                class="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl py-2 z-50"
                                onclick={() => isUserMenuOpen = false}
                            >
                                <button 
                                    onclick={handleLogout}
                                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                                >
                                    <i class="bi bi-box-arrow-right"></i>
                                    {$_('admin.logout')}
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            </header>

            <!-- Content Area -->
            <main class="flex-1 overflow-y-auto p-6">
                <div class="max-w-7xl mx-auto">
                    {@render children()}
                </div>
            </main>

            <!-- Footer -->
            <footer class="h-12 bg-white border-t border-zinc-200 px-6 flex items-center justify-between text-sm text-zinc-500">
                <div>© 2024 BIWA Restaurant System.</div>
                <div class="hidden sm:block">Version 1.0.0</div>
            </footer>
        </div>
    </div>
{/if}

<style>
    /* 引入 Bootstrap Icons (推荐在 app.html 中引入) */
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

    :global(body) {
        background-color: #f4f4f5;
    }

    aside::-webkit-scrollbar {
        width: 4px;
    }
    aside::-webkit-scrollbar-thumb {
        background: #3f3f46;
        border-radius: 10px;
    }

    aside:not(.w-64) a {
        justify-content: center;
    }
</style>