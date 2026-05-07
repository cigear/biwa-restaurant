<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { _ } from 'svelte-i18n';
    import { Globe, User, Lock, Mail } from 'lucide-svelte';
    import { Dialog } from 'bits-ui';
    import Button from '$pres/components/ui/Button.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

	let { children } = $props();

    const languages = [
        { code: 'zh', name: 'zh' },
        { code: 'en', name: 'en' },
        { code: 'ja', name: 'ja' }
    ];

    let showLogin = $state(false);
    let username = $state('');
    let password = $state('');
    let isSubmitting = $state(false);

    function handleLogin() {
        showLogin = true;
    }

    async function submitLogin(e: SubmitEvent) {
        e.preventDefault();
        isSubmitting = true;
        
        // 模拟登录请求
        console.log("Login Attempt:", { username, password });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        isSubmitting = false;
        showLogin = false;
    }

    function handleLanguageChange(event: Event) {
        const newLocale = (event.target as HTMLSelectElement).value;
        // 获取当前路径并替换 locale 部分，例如 /zh/menu -> /en/menu
        const newPath = $page.url.pathname.replace(`/${$page.params.locale}`, `/${newLocale}`);
        goto(newPath);
    }
</script>

<svelte:head>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<div class="flex flex-col h-screen">
    <!-- ✅ 顶部导航栏 -->
    <nav class="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 h-16 flex items-center justify-between">
        <!-- Logo / 品牌名 -->
        <div class="flex items-center gap-2">
            <span class="text-xl font-black tracking-tighter text-orange-600">BIWA</span>
            <span class="text-zinc-400 font-medium text-sm hidden sm:inline">RESTAURANT</span>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-4">
            <!-- 语言切换 -->
            <div class="flex items-center bg-zinc-50 rounded-full p-1 border border-zinc-100">
                <Globe class="w-4 h-4 ml-2 text-zinc-400" />
                <select 
                    value={$page.params.locale}
                    onchange={handleLanguageChange}
                    class="bg-transparent text-sm font-bold text-zinc-600 px-2 py-1 outline-none cursor-pointer"
                >
                    {#each languages as lang}
                        <option value={lang.code}>{$_(`common.languages.${lang.name}`)}</option>
                    {/each}
                </select>
            </div>

            <!-- 登录按钮 -->
           <Button
                variant="ghost"
                class="flex flex-row items-center justify-center gap-2 rounded-full px-4 h-10 !bg-orange-600 !text-white hover:!bg-orange-500"
                onclick={handleLogin}
            >
                <User class="w-4 h-4 shrink-0" />
                <span class="text-sm leading-none">
                    {$_('common.actions.login')}
                </span>
            </Button>
        </div>
    </nav>

    <!-- 页面内容 -->
    <main class="flex-1 overflow-hidden">
        {@render children()}
    </main>
</div>

<!-- 登录弹窗 -->
<Dialog.Root bind:open={showLogin}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-[200] bg-zinc-950/40 backdrop-blur-sm" />
        <Dialog.Content class="fixed left-[50%] top-[50%] z-[201] w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-[2rem] bg-white p-8 shadow-2xl outline-none">
            <Dialog.Title class="text-2xl font-black text-zinc-900 mb-2">
                {$_('common.actions.login')}
            </Dialog.Title>
            <Dialog.Description class="text-zinc-500 mb-6 text-sm">
                {$_('login.description') || '请输入您的账号信息以登录。'}
            </Dialog.Description>

            <form onsubmit={submitLogin} class="space-y-4">
                <div class="space-y-2">
                    <label for="username" class="text-sm font-bold text-zinc-700 ml-1">
                        {$_('login.username') || '用户名 / 邮箱'}
                    </label>
                    <div class="relative">
                        <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            id="username"
                            type="text" 
                            bind:value={username}
                            placeholder="Admin"
                            class="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="password" class="text-sm font-bold text-zinc-700 ml-1">
                        {$_('login.password') || '密码'}
                    </label>
                    <div class="relative">
                        <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            id="password"
                            type="password" 
                            bind:value={password}
                            placeholder="••••••••"
                            class="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div class="pt-4">
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                        class="w-full py-4 rounded-xl"
                    >
                        {#if isSubmitting}
                            <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
                        {:else}
                            {$_('common.actions.login')}
                        {/if}
                    </Button>
                </div>
            </form>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>