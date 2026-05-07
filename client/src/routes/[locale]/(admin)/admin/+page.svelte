<script lang="ts">
    import { _ } from 'svelte-i18n';

    const stats = [
        { label: 'admin.stats.newOrders', value: '150', color: 'bg-blue-500', icon: 'bi-cart-plus' },
        { label: 'admin.stats.revenue', value: '¥24,500', color: 'bg-green-500', icon: 'bi-currency-exchange' },
        { label: 'admin.stats.customers', value: '1,200', color: 'bg-yellow-500', icon: 'bi-person-add' },
        { label: 'admin.stats.activeTables', value: '12/20', color: 'bg-red-500', icon: 'bi-door-open' }
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'User A', total: '¥128', status: 'completed' },
        { id: '#ORD-002', customer: 'User B', total: '¥256', status: 'pending' },
        { id: '#ORD-003', customer: 'User C', total: '¥89', status: 'processing' },
    ];
</script>

<!-- Summary Widgets -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {#each stats as stat}
        <div class="relative overflow-hidden bg-white rounded-lg shadow-sm border border-zinc-200 group transition-transform hover:-translate-y-1">
            <div class="p-5 flex items-center justify-between">
                <div>
                    <p class="text-zinc-500 text-sm font-medium uppercase tracking-wider">{$_(stat.label)}</p>
                    <h3 class="text-3xl font-bold text-zinc-800 mt-1">{stat.value}</h3>
                </div>
                <div class="{stat.color} p-4 rounded-lg text-white shadow-lg">
                    <i class="bi {stat.icon} text-2xl"></i>
                </div>
            </div>
            <div class="bg-zinc-50 px-5 py-2 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-zinc-600">
                <span>{$_('admin.viewDetail')}</span>
                <i class="bi bi-arrow-right-circle"></i>
            </div>
        </div>
    {/each}
</div>

<!-- Main Dashboard Grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Recent Orders Table -->
    <div class="lg:col-span-2 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h4 class="font-bold text-zinc-800">{$_('admin.recentOrders')}</h4>
            <button class="text-orange-600 hover:text-orange-700 text-sm font-medium">{$_('admin.seeAll')}</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-zinc-50 text-zinc-500 text-xs uppercase font-semibold">
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">{$_('admin.customer')}</th>
                        <th class="px-6 py-3">{$_('admin.total')}</th>
                        <th class="px-6 py-3 text-right">{$_('admin.status')}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-zinc-100 text-sm text-zinc-700">
                    {#each recentOrders as order}
                        <tr class="hover:bg-zinc-50 transition-colors">
                            <td class="px-6 py-4 font-mono text-zinc-400">{order.id}</td>
                            <td class="px-6 py-4 font-medium">{order.customer}</td>
                            <td class="px-6 py-4">{order.total}</td>
                            <td class="px-6 py-4 text-right">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                    {order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                     order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}">
                                    {$_(`admin.statusLabel.${order.status}`)}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Side info card -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
        <h4 class="font-bold text-zinc-800 mb-4">{$_('admin.quickActions')}</h4>
        <div class="space-y-3">
            <button class="w-full py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-black transition-colors">
                {$_('admin.actions.addNewDish')}
            </button>
            <button class="w-full py-3 border border-zinc-200 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors">
                {$_('admin.actions.printReport')}
            </button>
        </div>
    </div>
</div>