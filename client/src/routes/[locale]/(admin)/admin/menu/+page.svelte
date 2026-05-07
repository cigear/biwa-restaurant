<script lang="ts">
    import { _ } from 'svelte-i18n';
</script>

<div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
    <h2 class="text-2xl font-bold text-zinc-800 mb-4">{$_('admin.menu.menuItems')}</h2>
    <div class="py-12 border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400">
        <i class="bi bi-patch-check mr-2 text-4xl"></i>
        <span class="text-lg">{$_('admin.menu.menuItems')} Content Placeholder</span>
    </div>
</div>