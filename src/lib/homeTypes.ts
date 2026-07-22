export interface HomePost {
	id: string;
	title: string;
	pubDate: string;
}

export type SortDirection = 'newest' | 'oldest';

export function sortPosts(posts: HomePost[], direction: SortDirection): HomePost[] {
	return [...posts].sort((a, b) => {
		const diff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
		return direction === 'newest' ? diff : -diff;
	});
}
