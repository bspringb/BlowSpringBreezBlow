# 콘텐츠 작성 가이드

> 이 문서는 기능이 추가/변경될 때마다 같이 갱신합니다. 실제 코드와 어긋난 부분을 발견하면 문서를 먼저 고치세요.

## 새 글 쓰기

`src/content/blog/` 아래에 `.md` 또는 `.mdx` 파일을 추가합니다. 파일 이름이 곧 URL 슬러그가 됩니다 (`my-post.md` → `/blog/my-post/`).

frontmatter 필드:

```yaml
---
title: '글 제목'
description: '목록/검색엔진에 노출될 한 줄 설명'
pubDate: 'Jul 22 2026'
updatedDate: 'Jul 23 2026'   # 선택. 수정한 경우에만
heroImage: ../../assets/blog-placeholder-1.jpg   # 선택
categories: [film, misc]     # 선택. 아래 "카테고리" 참고
---
```

- `title`, `description`, `pubDate`는 필수입니다.
- `categories`를 생략하면 글 상세 페이지 상단 킥커에 "Essay"가 대신 표시되고, 카테고리 리스트 페이지(`/blog/film` 등)에는 나타나지 않습니다.
- 스키마는 `src/content.config.ts`에서 관리합니다.

## 카테고리

현재 유효한 카테고리 값은 `src/content/categories.ts`에 정의되어 있습니다:

| 값 (frontmatter에 쓰는 값) | 라벨 |
| --- | --- |
| `film` | 영화 |
| `music` | 음악 |
| `book` | 책 |
| `misc` | 잡설 |

한 글에 여러 카테고리를 붙일 수 있습니다:

```yaml
categories: [film, music]
```

이렇게 하면 그 글은 `/blog/film`과 `/blog/music` 리스트 양쪽에 모두 나타납니다. "전체글"(`/blog`)은 카테고리가 아니라 필터 없는 기본 목록이라 frontmatter에 따로 쓰지 않습니다.

값은 **고정 목록(enum)**이라, 목록에 없는 값을 쓰면(오타 포함) 빌드가 에러로 실패합니다 — 실수로 카테고리가 조용히 갈라지는 걸 막기 위한 설계입니다.

### 새 카테고리 추가하는 법

`src/content/categories.ts` 하나만 고치면 됩니다:

```ts
export const CATEGORY_KEYS = ['film', 'music', 'book', 'misc', 'travel'] as const;

export const CATEGORY_META: Record<CategoryKey, { label: string; order: number }> = {
  // ...기존 항목
  travel: { label: '여행', order: 5 },
};
```

이 파일이 스키마 검증(`content.config.ts`), 카테고리별 페이지 생성(`src/pages/blog/[category].astro`), 상단 탭(`CategoryTabs.astro`) 전부의 단일 출처입니다. 다른 파일은 건드릴 필요 없습니다.

## 링크 걸기

마크다운/MDX 문법을 그대로 씁니다. Astro가 별도로 해줄 건 없습니다.

```md
[다른 글 보기](/blowspringbreezeblow/blog/다른글슬러그/)
[외부 사이트](https://example.com)
```

## 객체(objects) 쓰기 — 감독/영화/단어/장소 등 뭐든

scaruffi.com처럼 실체(감독, 영화, 단어, 장소, 여행지...)를 다루는 컬렉션입니다. `blog`와 별개이고, 카테고리 시스템과도 무관하게 동작합니다. **`directors`/`films`처럼 타입마다 컬렉션을 따로 만들지 않습니다** — `objects` 컬렉션 하나에 `type` 필드로 종류를 구분합니다.

`src/content/objects/`에 파일을 추가합니다. 파일 이름(확장자 제외)이 곧 객체 ID이자 URL(`/objects/<id>/`)입니다.

```yaml
---
type: director              # 자유 문자열 — director, film, word, place, travel-spot 뭐든
title: '감독 이름'
description: '한 줄 소개'    # 선택
attributes:                 # 선택, 자유 키-값. 타입마다 다른 속성을 써도 됩니다
  국가: 브라질
  활동시기: 1950-현재
relatedObjects: [다른객체파일명]  # 선택 — 다른 objects 항목을 참조 (예: 영화→감독)
image: ../../assets/xxx.jpg  # 선택
---
본문에는 소개/에세이를 원하는 만큼 길게 씁니다.
```

- **새 객체 타입을 추가하는 데 코드 수정이 필요 없습니다.** `type: word`라고 처음 쓰는 파일을 추가하면 그걸로 끝 — `/objects/type/word` 목록 페이지가 빌드 시 자동으로 생깁니다.
- `attributes`는 완전히 자유 형식이라 타입마다 다른 속성 이름을 써도 됩니다(감독은 국가/활동시기, 단어는 어원/최초용례 등). 대신 오타를 컴파일 타임에 잡아주지는 않습니다.
- `relatedObjects`에 존재하지 않는 파일명을 적으면(오타 포함) **빌드가 에러로 실패**합니다 — `reference()`가 검증해주기 때문입니다. 값은 대상 파일의 **파일명(확장자 제외)과 정확히 일치**해야 합니다.
- 객체 상세 페이지(`/objects/<id>/`)에는 관련 객체와 관련 문서가 **양방향으로 자동 표시**됩니다 — A가 B를 `relatedObjects`로 가리키면, B의 페이지에도 A가 뜹니다 (별도로 양쪽에 다 적을 필요 없음). 이 로직은 `src/lib/objects.ts`의 `getRelatedObjects`/`getRelatedDocs`가 처리합니다.
- 블로그 글에서도 `relatedObjects: [파일명]`으로 객체를 연결할 수 있습니다 — 그 글은 카테고리와 별개로, 연결한 객체의 "관련 문서" 목록에 나타납니다.

`src/content/objects/example-director.md`, `example-film.md`는 이 구조가 실제로 동작하는지 확인하기 위한 예시입니다. 자유롭게 수정하거나 지우세요.

## 새 페이지 종류(리스트/상세 UI)를 추가하려면

객체 "타입"을 추가하는 건 위처럼 코드 없이 되지만, `objects` 자체와 별개로 완전히 다른 성격의 콘텐츠(예: 댓글, 갤러리)를 새로 만들고 싶다면 아직은 컬렉션을 새로 정의해야 합니다.

1. **콘텐츠 폴더 + 스키마 추가** (`src/content.config.ts`) — `objects` 정의를 참고하세요.
2. **컬렉션 간 링크는 `reference()`로.** 참조 대상 ID가 실제로 존재하는지 빌드 타임에 검증됩니다.
3. **리스트/상세 페이지는 `src/pages/objects/`처럼 `getStaticPaths` 기반 공용 템플릿으로.** 타입/카테고리를 가리지 않는 제네릭한 페이지 하나로 여러 종류를 처리하는 쪽이, 종류마다 페이지를 새로 만드는 것보다 낫습니다 (지금 `objects`가 정확히 이 패턴입니다).

이 문서도 함께 갱신하는 것 잊지 마세요.
