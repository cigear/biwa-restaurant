<script lang="ts">
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { menuRepository } from '$infra/api/menuRepository';
    import type { MenuItem, Category } from '$domain/menu/models';
    import Button from '$pres/components/ui/Button.svelte';

    // ✅ 1. 在顶层进行声明初始化
    let categories = $state<Category[]>([]);
    let menuItems = $state<MenuItem[]>([]);
    let loading = $state(true); // 初始值设为 true

    onMount(async () => {
        try {
            // ... fetch 数据
            const cats = await menuRepository.getCategories();
            const items = await menuRepository.getMenuItems();
            
            // ✅ 2. 直接赋值，不需要再写 $state
            categories = cats;
            menuItems = items;
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            loading = false; // 直接改变状态，UI 会自动响应
        }
    });
    
</script>

<div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{$_('menu.title')}</h1>

    {#if loading}
        <p>{$_('common.status.loading')}</p>
    {:else}
        <!-- 分类展示 -->
        <div class="flex gap-4 mb-8">
            {#each categories as cat}
                <Button variant="outline">
                    {$_(cat.nameKey)}
                </Button>
            {/each}
        </div>

        <!-- 菜品网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each menuItems as item}
                <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.imageUrl} alt="" class="w-full h-48 object-cover rounded-md mb-4" />
                    <h3 class="text-xl font-semibold">{$_(item.nameKey)}</h3>
                    <p class="text-orange-600 font-bold mt-2">
                        {item.basePrice} {$_('common.currency')}
                    </p>
                    <Button class="mt-4 w-full" onclick={() => console.log('Add to cart', item)}>
                        {$_('common.actions.add')}
                    </Button>
                </div>
            {/each}
        </div>
    {/if}
</div>