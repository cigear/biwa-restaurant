<script lang="ts">
    import { Dialog } from 'bits-ui';
    import { cart } from '$pres/states/cart.svelte';
    import { _ } from 'svelte-i18n'; // 别忘了导入 i18n
    import CartSidebar from './CartSidebar.svelte';
    import { fly, fade } from 'svelte/transition';
</script>

<Dialog.Root bind:open={cart.isOpen}>
    <Dialog.Portal>
        <!-- 遮罩层 -->
        <div transition:fade={{ duration: 200 }} class="lg:hidden">
            <Dialog.Overlay class="fixed inset-0 z-50 bg-zinc-900/20 backdrop-blur-md" />
        </div>
        
        <!-- 内容区域：调整为符合餐饮系统暗色调的样式 -->
        <Dialog.Content class="fixed bottom-0 left-0 right-0 z-[60] outline-none lg:hidden max-h-[calc(100dvh-96px)]">
            <div
                transition:fly={{ y: 500, duration: 400 }}
                class="flex h-full flex-col rounded-t-[32px] bg-white border-t border-zinc-100 shadow-2xl overflow-hidden">
                
                <!-- 顶部小横条，增强“可下滑关闭”的视觉暗示 -->
                <div class="mx-auto mt-3 h-1.5 w-12 rounded-full bg-zinc-200"></div>

                <Dialog.Title class="py-4 text-center text-xl font-black text-zinc-900">
                    {$_('cart.title')}
                </Dialog.Title>
                
                <div class="flex-1 min-h-0 flex flex-col">
                    <!-- 传入 isEmbedded 为 true -->
                    <CartSidebar isEmbedded={true} />
                </div>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>