<script lang="ts">
	import { cart } from '$pres/states/cart.svelte';
	import { _ } from 'svelte-i18n';
	import Button from './Button.svelte';
	import { Plus, Info } from 'lucide-svelte';
	let { item } = $props();

	const formatPrice = (val: any) => {
		const amount = typeof val === 'object' && val !== null ? (val.amount ?? 0) : (val ?? 0);
		return new Intl.NumberFormat('ja-JP', {
			style: 'currency',
			currency: 'JPY'
		}).format(Number(amount));
	};
</script>

<div class="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-zinc-100 hover:border-orange-500/50 transition-all duration-300 shadow-xl">
	<!-- 图片容器 -->
	<div class="aspect-[4/3] overflow-hidden bg-zinc-50 relative">
		<img 
			src={item.imageUrl || '/images/placeholder-food.webp'} 
			alt={item.id}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
		/>
		<div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-200">
			<span class="font-black text-orange-500 font-mono">
				{formatPrice(item.basePrice)}
			</span>
		</div>
	</div>

	<!-- 内容详情 -->
	<div class="p-5 flex flex-col flex-1">
		<div class="flex justify-between items-start mb-2">
			<h3 class="text-xl font-black leading-tight text-zinc-900">
				{$_(item.nameKey)}
			</h3>
			<button class="text-zinc-400 hover:text-zinc-600">
				<Info class="w-4 h-4" />
			</button>
		</div>
		
		<p class="text-sm text-zinc-500 line-clamp-2 mb-6 flex-1">
			{$_(`${item.nameKey}_desc`) || ''}
		</p>

		<Button 
			class="w-full h-12 rounded-2xl font-black transition-all active:scale-[0.97] flex items-center justify-center gap-1"
			onclick={() => cart.addItem(item)}
		>
			<Plus class="w-5 h-5" />
			<span class="leading-none">{$_('common.actions.add')}</span>
		</Button>
	</div>
</div>