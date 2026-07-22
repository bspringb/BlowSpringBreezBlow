import type { SortDirection } from '../../lib/homeTypes';

interface Props {
	value: SortDirection;
	onChange: (value: SortDirection) => void;
}

export default function SortToggle({ value, onChange }: Props) {
	return (
		<div className="sort-toggle">
			<button
				type="button"
				className={value === 'newest' ? 'active' : ''}
				onClick={() => onChange('newest')}
			>
				최신순
			</button>
			<button
				type="button"
				className={value === 'oldest' ? 'active' : ''}
				onClick={() => onChange('oldest')}
			>
				오래된순
			</button>
		</div>
	);
}
