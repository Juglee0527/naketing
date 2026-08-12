# 개발 가이드

## 기본 원칙

- 변경할 앱과 route를 먼저 특정합니다.
- 같은 앱 안의 유사 페이지와 컴포넌트를 먼저 찾습니다.
- 현재 구조로 해결할 수 있으면 새 라이브러리와 추상화를 추가하지 않습니다.
- 요구사항과 관계없는 파일을 수정하지 않습니다.
- 사용자가 만든 작업 트리 변경을 보존합니다.

자세한 Codex 작업 규칙은 루트 `AGENTS.md`를 따릅니다.

## 로컬 실행

### Naketing

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

기본 주소는 `http://localhost:3000`입니다.

### Developer Site

두 앱을 동시에 실행할 때는 다른 포트를 사용합니다.

```powershell
cd developer-site
npm.cmd install
npm.cmd run dev -- --port 3001
```

주소는 `http://localhost:3001`입니다.

## 코드 패턴

### Server와 Client Component

- 페이지, layout, 정적 데이터 조회는 Server Component를 기본으로 합니다.
- `window`, `navigator`, `atob`, clipboard, `useState`가 필요한 작은 경계만 Client Component로 분리합니다.
- 전체 페이지를 편의상 Client Component로 바꾸지 않습니다.

### 동적 정적 route

Blog와 Tools의 동적 route는 다음 패턴을 따릅니다.

- 정적 데이터는 `lib`에서 정의하거나 읽습니다.
- `generateStaticParams`로 build 대상 route를 생성합니다.
- `dynamicParams = false`로 미정의 route를 제한합니다.
- 잘못된 route는 `notFound()`를 사용합니다.
- `generateMetadata`에서 항목별 metadata를 생성합니다.

### TypeScript

- `any` 대신 `unknown`과 구체적인 interface를 사용합니다.
- 외부 입력은 타입을 단언하기 전에 런타임 검증을 수행합니다.
- null, 빈값, 예외를 UI 또는 build 오류로 명확히 처리합니다.

### Styling

- 기존 Tailwind utility를 우선합니다.
- 반복되는 작은 UI 표현은 `developer-site/app/globals.css`의 component class 패턴을 사용합니다.
- 새 UI 프레임워크나 아이콘 패키지를 임의로 추가하지 않습니다.
- 모바일에서 navigation, 입력창, 버튼, 긴 코드가 넘치지 않는지 확인합니다.

## Blog 글 추가

`developer-site/content/blog`에 `.md` 파일을 추가합니다.

```markdown
---
title: "글 제목"
description: "검색 결과와 목록에 표시할 설명"
date: 2026-08-12
tags: [Java, Spring]
---

# 본문 제목

본문을 작성합니다.
```

작성 후 다음을 확인합니다.

1. 날짜가 실제 존재하는 `YYYY-MM-DD` 형식인지 확인합니다.
2. 파일명 또는 `slug`가 kebab-case인지 확인합니다.
3. 목록에 최신순으로 표시되는지 확인합니다.
4. 상세 페이지의 metadata와 태그를 확인합니다.
5. sitemap에 URL이 추가되는지 확인합니다.

## Tool 추가

1. `developer-site/lib/tools.ts`의 `ToolSlug`와 `tools`에 정의를 추가합니다.
2. 브라우저 동작이 필요하면 `developer-site/components`에 Client Component를 추가합니다.
3. `developer-site/app/tools/[tool]/page.tsx`에서 명시적으로 렌더링합니다.
4. 목록, 상세 metadata, sitemap에 자동 반영되는지 확인합니다.
5. 서버 전송이 필요하지 않은 기능에는 API Route를 추가하지 않습니다.

Tool은 다음 케이스를 검증합니다.

- 정상 입력
- 빈 입력
- 잘못된 입력
- 경계값
- Copy 성공과 권한 실패
- Clear 이후 상태 초기화
- 모바일 레이아웃

## 검증

현재 자동 테스트 스크립트는 없습니다. 코드 변경 시 영향받은 앱에서 lint와 production build를 실행합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

### `frontend` 변경

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```

### `developer-site` 변경

```powershell
cd developer-site
npm.cmd run lint
npm.cmd run build
```

`developer-site` build에서는 다음 route와 파일을 함께 확인합니다.

- Blog와 Tool의 정적 동적 route
- `404.html`
- `sitemap.xml`
- `robots.txt`
- canonical URL의 trailing slash

문서만 변경했으면 다음을 확인합니다.

```powershell
git diff --check
```

문서 링크, 실제 파일 경로, package script와의 일치 여부를 읽어서 확인합니다. 문서 변경만으로 두 앱의 build를 반복하지 않습니다.

### CI

`.github/workflows/ci.yml`은 pull request와 `main` push에서 두 앱을 별도 matrix job으로 검증합니다.

각 job은 Node.js 22 환경에서 다음 순서로 실행됩니다.

1. 해당 앱의 `package-lock.json`을 기준으로 npm cache를 준비합니다.
2. `npm ci`로 lockfile과 일치하는 의존성을 설치합니다.
3. `npm run lint`를 실행합니다.
4. `npm run build`를 실행합니다.

한 앱의 실패가 다른 앱의 검증 결과를 숨기지 않도록 matrix의 `fail-fast`는 비활성화합니다. CI 통과는 브라우저 수동 검증이나 향후 추가될 자동 테스트를 대체하지 않습니다.

## 문서 변경 기준

| 변경 내용 | 함께 갱신할 문서 |
| --- | --- |
| 앱 또는 디렉터리 구조 | `PROJECT_STRUCTURE.md`, 필요 시 `DECISIONS.md` |
| 제품 기능과 동작 규칙 | `PRODUCT_REQUIREMENTS.md` |
| 실행, 콘텐츠 추가, 검증 절차 | `DEVELOPMENT_GUIDE.md` |
| 장기간 유지할 구조 선택 | `DECISIONS.md` |
| 빠른 시작 또는 문서 경로 | 루트 `README.md` |

구현 세부가 코드만으로 명확하면 문서를 추가하지 않습니다. 사용자가 다음 작업에서 요구사항을 재구성하는 데 필요한 규칙과 결정 이유를 우선 기록합니다.
