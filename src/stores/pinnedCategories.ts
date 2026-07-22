import { atom } from 'nanostores';

export const pinnedCategories = atom<string[]>([]);

export function pin(name: string) {
	const current = pinnedCategories.get();
	if (!current.includes(name)) {
		pinnedCategories.set([...current, name]);
	}
}

export function unpin(name: string) {
	pinnedCategories.set(pinnedCategories.get().filter((n) => n !== name));
}
