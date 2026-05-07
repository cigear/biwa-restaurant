<script lang="ts">
    import { onMount } from 'svelte';
    // 假设你以后会实现的后厨状态管理
    // import { kitchenSocket } from '$lib/infra/realtime/kitchenSocket.svelte';

    let { children } = $props();

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
            <span>实时连接：<span class="text-green-500">● 已连接</span></span>
            <span>22:45:01</span>
        </div>
    </header>

    <main class="flex-1 relative">
        {@render children()}
    </main>
</div>

<style>
    /* 防止后厨人员操作时不小心选中文本 */
    :global(body) {
        user-select: none;
        background-color: #09090b; /* zinc-950 */
    }
</style>