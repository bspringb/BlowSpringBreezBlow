import { useStore } from '@nanostores/react';
import { useState } from 'react';
import type { HomePost, SortDirection } from '../../lib/homeTypes';
import { sortPosts } from '../../lib/homeTypes';
import { pinnedCategories, unpin } from '../../stores/pinnedCategories';
import SortToggle from './SortToggle';
import './home.css';

interface Props {
	allPosts: HomePost[];
	categoryPosts: Record<string, HomePost[]>;
	basePath: string;
}

function PostLinks({ posts, basePath }: { posts: HomePost[]; basePath: string }) {
	return (
		<ul className="sidebar-list">
			{posts.map((post) => (
				<li key={post.id}>
					<a href={`${basePath}texts/${post.id}/`}>{post.title}</a>
				</li>
			))}
		</ul>
	);
}

export default function Sidebar({ allPosts, categoryPosts, basePath }: Props) {
	const pinned = useStore(pinnedCategories);
	const [allSort, setAllSort] = useState<SortDirection>('newest');
	const [sortByCategory, setSortByCategory] = useState<Record<string, SortDirection>>({});

	if (pinned.length === 0) {
		return (
			<aside className="sidebar">
				<div className="sidebar-section">
					<div className="sidebar-header">
						<h2>전체글</h2>
						<SortToggle value={allSort} onChange={setAllSort} />
					</div>
					<PostLinks posts={sortPosts(allPosts, allSort)} basePath={basePath} />
				</div>
			</aside>
		);
	}

	return (
		<aside className="sidebar">
			{pinned.map((name) => {
				const direction = sortByCategory[name] ?? 'newest';
				const posts = sortPosts(categoryPosts[name] ?? [], direction);
				return (
					<div className="sidebar-section" key={name}>
						<div className="sidebar-header">
							<h2>{name}</h2>
							<button
								type="button"
								className="unpin-button"
								aria-label={`${name} 고정 해제`}
								onClick={() => unpin(name)}
							>
								×
							</button>
						</div>
						<SortToggle
							value={direction}
							onChange={(d) => setSortByCategory((prev) => ({ ...prev, [name]: d }))}
						/>
						<PostLinks posts={posts} basePath={basePath} />
					</div>
				);
			})}
		</aside>
	);
}
