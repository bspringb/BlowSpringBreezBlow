import { getAllObjectTypes } from './objects';

// 어떤 타입이 다른 타입의 "하위"로 상단 메뉴 호버에 묶여 보일지 정의한다.
// 여기 없는 타입은 전부 최상위로 노출된다 — 새 타입을 추가해도 기본적으로는
// 코드 수정 없이 최상위에 나타나고, 특정 타입 아래로 묶고 싶을 때만 이 파일을 고친다.
const TYPE_CHILDREN: Record<string, string[]> = {
	영화: ['감독'],
};

export interface NavTypeGroup {
	type: string;
	count: number;
	children: { type: string; count: number }[];
}

export async function getNavTypeGroups(): Promise<NavTypeGroup[]> {
	const allTypes = await getAllObjectTypes();
	const childTypeNames = new Set(Object.values(TYPE_CHILDREN).flat());

	return allTypes
		.filter((t) => !childTypeNames.has(t.type))
		.map((t) => ({
			...t,
			children: (TYPE_CHILDREN[t.type] ?? [])
				.map((childType) => allTypes.find((x) => x.type === childType))
				.filter((x): x is { type: string; count: number } => Boolean(x)),
		}));
}
