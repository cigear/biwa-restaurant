<script lang="ts">
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { fade, fly } from 'svelte/transition';
    import { menuRepository } from '$infra/api/menuRepository';
    import type { MenuItem, Category } from '$domain/menu/models';
    import { cart } from '$pres/states/cart.svelte';
    import Button from '$pres/components/ui/Button.svelte';
    import ProductCard from '$pres/components/ui/ProductCard.svelte';
    import { Plus, Info, ShoppingCart } from 'lucide-svelte';
    import CartSidebar from '$pres/components/layout/CartSidebar.svelte';
    import MobileCartDrawer from '$pres/components/layout/MobileCartDrawer.svelte';

    // ✅ 1. 顶层响应式状态
    let categories = $state<Category[]>([]);
    let menuItems = $state<MenuItem[]>([]);
    let loading = $state(true);
    let activeCategoryId = $state<string | null>(null);

    // ✅ 2. 派生状态：根据当前选中的分类自动过滤
    let filteredItems = $derived(
        activeCategoryId 
            ? menuItems.filter(item => item.categoryId === activeCategoryId)
            : menuItems
    );

    onMount(async () => {
        try {
            const [cats, items] = await Promise.all([
                menuRepository.getCategories(),
                menuRepository.getMenuItems()
            ]);
            
            categories = cats;
            menuItems = items;
            
            // 默认选中第一个分类
            if (categories.length > 0) {
                activeCategoryId = categories[0].id;
            }
        } catch (e) {
            console.error("Failed to load menu data", e);
        } finally {
            loading = false;
        }
    });

    // ✅ 改进的格式化函数：处理对象、数字及无效值
    const formatPrice = (val: any) => {
        const amount = typeof val === 'object' && val !== null ? (val.amount ?? 0) : (val ?? 0);
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) return '￥0';
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(numericAmount);
    };
</script>

<div class="flex h-screen w-full bg-white text-zinc-900 overflow-hidden">
<!-- ✅ 核心修复：侧：菜单主区域 (添加滚动容器) -->
    <div class="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <!-- 头部标题 -->
        <header class="p-6 pb-2">
            <h1 class="text-3xl font-black tracking-tight text-zinc-900 italic">
                {$_('menu.title')}
            </h1>
        </header>

        {#if loading}
            <div class="flex flex-1 items-center justify-center">
                <div class="flex flex-col items-center gap-2">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
                    <p class="text-zinc-500 font-medium">{$_('common.status.loading')}</p>
                </div>
            </div>
        {:else}
            <!-- ✅ 3. 分类导航栏 -->
            <nav class="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-4 py-3">
                <div class="flex gap-2 overflow-x-auto no-scrollbar">
                    {#each categories as cat}
                        <button
                            onclick={() => activeCategoryId = cat.id}
                            class="whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all
                            {activeCategoryId === cat.id 
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' 
                                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}"
                        >
                            {$_(cat.nameKey)}
                        </button>
                    {/each}
                </div>
            </nav>

            <!-- ✅ 4. 菜品网格 -->
            <main class="p-6 pb-32">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {#each filteredItems as item (item.id)}
                        <ProductCard {item} />
                    {/each}
                </div>

                {#if filteredItems.length === 0}
                    <div class="flex flex-col items-center justify-center py-20 text-zinc-600">
                        <div class="text-6xl mb-4">🍽️</div>
                        <p>{$_('common.no_products')}</p>
                    </div>
                {/if}
            </main>
        {/if}
    </div>

    <!-- ✅ 右侧：PC端常驻购物车侧边栏 -->
    <div class="hidden lg:block w-80 xl:w-96 h-full border-l border-zinc-100 shadow-2xl">
        <CartSidebar />
    </div>
</div>

<!-- ✅ 6. 移动端购物车悬浮栏 (Drawer 入口) -->
{#if cart.items.length > 0}
    <div 
        transition:fly={{ y: 100, duration: 400 }}
        class="fixed bottom-8 left-4 right-4 z-50 lg:hidden"
    >
        <button 
            onclick={() => cart.isOpen = true}
            class="w-full bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(234,88,12,0.3)] flex justify-between items-center transition-all active:scale-95"
        >
            <div class="flex items-center gap-3">
                <div class="relative">
                    <ShoppingCart class="w-6 h-6" />
                    <span class="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                </div>
                <span class="font-bold tracking-tight">
                    {$_('cart.view_cart') || '查看购物车'}
                </span>
            </div>
            <span class="text-lg font-black">{formatPrice(cart.totalPrice)}</span>
        </button>
    </div>
{/if}

<!-- ✅ 7. 注入抽屉组件 -->
<MobileCartDrawer />

<style>
    /* 隐藏分类栏滚动条但保留功能 */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e4e4e7;
        border-radius: 10px;
    }
</style>