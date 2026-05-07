<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { flip } from 'svelte/animate';
    import { fade, scale } from 'svelte/transition';
    
    // 模拟订单数据
    let orders = $state([
        { 
            id: '101', 
            table: 'A-03', 
            time: '12:45', 
            items: [
                { name: '豚骨ラーメン', qty: 2, note: '麺硬め' },
                { name: '餃子', qty: 1 }
            ],
            status: 'PAID' 
        },
        { 
            id: '102', 
            table: 'B-01', 
            time: '12:50', 
            items: [
                { name: '醤油ラーメン', qty: 1 },
                { name: 'チャーハン', qty: 1, note: 'ネギ抜き' }
            ],
            status: 'COOKING' 
        }
    ]);

    let pendingOrders = $derived(orders.filter(o => o.status === 'PAID'));
    let cookingOrders = $derived(orders.filter(o => o.status === 'COOKING'));

    function updateStatus(orderId: string, newStatus: string) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
        }
    }
</script>

<div class="flex h-full w-full gap-6 overflow-x-auto bg-zinc-950 p-6">
    
    <!-- 待制作列 (New Orders) -->
    <section class="flex w-[400px] flex-shrink-0 flex-col gap-4">
        <div class="flex items-center justify-between px-2">
            <h2 class="flex items-center gap-3 text-2xl font-black text-white">
                <span class="h-4 w-4 animate-pulse rounded-full bg-orange-600"></span>
                {$_('kds.status.new')} 
                <span class="ml-2 rounded-md bg-zinc-800 px-2 py-1 text-sm text-zinc-400">{pendingOrders.length}</span>
            </h2>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-2">
            {#each pendingOrders as order (order.id)}
                <div 
                    animate:flip={{ duration: 300 }}
                    transition:fade
                    class="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 shadow-2xl ring-1 ring-white/5"
                >
                    <div class="mb-4 flex items-start justify-between">
                        <div>
                            <span class="text-4xl font-black tracking-tighter text-white">{order.table}</span>
                            <p class="mt-1 text-sm font-medium text-zinc-500">#{order.id} • {order.time}</p>
                        </div>
                        <button 
                            onclick={() => updateStatus(order.id, 'COOKING')}
                            class="rounded-xl bg-orange-600 px-6 py-3 text-lg font-bold text-white transition-transform active:scale-95 hover:bg-orange-500"
                        >
                            START
                        </button>
                    </div>

                    <ul class="space-y-3 border-t border-zinc-700/50 pt-4">
                        {#each order.items as item}
                            <li class="flex items-start gap-3">
                                <span class="flex h-7 w-7 items-center justify-center rounded bg-orange-600/20 font-bold text-orange-500">
                                    {item.qty}
                                </span>
                                <div class="flex-1">
                                    <p class="text-xl font-bold text-zinc-100">{item.name}</p>
                                    {#if item.note}
                                        <p class="mt-1 text-sm font-bold text-yellow-500 italic">⚠️ {item.note}</p>
                                    {/if}
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </section>

    <!-- 制作中列 (In Progress) -->
    <section class="flex w-[400px] flex-shrink-0 flex-col gap-4">
        <div class="flex items-center justify-between px-2">
            <h2 class="flex items-center gap-3 text-2xl font-black text-blue-500">
                <span class="h-4 w-4 rounded-full bg-blue-500"></span>
                {$_('kds.status.cooking')}
                <span class="ml-2 rounded-md bg-zinc-800 px-2 py-1 text-sm text-zinc-500">{cookingOrders.length}</span>
            </h2>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-2">
            {#each cookingOrders as order (order.id)}
                <div 
                    animate:flip={{ duration: 300 }}
                    transition:scale={{ start: 0.95 }}
                    class="rounded-2xl border border-blue-500/30 bg-zinc-900 p-5 shadow-xl"
                >
                    <div class="mb-4 flex items-start justify-between">
                        <div>
                            <span class="text-4xl font-black tracking-tighter text-white opacity-80">{order.table}</span>
                            <p class="text-sm text-zinc-600">#{order.id} • {order.time}</p>
                        </div>
                        <button 
                            onclick={() => updateStatus(order.id, 'READY')}
                            class="rounded-xl bg-blue-600 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-blue-500"
                        >
                            DONE
                        </button>
                    </div>

                    <ul class="space-y-3 border-t border-zinc-800 pt-4">
                        {#each order.items as item}
                            <li class="flex items-center gap-3 opacity-70">
                                <span class="text-xl font-bold text-zinc-400">x{item.qty}</span>
                                <p class="text-xl font-medium text-zinc-300">{item.name}</p>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </section>

</div>

<style>
    /* 针对后厨触摸屏优化：隐藏滚动条但允许滑动 */
    div::-webkit-scrollbar {
        display: none;
    }
    div {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
</style>