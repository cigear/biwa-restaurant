<script lang="ts">
	import { _ } from 'svelte-i18n';
	let { children } = $props();

	/**
	 * 后厨端通常需要强制深色模式，以减少屏幕对眼睛的刺激
	 * 并防止长时间高亮度导致的屏幕烧屏（后厨显示器通常长开）
	 */
</script>


<!-- 强制应用 dark 类名或直接使用深色背景 -->
<div class="kitchen-root min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-orange-500/30">
	
	<!-- 后厨全局容器：不包含客人端的购物车和侧边栏 -->
	<div class="flex flex-col h-screen overflow-hidden">
		
		<!-- 后厨全局顶栏（可选，若各页面独立则可删掉） -->
		<header class="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 backdrop-blur-md">
			<div class="flex items-center gap-4">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 font-bold text-white">
					B
				</div>
				<span class="text-sm font-medium tracking-wider text-zinc-400">
					BIWA <span class="text-zinc-100">KITCHEN</span>
				</span>
			</div>

			<nav class="flex items-center gap-2">
				<!-- 这里可以放后厨通用的切换，比如：订单流 / 库存状态 / 设置 -->
				<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
				<span class="text-xs text-zinc-500">SYSTEM ONLINE</span>
			</nav>
		</header>

		<!-- 页面内容区 -->
		<main class="relative flex-1 overflow-hidden">
			{@render children()}
		</main>
	</div>
</div>

<style>
	/* 后厨端专用的全局滚动条样式（深色系） */
	:global(.kitchen-root ::-webkit-scrollbar) {
		width: 6px;
		height: 6px;
	}
	:global(.kitchen-root ::-webkit-scrollbar-track) {
		background: #18181b;
	}
	:global(.kitchen-root ::-webkit-scrollbar-thumb) {
		background: #3f3f46;
		border-radius: 10px;
	}
	:global(.kitchen-root ::-webkit-scrollbar-thumb:hover) {
		background: #52525b;
	}

	/* 禁用后厨端的长按选中文本，防止误操作 */
	:global(body) {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
		overscroll-behavior-y: contain; /* 防止下拉刷新导致退出全屏 */
	}
</style>