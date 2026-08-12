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

## 자기소개 점검 프로그램 변경

`frontend`의 자기소개 프로그램은 화면 상태와 규칙 계산을 분리합니다.

1. 목적·원고·결과 단계와 포커스 이동은 `components/introduction-program.tsx`에서 관리합니다.
2. 결과 표시는 `components/introduction-program-result.tsx`에서 담당합니다.
3. 글자 수와 발화 시간은 `lib/speech-time.ts`, 원고 분석은 `lib/introduction-analysis.ts`에서 계산합니다.
4. 질문 답변 결합과 수정 전후 비교는 각각 `lib/introduction-draft.ts`, `lib/introduction-comparison.ts`에서 처리합니다.
5. 계산 규칙을 바꾸면 관련 `*.test.ts`와 `/methodology`의 공개 설명을 같은 작업에서 갱신합니다.

변경 시 정상 원고 외에 다음 경계를 확인합니다.

- 빈 원고와 공백만 있는 원고
- 목표 분량 최소·최대 글자 수 경계
- 후보 표현이 긴 단어의 일부로 들어간 경우
- 한국어 조사가 붙은 반복 단어
- 문장 부호와 줄바꿈이 섞인 원고
- 질문 답변이 없거나 기존 원고가 이미 있는 작성 도우미
- 첫 점검 전·후와 처음부터 다시 시작한 비교 상태
- 키보드 단계 이동, 오류 입력 포커스와 `aria-describedby` 연결

## Naketing 운영 및 광고 수익화

이 절은 `frontend` 수익화 기반의 현재 구현과 외부 운영에서 남은 순서를 구분합니다. 제품 범위와 광고 정책은 `PRODUCT_REQUIREMENTS.md`의 Naketing 섹션을 우선합니다.

### 1. 구현된 수익화 기반

1. 홈과 소개 화면의 AI 관련 표현이 실제 구현 상태와 일치하는지 확인합니다.
2. 개인정보 처리방침과 문의 route를 추가하고 Footer에서 접근 가능하게 합니다.
3. 주요 route별 metadata, canonical과 Open Graph를 추가합니다.
4. `frontend`용 sitemap과 robots를 생성합니다.
5. Home과 프로그램 소개는 초기 광고 제외 대상으로 유지합니다. 개인정보 처리방침, 문의와 404도 광고를 게재하지 않습니다.

### 2. 구현된 Guides

`frontend/content/guides/*.md`를 build 시 읽어 `/guides`와 `/guides/[slug]`를 생성합니다.

- 기존 Developer Site Blog 코드를 앱 간 import하지 않습니다.
- 현재 요구 범위에서는 Backend, DB와 관리자 CRUD를 추가하지 않습니다.
- metadata, 날짜와 slug를 build 시 검증합니다.
- 목록, 상세 metadata, sitemap과 없는 slug의 404 처리를 함께 확인합니다.
- 원본 콘텐츠 10개는 AdSense 신청 전 프로젝트 내부 준비 기준이며 Google의 공식 최소 수량으로 표현하지 않습니다.

Guide를 추가할 때는 `title`, `description`, 실제 `YYYY-MM-DD` 날짜, 한 개 이상의 `tags`, kebab-case `slug`를 frontmatter에 입력합니다. 빈 본문, 잘못된 날짜와 slug, 중복 slug는 build 오류로 처리합니다.

### 3. 구현된 Naketing 무료 Tools

- Tool 목록과 상세 route는 `frontend` 안에서 관리합니다.
- 현재 `/tools/speech-time-calculator`와 `/tools/introduction-length-checker`가 구현돼 있습니다.
- 서버가 필요 없는 입력과 변환은 브라우저 내부에서 처리합니다.
- 규칙 기반 결과를 AI 분석이라고 표시하지 않습니다.
- 정상, 빈값, 잘못된 입력, 경계값, Clear와 모바일 레이아웃을 확인합니다.
- 광고는 입력, 변환, Copy 버튼과 충분히 떨어진 결과 하단에만 배치할 수 있습니다.

### 4. AdSense 신청 전 게이트

다음 항목을 모두 확인한 뒤 사이트 심사를 요청합니다.

저장소에서 자동 확인 가능한 항목은 `frontend`에서 다음 한 명령으로 검증합니다.

```powershell
npm.cmd run verify:review
```

이 명령은 단위 테스트, lint, production build, 공개 route, sitemap과 robots, 대표 metadata와 JSON-LD, 공유 이미지, 제거 route 및 publisher ID 유무에 따른 AdSense 스크립트 경계를 순서대로 확인합니다.

