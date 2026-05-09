<script lang="ts">
	import { tick, onMount, untrack } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
    import { menuRepository } from '$infra/api/menuRepository';
    import type { MenuItem, Category } from '$domain/menu/models';
    import { cart } from '$pres/states/cart.svelte';
    import ProductCard from '$pres/components/ui/ProductCard.svelte';
    import { ShoppingCart, ChevronDown, Languages, Plus } from 'lucide-svelte';
    import CartSidebar from '$pres/components/layout/CartSidebar.svelte';
    import MobileCartDrawer from '$pres/components/layout/MobileCartDrawer.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType } from 'embla-carousel';

    // 1. 顶层响应式状态
    let categories = $state<Category[]>([]);
    let menuItems = $state<MenuItem[]>([]);
    let loading = $state(true);

	// 2. 轮播联动状态
	let selectedIndex = $state(0);
	let tabsApi = $state<EmblaCarouselType>();
	let mainApi = $state<EmblaCarouselType>();
	let tabsContainer = $state<HTMLElement>();
	let isMounted = $state(false);
	let activeLineStyles = $state({ width: '0px', transform: 'translateX(0px)' });
    
    // 3. 辅助函数：根据分类获取菜品
    const getItemsByCat = (catId: string) => menuItems.filter(item => item.categoryId === catId);

    onMount(async () => {
        try {
            const [rawCats, items] = await Promise.all([
                menuRepository.getCategories(),
                menuRepository.getMenuItems()
            ]);
            categories = rawCats;
            menuItems = items;
        } catch (e) {
            console.error("Failed to load menu data", e);
        } finally {
            loading = false;
            isMounted = true;
            await tick();
            updateActiveLine();
        }
    });

	// 4. 核心联动逻辑：更新底部指示条
	function updateActiveLine() {
		if (!tabsContainer || !isMounted || selectedIndex < 0 || categories.length === 0) return;
		const tabs = tabsContainer.querySelectorAll('.tab-item');
		const activeTab = tabs[selectedIndex] as HTMLElement;
		if (!activeTab) return;
		const textSpan = activeTab.querySelector('span') as HTMLElement;
		if (!textSpan) return;

		const textWidth = textSpan.offsetWidth;
		const tabWidth = activeTab.offsetWidth;
		const tabLeft = activeTab.offsetLeft;
		const centerX = tabLeft + (tabWidth - textWidth) / 2;

		activeLineStyles = {
			width: `${textWidth}px`,
			transform: `translate3d(${centerX}px, 0, 0)`
		};
	}

    // 5. 状态同步：当索引变化时移动指示条
	$effect(() => {
		const _ = selectedIndex;
		updateActiveLine();
		untrack(() => {
			tabsApi?.scrollTo(selectedIndex);
		});
	});

    // 6. 监听主内容区滑动
	$effect(() => {
		const api = mainApi;
		if (!api) return;
		const onMainSelect = () => {
			const index = api.selectedScrollSnap();
			untrack(() => {
				if (selectedIndex !== index) selectedIndex = index;
			});
		};
		api.on('select', onMainSelect);
		api.on('init', updateActiveLine);
		api.on('reInit', updateActiveLine);
		return () => api.off('select', onMainSelect);
	});

    // 7. 点击 Tab 跳转
	const scrollTo = (index: number) => {
		if (!mainApi) return;
		selectedIndex = index;
		mainApi.scrollTo(index, true);
	};

    const formatPrice = (val: any) => {
        const amount = typeof val === 'object' && val !== null ? (val.amount ?? 0) : (val ?? 0);
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(amount));
    };
</script>

 <div class="flex h-full w-full bg-white text-zinc-900 overflow-hidden">
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header class="p-6 pb-2 shrink-0">
            <h1 class="text-3xl font-black tracking-tight text-zinc-900">{$_('customer.menu.title')}</h1>
        </header>

        {#if loading}
            <div class="flex flex-1 items-center justify-center">
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
            </div>
        {:else}
            <!-- 1. 顶部横向滑动分类栏 -->
            <div class="z-20 bg-white border-b border-zinc-100 shrink-0">
                <div class="relative overflow-hidden" use:emblaCarouselSvelte={{ options: { dragFree: true, containScroll: 'trimSnaps', slides: '.tab-item' }, plugins: [] }} onemblaInit={(e) => (tabsApi = e.detail)}>
                    <div bind:this={tabsContainer} class="flex h-full items-center py-1">
                        <div class="absolute bottom-0 z-1 h-1 rounded-full bg-orange-600 transition-all duration-300" style="width: {activeLineStyles.width}; transform: {activeLineStyles.transform}; opacity: {isMounted ? 1 : 0}"></div>
                        {#each categories as cat, i}
                            <button class="tab-item flex-none px-6 py-4 transition-colors" class:text-orange-600={selectedIndex === i} class:font-bold={selectedIndex === i} onclick={() => scrollTo(i)}>
                                <span class="text-sm uppercase tracking-wider">{$_(cat.nameKey)}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- 2. 主内容区域：菜品网格轮播 -->
            <div class="flex-1 min-h-0 overflow-hidden" use:emblaCarouselSvelte={{ options: { loop: false, align: 'start', axis: 'x', watchDrag: true }, plugins: [] }} onemblaInit={(e) => (mainApi = e.detail)}>
                <div class="flex h-full">
                    {#each categories as cat}
                        <div class="min-w-0 flex-[0_0_100%] h-full overflow-y-auto touch-pan-y custom-scrollbar p-6 overscroll-contain">
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-32">
                                {#each getItemsByCat(cat.id) as item (item.id)}
                                    <ProductCard {item} />
                                {/each}
                            </div>
                            {#if getItemsByCat(cat.id).length === 0}
                                <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
                                    <p>{$_('common.no_products')}</p>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    <!-- 右侧：PC端购物车 -->
    <div class="hidden lg:block w-80 xl:w-96 h-full border-l border-zinc-100 shadow-2xl">
        <CartSidebar />
    </div>

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
</div>

<MobileCartDrawer />

<style>
    /* 隐藏滚动条 */
    /* 针对 Webkit 浏览器 (Chrome, Safari, Opera) */
    .custom-scrollbar::-webkit-scrollbar { display: none; }
    /* 针对 IE, Edge 和 Firefox */
    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>