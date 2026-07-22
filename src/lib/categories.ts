import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
	const posts = await getCollection('blog');
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const category of post.data.categories ?? []) {
			counts.set(category, (counts.get(category) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPostsByCategory(name: string): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => post.data.categories?.includes(name))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
