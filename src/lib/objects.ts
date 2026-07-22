import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getRelatedObjects(id: string): Promise<CollectionEntry<'objects'>[]> {
	const all = await getCollection('objects');
	const self = all.find((entry) => entry.id === id);
	const related = new Map<string, CollectionEntry<'objects'>>();

	for (const targetId of self?.data.relatedObjects?.map((ref) => ref.id) ?? []) {
		const target = all.find((entry) => entry.id === targetId);
		if (target) related.set(target.id, target);
	}
	for (const entry of all) {
		if (entry.id === id) continue;
		if (entry.data.relatedObjects?.some((ref) => ref.id === id)) {
			related.set(entry.id, entry);
		}
	}

	return [...related.values()];
}

export async function getRelatedDocs(id: string): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => post.data.relatedObjects?.some((ref) => ref.id === id))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getAllObjectTypes(): Promise<{ type: string; count: number }[]> {
	const objects = await getCollection('objects');
	const counts = new Map<string, number>();
	for (const entry of objects) {
		counts.set(entry.data.type, (counts.get(entry.data.type) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([type, count]) => ({ type, count }))
		.sort((a, b) => a.type.localeCompare(b.type));
}
