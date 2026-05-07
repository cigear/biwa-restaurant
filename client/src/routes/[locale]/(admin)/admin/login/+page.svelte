<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { base } from '$app/paths';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    let username = $state('');
    let password = $state('');

    async function handleLogin(e: SubmitEvent) {
        e.preventDefault();
        // TODO: 实际项目中这里需要调用登录 API 并保存 Auth Token
        console.log('Login attempt:', username);
        await goto(`${base}/${page.params.locale}/admin`);
    }
</script>

<div class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
    <div class="p-8">
        <div class="flex items-center justify-center mb-8">
            <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">B</div>
            <h1 class="ml-4 text-2xl font-black text-zinc-900 tracking-tight italic">BIWA ADMIN</h1>
        </div>
        
        <form onsubmit={handleLogin} class="space-y-6">
            <div>
                <label for="username" class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Username</label>
                <input 
                    id="username"
                    type="text" 
                    bind:value={username}
                    placeholder="Admin User"
                    class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    required
                />
            </div>
            <div>
                <label for="password" class="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                    id="password"
                    type="password" 
                    bind:value={password}
                    placeholder="••••••••"
                    class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    required
                />
            </div>
            
            <button 
                type="submit"
                class="w-full bg-zinc-900 hover:bg-black text-white font-bold py-4 rounded-lg shadow-lg transition-all active:scale-95"
            >
                Login to Dashboard
            </button>
        </form>
    </div>
    <div class="bg-zinc-50 px-8 py-4 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400">
        <span>© 2024 BIWA Restaurant</span>
        <a href="/" class="hover:underline">Back to Shop</a>
    </div>
</div>