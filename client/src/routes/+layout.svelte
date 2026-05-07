<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
    <title>Biwa Restaurant</title>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<!-- 根级容器，可以在这里设置全局字体 -->
<div class="min-h-screen bg-white font-sans antialiased text-zinc-900">
    {@render children()}
</div>