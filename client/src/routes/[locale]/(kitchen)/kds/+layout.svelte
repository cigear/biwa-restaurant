<script lang="ts">
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';

    // 假设你以后会实现的后厨状态管理
    // import { kitchenSocket } from '$lib/infra/realtime/kitchenSocket.svelte';

    let { children } = $props();
    
    let isAuthenticated = $state(false);
    let pin = $state('');

    function handleLogin(e: Event) {
        e.preventDefault();
        // 模拟验证逻辑：实际开发中请替换为真实的校验（如 PIN 码 1234）
        if (pin === '1234') {
            isAuthenticated = true;
        }
    }

    onMount(() => {
        console.log("KDS 系统初始化：启动实时监听...");
        // 建立连接逻辑...
        
        return () => {
            console.log("退出 KDS 系统：断开连接");
        };
    });
</script>

<!-- KDS 专属的包装层：通常是黑色背景，防止屏幕烧屏，且高对比度 -->
<div class="kds-container min-h-screen bg-zinc-950 text-white overflow-hidden flex flex-col">
    <!-- KDS 专用顶部栏：显示连接状态、时钟、通知设置 -->
    <header class="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
        <div class="font-bold text-orange-500">BIWA KDS v1.0</div>
        <div class="flex items-center gap-4 text-sm text-zinc-400">
            <span>{$_('kds.connectionStatus')}: <span class="text-green-500">● {$_('kds.connected')}</span></span>
            <span>22:45:01</span>
        </div>
    </header>

    <main class="flex-1 relative">
        {#if isAuthenticated}
            {@render children()}
        {:else}
            <!-- 后厨登录界面 -->
            <div class="absolute inset-0 flex items-center justify-center bg-zinc-950 px-4">
                <div class="w-full max-w-sm p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
                    <h2 class="text-2xl font-bold mb-8 text-center text-zinc-100">{$_('kds.loginTitle')}</h2>
                    <form onsubmit={handleLogin} class="space-y-6">
                        <input 
                            type="password" 
                            bind:value={pin}
                            placeholder="PIN"
                            class="w-full bg-zinc-800 border border-zinc-700 text-white text-4xl text-center py-4 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <button 
                            type="submit"
                            class="w-full bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-4 rounded-lg text-xl transition-all"
                        >
                            {$_('kds.loginButton')}
                        </button>
                    </form>
                </div>
            </div>
        {/if}
    </main>
</div>

<style>
    /* 防止后厨人员操作时不小心选中文本 */
    :global(body) {
        user-select: none;
        background-color: #09090b; /* zinc-950 */
    }
</style>