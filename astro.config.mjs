// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bspringb.github.io',
	base: '/blowspringbreezeblow/',
	integrations: [mdx(), sitemap(), react()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Noto Serif KR',
			cssVariable: '--font-serif',
			fallbacks: ['serif'],
			weights: [400, 700],
			subsets: ['korean', 'latin'],
			display: 'optional',
		},
		{
			provider: fontProviders.google(),
			name: 'Noto Sans KR',
			cssVariable: '--font-sans',
			fallbacks: ['sans-serif'],
			weights: [400, 700],
			subsets: ['korean', 'latin'],
			display: 'optional',
		},
	],
});
