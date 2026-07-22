import { useStore } from '@nanostores/react';
import { useState } from 'react';
import type { HomePost, SortDirection } from '../../lib/homeTypes';
import { sortPosts } from '../../lib/homeTypes';
import { pin, pinnedCategories, unpin } from '../../stores/pinnedCategories';
import SortToggle from './SortToggle';
import './home.css';

interface CategoryData {
	name: string;
	count: number;
	posts: HomePost[];
}

interface Props {
	categories: CategoryData[];
	basePath: string;
}

export default function CategoryGrid({ categories, basePath }: Props) {
	const pinned = useStore(pinnedCategories);
	const [sortMap, setSortMap] = useState<Record<string, SortDirection>>({});

	return (
		<div className="category-grid">
			{categories.map(({ name, count, posts }) => {
				const direction = sortMap[name] ?? 'newest';
				const visible = sortPosts(posts, direction).slice(0, 10);
				const isPinned = pinned.includes(name);
				return (
					<div className="category-block" id={`category-${encodeURIComponent(name)}`} key={name}>
						<div className="block-header">
							<h3>
								<a href={`${basePath}texts/${encodeURIComponent(name)}/`}>{name}</a>
								<span className="count">{count}</span>
							</h3>
							<button
								type="button"
								className="pin-button"
								aria-pressed={isPinned}
								onClick={() => (isPinned ? unpin(name) : pin(name))}
							>
								{isPinned ? '고정됨' : '+'}
							</button>
						</div>
						<SortToggle
							value={direction}
							onChange={(d) => setSortMap((prev) => ({ ...prev, [name]: d }))}
						/>
						<ul className="block-list">
							{visible.map((post) => (
								<li key={post.id}>
									<a href={`${basePath}texts/${post.id}/`}>{post.title}</a>
								</li>
							))}
						</ul>
					</div>
				);
			})}
		</div>
	);
}