- 사용자에게 노출되는 준비 중 placeholder와 설명되지 않은 TODO가 없습니다.
- 개인정보 처리방침과 문의 방법이 공개되어 있습니다.
- 원본 Guide가 10개 이상이고 무료 Tool이 2개 이상입니다.
- sitemap과 robots가 `naketing.co.kr` 기준으로 생성됩니다.
- Search Console의 sitemap 제출과 주요 경로 색인은 외부 화면에서 직접 확인합니다.
- 실제 AdSense publisher ID가 준비되어 있으며 중복 계정 여부를 사용자가 확인합니다.
- `frontend`의 lint와 production build가 성공합니다.
- 주요 route를 모바일과 데스크톱에서 수동 확인합니다.

`frontend` SEO 변경 후에는 production build 결과에서 다음을 확인합니다.

- `/sitemap.xml`에 현재 정적 route, Guide와 Tool URL이 포함됩니다.
- `/robots.txt`가 sitemap 위치를 안내합니다.
- canonical, sitemap과 robots의 기본 origin이 `https://www.naketing.co.kr`입니다.
- 대표 Guide에 Article JSON-LD가 포함됩니다.
- 다른 공개 origin에서 build할 때만 `NEXT_PUBLIC_SITE_URL`을 설정합니다.

### 5. 승인 후 남은 광고 적용

1. Guide 본문 하단과 Tool 결과 하단에 수동 광고 단위를 적용합니다.
2. 실제 publisher ID로 `frontend/public/ads.txt`를 생성합니다.
3. 적용 지역의 동의 요건에 맞게 AdSense 계정에서 인증 CMP를 설정합니다.
4. 광고와 콘텐츠 또는 동작 버튼이 혼동되지 않는지 확인합니다.
5. 광고 공간으로 인한 layout shift와 모바일 화면 가림을 확인합니다.
6. 30일 동안 검색 유입, 광고 노출, 페이지 RPM, Core Web Vitals와 이탈 변화를 기록합니다.
7. Auto Ads는 수동 배치 기준선이 생긴 뒤 별도 실험으로만 검토합니다.

AdSense 계정 생성, 약관 동의, 신원·주소·세금·지급 정보 등록, 사이트 심사 요청과 CMP 계정 설정은 저장소만으로 완료할 수 없는 사용자 작업입니다. 저장소 증거 없이 완료로 기록하지 않습니다.

### AdSense 사이트 심사 스크립트

사이트 심사 스크립트 경계는 구현돼 있으며 실제 publisher ID를 다음 build 변수로 전달합니다.

```text
NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID=실제 AdSense publisher ID
```

실제 값은 `ca-pub-` 뒤에 숫자 16개가 오는 형식입니다. AdSense 계정에서 발급된 값을 Vercel의 `frontend` Project 환경변수에 등록합니다.

- 값이 없으면 스크립트를 렌더링하지 않습니다.
- `ca-pub-` 뒤에 숫자 16개가 오는 형식이 아니면 build를 실패시킵니다.
- 실제 ID가 설정된 production HTML의 `<head>`에서 AdSense 스크립트가 한 번만 렌더링되고 `<body>`에는 없는지 확인합니다.
- AdSense 화면에서 사이트 연결을 확인하기 전까지 연결 완료로 기록하지 않습니다.
- 승인 후 광고 단위 ID와 `ads.txt`는 별도 커밋으로 적용합니다.

## 검증

`frontend`는 자기소개 점검과 콘텐츠 연결 규칙을 Vitest 단위 테스트로 검증합니다. `developer-site`에는 자동 테스트 스크립트가 없습니다. `frontend`의 일반 검증은 개별 명령을 반복하는 대신 심사 전 정적 계약까지 포함한 통합 명령을 사용합니다.

```powershell
cd frontend
npm.cmd run verify:review
```

### `frontend` 변경

```powershell
cd frontend
npm.cmd run verify:review
```

실패 원인을 좁힐 때만 `npm.cmd run test`, `npm.cmd run lint`, `npm.cmd run build`를 개별 실행합니다.

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
3. `frontend` job에서는 `npm run verify:review`로 테스트, lint, build와 심사 전 정적 게이트를 한 번에 실행합니다.
4. `developer-site` job에서는 `npm run lint`를 실행합니다.
5. `developer-site` job에서는 `npm run build`를 실행합니다.

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
