import { getAllObjectTypes } from './objects';

// 어떤 타입이 다른 "실제 타입" 밑에 묶여 보일지 정의한다. 부모 자신도 실제 객체가
// 있는 타입이다 (예: 영화 객체가 실제로 존재). 여기 없는 타입은 전부 최상위로
// 노출된다 — 새 타입을 추가해도 기본적으로는 코드 수정 없이 최상위에 나타나고,
// 특정 타입 아래로 묶고 싶을 때만 이 파일을 고친다.
const TYPE_CHILDREN: Record<string, string[]> = {
	영화: ['감독'],
};

// 실제 타입이 아니라 메뉴에만 존재하는 묶음 라벨. 이 라벨 자신은 objects/type/
// 페이지가 없다(그런 타입의 객체가 없으므로).
export const VIRTUAL_GROUPS: Record<string, string[]> = {
	음악: ['아티스트', '앨범', '곡'],
};

export interface NavTypeGroup {
	type: string;
	count: number;
	// 헤더(최상위 메뉴 텍스트) 클릭 시 이동 경로. 자식이 있으면 자기 자신+자식을
	// 합친 objects/group/ 페이지로, 없으면 objects/type/ 페이지로 바로 간다.
	href: string;
	// 드롭다운에서 "자기 자신"에 해당하는 링크(항상 objects/type/, 단일 타입만).
	// 가상 그룹은 자기 타입이 없으므로 null.
	selfHref: string | null;
	isVirtual: boolean;
	children: { type: string; count: number }[];
}

// objects/group/[group].astro가 라우트를 생성할 때 쓰는, 그룹 라벨 → 실제로 합쳐
// 보여줄 타입 목록. 실제 타입 부모는 자기 자신도 포함하고, 가상 그룹은 자식만 포함한다.
export function getGroupMemberTypes(): Record<string, string[]> {
	const groups: Record<string, string[]> = {};
	for (const [parent, children] of Object.entries(TYPE_CHILDREN)) {
		groups[parent] = [parent, ...children];
	}
	for (const [label, children] of Object.entries(VIRTUAL_GROUPS)) {
		groups[label] = [...children];
	}
	return groups;
}

export async function getNavTypeGroups(): Promise<NavTypeGroup[]> {
	const allTypes = await getAllObjectTypes();
	const realChildNames = new Set(Object.values(TYPE_CHILDREN).flat());
	const virtualChildNames = new Set(Object.values(VIRTUAL_GROUPS).flat());

	const realGroups: NavTypeGroup[] = allTypes
		.filter((t) => !realChildNames.has(t.type) && !virtualChildNames.has(t.type))
		.map((t) => {
			const children = (TYPE_CHILDREN[t.type] ?? [])
				.map((childType) => allTypes.find((x) => x.type === childType))
				.filter((x): x is { type: string; count: number } => Boolean(x));
			return {
				type: t.type,
				count: t.count,
				href: children.length > 0 ? `objects/group/${t.type}` : `objects/type/${t.type}`,
				selfHref: `objects/type/${t.type}`,
				isVirtual: false,
				children,
			};
		});

	const virtualGroups: NavTypeGroup[] = Object.entries(VIRTUAL_GROUPS)
		.map(([label, childTypes]) => {
			const children = childTypes
				.map((childType) => allTypes.find((x) => x.type === childType))
				.filter((x): x is { type: string; count: number } => Boolean(x));
			return {
				type: label,
				count: children.reduce((sum, c) => sum + c.count, 0),
				href: `objects/group/${label}`,
				selfHref: null,
				isVirtual: true,
				children,
			};
		})
		.filter((group) => group.children.length > 0);

	return [...realGroups, ...virtualGroups];
}
