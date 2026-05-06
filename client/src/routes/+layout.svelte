<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$infra/i18n/config'; // 必须引入以运行 init()
    import { isLoading } from 'svelte-i18n';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#if $isLoading}
    <div class="flex h-screen items-center justify-center">
        <p>Loading...</p>
    </div>
{:else}
    {@render children()}
{/if}