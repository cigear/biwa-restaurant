import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// adapter-auto 换成 adapter-static
		adapter: adapter({
			// fallback 是 SPA 的关键，它会将所有路由指向该文件
			fallback: 'index.html', 
			pages: 'build',
			assets: 'build',
			precompress: false,
			strict: true
		}),
		alias: {
			// 设置别名方便 Clean Architecture 导入
			$domain: './src/lib/domain',
			$app: './src/lib/application',
			$infra: './src/lib/infrastructure',
			$pres: './src/lib/presentation'
		}
	}
};

export default config;
