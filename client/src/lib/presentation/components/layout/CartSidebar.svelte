<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { fade, slide } from 'svelte/transition';
    import { Dialog } from 'bits-ui';
    import { cart } from '$pres/states/cart.svelte';
    import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-svelte';
    import Button from '$pres/components/ui/Button.svelte';

    // 1. 接收 props：如果是嵌入模式 (isEmbedded)，样式会调整
    let { isEmbedded = false } = $props();
    let showConfirm = $state(false);
    let isSubmitting = $state(false);

    // ✅ 统一鲁棒的格式化逻辑
    const formatCurrency = (val: any) => {
        const amount = typeof val === 'object' && val !== null ? (val.amount ?? 0) : (val ?? 0);
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return '￥0';
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(numericAmount);
    };

    const getPriceValue = (val: any) => typeof val === 'object' && val !== null ? (val.amount ?? 0) : (val ?? 0);

    // 模拟下单流程
    async function handlePlaceOrder() {
        isSubmitting = true;
        // 这里模拟 API 请求延时
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("订单已提交:", cart.items);
        
        cart.clear();
        showConfirm = false;
        isSubmitting = false;
        if (isEmbedded) cart.isOpen = false; // 如果在移动端，下单后关闭抽屉
    }
</script>

<!-- 2. 动态样式：非嵌入模式应用固定的侧边栏外观 -->
<aside 
    class="flex h-full min-h-0 w-full flex-col bg-white transition-all overflow-hidden" 
    class:border-l={!isEmbedded} class:border-zinc-100={!isEmbedded} class:shadow-2xl={!isEmbedded} 
>
    <!-- 3. 条件渲染头部：嵌入 Drawer 时不重复显示标题 -->
    {#if !isEmbedded}
        <div class="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 backdrop-blur-md">
            <h2 class="text-xl font-black flex items-center gap-2 text-zinc-900">
                <ShoppingBag class="w-5 h-5 text-orange-500" />
                {$_('cart.title')}
            </h2>
            <span class="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                {cart.totalCount}
            </span>
        </div>
    {/if}

    <!-- 列表区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {#each cart.items as item (item.id)}
            <div 
                transition:slide={{ duration: 200 }}
                class="group relative flex flex-col gap-2 rounded-xl bg-zinc-50 p-3 border border-zinc-100 hover:border-zinc-200 transition-all"
            >
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="font-bold text-zinc-900 line-clamp-2">
                            {$_(item.productNameKey)}
                        </p>
                        <p class="text-sm text-zinc-500 font-mono">
                            {formatCurrency(item.basePrice)}
                        </p>
                    </div>
                    
                    <button 
                        onclick={() => cart.removeItem(item.id)}
                        class="text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                    >
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>

                <div class="flex items-center justify-between mt-1">
                    <div class="flex items-center gap-1 bg-white rounded-lg p-1 border border-zinc-200">
                        <button 
                            onclick={() => cart.updateQuantity(item.id, -1)}
                            class="p-1 hover:bg-zinc-100 rounded transition-colors text-zinc-500"
                        >
                            <Minus class="w-4 h-4" />
                        </button>
                        
                        <span class="w-8 text-center font-bold font-mono text-orange-500">
                            {item.quantity}
                        </span>

                        <button 
                            onclick={() => cart.updateQuantity(item.id, 1)}
                            class="p-1 hover:bg-zinc-100 rounded transition-colors text-zinc-500"
                        >
                            <Plus class="w-4 h-4" />
                        </button>
                    </div>

                    <p class="font-black text-zinc-900 italic">
                        {formatCurrency(getPriceValue(item.basePrice) * item.quantity)}
                    </p>
                </div>
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center h-64 text-zinc-600 opacity-50" in:fade>
                <ShoppingBag class="w-12 h-12 mb-2 stroke-1" />
                <p class="text-sm">{$_('cart.empty')}</p>
            </div>
        {/each}
    </div>

    <!-- 底部区域 -->
    <div class="sticky bottom-0 border-t border-zinc-100 bg-white flex-shrink-0
        {isEmbedded
            ? 'p-4 pb-16 flex flex-col gap-y-4' 
            : 'p-4 pb-16 space-y-4'}"
    >
        <div class="space-y-2">
            <div class="flex justify-between text-zinc-500 text-sm">
                <span>{$_('cart.subtotal')}</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
            <div class="flex justify-between text-zinc-900 text-lg font-black tracking-tight">
                <span>{$_('cart.total')}</span>
                <span class="text-orange-500">{formatCurrency(cart.totalPrice)}</span>
            </div>
        </div>

        <button 
            disabled={cart.items.length === 0}
            onclick={() => showConfirm = true}
            class="w-full rounded-xl bg-orange-600 py-4 font-black text-white shadow-lg shadow-orange-900/20 transition-all 
                   hover:bg-orange-500 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
        >
            {$_('cart.checkout')}
        </button>
    </div>
</aside>

<!-- 订单确认弹窗 -->
<Dialog.Root bind:open={showConfirm}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-[100] bg-zinc-950/40 backdrop-blur-sm" />
        <Dialog.Content class="fixed left-[50%] top-[50%] z-[101] w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-[2rem] bg-white p-8 shadow-2xl outline-none">
            <Dialog.Title class="text-2xl font-black text-zinc-900 mb-2">
                {$_('cart.confirm_order') || '确认订单'}
            </Dialog.Title>
            <Dialog.Description class="text-zinc-500 mb-6 text-sm">
                {$_('cart.confirm_desc') || '请确认您的餐品及金额，提交后后厨将开始制作。'}
            </Dialog.Description>

            <!-- 简易清单摘要 -->
            <div class="max-h-48 overflow-y-auto mb-6 space-y-2 border-y border-zinc-100 py-4 custom-scrollbar">
                {#each cart.items as item}
                    <div class="flex justify-between text-sm">
                        <span class="text-zinc-700 font-medium">{$_(item.productNameKey)} <span class="text-zinc-400">x{item.quantity}</span></span>
                        <span class="font-mono font-bold">{formatCurrency(getPriceValue(item.basePrice) * item.quantity)}</span>
                    </div>
                {/each}
            </div>

            <div class="flex justify-between items-center mb-8">
                <span class="font-bold text-zinc-500">{$_('cart.total')}</span>
                <span class="text-2xl font-black text-orange-600">{formatCurrency(cart.totalPrice)}</span>
            </div>

            <div class="flex gap-3">
                <button 
                    onclick={() => showConfirm = false}
                    class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-600 hover:bg-zinc-200 transition-colors"
                >
                    {$_('common.actions.cancel')}
                </button>
                <Button 
                    disabled={isSubmitting}
                    onclick={handlePlaceOrder}
                    class="flex-1 py-3"
                >
                    {#if isSubmitting}
                        <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
                    {:else}
                        {$_('cart.place_order') || '立即下单'}
                    {/if}
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<style>
    div::-webkit-scrollbar {
        display: none;
    }
</style>
